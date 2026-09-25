from fastapi import APIRouter
from app.api.v1.blocks import router as blocks_router
from app.api.v1.mining import router as mining_router
from app.api.v1.nodes import router as nodes_router
from app.api.v1.transactions import router as transactions_router
from app.api.v1.wallets import router as wallets_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(blocks_router)
api_v1_router.include_router(transactions_router)
api_v1_router.include_router(mining_router)
api_v1_router.include_router(wallets_router)
api_v1_router.include_router(nodes_router)
