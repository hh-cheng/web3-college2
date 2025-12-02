# Design: Market Page Purchase Flow Enhancement

## Context
The market page needs to support course purchases and ownership-based access. Users can own courses in two ways:
1. As creators (uploaded courses)
2. As buyers (purchased courses)

The purchase flow requires a two-step process:
1. Approve YD Token spending for CourseManager contract
2. Call CourseManager.purchase() to complete the purchase

## Goals / Non-Goals

### Goals
- Enable users to purchase courses from the market page
- Show appropriate UI based on course ownership
- Provide seamless video access for owned courses
- Handle transaction states (pending, success, error) with user feedback

### Non-Goals
- Course detail page (separate concern)
- Batch purchases (single course purchase only)
- Partial approvals (approve exact course price)
- Course refunds or transfers

## Decisions

### Decision: Ownership Checking Strategy
**What**: Check ownership via database queries (Purchases table + Courses creator_address) rather than on-chain calls.

**Why**: 
- Faster response times (no RPC calls)
- Database is source of truth for purchases
- On-chain checks can be expensive and slow
- Database already tracks purchases and creators

**Alternatives considered**:
- On-chain `hasPurchased` mapping check: Rejected due to performance and cost
- Hybrid approach: Rejected as unnecessary complexity

### Decision: Approve Amount Strategy
**What**: Approve the exact course price amount (not infinite approval).

**Why**:
- Better security (principle of least privilege)
- Users maintain control over token spending
- Aligns with best practices for token approvals

**Alternatives considered**:
- Infinite approval: Rejected due to security concerns
- Batch approval for multiple courses: Out of scope

### Decision: Transaction State Management
**What**: Use React Query mutations with optimistic updates and error handling.

**Why**:
- Consistent with existing data fetching patterns (`useMarket` uses React Query)
- Built-in loading/error states
- Easy to integrate with wallet transaction hooks

**Alternatives considered**:
- Custom state management: Rejected as unnecessary
- Zustand store: Rejected as React Query provides sufficient state management

### Decision: Video Viewing Route
**What**: Create a general `/learn/[courseId]` route that checks ownership before allowing access.

**Why**:
- Reusable for both market page and other entry points
- Centralized access control logic
- Matches existing route structure (`/my-courses/uploaded/[courseId]`)

**Alternatives considered**:
- Reuse `/my-courses/uploaded/[courseId]`: Rejected as it's specific to uploaded courses
- Inline video player: Rejected as it doesn't match existing patterns

### Decision: Contract Address Configuration
**What**: Store contract addresses in environment variables or a config file.

**Why**:
- Different addresses for different chains/environments
- Easy to update without code changes
- Standard practice for Web3 applications

**Implementation**: Add `NEXT_PUBLIC_COURSE_MANAGER_ADDRESS` and `NEXT_PUBLIC_YD_TOKEN_ADDRESS` environment variables.

## Risks / Trade-offs

### Risk: Purchase Transaction Fails After Approval
**Mitigation**: 
- Show clear error messages
- Allow users to retry purchase without re-approval (if allowance sufficient)
- Consider showing allowance status in UI

### Risk: Database Out of Sync with On-Chain State
**Mitigation**:
- Purchase action should verify on-chain state before updating database
- Consider event listening for purchase events (future enhancement)
- Provide manual refresh option

### Risk: Gas Costs for Approve + Purchase
**Mitigation**:
- Show estimated gas costs before transactions
- Consider batch operations in future (out of scope)
- Clear messaging about transaction costs

### Trade-off: Approve Exact Amount vs Infinite
**Chosen**: Exact amount for security, accepting that users need to approve for each purchase.

## Migration Plan
- No database migrations required (existing schema supports purchases)
- No breaking changes to existing market page (additive changes only)
- Contract addresses need to be configured in environment variables

## Open Questions
- Should we show allowance status in the UI before purchase?
- Do we need to handle cases where course price changes between approval and purchase?
- Should we add a "View Details" button that navigates to a course detail page?

