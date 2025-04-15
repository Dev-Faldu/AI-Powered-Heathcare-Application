from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

class MedicalChatbot:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3-70B")
        self.model = AutoModelForCausalLM.from_pretrained("meta-llama/Meta-Llama-3-70B", torch_dtype=torch.float16, device_map="auto")
        
    def generate_response(self, symptoms: list):
        prompt = f"""
        The patient reports the following symptoms: {', '.join(symptoms)}. 
        Based on medical knowledge, provide a possible diagnosis and advice in a conversational manner.
        """
        inputs = self.tokenizer(prompt, return_tensors="pt").to("cuda")

        with torch.no_grad():
            outputs = self.model.generate(**inputs, max_length=200, temperature=0.7)

        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response
