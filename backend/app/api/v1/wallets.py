from fastapi import APIRouter, HTTPException, status
from app.schema.transaction import TransactionResponse, TransactionSignRequest
from app.schema.wallet import BalanceResponse, NonceResponse, WalletResponse
from app.services.blockchain_service import service

router = APIRouter(tags=["Wallets"])


@router.post("/wallets", response_model=WalletResponse, status_code=status.HTTP_201_CREATED)
def create_wallet():
    """
    Create a new cryptographic wallet using Ed25519.
    Returns the address and public key. The private key is kept safe and never exposed.
    """
    wallet = service.create_wallet()
    return WalletResponse(
        address=wallet.address,
        public_key=wallet.get_public_key_hex(),
        balance=service.get_balance(wallet.address),
        nonce=0,
    )


@router.get("/wallets", response_model=list[WalletResponse])
def list_wallets():
    """List all wallets created and managed on this node with their current balance and nonce."""
    wallets = service.list_wallets()
    results = []
    for w in wallets:
        results.append(
            WalletResponse(
                address=w.address,
                public_key=w.get_public_key_hex(),
                balance=service.get_balance(w.address),
                nonce=service.get_nonce(w.address),
            )
        )
    return results


@router.get("/balance/{address}", response_model=BalanceResponse)
def get_balance(address: str):
    """Get the current coin balance of a wallet address."""
    return BalanceResponse(
        address=address,
        balance=service.get_balance(address),
    )


@router.get("/nonce/{address}", response_model=NonceResponse)
def get_nonce(address: str):
    """Get the expected transaction nonce for a wallet address."""
    return NonceResponse(
        address=address,
        nonce=service.get_nonce(address),
    )


@router.post("/wallets/{address}/sign-transaction", response_model=TransactionResponse)
def sign_transaction_with_wallet(address: str, payload: TransactionSignRequest):
    """
    Educational helper: signs a transaction for a node-managed wallet without exposing the private key.
    The returned signed transaction can then be posted to /api/v1/transactions.
    """
    try:
        signed_tx = service.sign_transaction(
            sender_address=address,
            receiver=payload.receiver,
            amount=payload.amount,
            nonce=payload.nonce,
        )
        return signed_tx.to_dict()
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
