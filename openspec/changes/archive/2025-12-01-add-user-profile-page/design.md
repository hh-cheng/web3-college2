## Context
The `/me` page currently only displays "me" and needs to be implemented as a full user profile page. Users can already sync their wallet with the database via the existing `getOrCreateUser` server action, but there is no functionality to update their nickname. The page should display wallet information and allow nickname editing.

## Goals / Non-Goals
- Goals:
  - Display wallet address, chain ID, and ETH balance
  - Display and allow editing of user nickname
  - Handle disconnected wallet state gracefully
  - Integrate with existing wallet store and user sync functionality
- Non-Goals:
  - Avatar management (future feature)
  - Signature verification for nickname updates (can be added later if security requirements demand it)
  - Profile privacy settings (future feature)
  - Transaction history display (future feature)

## Decisions
- Decision: Use server action pattern for nickname updates (consistent with `app/market/actions.ts` and `components/Layout/HeaderNav/components/Wallet/actions.ts`)
  - Alternatives considered: API routes, direct Prisma calls from client
  - Rationale: Server actions are the Next.js App Router pattern, provide type safety, and keep database logic server-side
- Decision: Verify wallet address ownership via server action parameter (no signature verification for MVP)
  - Alternatives considered: Require wallet signature for nickname updates
  - Rationale: Simpler implementation for MVP; wallet address is already verified through wallet connection. Signature verification can be added later if security requirements change
- Decision: Use existing `useWeb3` hook for balance fetching
  - Alternatives considered: Direct viem calls, separate balance hook
  - Rationale: Consistent with existing patterns, `useWeb3` already provides `getBalance` functionality
- Decision: Create separate `app/me/actions.ts` for profile-related actions
  - Alternatives considered: Extend `components/Layout/HeaderNav/components/Wallet/actions.ts`
  - Rationale: Separation of concerns - wallet actions are for header component, profile actions are for profile page. Keeps code organized and maintainable
- Decision: Update nickname via Prisma `update` operation
  - Alternatives considered: Use `upsert` pattern
  - Rationale: User record should already exist from wallet sync; `update` is more explicit and fails if user doesn't exist (which would indicate a bug)

## Risks / Trade-offs
- Security: No signature verification for nickname updates → Mitigation: Server action verifies wallet address matches the connected wallet. For production, consider adding signature verification if impersonation is a concern
- Race condition: Multiple rapid nickname updates → Mitigation: Prisma update operations are atomic. UI can disable save button during update operation
- Performance: Balance fetch on every page load → Trade-off: Acceptable for profile page. Can add caching if needed later
- User experience: Empty nickname validation → Trade-off: Requiring non-empty nickname ensures users always have a display name. Alternative: Allow empty nickname and fallback to address display

## Migration Plan
- No migration needed - uses existing `Users` table schema
- Existing users will have their current nickname displayed
- New users connecting wallet will have default nickname (wallet address) which they can update

## Open Questions
- Should nickname updates require wallet signature verification? (Deferred to future enhancement)
- Should there be a maximum nickname length? (Proposed: 50 characters, can be adjusted)
- Should nickname changes be logged/audited? (Not required for MVP)

