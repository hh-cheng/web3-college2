## 1. Implementation

### 1.1 R2 Upload Function Enhancement
- [x] Modify `uploadFile` function in `lib/r2.ts` to return the generated key along with success status
- [x] Update return type to include `key: string` when successful
- [x] Ensure error handling preserves existing behavior

### 1.2 Server Actions
- [x] Create `app/my-courses/upload/actions.ts` with `uploadCourse` server action
- [x] Implement upload workflow:
  - [x] Validate required fields (title, price, cover image, video)
  - [x] Upload cover image to R2 and capture key
  - [x] Upload video to R2 and capture key
  - [x] Get wallet address and chain ID from request context
  - [x] Generate unique `course_onchain_id` (format: timestamp-based or UUID)
  - [x] Write course record to PostgreSQL via Prisma
  - [x] Return success/error result with appropriate messages

### 1.3 Upload Page UI
- [x] Create upload form component in `app/my-courses/upload/page.tsx`
- [x] Add form fields:
  - [x] Course title (text input, required)
  - [x] Course price (text/number input, required)
  - [x] Cover image (file input, accept images, required)
  - [x] Video file (file input, accept video, required)
- [x] Add form validation (client-side)
- [x] Add submit button with loading state
- [x] Integrate with wallet connection (check if connected, show message if not)
- [x] Display preview of selected cover image
- [x] Show upload progress/loading indicators

### 1.4 Form Submission Handling
- [x] Implement form submission handler
- [x] Call `uploadCourse` server action with form data
- [x] Handle success: show success toast and refresh page
- [x] Handle errors: show error toast with message
- [x] Reset form after successful upload

### 1.5 Error Handling
- [x] Handle R2 upload failures gracefully
- [x] Handle database write failures gracefully
- [x] Provide user-friendly error messages
- [x] Ensure partial uploads don't leave orphaned R2 objects (consider cleanup on failure)

## 2. Validation

- [ ] Test upload flow with valid data
- [ ] Test validation with missing required fields
- [ ] Test error handling with invalid file types
- [ ] Test error handling with R2 upload failure
- [ ] Test error handling with database write failure
- [ ] Verify course appears in database after successful upload
- [ ] Verify files are accessible in R2 after upload
- [ ] Test with wallet connected and disconnected states

