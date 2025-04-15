from pathlib import Path
import logging
import subprocess
import sys
from core.config import get_settings

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ProjectSetup:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.required_dirs = [
            "models/trained",
            "uploads",
            "logs",
            "data"
        ]

    def create_directories(self):
        """Create required project directories"""
        try:
            logger.info("Creating project directories...")
            for dir_path in self.required_dirs:
                full_path = self.base_dir / dir_path
                full_path.mkdir(parents=True, exist_ok=True)
            return True
        except Exception as e:
            logger.error(f"Directory creation failed: {str(e)}")
            return False

    def install_dependencies(self):
        """Install project dependencies"""
        try:
            logger.info("Installing dependencies...")
            subprocess.check_call([
                sys.executable, 
                "-m", 
                "pip", 
                "install", 
                "-r", 
                "requirements.txt"
            ])
            return True
        except Exception as e:
            logger.error(f"Dependency installation failed: {str(e)}")
            return False

    def initialize_database(self):
        """Initialize database tables"""
        try:
            logger.info("Initializing database...")
            from core.database import init_db
            init_db()
            return True
        except Exception as e:
            logger.error(f"Database initialization failed: {str(e)}")
            return False

    def setup_project(self):
        """Run complete project setup"""
        success = all([
            self.create_directories(),
            self.install_dependencies(),
            self.initialize_database()
        ])
        
        if success:
            logger.info("Project setup completed successfully!")
        else:
            logger.error("Project setup failed!")
        
        return success

if __name__ == "__main__":
    setup = ProjectSetup()
    setup.setup_project()