from fastapi import APIRouter, HTTPException, status
from app.schema.block import BlockResponse
from app.services.blockchain_service import service

router = APIRouter(prefix="/blocks", tags=["Blocks"])


@router.get("", response_model=list[BlockResponse])
def get_blocks():
    """Retrieve all blocks in the blockchain ledger."""
    return service.get_blocks()


@router.get("/{index}", response_model=BlockResponse)
def get_block(index: int):
    """Retrieve a specific block by its index."""
    block = service.get_block(index)
    if block is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Block at index {index} not found.",
        )
    return block
