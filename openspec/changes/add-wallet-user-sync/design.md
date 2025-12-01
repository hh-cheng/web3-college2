## Context
The Wallet component currently connects to Web3 wallets but does not sync user data with the database. The `Users` table exists with `wallet_address` (unique) and optional `nickname` fields. When a wallet connects, we need to ensure a user record exists and can be retrieved for display and future features.

## Goals / Non-Goals
- Goals:
  - Automatically create user record on wallet connection if it doesn't exist
  - Fetch existing user nickname when wallet connects
  - Display nickname in Wallet component UI
  - Handle errors gracefully without breaking wallet connection flow
- Non-Goals:
  - User-initiated nickname updates (future feature)
  - Avatar management (future feature)
  - User profile pages (future feature)

## Decisions
- Decision: Use server action pattern (consistent with `app/market/actions.ts`)
  - Alternatives considered: API routes, direct Prisma calls from client
  - Rationale: Server actions are the Next.js App Router pattern, provide type safety, and keep database logic server-side
- Decision: Use `upsert` pattern (find or create) in single database operation
  - Alternatives considered: Separate find then create operations
  - Rationale: Atomic operation prevents race conditions, more efficient
- Decision: Default nickname is the wallet address itself
  - Alternatives considered: Empty string, "User" + address suffix
  - Rationale: Address is always available and provides immediate identification
- Decision: Sync happens on wallet connection, not on component mount
  - Alternatives considered: Sync on every render, sync on address change
  - Rationale: Only sync when user actively connects, avoids unnecessary database calls

## Risks / Trade-offs
- Database connection failure → Mitigation: Catch errors, show toast notification, allow wallet to remain connected
- Race condition with multiple rapid connections → Mitigation: Use Prisma upsert which handles this atomically
- Performance: Additional database call on connect → Trade-off: Acceptable for better UX and data consistency

## Migration Plan
- No migration needed - uses existing `Users` table schema
- Existing users will be fetched on next wallet connection
- New users will be created automatically

## Open Questions
- Should we cache user data in client state to avoid refetching on re-renders? (Answer: Yes, use React state)
- Should sync happen synchronously or asynchronously? (Answer: Asynchronously to not block UI)

