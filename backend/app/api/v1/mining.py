from fastapi import APIRouter, HTTPException, status
from app.schema.block import BlockResponse
from app.schema.node import MineRequest
from app.services.blockchain_service import service

router = APIRouter(prefix="/mine", tags=["Mining"])


@router.post("", response_model=BlockResponse, status_code=status.HTTP_201_CREATED)
def mine_block(payload: MineRequest):
    """
    Mine a new block containing all pending transactions from the mempool
    and reward the specified miner address with 50 coins.
    """
    try:
        mined_block = service.mine(payload.miner_address)
        return mined_block
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
