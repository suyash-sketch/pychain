import React, { useState } from 'react';
import { api } from '../api';

export default function MiningView({ wallets, activeWalletAddress, pendingTransactions, onMined }) {
  const [minerAddress, setMinerAddress] = useState(activeWalletAddress || (wallets[0]?.address || ''));
  const [mining, setMining] = useState(false);
  const [minedBlock, setMinedBlock] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleMine = async () => {
    setErrorMessage(null);
    setMinedBlock(null);

    if (!minerAddress) {
      setErrorMessage('Please select or provide a miner address to receive the reward.');
      return;
    }

    try {
      setMining(true);
      const block = await api.mineBlock(minerAddress);
      setMinedBlock(block);
      if (onMined) onMined();
    } catch (err) {
      setErrorMessage(err.message || 'Mining failed.');
    } finally {
      setMining(false);
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2>Proof of Work Mining</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
          Execute Proof of Work, package pending transactions, and claim the 50-coin block reward.
        </p>

        {minedBlock && (
          <div className="alert alert-success">
            <strong>🎉 Block #{minedBlock.index} Successfully Mined!</strong>
            <div style={{ fontSize: '13px', marginTop: '8px' }}>
              <div>Hash: <span className="mono" style={{ color: '#fff' }}>{minedBlock.hash}</span></div>
              <div>Proof of Work Nonce: <strong>{minedBlock.nonce}</strong></div>
              <div>Included Transactions: <strong>{minedBlock.transactions.length}</strong> (including 50 coin reward)</div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error">
            <strong>Mining Error:</strong> {errorMessage}
          </div>
        )}

        <div className="form-group">
          <label>Reward Recipient (Miner Address)</label>
          {wallets.length > 0 ? (
            <select
              value={minerAddress}
              onChange={(e) => setMinerAddress(e.target.value)}
              disabled={mining}
            >
              <option value="">-- Choose Miner Wallet --</option>
              {wallets.map((w, i) => (
                <option key={w.address} value={w.address}>
                  Wallet #{i + 1} ({w.balance} coins) - {w.address.slice(0, 16)}...
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="Paste miner address"
              value={minerAddress}
              onChange={(e) => setMinerAddress(e.target.value)}
              disabled={mining}
            />
          )}
        </div>

        <div style={{ background: '#0d1117', padding: '14px', borderRadius: '6px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span>Block Reward:</span>
            <span style={{ fontWeight: '700', color: '#e3b341' }}>50 PYCHAIN Coins</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '6px' }}>
            <span>Pending Tx to Package:</span>
            <span>{pendingTransactions.length} transaction(s)</span>
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', fontSize: '15px' }}
          onClick={handleMine}
          disabled={mining || !minerAddress}
        >
          {mining ? '⛏️ Solving Proof of Work Hash...' : '⛏️ Mine New Block'}
        </button>
      </div>

      <div className="card">
        <h3>Mempool: Pending Transactions ({pendingTransactions.length})</h3>
        {pendingTransactions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '10px' }}>
            Mempool is currently empty. Mining now will produce a block containing solely the 50-coin coinbase reward.
          </p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '12px' }}>
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Amount</th>
                  <th>Nonce</th>
                </tr>
              </thead>
              <tbody>
                {pendingTransactions.map((tx, idx) => (
                  <tr key={idx}>
                    <td><span className="hash-pill">{tx.sender?.slice(0, 12)}...</span></td>
                    <td><span className="hash-pill">{tx.receiver?.slice(0, 12)}...</span></td>
                    <td><strong style={{ color: '#56d364' }}>{tx.amount}</strong></td>
                    <td className="mono">{tx.nonce}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
