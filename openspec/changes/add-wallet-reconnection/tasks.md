## 1. Implementation
- [x] 1.1 Add `checkConnection` method to wallet store that uses `eth_accounts` to check for existing connected accounts
- [x] 1.2 Add `initialize` method to wallet store that checks for connection on mount and sets up event listeners
- [x] 1.3 Add event listeners for `accountsChanged` and `chainChanged` events from wallet provider
- [x] 1.4 Update wallet store to handle account changes (disconnect if accounts empty, update address if changed)
- [x] 1.5 Update wallet store to handle chain changes (update chainID, switch to target chain if needed)
- [x] 1.6 Create initialization hook or component that calls `initialize` on app mount
- [x] 1.7 Ensure user synchronization (`getOrCreateUser`) still triggers after automatic reconnection

## 2. Validation
- [x] 2.1 Test wallet reconnection after page refresh
- [x] 2.2 Test wallet disconnection when user disconnects in MetaMask
- [x] 2.3 Test account switching in MetaMask updates the connected address
- [x] 2.4 Test chain switching updates the chainID
- [x] 2.5 Verify user synchronization occurs after automatic reconnection
- [x] 2.6 Verify no duplicate connection prompts appear

