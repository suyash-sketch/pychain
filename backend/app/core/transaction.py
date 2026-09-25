import json
import hashlib
from dataclasses import dataclass
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

@dataclass
class Transaction:
    sender: str
    receiver: str
    amount: int
    nonce: int = 0
    public_key: str | None = None
    signature: str | None = None

    def to_dict(self) -> dict:
        return {
            "sender": self.sender,
            "receiver": self.receiver,
            "amount": self.amount,
            "nonce": self.nonce,
            "public_key": self.public_key,
            "signature": self.signature,
        }

    def signing_data(self) -> bytes:
        data = {
            "sender": self.sender,
            "receiver": self.receiver,
            "amount": self.amount,
            "nonce": self.nonce,
        }

        return json.dumps(
            data,
            sort_keys=True,
            separators=(",", ":"),
        ).encode("utf-8")

    def is_valid(self) -> bool:
        if not self.sender:
            return False

        if not self.receiver:
            return False

        if self.amount <= 0:
            return False

        if self.nonce < 0:
            return False

        if self.sender == self.receiver:
            return False

        return True
    
    def verify_signature(self) -> bool:
        if not self.public_key:
            return False
        
        if not self.signature:
            return False
            
        try:
            public_key = Ed25519PublicKey.from_public_bytes(
                bytes.fromhex(self.public_key)
            )

            public_key.verify(
                bytes.fromhex(self.signature),
                self.signing_data(),
            )

            return True

        except (InvalidSignature, ValueError):
            return False
        
    def verify_sender(self) -> bool:
        if not self.public_key:
            return False
        
        if not self.sender:
            return False

        derived_address = hashlib.sha256(bytes.fromhex(self.public_key)).hexdigest()

        return derived_address == self.sender