# Change: Add Wallet Reconnection

## Why
Currently, when users refresh the page, their wallet connection is lost and they must manually reconnect. This creates a poor user experience as users expect their wallet connection to persist across page refreshes, similar to how MetaMask and other wallet providers maintain connection state.

## What Changes
- Add automatic wallet reconnection on page load using `eth_accounts` (non-interactive method)
- Add event listeners for `accountsChanged` and `chainChanged` to keep wallet state synchronized
- Update wallet store to restore connection state when wallet provider is available
- Ensure user synchronization still occurs after automatic reconnection

## Impact
- Affected specs: `wallet-user-sync` (modified requirement)
- Affected code:
  - `stores/useWalletStore.ts` - Add reconnection logic and event listeners
  - `lib/hooks/useWeb3.ts` - May need initialization hook
  - `components/Layout/HeaderNav/components/Wallet/service.ts` - Already handles address changes via useEffect

