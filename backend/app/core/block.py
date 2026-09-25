from dataclasses import dataclass, field
from datetime import datetime, timezone

from app.core.hashing import hash_data
from app.core.transaction import Transaction

@dataclass
class Block:
    index: int
    transactions: list[Transaction]
    previous_hash: str
    timestamp: str = field(
       default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )

    nonce: int = 0
    hash: str = ""

    def compute_hash(self) -> str:
        data = {
            "index": self.index,
            "transactions": [tx.to_dict() for tx in self.transactions],
            "previous_hash": self.previous_hash,
            "timestamp": self.timestamp,
            "nonce": self.nonce,
        }

        return hash_data(data)
    
    def validate_hash(self) -> bool:
        return self.hash == self.compute_hash()