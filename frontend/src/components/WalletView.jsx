import React, { useState } from 'react';

export default function WalletView({ wallets, onCreateWallet, onSelectWallet, activeWalletAddress, loading }) {
  const [copiedAddress, setCopiedAddress] = useState(null);

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Cryptographic Wallets</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Ed25519 keypairs with SHA-256 derived addresses. Private keys remain secure on node.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onCreateWallet} disabled={loading}>
          {loading ? 'Creating...' : '+ Create New Wallet'}
        </button>
      </div>

      {wallets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            No wallets created yet. Click "+ Create New Wallet" to generate an Ed25519 keypair!
          </p>
          <button className="btn btn-primary" onClick={onCreateWallet} disabled={loading}>
            Create First Wallet
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {wallets.map((wallet, index) => {
            const isActive = wallet.address === activeWalletAddress;
            return (
              <div
                key={wallet.address}
                className="card"
                style={{
                  border: isActive ? '1px solid var(--accent)' : '1px solid var(--card-border)',
                  backgroundColor: isActive ? '#1c2128' : 'var(--card-bg)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '16px' }}>Wallet #{index + 1}</span>
                    {isActive && (
                      <span className="badge" style={{ marginLeft: '10px' }}>
                        Active Selection
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: '#56d364' }}>
                      {wallet.balance} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>COINS</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Account Nonce: {wallet.nonce}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '8px', fontSize: '13px', marginBottom: '12px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Address:</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="hash-pill" style={{ flex: 1 }}>{wallet.address}</span>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '11px' }}
                      onClick={() => handleCopy(wallet.address)}
                    >
                      {copiedAddress === wallet.address ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div style={{ color: 'var(--text-muted)' }}>Public Key:</div>
                  <div className="mono" style={{ color: 'var(--text-muted)' }}>
                    {wallet.public_key}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    className={`btn ${isActive ? 'btn-secondary' : 'btn-accent'}`}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => onSelectWallet(wallet.address)}
                  >
                    {isActive ? 'Selected' : 'Use as Active Wallet'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
