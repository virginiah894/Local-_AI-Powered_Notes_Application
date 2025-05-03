from fastapi import Request, HTTPException
from fastapi.security import APIKeyHeader
import os

API_KEY_HEADER = APIKeyHeader(name="X-API-Key")

async def verify_api_key(request: Request):
    api_key = request.headers.get("X-API-Key")
    if not api_key or api_key != os.getenv("API_KEY"):
        raise HTTPException(
            status_code=403,
            detail="Invalid API key"
        )