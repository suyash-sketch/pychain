const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.detail || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export const api = {
  getNodeStatus: () => request('/node/status'),
  validateChain: () => request('/node/validate'),
  getBlocks: () => request('/blocks'),
  getBlock: (index) => request(`/blocks/${index}`),
  getPendingTransactions: () => request('/transactions/pending'),
  submitTransaction: (tx) =>
    request('/transactions', {
      method: 'POST',
      body: JSON.stringify(tx),
    }),
  mineBlock: (minerAddress) =>
    request('/mine', {
      method: 'POST',
      body: JSON.stringify({ miner_address: minerAddress }),
    }),
  createWallet: () =>
    request('/wallets', {
      method: 'POST',
    }),
  getWallets: () => request('/wallets'),
  getBalance: (address) => request(`/balance/${address}`),
  getNonce: (address) => request(`/nonce/${address}`),
  signTransaction: (address, payload) =>
    request(`/wallets/${address}/sign-transaction`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
