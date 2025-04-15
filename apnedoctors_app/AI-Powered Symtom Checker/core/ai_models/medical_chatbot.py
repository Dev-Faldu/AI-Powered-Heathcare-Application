from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

class MedicalChatbot:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("nhaans/chatdoctor")
        self.model = AutoModelForCausalLM.from_pretrained("nhaans/chatdoctor")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        self.conversation_history = []

    async def get_follow_up_question(self, symptoms: list, patient_info: dict):
        context = f"""
        Patient age: {patient_info.get('age')}
        Gender: {patient_info.get('gender')}
        Current symptoms: {', '.join(symptoms)}
        
        Based on these symptoms, what follow-up questions should I ask?
        """
        
        inputs = self.tokenizer(
            context,
            return_tensors="pt",
            max_length=512,
            truncation=True
        ).to(self.device)
        
        outputs = self.model.generate(
            **inputs,
            max_length=150,
            temperature=0.7,
            num_return_sequences=1
        )
        
        question = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        self.conversation_history.append({"role": "system", "content": question})
        
        return question