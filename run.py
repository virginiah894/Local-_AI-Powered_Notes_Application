import uvicorn
from dotenv import load_dotenv
import os

load_dotenv()

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=True,
        ssl_keyfile=os.getenv("SSL_KEYFILE", None),
        ssl_certfile=os.getenv("SSL_CERTFILE", None),
    )
