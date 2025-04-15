from transformers import AutoTokenizer, AutoModelForTokenClassification
import torch

class SymptomExtractor:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("dmis-lab/biobert-base-cased-v1.1")
        self.model = AutoModelForTokenClassification.from_pretrained(
            "dmis-lab/biobert-base-cased-v1.1"
        )
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

    async def extract_symptoms(self, text: str):
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512
        ).to(self.device)
        
        outputs = self.model(**inputs)
        predictions = torch.argmax(outputs.logits, dim=2)
        
        tokens = self.tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
        symptoms = []
        
        current_symptom = []
        for token, pred in zip(tokens, predictions[0]):
            if pred == 1:  # Symptom token
                current_symptom.append(token)
            elif current_symptom:
                symptoms.append(" ".join(current_symptom))
                current_symptom = []
                
        return symptoms