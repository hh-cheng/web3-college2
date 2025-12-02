# Change: Add Bought Courses Page

## Why
Users need to view courses they have purchased. Currently, the "/my-courses/bought" route exists but only displays a placeholder. This change implements the full functionality to display purchased courses with course details, similar to the existing uploaded courses page.

## What Changes
- Add server action `getBoughtCourses` to fetch purchased courses for a user
- Add service hook `useBoughtCourses` for data fetching with React Query
- Implement the bought courses page component with course cards display
- Add requirements to the my-courses specification for bought courses functionality

## Impact
- Affected specs: `my-courses` (ADDED requirements)
- Affected code:
  - `app/my-courses/bought/page.tsx` - Replace placeholder with full implementation
  - `app/my-courses/bought/actions.ts` - New server action file
  - `app/my-courses/bought/service.ts` - New service hook file

