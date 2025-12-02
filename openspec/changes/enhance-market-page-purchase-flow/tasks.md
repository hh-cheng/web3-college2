## 1. Ownership Detection
- [ ] 1.1 Create server action `checkCourseOwnership` that checks if user owns a course (creator or buyer)
- [ ] 1.2 Update `getCourses` action to include ownership status for each course
- [ ] 1.3 Update market service hook to pass user address for ownership checking
- [ ] 1.4 Test ownership detection for both creator and buyer scenarios

## 2. Contract Integration Setup
- [ ] 2.1 Add CourseManager contract ABI file (or verify existing)
- [ ] 2.2 Add contract address configuration (environment variables)
- [ ] 2.3 Create contract interaction utilities/hooks for approve and purchase
- [ ] 2.4 Test contract address configuration loading

## 3. Approve Flow
- [ ] 3.1 Create `approveToken` action that calls YDToken.approve()
- [ ] 3.2 Add approve button UI component with loading/error states
- [ ] 3.3 Integrate approve action with market page
- [ ] 3.4 Handle approve transaction success/failure feedback
- [ ] 3.5 Test approve flow with test wallet

## 4. Purchase Flow
- [ ] 4.1 Create `purchaseCourse` action that calls CourseManager.purchase()
- [ ] 4.2 Add purchase button UI component with loading/error states
- [ ] 4.3 Check token allowance before showing purchase button
- [ ] 4.4 Integrate purchase action with market page
- [ ] 4.5 Handle purchase transaction success/failure feedback
- [ ] 4.6 Update course list after successful purchase (refetch or optimistic update)
- [ ] 4.7 Test purchase flow end-to-end

## 5. Conditional Button Rendering
- [ ] 5.1 Update market page to show "View" button for owned courses
- [ ] 5.2 Update market page to show "Approve" and "Buy" buttons for unowned courses
- [ ] 5.3 Handle button states (disabled when transaction pending, etc.)
- [ ] 5.4 Test button visibility for different ownership scenarios

## 6. Video Viewing Route
- [ ] 6.1 Create `/learn/[courseId]` route/page
- [ ] 6.2 Add ownership verification before allowing video access
- [ ] 6.3 Integrate video player component (reuse from uploaded courses page)
- [ ] 6.4 Add navigation from market page "View" button to video page
- [ ] 6.5 Test video access for owned courses
- [ ] 6.6 Test access denial for unowned courses

## 7. Error Handling & UX
- [ ] 7.1 Add error messages for failed transactions
- [ ] 7.2 Add loading states during transactions
- [ ] 7.3 Add success notifications after purchase
- [ ] 7.4 Handle wallet disconnection during transaction
- [ ] 7.5 Test error scenarios (insufficient balance, rejected transaction, etc.)

## 8. Testing & Validation
- [ ] 8.1 Test complete purchase flow (approve → buy → view)
- [ ] 8.2 Test ownership detection accuracy
- [ ] 8.3 Test video access permissions
- [ ] 8.4 Test error handling and edge cases
- [ ] 8.5 Verify UI states and button visibility

