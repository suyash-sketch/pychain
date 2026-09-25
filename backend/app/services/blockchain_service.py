from app.core.blockchain import Blockchain
from app.core.block import Block
from app.core.mempool import Mempool
from app.core.miner import Miner
from app.core.transaction import Transaction
from app.core.wallet import Wallet


class BlockchainService:
    def __init__(self, difficulty: int = 2):
        self.blockchain = Blockchain(difficulty=difficulty)
        self.mempool = Mempool()
        self.miner = Miner(self.blockchain, self.mempool)
        self.wallets: dict[str, Wallet] = {}

    def get_blocks(self) -> list[Block]:
        return self.blockchain.chain

    def get_block(self, index: int) -> Block | None:
        if 0 <= index < len(self.blockchain.chain):
            return self.blockchain.chain[index]
        return None

    def get_latest_block(self) -> Block:
        return self.blockchain.get_latest_block()

    def get_balance(self, address: str) -> int:
        return self.blockchain.get_balance(address)

    def get_nonce(self, address: str) -> int:
        return self.blockchain.get_nonce(address)

    def get_pending_transactions(self) -> list[Transaction]:
        return self.mempool.get_pending_transactions()

    def add_transaction(self, tx: Transaction) -> None:
        # Check basic validity, signature, and sender address
        self.mempool.add_transaction(tx)

    def mine(self, miner_address: str) -> Block:
        return self.miner.mine_pending_transactions(miner_address)

    def create_wallet(self) -> Wallet:
        wallet = Wallet()
        self.wallets[wallet.address] = wallet
        return wallet

    def get_wallet(self, address: str) -> Wallet | None:
        return self.wallets.get(address)

    def list_wallets(self) -> list[Wallet]:
        return list(self.wallets.values())

    def sign_transaction(
        self,
        sender_address: str,
        receiver: str,
        amount: int,
        nonce: int | None = None,
    ) -> Transaction:
        wallet = self.get_wallet(sender_address)
        if not wallet:
            raise ValueError(f"Wallet with address {sender_address} is not managed by this node.")

        if nonce is None:
            nonce = self.get_nonce(sender_address)

        return wallet.create_transaction(
            receiver=receiver,
            amount=amount,
            nonce=nonce,
        )

    def validate_chain(self) -> bool:
        return self.blockchain.validate_chain()

    def get_status(self) -> dict:
        latest = self.get_latest_block()
        return {
            "chain_length": len(self.blockchain.chain),
            "latest_block": latest,
            "difficulty": self.blockchain.difficulty,
            "pending_transactions_count": len(self.mempool.get_pending_transactions()),
            "is_valid": self.validate_chain(),
        }


# Global in-memory singleton service
service = BlockchainService(difficulty=2)
