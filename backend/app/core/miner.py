from app.core.block import Block
from app.core.blockchain import Blockchain
from app.core.mempool import Mempool
from app.core.transaction import Transaction
from app.core.blockchain import MINING_REWARD, SYSTEM_ADDRESS
class Miner:
    def __init__(self, blockchain: Blockchain, mempool: Mempool):
        self.blockchain = blockchain
        self.mempool = mempool

    
    def mine_pending_transactions(self, miner_address: str) -> Block:
        transactions = self.mempool.get_pending_transactions()

        reward = Transaction(
            sender=SYSTEM_ADDRESS,
            receiver=miner_address,
            amount=MINING_REWARD,
            nonce=0,
        ) 

        transactions.append(reward)

        previous_block = (self.blockchain.get_latest_block())

        block = Block(
            index=previous_block.index + 1,
            transactions=transactions,
            previous_hash=previous_block.hash,
        )

        self.blockchain.proof_of_work.mine(block)

        self.blockchain.add_block(block)

        self.mempool.clear()

        return block