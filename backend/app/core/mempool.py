from app.core.transaction import Transaction
class Mempool:
    def __init__(self):
        self.transactions = []

    def add_transaction(self, transaction: Transaction):
        if not transaction.is_valid():
            raise ValueError("Invalid Transaction.")

        if not transaction.verify_signature():
            raise ValueError("Invalid Signature.")
        
        if not transaction.verify_sender(): 
            raise ValueError("Invalid sender.")

        self.transactions.append(transaction)

    def get_pending_transactions(self):
        return list(self.transactions)

    def clear(self):
        self.transactions.clear()