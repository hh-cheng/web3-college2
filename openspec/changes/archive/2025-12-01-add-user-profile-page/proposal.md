# Change: Add User Profile Page

## Why
Users need a dedicated page to view their wallet information and manage their profile settings, specifically their nickname. Currently, the `/me` page only displays "me" and there is no way for users to update their nickname after it's been set during wallet connection. This change will provide a complete user profile experience where users can view their wallet details and customize their nickname.

## What Changes
- Implement `/me` page to display user wallet information (address, chain ID, balance)
- Add nickname display and editing functionality
- Create server action to update user nickname
- Handle wallet connection state (prompt to connect if disconnected)
- Integrate with existing wallet store and user sync functionality

## Impact
- Affected specs: New capability `user-profile`
- Affected code:
  - `app/me/page.tsx` - Implement full profile page UI
  - `app/me/actions.ts` - New server action for updating nickname
  - `components/Layout/HeaderNav/components/Wallet/actions.ts` - May extend with update functionality or create separate action
  - Database: Uses existing `Users` model with `nickname` field

