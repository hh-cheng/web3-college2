## 1. Implementation
- [ ] 1.1 Create server action `getBoughtCourses` in `app/my-courses/bought/actions.ts`
  - Query Purchases table filtered by `buyer_address` and `chain_id`
  - Join with Courses table to get course details (title, price, cover_key, etc.)
  - Return formatted course data with purchase information
  - Handle errors and return appropriate response format
- [ ] 1.2 Create service hook `useBoughtCourses` in `app/my-courses/bought/service.ts`
  - Use React Query for data fetching
  - Integrate with `useWeb3` hook for wallet address and chain ID
  - Return data, loading, error states
- [ ] 1.3 Implement bought courses page component in `app/my-courses/bought/page.tsx`
  - Display wallet connection prompt when wallet not connected
  - Show loading state with skeleton cards
  - Display error state with retry option
  - Render course cards in grid layout (similar to uploaded page)
  - Show empty state when no purchased courses
  - Include course cover image, title, price, purchase date
  - Add navigation to course detail page (if applicable)

## 2. Validation
- [ ] 2.1 Test with connected wallet and purchased courses
- [ ] 2.2 Test with connected wallet and no purchased courses
- [ ] 2.3 Test with disconnected wallet
- [ ] 2.4 Test error handling (database errors, network errors)
- [ ] 2.5 Verify course cards display correctly with images
- [ ] 2.6 Verify navigation works correctly

