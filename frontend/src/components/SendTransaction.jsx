import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function SendTransaction({ wallets, activeWalletAddress, onSuccess }) {
  const [sender, setSender] = useState(activeWalletAddress || '');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [nonce, setNonce] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // When sender or activeWalletAddress changes, update sender and fetch nonce
  useEffect(() => {
    if (activeWalletAddress && !sender) {
      setSender(activeWalletAddress);
    }
  }, [activeWalletAddress]);

  useEffect(() => {
    if (sender) {
      api.getNonce(sender)
        .then((res) => setNonce(res.nonce))
        .catch(() => setNonce(0));
    }
  }, [sender]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    const numAmount = parseInt(amount, 10);
    if (!sender) {
      setErrorMessage('Please select or specify a sender address.');
      return;
    }
    if (!receiver) {
      setErrorMessage('Please enter a receiver address.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Amount must be greater than zero.');
      return;
    }
    if (sender === receiver) {
      setErrorMessage('Sender and receiver cannot be the same address.');
      return;
    }

    try {
      setSubmitting(true);
      // Step 1: Sign the transaction using the node's wallet helper
      const signedTx = await api.signTransaction(sender, {
        receiver,
        amount: numAmount,
        nonce: parseInt(nonce, 10),
      });

      // Step 2: Post raw signed transaction to POST /api/v1/transactions
      const submitRes = await api.submitTransaction(signedTx);

      setStatusMessage({
        text: 'Transaction signed with Ed25519 & admitted to mempool!',
        details: submitRes.transaction,
      });

      setAmount('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="card">
        <h2 style={{ marginBottom: '8px' }}>Send Coins</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
          Digitally sign with sender private key and broadcast to the mempool.
        </p>

        {statusMessage && (
          <div className="alert alert-success">
            <strong>{statusMessage.text}</strong>
            <div style={{ fontSize: '12px', marginTop: '6px' }}>
              <div>Signature: <span className="mono">{statusMessage.details.signature?.slice(0, 32)}...</span></div>
              <div>Nonce: {statusMessage.details.nonce} | Amount: {statusMessage.details.amount} coins</div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Sender Address</label>
            <select
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              disabled={submitting}
            >
              <option value="">-- Select Sender Wallet --</option>
              {wallets.map((w, i) => (
                <option key={w.address} value={w.address}>
                  Wallet #{i + 1} ({w.balance} coins) - {w.address.slice(0, 16)}...
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Receiver Address</label>
            <input
              type="text"
              placeholder="Paste receiver wallet address (64 hex characters)"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              disabled={submitting}
            />
            {wallets.filter((w) => w.address !== sender).length > 0 && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quick Select:</span>
                {wallets
                  .filter((w) => w.address !== sender)
                  .map((w, i) => (
                    <button
                      key={w.address}
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '2px 8px', fontSize: '11px' }}
                      onClick={() => setReceiver(w.address)}
                    >
                      Wallet #{i + 1}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Amount (coins)</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label>Transaction Nonce</label>
              <input
                type="number"
                min="0"
                value={nonce}
                onChange={(e) => setNonce(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={submitting}
          >
            {submitting ? 'Signing & Broadcasting...' : '✍️ Sign & Submit Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
