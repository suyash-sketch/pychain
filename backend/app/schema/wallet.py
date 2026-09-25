from pydantic import BaseModel


class WalletResponse(BaseModel):
    address: str
    public_key: str
    balance: int = 10
    nonce: int = 0


class BalanceResponse(BaseModel):
    address: str
    balance: int


class NonceResponse(BaseModel):
    address: str
    nonce: int
