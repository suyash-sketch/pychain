# PyChain Backend

PyChain backend provides the pure Python core blockchain and the FastAPI REST API.

## Requirements
- Python 3.12+
- `uv`

## Run Tests
```bash
uv run pytest
```

## Run Demo
```bash
uv run python demo.py
```

## Start API Server
```bash
uv run uvicorn app.main:app --reload --port 8000
```

Interactive API documentation will be available at `http://127.0.0.1:8000/docs`.
