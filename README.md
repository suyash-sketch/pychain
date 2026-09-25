# PyChain — Educational Blockchain From Scratch

**PyChain** is an educational, working mini cryptocurrency and blockchain implementation built from scratch using Python, FastAPI, and React.

> **Disclaimer:** PyChain is strictly an educational project intended for learning how core blockchain concepts work (cryptographic keys, digital signatures, hashing, Proof of Work, transaction pools, and ledger state transitions). It is **not** a production cryptocurrency and not intended for real-money use.

---

## 🌟 Key Features

* **Ed25519 Cryptographic Wallets:** Public/private key generation using the standard `cryptography` library. Wallet addresses derived from `SHA-256(public_key)`.
* **Tamper-Proof Transactions:** Account-based transactions signed with sender private keys and verified with public keys.
* **Replay Protection:** Account transaction nonces ensure transactions cannot be re-executed.
* **In-Memory Mempool:** Transaction pool that filters invalid transactions and bad signatures before admitting them for mining.
* **Proof-of-Work Consensus:** Difficulty-based block mining ($N$ leading zeros) and validation.
* **Mining Rewards:** Automatic 50-coin reward transaction from `SYSTEM` awarded to the miner on each block.
* **Ledger Validation:** Full chain integrity verification validating block linkages, hashes, transaction state, and Proof of Work.
* **REST API:** FastAPI application exposing endpoints for blocks, transactions, wallets, mining, and node status with interactive `/docs`.
* **React Frontend:** Modern, dark-mode web explorer built with React & Vite to create wallets, mine blocks, send coins, and inspect blocks.

---

## 📁 Project Structure

```text
PYCHAIN/
├── backend/
│   ├── app/
│   │   ├── core/                  # Pure Python blockchain core (zero FastAPI dependency)
│   │   │   ├── hashing.py         # SHA-256 deterministic hashing
│   │   │   ├── transaction.py     # Transaction dataclass & signature verification
│   │   │   ├── wallet.py          # Ed25519 keypair generation & signing
│   │   │   ├── block.py           # Block structure & hash validation
│   │   │   ├── blockchain.py      # Ledger state, balance tracking & chain validation
│   │   │   ├── mempool.py         # In-memory unconfirmed transaction pool
│   │   │   ├── miner.py           # Block assembly, reward injection & PoW mining
│   │   │   └── consensus/
│   │   │       └── proof_of_work.py  # PoW target difficulty & mining loop
│   │   ├── api/v1/                # FastAPI v1 route handlers
│   │   │   ├── blocks.py          # GET /blocks, GET /blocks/{index}
│   │   │   ├── transactions.py    # POST /transactions, GET /transactions/pending
│   │   │   ├── mining.py          # POST /mine
│   │   │   ├── wallets.py         # POST /wallets, GET /balance, GET /nonce
│   │   │   └── nodes.py           # GET /node/status, GET /node/validate
│   │   ├── schema/                # Pydantic models for request & response validation
│   │   ├── services/              # In-memory service coordinating blockchain & miner
│   │   └── main.py                # FastAPI app with CORS middleware
│   ├── tests/                     # Comprehensive pytest test suite (42 tests)
│   ├── demo.py                    # Standalone single-node Python simulation
│   └── pyproject.toml             # uv & Python dependencies
└── frontend/                      # React + Vite web explorer & wallet interface
    ├── src/
    │   ├── components/            # Dashboard, WalletView, SendTransaction, MiningView, ExplorerView
    │   ├── api.js                 # Backend API client
    │   ├── App.jsx                # Main application & tab switcher
    │   └── index.css              # Custom responsive dark-mode styling
    └── package.json
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.12+
- [`uv`](https://docs.astral.sh/uv/) (Python package manager)
- Node.js 18+ and npm

---

### 2. Running the Python Demo (Plain Python)
To verify the core blockchain without starting any web server:

```bash
cd backend
uv run python demo.py
```

Expected output:
```text
Alice: dae97211684118df5d75c856e743791681891a37b9372bb6f3beeadc84315e26
Bob: acae53028565b538eb407f586d6990af830b19788e8a09a3070c3073696f8096
Alice balance after mining: 50
Alice balance: 90
Bob balance: 10
Chain valid: True
```

---

### 3. Running Backend Tests
Execute the full unit test suite covering blocks, transactions, wallets, mempool, proof of work, and API endpoints:

```bash
cd backend
uv run pytest
```

---

### 4. Starting the Backend API Server
Start FastAPI with automatic reloading:

```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

- API Base URL: `http://127.0.0.1:8000`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`

---

### 5. Starting the React Frontend
In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📖 Walkthrough: Interacting with PyChain

1. **Create Wallets:**
   - Go to the **Wallets** tab and click **"+ Create New Wallet"** to create Alice and Bob's wallets.
2. **Mine Initial Coins:**
   - Go to the **Mining** tab, select Alice's wallet, and click **"Mine New Block"**.
   - Proof of Work will execute, and Alice will receive the 50-coin block reward.
3. **Send Coins:**
   - Go to the **Send** tab.
   - Choose Alice as sender, select Bob as receiver, enter `10` coins, and click **"Sign & Submit Transaction"**.
   - The transaction is signed with Alice's Ed25519 private key and admitted into the mempool.
4. **Mine Block with Transaction:**
   - Go back to the **Mining** tab. Notice `1 pending transaction` waiting in the mempool.
   - Click **"Mine New Block"** to solve the PoW and confirm the transaction onto the ledger.
5. **Inspect the Ledger:**
   - In the **Dashboard**, see updated chain statistics and verified cryptographic integrity.
   - In the **Wallets** tab, see updated balances (Alice: 90 coins, Bob: 10 coins).
   - In the **Explorer** tab, expand blocks to inspect confirmed transactions, amounts, and digital signatures.
