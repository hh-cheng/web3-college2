## 1. Implementation

### 1.1 R2 Upload Function Enhancement
- [ ] Modify `uploadFile` function in `lib/r2.ts` to return the generated key along with success status
- [ ] Update return type to include `key: string` when successful
- [ ] Ensure error handling preserves existing behavior

### 1.2 Server Actions
- [ ] Create `app/my-courses/upload/actions.ts` with `uploadCourse` server action
- [ ] Implement upload workflow:
  - [ ] Validate required fields (title, price, cover image, video)
  - [ ] Upload cover image to R2 and capture key
  - [ ] Upload video to R2 and capture key
  - [ ] Get wallet address and chain ID from request context
  - [ ] Generate unique `course_onchain_id` (format: timestamp-based or UUID)
  - [ ] Write course record to PostgreSQL via Prisma
  - [ ] Return success/error result with appropriate messages

### 1.3 Upload Page UI
- [ ] Create upload form component in `app/my-courses/upload/page.tsx`
- [ ] Add form fields:
  - [ ] Course title (text input, required)
  - [ ] Course price (text/number input, required)
  - [ ] Cover image (file input, accept images, required)
  - [ ] Video file (file input, accept video, required)
- [ ] Add form validation (client-side)
- [ ] Add submit button with loading state
- [ ] Integrate with wallet connection (check if connected, show message if not)
- [ ] Display preview of selected cover image
- [ ] Show upload progress/loading indicators

### 1.4 Form Submission Handling
- [ ] Implement form submission handler
- [ ] Call `uploadCourse` server action with form data
- [ ] Handle success: show success toast and refresh page
- [ ] Handle errors: show error toast with message
- [ ] Reset form after successful upload

### 1.5 Error Handling
- [ ] Handle R2 upload failures gracefully
- [ ] Handle database write failures gracefully
- [ ] Provide user-friendly error messages
- [ ] Ensure partial uploads don't leave orphaned R2 objects (consider cleanup on failure)

## 2. Validation

- [ ] Test upload flow with valid data
- [ ] Test validation with missing required fields
- [ ] Test error handling with invalid file types
- [ ] Test error handling with R2 upload failure
- [ ] Test error handling with database write failure
- [ ] Verify course appears in database after successful upload
- [ ] Verify files are accessible in R2 after upload
- [ ] Test with wallet connected and disconnected states

