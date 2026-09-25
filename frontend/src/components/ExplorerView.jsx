import React, { useState } from 'react';

export default function ExplorerView({ blocks, onRefresh, loading }) {
  const [expandedBlockIndex, setExpandedBlockIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedBlockIndex(expandedBlockIndex === index ? null : index);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Blockchain Explorer</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Inspect immutable ledger blocks and confirmed transactions.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={onRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : '🔄 Refresh Blocks'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '16px' }}>
        {blocks.map((block) => {
          const isExpanded = expandedBlockIndex === block.index;
          const isGenesis = block.index === 0;

          return (
            <div key={block.index} className="block-item">
              <div className="block-header">
                <div>
                  <span style={{ fontSize: '18px', fontWeight: '700', marginRight: '10px' }}>
                    Block #{block.index}
                  </span>
                  {isGenesis ? (
                    <span className="badge" style={{ backgroundColor: 'rgba(88, 166, 255, 0.15)', color: '#58a6ff', borderColor: 'rgba(88, 166, 255, 0.3)' }}>
                      Genesis Block
                    </span>
                  ) : (
                    <span className="badge">
                      {block.transactions.length} Tx(s)
                    </span>
                  )}
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                  onClick={() => toggleExpand(block.index)}
                >
                  {isExpanded ? 'Hide Details' : 'Inspect Transactions'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '6px', fontSize: '13px' }}>
                <div style={{ color: 'var(--text-muted)' }}>Hash:</div>
                <div className="hash-pill" style={{ color: '#58a6ff' }}>{block.hash}</div>

                <div style={{ color: 'var(--text-muted)' }}>Previous Hash:</div>
                <div className="hash-pill">{block.previous_hash}</div>

                <div style={{ color: 'var(--text-muted)' }}>PoW Nonce:</div>
                <div className="mono">{block.nonce}</div>

                <div style={{ color: 'var(--text-muted)' }}>Timestamp:</div>
                <div>{block.timestamp}</div>
              </div>

              {isExpanded && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
                  <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>
                    Transactions Included ({block.transactions.length})
                  </h4>

                  {block.transactions.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No transactions in this block.</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="tx-table">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th>Amount</th>
                            <th>Nonce</th>
                            <th>Signature</th>
                          </tr>
                        </thead>
                        <tbody>
                          {block.transactions.map((tx, idx) => {
                            const isReward = tx.sender === 'SYSTEM';
                            return (
                              <tr key={idx}>
                                <td>
                                  {isReward ? (
                                    <span className="tx-reward">REWARD</span>
                                  ) : (
                                    <span style={{ color: 'var(--accent)', fontWeight: '600' }}>TRANSFER</span>
                                  )}
                                </td>
                                <td>
                                  {isReward ? (
                                    <span style={{ color: '#e3b341', fontWeight: '600' }}>SYSTEM</span>
                                  ) : (
                                    <span className="hash-pill">{tx.sender.slice(0, 12)}...</span>
                                  )}
                                </td>
                                <td><span className="hash-pill">{tx.receiver.slice(0, 12)}...</span></td>
                                <td>
                                  <strong style={{ color: isReward ? '#e3b341' : '#56d364' }}>
                                    {tx.amount}
                                  </strong>
                                </td>
                                <td className="mono">{tx.nonce}</td>
                                <td>
                                  {tx.signature ? (
                                    <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                                      {tx.signature.slice(0, 16)}...
                                    </span>
                                  ) : (
                                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
