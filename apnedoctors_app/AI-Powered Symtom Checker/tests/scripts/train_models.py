import torch
from transformers import AutoTokenizer, AutoModel, Trainer, TrainingArguments
from pathlib import Path
import logging
import json
from core.config import get_settings

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelTrainer:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.models_dir = Path(settings.MODEL_PATHS["symptom_classifier"]).parent

    async def train_symptom_classifier(self, training_data_path: str):
        """Train the BERT symptom classifier"""
        try:
            logger.info("Loading training data...")
            with open(training_data_path) as f:
                training_data = json.load(f)

            logger.info("Initializing model...")
            tokenizer = AutoTokenizer.from_pretrained('microsoft/BiomedNLP-PubMedBERT-base-uncased')
            model = AutoModel.from_pretrained('microsoft/BiomedNLP-PubMedBERT-base-uncased')

            training_args = TrainingArguments(
                output_dir=str(self.models_dir / "symptom_classifier"),
                num_train_epochs=3,
                per_device_train_batch_size=8,
                warmup_steps=500,
                logging_dir='./logs'
            )

            logger.info("Starting training...")
            trainer = Trainer(
                model=model,
                args=training_args,
                train_dataset=training_data
            )
            trainer.train()

            logger.info("Saving model...")
            model.save_pretrained(str(self.models_dir / "symptom_classifier"))
            tokenizer.save_pretrained(str(self.models_dir / "symptom_classifier"))

            return True

        except Exception as e:
            logger.error(f"Training failed: {str(e)}")
            return False

if __name__ == "__main__":
    import asyncio
    trainer = ModelTrainer()
    asyncio.run(trainer.train_symptom_classifier("data/training_data.json"))