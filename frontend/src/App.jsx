import React, { useState, useEffect } from 'react';
import { api } from './api';
import Dashboard from './components/Dashboard';
import WalletView from './components/WalletView';
import SendTransaction from './components/SendTransaction';
import MiningView from './components/MiningView';
import ExplorerView from './components/ExplorerView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [status, setStatus] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [activeWalletAddress, setActiveWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  const refreshAllData = async () => {
    try {
      setLoading(true);
      setGlobalError(null);

      const [statusRes, blocksRes, walletsRes, pendingRes] = await Promise.all([
        api.getNodeStatus(),
        api.getBlocks(),
        api.getWallets(),
        api.getPendingTransactions(),
      ]);

      setStatus(statusRes);
      setBlocks(blocksRes);
      setWallets(walletsRes);
      setPendingTransactions(pendingRes);

      if (!activeWalletAddress && walletsRes.length > 0) {
        setActiveWalletAddress(walletsRes[0].address);
      }
    } catch (err) {
      setGlobalError('Backend connection error: Ensure FastAPI server is running on http://127.0.0.1:8000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
    const interval = setInterval(refreshAllData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateWallet = async () => {
    try {
      setLoading(true);
      const newWallet = await api.createWallet();
      await refreshAllData();
      setActiveWalletAddress(newWallet.address);
    } catch (err) {
      alert(err.message || 'Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <span style={{ fontSize: '28px' }}>⛓️</span>
          <div>
            <h1>PyChain</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Educational Blockchain Built From Scratch
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {status && (
            <span className={`badge ${status.is_valid ? '' : 'invalid'}`}>
              {status.is_valid ? 'Chain Valid' : 'Invalid'}
            </span>
          )}
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Diff: {status?.difficulty ?? 2}
          </span>
        </div>
      </header>

      {globalError && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          {globalError}
        </div>
      )}

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-tab ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          👛 Wallets ({wallets.length})
        </button>
        <button
          className={`nav-tab ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          💸 Send
        </button>
        <button
          className={`nav-tab ${activeTab === 'mining' ? 'active' : ''}`}
          onClick={() => setActiveTab('mining')}
        >
          ⛏️ Mining {pendingTransactions.length > 0 && `(${pendingTransactions.length})`}
        </button>
        <button
          className={`nav-tab ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}
        >
          🔍 Explorer ({blocks.length})
        </button>
      </nav>

      <main>
        {activeTab === 'dashboard' && (
          <Dashboard status={status} onRefresh={refreshAllData} loading={loading} />
        )}

        {activeTab === 'wallet' && (
          <WalletView
            wallets={wallets}
            onCreateWallet={handleCreateWallet}
            onSelectWallet={setActiveWalletAddress}
            activeWalletAddress={activeWalletAddress}
            loading={loading}
          />
        )}

        {activeTab === 'send' && (
          <SendTransaction
            wallets={wallets}
            activeWalletAddress={activeWalletAddress}
            onSuccess={refreshAllData}
          />
        )}

        {activeTab === 'mining' && (
          <MiningView
            wallets={wallets}
            activeWalletAddress={activeWalletAddress}
            pendingTransactions={pendingTransactions}
            onMined={refreshAllData}
          />
        )}

        {activeTab === 'explorer' && (
          <ExplorerView blocks={blocks} onRefresh={refreshAllData} loading={loading} />
        )}
      </main>

      <footer className="footer">
        <p>PyChain — Educational Blockchain Implementation (Python 3.12, FastAPI & React)</p>
      </footer>
    </div>
  );
}
