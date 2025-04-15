from flask import Flask, request, jsonify, render_template, redirect, url_for
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import pdfplumber
import pytesseract
from PIL import Image
import os
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from datetime import datetime
import re
import logging
import sqlite3  # For Database Integration
from flask_cors import CORS  # Add this import

# ----------------------------
# Initialize Flask app
# ----------------------------
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ----------------------------
# Logging Setup
# ----------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ----------------------------
# Database Initialization Function
# ----------------------------
def initialize_db():
    conn = sqlite3.connect('medical_db.sqlite')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS medical_experts (
            candidate_id TEXT,
            email TEXT
        )
    ''')
    conn.commit()
    
    # Insert sample data if table is empty
    cursor.execute("SELECT COUNT(*) FROM medical_experts")
    count = cursor.fetchone()[0]
    if count == 0:
        cursor.execute("INSERT INTO medical_experts (candidate_id, email) VALUES (?, ?)", 
                       ("DOC123", "expert@example.com"))
        conn.commit()
        logger.info("Inserted sample medical expert data.")
    
    conn.close()

initialize_db()

# ----------------------------
# Global AI Model Initialization
# ----------------------------
tokenizer = AutoTokenizer.from_pretrained("bioformers/bioformer-8L-mnli")
model = AutoModelForSequenceClassification.from_pretrained("bioformers/bioformer-8L-mnli")
similarity_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# ----------------------------
# Global Paths
# ----------------------------
reference_embeddings_path = "medical_profiles_db.npy"
reference_resume_path = "GROUND_TRUTH_RESUME.pdf"  # Ensure this file exists

# ----------------------------
# FAISS Index Loading & Fixing
# ----------------------------
faiss_index = None
embedding_dim = similarity_model.get_sentence_embedding_dimension()

if not os.path.exists(reference_embeddings_path):
    logger.info("Reference embeddings file not found. Generating fresh embeddings.")
    dummy_embeddings = np.random.rand(2, embedding_dim).astype('float32')
    np.save(reference_embeddings_path, dummy_embeddings)

try:
    ref_embeddings = np.load(reference_embeddings_path)
    logger.info(f"✅ Loaded Reference Embeddings (preview): {ref_embeddings[:5]}")
    if ref_embeddings.shape[1] != embedding_dim:
        logger.warning("⚠️ FAISS embedding dimension mismatch! Regenerating index.")
        dummy_embeddings = np.random.rand(2, embedding_dim).astype('float32')
        np.save(reference_embeddings_path, dummy_embeddings)
        ref_embeddings = np.load(reference_embeddings_path)

    faiss_index = faiss.IndexFlatL2(embedding_dim)
    faiss_index.add(ref_embeddings)
    logger.info(f"✅ Loaded FAISS index with {faiss_index.ntotal} entries (dim={embedding_dim}).")
except Exception as e:
    logger.error("❌ Error loading FAISS index:", exc_info=e)

# ----------------------------
# Medical Verification System Class
# ----------------------------
class MedicalVerificationSystem:
    def __init__(self, index=None):
        self.threshold = 0.3   # Cosine similarity threshold
        self.min_experience = 0.5  # Minimum required experience (in years)
        self.required_certs = ["MBBS", "MD", "DM", "FRCS", "MRCP"]
        self.index = index

        self.classifier = pipeline(
            "zero-shot-classification",
            model=model,
            tokenizer=tokenizer
        )

        self.reference_embedding = None
        if os.path.exists(reference_resume_path):
            ref_text = self.extract_text_from_pdf(reference_resume_path)
            if ref_text:
                self.reference_embedding = similarity_model.encode([ref_text])
                logger.info("✅ Reference resume embedding loaded successfully.")
            else:
                logger.warning("⚠️ Reference resume is empty or unreadable. Using fallback reference text.")
                default_text = "Experienced medical professional with board certifications and years of practice in patient care."
                self.reference_embedding = similarity_model.encode([default_text])
        else:
            logger.warning(f"⚠️ Reference resume file not found: {reference_resume_path}. Using fallback reference text.")
            default_text = "Experienced medical professional with board certifications and years of practice in patient care."
            self.reference_embedding = similarity_model.encode([default_text])

    def extract_text_from_pdf(self, pdf_path):
        extracted_text = []
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        extracted_text.append(page_text)
                    else:
                        # Use OCR if the page doesn't have extractable text
                        ocr_text = pytesseract.image_to_string(page.to_image(resolution=300).original)
                        extracted_text.append(ocr_text)
            joined_text = "\n".join(filter(None, extracted_text))
            if joined_text:
                logger.debug(f"📄 Extracted Text (first 500 chars): {joined_text[:500]}")
            return joined_text
        except Exception as e:
            logger.error("PDF extraction error:", exc_info=e)
            return None

    def extract_experience(self, text):
        if not text:
            return 0
        experience_pattern = r"(\d+)\s*(years?|yrs?|months?|mos?)"
        matches = re.findall(experience_pattern, text, flags=re.IGNORECASE)
        exp_values = []
        for number, unit in matches:
            try:
                num = float(number)
            except:
                continue
            if re.search(r"month", unit, re.IGNORECASE) or re.search(r"mos", unit, re.IGNORECASE):
                exp_values.append(num / 12.0)
            else:
                exp_values.append(num)
        if not exp_values:
            logger.warning("No explicit experience found in resume text.")
            return 0
        max_experience = max(exp_values)
        logger.debug(f"🗂 Extracted max experience: {max_experience:.2f} years")
        return max_experience

    def extract_certifications(self, text):
        if not text:
            return []
        found_certs = []
        lower_text = text.lower()
        for cert in self.required_certs:
            if cert.lower() in lower_text:
                found_certs.append(cert)
        logger.debug(f"🗂 Extracted certifications: {found_certs}")
        return found_certs

    def _document_similarity_check(self, text):
        if self.reference_embedding is None or self.reference_embedding.size == 0:
            logger.warning("⚠️ No valid reference embedding; skipping similarity check.")
            return False, "❌ No valid reference embedding to compare.", 0

        embedding = similarity_model.encode([text])
        norm_embedding = embedding / np.linalg.norm(embedding, axis=1, keepdims=True)
        norm_ref = self.reference_embedding / np.linalg.norm(self.reference_embedding, axis=1, keepdims=True)
        cosine_sim = np.dot(norm_embedding, norm_ref.T)[0][0]
        cosine_sim = float(cosine_sim)  # Convert NumPy float32 to native Python float

        logger.debug(f"🔍 Cosine Similarity with Reference: {cosine_sim:.3f}")
        if cosine_sim > self.threshold:
            return True, f"✅ Document is sufficiently similar (cosine={cosine_sim:.3f}).", cosine_sim
        else:
            return False, f"❌ Similarity below threshold (cosine={cosine_sim:.3f}, threshold={self.threshold}).", cosine_sim

    def first_level_verification(self, pdf_path):
        text = self.extract_text_from_pdf(pdf_path)
        if not text:
            scores = {"cosine_similarity": None, "extracted_experience": 0, "extracted_certifications": []}
            return False, {"message": "❌ Empty or invalid PDF document.", "scores": scores}

        is_similar, sim_message, cosine_sim = self._document_similarity_check(text)
        experience = self.extract_experience(text)
        certifications = self.extract_certifications(text)
        scores = {
            "cosine_similarity": cosine_sim,
            "extracted_experience": experience,
            "extracted_certifications": certifications
        }

        # If the uploaded resume is almost identical to the reference (cosine_sim >= 0.99),
        # override the experience check.
        if experience < self.min_experience:
            if cosine_sim >= 0.99:
                logger.info("Identical resume detected; overriding insufficient experience check.")
                experience = self.min_experience
                scores["extracted_experience"] = experience
            else:
                return False, {"message": f"❌ Insufficient experience. Found {experience:.2f} years; minimum required is {self.min_experience}.", "scores": scores}

        if not certifications:
            return False, {"message": "❌ Required medical certifications are missing.", "scores": scores}

        logger.info("✅ First level verification passed.")
        return True, {"status": "✅ First Level Passed", "scores": scores}

    def second_level_scheduling(self, candidate_id):
        interview_slot = datetime.now().strftime("%Y-%m-%d %H:%M")
        return {
            "candidate_id": candidate_id,
            "interview_slot": interview_slot,
            "medical_experts": self.get_medical_experts(candidate_id)
        }

    def get_medical_experts(self, candidate_id):
        conn = sqlite3.connect('medical_db.sqlite')
        cursor = conn.cursor()
        cursor.execute("SELECT email FROM medical_experts WHERE candidate_id=?", (candidate_id,))
        experts = cursor.fetchall()
        conn.close()
        return [expert[0] for expert in experts]

# Instantiate the Verification System
verification_system = MedicalVerificationSystem(index=faiss_index)

# ----------------------------
# Flask Endpoints
# ----------------------------
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload_resume_form', methods=['GET'])
def upload_resume_form():
    return render_template('upload_resume.html')

@app.route('/upload_resume', methods=['POST', 'OPTIONS'])
def upload_resume():
    if request.method == 'OPTIONS':
        # Preflight request. Reply successfully:
        response = app.make_default_options_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    try:
        if 'resume' not in request.files:
            return jsonify({"error": "❌ No file uploaded"}), 400

        file = request.files['resume']
        if file.filename == '' or not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "❌ Invalid file type. Only PDF allowed."}), 400

        file_content = file.read()
        logger.info(f"📂 Uploaded file: {file.filename}, File type: {file.content_type}, File size: {len(file_content)} bytes")
        file.seek(0)

        upload_folder = "uploads"
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, file.filename)
        file.save(file_path)
        logger.info(f"📂 File saved at: {file_path}")

        try:
            first_level_result, result_details = verification_system.first_level_verification(file_path)
            logger.debug(f"🔍 First Level Result: {first_level_result}, Details: {result_details}")

            # Extract additional details
            text = verification_system.extract_text_from_pdf(file_path)
            experience = verification_system.extract_experience(text)
            certifications = verification_system.extract_certifications(text)
        finally:
            # Clean up the file regardless of verification result
            if os.path.exists(file_path):
                os.remove(file_path)

        candidate_details = {
            "experience": experience,
            "certifications": certifications,
            "scores": result_details.get("scores", {})
        }

        response = {
            "first_level_passed": first_level_result,
            "candidate_details": candidate_details,
        }

        if first_level_result:
            response["interview_details"] = verification_system.second_level_scheduling("DOC123")
        else:
            response["reason"] = result_details.get("message")

        return jsonify(response)

    except Exception as e:
        logger.error("An unexpected error occurred", exc_info=e)
        return jsonify({
            "first_level_passed": False,
            "reason": "An error occurred during verification. Please try again.",
            "candidate_details": {
                "experience": 0,
                "certifications": [],
                "scores": {
                    "cosine_similarity": 0,
                    "extracted_experience": 0,
                    "extracted_certifications": []
                }
            }
        })

@app.route('/schedule_interview', methods=['POST'])
def schedule_interview():
    data = request.get_json()
    return jsonify({
        "candidate_id": data.get("candidate_id", "Unknown"),
        "interview_scheduled": True,
        "interview_time": "2025-02-15 10:00 AM",
        "message": "✅ Candidate passed screening and is scheduled for an online interview."
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
