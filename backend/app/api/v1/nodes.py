from fastapi import APIRouter
from app.schema.node import ChainStatusResponse
from app.services.blockchain_service import service

router = APIRouter(prefix="/node", tags=["Node & Consensus"])


@router.get("/status", response_model=ChainStatusResponse)
def get_node_status():
    """Retrieve the current health, chain length, difficulty, and mempool status of the node."""
    status_data = service.get_status()
    return status_data


@router.get("/validate")
def validate_chain():
    """Check if the entire blockchain ledger is mathematically and cryptographically valid."""
    is_valid = service.validate_chain()
    return {"is_valid": is_valid}
