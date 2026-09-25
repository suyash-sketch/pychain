from pydantic import BaseModel, Field
from app.schema.block import BlockResponse


class MineRequest(BaseModel):
    miner_address: str = Field(..., min_length=1, description="Address to receive the mining reward")


class ChainStatusResponse(BaseModel):
    chain_length: int
    latest_block: BlockResponse
    difficulty: int
    pending_transactions_count: int
    is_valid: bool
