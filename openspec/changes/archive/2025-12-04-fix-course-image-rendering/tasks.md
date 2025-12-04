## 1. Implementation
- [x] 1.1 Improve URL decoding logic in course-image route handler
  - [x] Replace current single/double decode logic with robust iterative decoding
  - [x] Handle edge cases with special characters (e.g., Chinese characters, spaces, symbols)
  - [x] Add comprehensive error handling for malformed URLs
- [x] 1.2 Enhance logging and error messages
  - [x] Add detailed logging for decoding steps
  - [x] Include original key and decoded key in error messages
  - [x] Log R2 fetch failures with context
- [x] 1.3 Strengthen key validation
  - [x] Ensure validation works correctly after decoding
  - [x] Add validation for key format and structure
  - [x] Handle empty or null keys gracefully
- [x] 1.4 Test image rendering across all pages
  - [x] Verify images render on marketplace page
  - [x] Verify images render on uploaded courses page
  - [x] Verify images render on bought courses page
  - [x] Verify images render on course detail/learn page
  - [x] Test with various filename formats (special characters, spaces, etc.)

## 2. Validation
- [x] 2.1 Manual testing
  - [x] Upload a course with cover image containing special characters
  - [x] Verify image displays correctly on all pages
  - [x] Test with images containing Chinese characters, spaces, and symbols
  - [x] Verify error handling when image doesn't exist in R2
- [x] 2.2 Edge case testing
  - [x] Test with double-encoded URLs
  - [x] Test with triple-encoded URLs (if possible)
  - [x] Test with malformed keys
  - [x] Test with empty or null cover_key values

