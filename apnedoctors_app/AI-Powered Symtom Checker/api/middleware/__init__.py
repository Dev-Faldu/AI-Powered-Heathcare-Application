from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security configuration
security = HTTPBearer()
SECRET_KEY = "your-secret-key"  # Move to environment variables in production
ALGORITHM = "HS256"

class AuthMiddleware:
    async def __call__(self, request: Request, call_next):
        try:
            # Skip auth for certain endpoints
            if request.url.path in ["/api/v1/auth/login", "/health", "/"]:
                return await call_next(request)

            # Verify JWT token
            credentials: HTTPAuthorizationCredentials = await security(request)
            token = credentials.credentials
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            
            # Check token expiration
            if datetime.fromtimestamp(payload.get("exp")) < datetime.now():
                raise HTTPException(status_code=401, detail="Token expired")
            
            # Add user info to request state
            request.state.user = payload.get("sub")
            
            return await call_next(request)
            
        except JWTError:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication credentials"
            )
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

class ErrorHandlerMiddleware:
    async def __call__(self, request: Request, call_next):
        try:
            return await call_next(request)
        except HTTPException as exc:
            # Re-raise HTTP exceptions
            raise exc
        except Exception as e:
            # Log unexpected errors
            logger.error(f"Unhandled error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="An unexpected error occurred"
            )

# Export middleware classes
__all__ = ["AuthMiddleware", "ErrorHandlerMiddleware"]