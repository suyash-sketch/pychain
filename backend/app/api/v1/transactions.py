from fastapi import APIRouter, HTTPException, status
from app.core.transaction import Transaction
from app.schema.transaction import TransactionCreate, TransactionResponse
from app.services.blockchain_service import service

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_transaction(payload: TransactionCreate):
    """
    Submit a signed transaction to the mempool.
    Validates transaction structure, signature, and sender address before adding.
    """
    tx = Transaction(
        sender=payload.sender,
        receiver=payload.receiver,
        amount=payload.amount,
        nonce=payload.nonce,
        public_key=payload.public_key,
        signature=payload.signature,
    )

    try:
        service.add_transaction(tx)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return {
        "message": "Transaction added to mempool successfully.",
        "transaction": tx.to_dict(),
    }


@router.get("/pending", response_model=list[TransactionResponse])
def get_pending_transactions():
    """Retrieve all pending transactions waiting in the mempool."""
    return service.get_pending_transactions()
