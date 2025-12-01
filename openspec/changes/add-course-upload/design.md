# Design: Course Upload Implementation

## Context
The course upload page needs to allow users to upload course content (cover image and video) to Cloudflare R2 and store course metadata in PostgreSQL. The current `uploadFile` function in `lib/r2.ts` generates a key but doesn't return it, which is needed for database storage.

## Goals / Non-Goals

### Goals
- Enable course creators to upload courses via web UI
- Store course files (cover image, video) in Cloudflare R2
- Persist course metadata in PostgreSQL database
- Provide clear user feedback during upload process
- Handle errors gracefully with user-friendly messages

### Non-Goals
- On-chain course creation (smart contract interaction) - this is a separate concern
- Course editing/updating after upload
- Batch upload functionality
- File size validation (handled by R2 limits)
- Video transcoding or processing

## Decisions

### Decision: Modify R2 upload function to return key
**What**: Update `uploadFile` in `lib/r2.ts` to return the generated R2 key in the success response.

**Why**: The database schema requires storing the `key` and `cover_key` fields. Currently, the upload function generates these keys but doesn't expose them, making it impossible to store them in the database.

**Alternatives considered**:
1. Generate keys client-side and pass to upload function - **Rejected**: Less secure, could lead to collisions
2. Query R2 after upload to get the key - **Rejected**: Inefficient and error-prone
3. Return key from upload function - **Chosen**: Clean, efficient, maintains single source of truth

### Decision: Use server actions for upload workflow
**What**: Implement course upload as a Next.js server action that orchestrates R2 uploads and database writes.

**Why**: Server actions provide a clean API for form submissions, handle file uploads securely, and can access server-side resources (R2 client, Prisma client) without exposing credentials.

**Alternatives considered**:
1. API routes - **Rejected**: More boilerplate, server actions are preferred in Next.js App Router
2. Client-side upload with direct R2 access - **Rejected**: Would expose R2 credentials to client

### Decision: Generate course_onchain_id server-side
**What**: Generate unique `course_onchain_id` on the server using timestamp + random component or UUID.

**Why**: Ensures uniqueness and prevents collisions. The `course_onchain_id` is used as a unique identifier and will be referenced when creating on-chain course records later.

**Format**: Consider using `course-${Date.now()}-${randomString}` or UUID v4.

### Decision: Get wallet address from request context
**What**: Extract wallet address from the authenticated user session or request headers.

**Why**: The `creator_address` field in the Courses table needs the wallet address of the uploader. Since this is a server action, we need to pass the wallet address from the client.

**Implementation**: Pass wallet address as a parameter to the server action from the client component (using `useWeb3` hook to get current address).

### Decision: Page refresh after successful upload
**What**: Use `router.refresh()` or `window.location.reload()` after successful upload.

**Why**: Ensures the page state is updated and any cached data is refreshed. Simple and effective for this use case.

**Alternatives considered**:
1. Optimistic updates - **Rejected**: Overkill for this simple case, refresh is sufficient
2. Manual state updates - **Rejected**: More complex, refresh is simpler

## Risks / Trade-offs

### Risk: Partial uploads leave orphaned R2 objects
**Mitigation**: Consider implementing cleanup logic if database write fails after R2 upload succeeds. For MVP, accept this risk as cleanup can be handled manually or via scheduled job later.

### Risk: Large file uploads timeout
**Mitigation**: R2 handles large files well, but consider adding progress indicators and file size warnings. For MVP, rely on R2's built-in handling.

### Risk: Concurrent uploads with same filename
**Mitigation**: The current key generation includes timestamp, which minimizes collision risk. UUID-based keys would be safer but current approach is acceptable.

### Trade-off: No file validation on server
**Current**: Rely on client-side validation and R2's content type handling.
**Future**: Add server-side file type and size validation for better security.

## Migration Plan

### No migration needed
This is a new feature, not a modification of existing data. No migration required.

## Open Questions

1. **File size limits**: Should we enforce maximum file sizes? (Defer to future)
2. **Video format requirements**: Should we restrict to specific video formats? (Defer to future)
3. **Cover image dimensions**: Should we enforce aspect ratio or dimensions? (Defer to future)
4. **On-chain course creation**: When should courses be created on-chain? (Separate feature)
5. **Course editing**: How will users edit uploaded courses? (Separate feature)

