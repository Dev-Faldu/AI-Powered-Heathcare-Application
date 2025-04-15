from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from typing import Union, Dict, Any
import logging
import traceback
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ErrorHandlerMiddleware:
    async def __call__(self, request: Request, call_next) -> Union[JSONResponse, Any]:
        try:
            return await call_next(request)
        
        except HTTPException as http_exc:
            # Handle known HTTP exceptions
            return JSONResponse(
                status_code=http_exc.status_code,
                content={"detail": http_exc.detail}
            )
            
        except ValueError as val_exc:
            # Handle validation errors
            logger.error(f"Validation error: {str(val_exc)}")
            return JSONResponse(
                status_code=422,
                content={"detail": str(val_exc)}
            )
            
        except Exception as exc:
            # Handle unexpected errors
            exc_type, exc_value, exc_traceback = sys.exc_info()
            stack_trace = traceback.format_exception(exc_type, exc_value, exc_traceback)
            
            # Log the full error details
            logger.error(
                f"Unhandled error occurred: {str(exc)}\n"
                f"Stack trace:\n{''.join(stack_trace)}"
            )
            
            # Return a sanitized error response
            return JSONResponse(
                status_code=500,
                content={
                    "detail": "An internal server error occurred",
                    "error_id": id(exc)  # Useful for log correlation
                }
            )

class CustomHTTPException(HTTPException):
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: str = None,
        extra: Dict[str, Any] = None
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code
        self.extra = extra or {}

async def http_exception_handler(request: Request, exc: CustomHTTPException):
    """Custom exception handler for HTTPException"""
    response = {
        "detail": exc.detail,
        "status_code": exc.status_code
    }
    
    if exc.error_code:
        response["error_code"] = exc.error_code
    
    if exc.extra:
        response["extra"] = exc.extra
        
    return JSONResponse(
        status_code=exc.status_code,
        content=response
    )