from app.core.block import Block
from app.core.consensus.proof_of_work import ProofOfWork

MINING_REWARD = 50
SYSTEM_ADDRESS = "SYSTEM"
DEFAULT_WALLET_BALANCE = 10
class Blockchain:
    def __init__(self, difficulty: int = 4):
        self.chain : list[Block] = []
        self.difficulty = difficulty
        self.proof_of_work = ProofOfWork(difficulty)
        self._create_genesis_block()

    def _create_genesis_block(self) -> None:
        genesis_block = Block(
            index=0, 
            transactions=[], 
            previous_hash="0",
            timestamp="genesis"
        )
        genesis_block.hash = genesis_block.compute_hash()
        self.chain.append(genesis_block)

    def get_latest_block(self) -> Block:
        return self.chain[-1]
    
 
    def validate_chain(self) -> bool:
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            if current_block.previous_hash != previous_block.hash:
                return False
            
            if not current_block.validate_hash():
                return False
        
        return True
    

    def get_balance(self, address: str) -> int:
        balance = DEFAULT_WALLET_BALANCE

        for block in self.chain:
            for transaction in block.transactions:
                if (
                    transaction.sender == SYSTEM_ADDRESS
                    and transaction.receiver == address
                ):
                    balance += transaction.amount
                    continue

                if transaction.sender == address:
                    balance -= transaction.amount
                elif transaction.receiver == address:
                    balance += transaction.amount

        return balance

    def get_nonce(self, address: str) -> int:
        nonce = 0

        for block in self.chain:
            for transaction in block.transactions:
                if transaction.sender == address:
                    nonce = max(nonce, transaction.nonce + 1)

        return nonce

    def validate_transaction(self, transaction) -> bool:
        if not transaction.is_valid():
            return False

        if not transaction.verify_sender():
            return False

        if not transaction.verify_signature():
            return False

        if transaction.nonce != self.get_nonce(transaction.sender):
            return False

        if self.get_balance(transaction.sender) < transaction.amount:
            return False

        return True

    def add_block(self, block: Block) -> None:
        latest_block = self.get_latest_block()

        if block.index != latest_block.index + 1:
            raise ValueError("The block index is invalid.")

        if block.previous_hash != latest_block.hash:
            raise ValueError("The previous hash does not match the latest block's hash.")

        if not self.proof_of_work.is_valid(block):
            raise ValueError("The block's proof of work is invalid.")

        if not block.transactions:
            raise ValueError("The block must contain at least one transaction.")

        normal_transactions = block.transactions[:-1]
        reward_transaction = block.transactions[-1]

        for transaction in normal_transactions:
            if not self.validate_transaction(transaction):
                raise ValueError("One or more transactions in the block are invalid.")

        if (
            reward_transaction.sender != SYSTEM_ADDRESS
            or reward_transaction.amount != MINING_REWARD
        ):
            raise ValueError("Invalid mining reward.")

        if not reward_transaction.receiver:
            raise ValueError("Invalid mining reward receiver.")

        self.chain.append(block)

