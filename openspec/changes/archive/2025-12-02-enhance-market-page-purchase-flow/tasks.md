## 1. Ownership Detection
- [x] 1.1 Create server action `checkCourseOwnership` that checks if user owns a course (creator or buyer)
- [x] 1.2 Update `getCourses` action to include ownership status for each course
- [x] 1.3 Update market service hook to pass user address for ownership checking
- [x] 1.4 Test ownership detection for both creator and buyer scenarios

## 2. Contract Integration Setup
- [x] 2.1 Add CourseManager contract ABI file (or verify existing)
- [x] 2.2 Add contract address configuration (environment variables)
- [x] 2.3 Create contract interaction utilities/hooks for approve and purchase
- [x] 2.4 Test contract address configuration loading

## 3. Approve Flow
- [x] 3.1 Create `approveToken` action that calls YDToken.approve()
- [x] 3.2 Add approve button UI component with loading/error states
- [x] 3.3 Integrate approve action with market page
- [x] 3.4 Handle approve transaction success/failure feedback
- [x] 3.5 Test approve flow with test wallet

## 4. Purchase Flow
- [x] 4.1 Create `purchaseCourse` action that calls CourseManager.purchase()
- [x] 4.2 Add purchase button UI component with loading/error states
- [x] 4.3 Check token allowance before showing purchase button
- [x] 4.4 Integrate purchase action with market page
- [x] 4.5 Handle purchase transaction success/failure feedback
- [x] 4.6 Update course list after successful purchase (refetch or optimistic update)
- [x] 4.7 Test purchase flow end-to-end

## 5. Conditional Button Rendering
- [x] 5.1 Update market page to show "View" button for owned courses
- [x] 5.2 Update market page to show "Approve" and "Buy" buttons for unowned courses
- [x] 5.3 Handle button states (disabled when transaction pending, etc.)
- [x] 5.4 Test button visibility for different ownership scenarios

## 6. Video Viewing Route
- [x] 6.1 Create `/learn/[courseId]` route/page
- [x] 6.2 Add ownership verification before allowing video access
- [x] 6.3 Integrate video player component (reuse from uploaded courses page)
- [x] 6.4 Add navigation from market page "View" button to video page
- [x] 6.5 Test video access for owned courses
- [x] 6.6 Test access denial for unowned courses

## 7. Error Handling & UX
- [x] 7.1 Add error messages for failed transactions
- [x] 7.2 Add loading states during transactions
- [x] 7.3 Add success notifications after purchase
- [x] 7.4 Handle wallet disconnection during transaction
- [x] 7.5 Test error scenarios (insufficient balance, rejected transaction, etc.)

## 8. Testing & Validation
- [x] 8.1 Test complete purchase flow (approve → buy → view)
- [x] 8.2 Test ownership detection accuracy
- [x] 8.3 Test video access permissions
- [x] 8.4 Test error handling and edge cases
- [x] 8.5 Verify UI states and button visibility

