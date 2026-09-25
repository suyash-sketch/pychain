from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import api_v1_router

app = FastAPI(
    title="PyChain API",
    description="Educational blockchain built from scratch with Python",
    version="1.0.0",
)

# Enable CORS for frontend web apps (e.g., Vite/React dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 router
app.include_router(api_v1_router)


@app.get("/")
def root():
    return {
        "name": "PyChain",
        "status": "running",
        "docs_url": "/docs",
        "api_v1": "/api/v1",
    }


@app.get("/health")
def health():
    return {"status": "ok"}