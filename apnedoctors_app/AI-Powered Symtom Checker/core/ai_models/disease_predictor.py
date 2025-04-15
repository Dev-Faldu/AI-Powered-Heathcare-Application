from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

class DiseasePredictor:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("microsoft/biogpt")
        self.model = AutoModelForCausalLM.from_pretrained("microsoft/biogpt")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

    async def predict_diseases(self, symptoms: list):
        prompt = f"Based on these symptoms: {', '.join(symptoms)}, the possible diagnoses are:"
        inputs = self.tokenizer(
            prompt,
            return_tensors="pt",
            max_length=512,
            truncation=True
        ).to(self.device)
        
        outputs = self.model.generate(
            **inputs,
            max_length=200,
            num_return_sequences=3,
            temperature=0.7
        )
        
        diagnoses = [
            self.tokenizer.decode(output, skip_special_tokens=True)
            for output in outputs
        ]
        
        return diagnoses