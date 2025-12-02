# Design: Uploaded Courses Page

## Context
Users need to view courses they have uploaded. The `/my-courses/uploaded` route exists but is empty. The my-courses section currently has "Bought" and "Upload" tabs, and we need to add an "Uploaded" tab to complete the navigation.

## Goals / Non-Goals

### Goals
- Display courses uploaded by the logged-in user (filtered by `creator_address`)
- Provide visual grid layout for course cards
- Show course metadata: title, price, cover image, creation date
- Integrate seamlessly with existing my-courses tab navigation
- Handle wallet connection requirements

### Non-Goals
- Course editing or deletion (separate feature)
- Course statistics or analytics (separate feature)
- Bulk operations on courses
- Course preview or detailed view (handled by market/course detail pages)

## Decisions

### Decision: UI Component Choice - MagicBento vs Simple Grid
**What**: Choose between using MagicBento component or a simple card grid for displaying courses.

**Analysis**:
- **MagicBento**: Highly animated, visually impressive card grid with particles, spotlight effects, and tilt animations. However, it's designed for fixed, predefined card data and would require significant adaptation for dynamic course data.
- **Simple Grid**: Similar to market page (`app/market/page.tsx`), uses standard Tailwind grid with hover effects. Simpler, more maintainable, and already proven in the codebase.

**Recommendation**: Start with a simple grid layout (similar to market page) for consistency and simplicity. MagicBento can be considered later if visual enhancement is specifically requested, but it would require:
- Adapting MagicBento to accept dynamic course data as props
- Mapping course properties to MagicBento card props
- Handling loading/empty states within MagicBento structure

**Chosen**: Simple grid layout for initial implementation.

**Alternatives considered**:
1. Use MagicBento with adaptations - **Deferred**: More complex, can be added later if needed
2. Simple grid - **Chosen**: Consistent with existing patterns, easier to maintain

### Decision: R2 Image URL Generation
**What**: How to serve/generate URLs for course cover images stored in R2.

**Options**:
1. **API Route**: Create `/api/course-image/[key]` route that proxies R2 images
   - Pros: Secure, can add authentication/rate limiting
   - Cons: Additional server load, more complex
2. **Direct R2 Public URL**: If R2 bucket is configured for public access
   - Pros: Simple, no server overhead
   - Cons: Requires public bucket configuration, less control
3. **Presigned URLs**: Generate time-limited presigned URLs server-side
   - Pros: Secure, time-limited access
   - Cons: More complex, requires URL generation logic

**Chosen**: API route approach (`/api/course-image/[key]`) for initial implementation, as it provides security and control. Can be optimized later if needed.

**Alternatives considered**:
- Direct public URLs - **Rejected**: Security concerns, less control
- Presigned URLs - **Deferred**: More complex, can be added if needed

### Decision: Tab Navigation Update
**What**: Add "Uploaded" tab to existing TabMenu component.

**Implementation**: 
- Update `TabMenu.tsx` to include third tab "Uploaded"
- Update routing logic to handle `/my-courses/uploaded`
- Ensure active tab highlighting works correctly

**Chosen**: Extend existing TabMenu component.

## Risks / Trade-offs

- **R2 Image Serving**: If R2 bucket is not configured for public access, API route is necessary. This adds server load but provides better security.
- **MagicBento Complexity**: If user specifically wants MagicBento, it will require significant adaptation work. Starting with simple grid allows for easier iteration.
- **Performance**: Fetching courses on every page load. Consider caching if needed, but React Query already provides caching.

## Migration Plan

No migration needed - this is a new feature addition.

## Open Questions

1. Should we show course statistics (views, purchases) on uploaded courses? → **Deferred**: Not in scope
2. Should users be able to edit/delete courses from this page? → **Deferred**: Separate feature
3. How should we handle courses uploaded on different chains? → **Current**: Filter by chain_id from connected wallet

