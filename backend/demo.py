from app.core.blockchain import Blockchain
from app.core.mempool import Mempool
from app.core.miner import Miner
from app.core.wallet import Wallet


blockchain = Blockchain(difficulty=2)
mempool = Mempool()
miner = Miner(blockchain, mempool)

alice = Wallet()
bob = Wallet()

print("Alice:", alice.address)
print("Bob:", bob.address)

# Mine initial coins to Alice
miner.mine_pending_transactions(alice.address)

print("Alice balance after mining:", blockchain.get_balance(alice.address))

# Alice sends 10 coins to Bob
nonce = blockchain.get_nonce(alice.address)

transaction = alice.create_transaction(
    receiver=bob.address,
    amount=10,
    nonce=nonce,
)

mempool.add_transaction(transaction)

# Mine the transaction
miner.mine_pending_transactions(alice.address)

print("Alice balance:", blockchain.get_balance(alice.address))
print("Bob balance:", blockchain.get_balance(bob.address))
print("Chain valid:", blockchain.validate_chain())
