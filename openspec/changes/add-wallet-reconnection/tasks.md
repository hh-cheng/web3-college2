## 1. Implementation
- [ ] 1.1 Add `checkConnection` method to wallet store that uses `eth_accounts` to check for existing connected accounts
- [ ] 1.2 Add `initialize` method to wallet store that checks for connection on mount and sets up event listeners
- [ ] 1.3 Add event listeners for `accountsChanged` and `chainChanged` events from wallet provider
- [ ] 1.4 Update wallet store to handle account changes (disconnect if accounts empty, update address if changed)
- [ ] 1.5 Update wallet store to handle chain changes (update chainID, switch to target chain if needed)
- [ ] 1.6 Create initialization hook or component that calls `initialize` on app mount
- [ ] 1.7 Ensure user synchronization (`getOrCreateUser`) still triggers after automatic reconnection

## 2. Validation
- [ ] 2.1 Test wallet reconnection after page refresh
- [ ] 2.2 Test wallet disconnection when user disconnects in MetaMask
- [ ] 2.3 Test account switching in MetaMask updates the connected address
- [ ] 2.4 Test chain switching updates the chainID
- [ ] 2.5 Verify user synchronization occurs after automatic reconnection
- [ ] 2.6 Verify no duplicate connection prompts appear

