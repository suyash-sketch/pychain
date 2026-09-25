from pydantic import BaseModel
from app.schema.transaction import TransactionResponse


class BlockResponse(BaseModel):
    index: int
    timestamp: str
    transactions: list[TransactionResponse]
    previous_hash: str
    nonce: int
    hash: str
