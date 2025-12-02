# Change: Enhance Market Page with Purchase Flow

## Why
The market page currently displays all courses but lacks the ability for users to purchase courses or view courses they own. Users need to:
1. See which courses they own (either as creator or buyer)
2. Purchase courses they don't own through an approve + buy flow
3. Access course videos directly from the market page for owned courses

This enhancement completes the core marketplace functionality by enabling the purchase workflow and ownership-based access control.

## What Changes
- **ADDED**: Course ownership detection (creator or buyer) in market page data fetching
- **ADDED**: Conditional button rendering based on ownership status
- **ADDED**: Approve YD Token transaction flow for unowned courses
- **ADDED**: Purchase course transaction flow via CourseManager contract
- **ADDED**: Direct video viewing for owned courses
- **MODIFIED**: Market page UI to show appropriate action buttons (View/Approve+Buy)
- **ADDED**: Transaction status handling and user feedback during approve/buy operations

## Impact
- Affected specs: `market` (new capability)
- Affected code:
  - `app/market/page.tsx` - UI updates for buttons and ownership states
  - `app/market/service.ts` - Add ownership checking logic
  - `app/market/actions.ts` - Add ownership query, approve, and purchase actions
  - New: Course video viewing route/page for general access (not just uploaded courses)
- Dependencies:
  - YDToken contract ABI (`app/abi/YDToken.json`)
  - CourseManager contract (needs ABI/address configuration)
  - Database queries for purchase and creator checking

