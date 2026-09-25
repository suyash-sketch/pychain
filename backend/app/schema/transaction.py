from pydantic import BaseModel, Field


class TransactionCreate(BaseModel):
    sender: str = Field(..., min_length=1, description="Sender wallet address")
    receiver: str = Field(..., min_length=1, description="Receiver wallet address")
    amount: int = Field(..., gt=0, description="Amount to transfer (must be > 0)")
    nonce: int = Field(..., ge=0, description="Account transaction nonce (must be >= 0)")
    public_key: str = Field(..., min_length=1, description="Hex-encoded Ed25519 public key")
    signature: str = Field(..., min_length=1, description="Hex-encoded Ed25519 signature")


class TransactionResponse(BaseModel):
    sender: str
    receiver: str
    amount: int
    nonce: int
    public_key: str | None = None
    signature: str | None = None


class TransactionSignRequest(BaseModel):
    receiver: str = Field(..., min_length=1, description="Receiver wallet address")
    amount: int = Field(..., gt=0, description="Amount to transfer")
    nonce: int | None = Field(default=None, description="Account nonce (auto-fetched if omitted)")
