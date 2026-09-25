import React from 'react';

export default function Dashboard({ status, onRefresh, loading }) {
  if (!status) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading blockchain status...</p>
      </div>
    );
  }

  const { chain_length, latest_block, difficulty, pending_transactions_count, is_valid } = status;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Network Dashboard</h2>
        <button className="btn btn-secondary" onClick={onRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : '🔄 Refresh Status'}
        </button>
      </div>

      <div className="grid-stats">
        <div className="card stat-card">
          <div className="label">Chain Length</div>
          <div className="value">{chain_length} Blocks</div>
        </div>

        <div className="card stat-card">
          <div className="label">Difficulty Target</div>
          <div className="value">{difficulty} Leading Zeros</div>
        </div>

        <div className="card stat-card">
          <div className="label">Mempool Pending</div>
          <div className="value">{pending_transactions_count} Tx</div>
        </div>

        <div className="card stat-card">
          <div className="label">Ledger Integrity</div>
          <div className="value" style={{ fontSize: '20px', marginTop: '4px' }}>
            <span className={`badge ${is_valid ? '' : 'invalid'}`}>
              {is_valid ? '✓ Cryptographically Valid' : '✗ Tampered / Invalid'}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Latest Block (# {latest_block.index})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', fontSize: '14px' }}>
          <div style={{ color: 'var(--text-muted)' }}>Block Hash:</div>
          <div><span className="hash-pill" style={{ color: '#58a6ff' }}>{latest_block.hash}</span></div>

          <div style={{ color: 'var(--text-muted)' }}>Previous Hash:</div>
          <div><span className="hash-pill">{latest_block.previous_hash}</span></div>

          <div style={{ color: 'var(--text-muted)' }}>PoW Nonce:</div>
          <div className="mono">{latest_block.nonce}</div>

          <div style={{ color: 'var(--text-muted)' }}>Timestamp:</div>
          <div>{latest_block.timestamp}</div>

          <div style={{ color: 'var(--text-muted)' }}>Transactions:</div>
          <div>{latest_block.transactions.length} transaction(s) included</div>
        </div>
      </div>
    </div>
  );
}
