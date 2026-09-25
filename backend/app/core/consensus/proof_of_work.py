
from app.core.block import Block

class ProofOfWork:
    def __init__(self, difficulty: int):
        self.difficulty = difficulty

    def mine(self, block: Block) -> Block:
        
        target = "0" * self.difficulty
        while True:
            block.hash = block.compute_hash()
            if block.hash.startswith(target):
                return block
            block.nonce += 1

    def is_valid(self, block: Block) -> bool:
        target = "0" * self.difficulty
        return block.hash.startswith(target) and block.hash == block.compute_hash()