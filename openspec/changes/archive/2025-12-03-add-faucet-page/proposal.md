# Change: Add Faucet Page

## Why
Users need a way to obtain YD Tokens for testing and purchasing courses on the platform. A faucet page provides a user-friendly interface for claiming test tokens from the YDFaucet contract, enabling users to participate in the marketplace without needing external token sources.

## What Changes
- **ADDED**: New `/faucet` route and page component for token claiming
- **ADDED**: Faucet contract integration (read claim status, claim amount, execute claim)
- **ADDED**: UI components for displaying claim status, claim amount, and claim button
- **ADDED**: Transaction handling for claim operations with loading/error states
- **ADDED**: Wallet connection requirement and user feedback
- **ADDED**: Claim eligibility checking (hasClaimed status)

## Impact
- Affected specs: `faucet` (new capability)
- Affected code:
  - New: `app/faucet/page.tsx` - Main faucet page component
  - New: `app/faucet/actions.ts` - Server actions for faucet operations
  - New: `app/faucet/hooks.ts` - React hooks for faucet contract interactions
  - New: `app/faucet/service.ts` - Service layer for faucet data fetching
  - Modified: `lib/config/contracts.ts` - Add YDFAUCET_ADDRESS export
- Dependencies:
  - YDFaucet contract ABI (`app/abi/YDFaucet.json`)
  - YDFaucet contract address (environment variable `YDFAUCET_ADDRESS`)
  - Wallet connection (via existing `useWeb3` hook)

