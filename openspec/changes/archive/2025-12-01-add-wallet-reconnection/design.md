## Context
The wallet store currently only supports manual connection via `eth_requestAccounts`, which requires user interaction. When users refresh the page, they must manually reconnect their wallet, creating friction in the user experience. MetaMask and other EIP-1193 compatible wallets maintain connection state and can be queried non-interactively using `eth_accounts`.

## Goals / Non-Goals
- Goals:
  - Automatically reconnect wallets on page load without user interaction
  - Keep wallet state synchronized with wallet provider state (account changes, chain changes)
  - Maintain existing user synchronization behavior after reconnection
- Non-Goals:
  - Persisting connection state in localStorage (wallet provider already handles this)
  - Supporting multiple simultaneous wallet connections
  - Adding wallet connection timeout or retry logic

## Decisions
- Decision: Use `eth_accounts` for non-interactive connection check
  - Rationale: `eth_accounts` returns currently connected accounts without prompting the user, making it ideal for initialization
  - Alternative considered: Using `eth_requestAccounts` on page load - rejected because it prompts users unnecessarily

- Decision: Add event listeners directly in the wallet store
  - Rationale: Centralizes wallet state management and ensures all components using the store receive updates automatically
  - Alternative considered: Event listeners in a separate hook - rejected because it would require passing state updates back to the store, creating unnecessary complexity

- Decision: Initialize wallet connection in a client-side initialization hook/component
  - Rationale: Next.js App Router requires client-side code for browser APIs like `window.ethereum`
  - Implementation: Create a `WalletInitializer` component or hook that runs once on mount and calls the store's `initialize` method

- Decision: Handle account changes by disconnecting if accounts array is empty, updating address if changed
  - Rationale: Matches user expectations - if they disconnect in MetaMask, the app should reflect that immediately
  - Edge case: If user switches accounts, we update the address and trigger user sync for the new account

- Decision: Handle chain changes by updating chainID and optionally prompting to switch to target chain
  - Rationale: Users may switch chains for other purposes, but we should still track the current chain
  - Note: Chain switching prompt behavior matches existing `switchToTargetChain` logic

## Risks / Trade-offs
- Risk: Event listeners may not be cleaned up properly, causing memory leaks
  - Mitigation: Store event listener references and provide cleanup method in store, call cleanup on component unmount

- Risk: Race condition between initialization and manual connection attempts
  - Mitigation: Use store status to prevent concurrent connection attempts (`status === 'connecting'`)

- Risk: Multiple tabs/windows may have different connection states
  - Mitigation: Rely on wallet provider's `accountsChanged` event to sync across tabs (standard EIP-1193 behavior)

- Trade-off: Automatic reconnection vs user privacy
  - Consideration: Some users may prefer explicit connection each time
  - Decision: Follow industry standard (MetaMask, WalletConnect) of auto-reconnecting previously connected wallets

## Migration Plan
1. Add `initialize` method to wallet store
2. Add `checkConnection` helper method
3. Add event listener setup and cleanup
4. Create initialization component/hook
5. Add initialization to app layout or root component
6. Test reconnection flow
7. Test event handling (account/chain changes)

No rollback needed - this is additive functionality. If issues arise, the `initialize` call can be removed and the app will fall back to manual connection only.

## Open Questions
- Should we add a loading state during initialization to prevent UI flicker?
  - Decision: Yes, add `initializing` status to store to show loading state during first connection check

