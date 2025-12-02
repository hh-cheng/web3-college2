## 1. Backend Implementation
- [x] 1.1 Create `app/my-courses/uploaded/actions.ts` with `getUploadedCourses` server action
- [x] 1.2 Implement database query to fetch courses filtered by `creator_address` and `chain_id`
- [x] 1.3 Return course data including id, title, price, cover_key, created_at, course_onchain_id
- [x] 1.4 Handle error cases and return appropriate response format

## 2. Frontend Service Layer
- [x] 2.1 Create `app/my-courses/uploaded/service.ts` hook using React Query
- [x] 2.2 Integrate with `useWeb3` hook to get wallet address and chain ID
- [x] 2.3 Handle loading and error states

## 3. UI Components
- [x] 3.1 Update `app/my-courses/components/TabMenu.tsx` to include "Uploaded" tab
- [x] 3.2 Update tab routing logic to handle `/my-courses/uploaded` route
- [x] 3.3 Implement `app/my-courses/uploaded/page.tsx` component
- [x] 3.4 Display courses in grid layout (decide on MagicBento vs simple grid)
- [x] 3.5 Show course cover images (handle R2 URL generation)
- [x] 3.6 Display course title, price, and creation date
- [x] 3.7 Handle empty state when user has no uploaded courses
- [x] 3.8 Handle wallet connection requirement

## 4. Image URL Handling
- [x] 4.1 Determine approach for R2 image URLs (API route vs direct URL vs helper function)
- [x] 4.2 Implement image URL generation/serving mechanism
- [x] 4.3 Update course display to use cover images

## 5. Validation & Testing
- [x] 5.1 Test page with connected wallet showing uploaded courses
- [x] 5.2 Test page with no uploaded courses (empty state)
- [x] 5.3 Test page with disconnected wallet
- [x] 5.4 Verify tab navigation works correctly
- [x] 5.5 Verify courses are filtered correctly by creator address and chain ID

