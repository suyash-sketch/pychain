from fastapi import FastAPI

app = FastAPI(
    title="PyChain API",
    description="Educational blockchain built from scratch with Python",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "name": "PyChain",
        "status": "running",
    }


@app.get("/health")
def health():
    return {"status": "ok"}