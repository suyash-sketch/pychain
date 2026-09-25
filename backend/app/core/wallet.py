import hashlib
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives import serialization

class Wallet:
    def __init__(self):
        self.private_key = Ed25519PrivateKey.generate()
        self.public_key = self.private_key.public_key()

    @property
    def address(self) -> str:
        public_key_bytes = self.public_key.public_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PublicFormat.Raw
        )
        
        return hashlib.sha256(public_key_bytes).hexdigest()

    def sign(self, message: bytes) -> str:
        return self.private_key.sign(message).hex()

    def verify(self, data: bytes, signature: str) -> bool:
        try:
            self.public_key.verify(
                bytes.fromhex(signature),
                data,
            )

            return True
        except (InvalidSignature, ValueError):
            return False
        
    def get_public_key_hex(self) -> str:
        public_key_bytes = self.public_key.public_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PublicFormat.Raw
        )
        return public_key_bytes.hex()
    
    def get_private_key_hex(self) -> str:
        private_key_bytes = self.private_key.private_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PrivateFormat.Raw,
            encryption_algorithm=serialization.NoEncryption()
        )
        return private_key_bytes.hex()

    def create_transaction(
        self,
        receiver: str,
        amount: int,
        nonce: int,
    ):
        from app.core.transaction import Transaction

        transaction = Transaction(
            sender=self.address,
            receiver=receiver,
            amount=amount,
            nonce=nonce,
            public_key=self.get_public_key_hex(),
        )
        transaction.signature = self.sign(
            transaction.signing_data()
            )
    
        return transaction
    
    @staticmethod
    def address_from_public_key(public_key_hex: str) -> str:
        public_key_bytes = bytes.fromhex(public_key_hex)
        
        return hashlib.sha256(public_key_bytes).hexdigest()