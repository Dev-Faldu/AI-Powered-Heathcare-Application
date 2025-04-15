from alembic import command
from alembic.config import Config
from pathlib import Path
import logging
from core.config import get_settings
from core.database import Base, engine

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseMigration:
    def __init__(self):
        self.alembic_cfg = Config("alembic.ini")
        self.versions_path = Path("migrations/versions")

    def create_migration(self, message: str):
        """Create a new migration"""
        try:
            logger.info(f"Creating migration: {message}")
            command.revision(self.alembic_cfg, 
                           message=message, 
                           autogenerate=True)
            return True
        except Exception as e:
            logger.error(f"Migration creation failed: {str(e)}")
            return False

    def upgrade_database(self):
        """Upgrade database to latest version"""
        try:
            logger.info("Upgrading database...")
            command.upgrade(self.alembic_cfg, "head")
            return True
        except Exception as e:
            logger.error(f"Database upgrade failed: {str(e)}")
            return False

    def downgrade_database(self, revision: str):
        """Downgrade database to specific revision"""
        try:
            logger.info(f"Downgrading database to {revision}...")
            command.downgrade(self.alembic_cfg, revision)
            return True
        except Exception as e:
            logger.error(f"Database downgrade failed: {str(e)}")
            return False

if __name__ == "__main__":
    migration = DatabaseMigration()
    migration.upgrade_database()