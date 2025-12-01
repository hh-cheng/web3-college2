# Change: Add Wallet User Sync

## Why
When a user connects their wallet, the application should automatically check if a user record exists in the database and create one if it doesn't. This ensures that every connected wallet address has a corresponding user record with a default nickname (the wallet address itself), enabling future features like nickname display, user profiles, and personalized experiences.

Currently, the Wallet component has TODO comments indicating this functionality is needed but not implemented. This change will complete that feature and establish the foundation for user profile management.

## What Changes
- Add server action to fetch or create user record by wallet address
- Integrate user sync logic into Wallet component when wallet connects
- Display user nickname in Wallet component UI (when available)
- Handle error cases gracefully (database failures, network issues)

## Impact
- Affected specs: New capability `wallet-user-sync`
- Affected code:
  - `components/Layout/HeaderNav/components/Wallet.tsx` - Add user sync on connect, display nickname
  - New server action file (e.g., `app/wallet/actions.ts` or similar) - Database operations
  - Database: Uses existing `Users` model with `wallet_address` and `nickname` fields

