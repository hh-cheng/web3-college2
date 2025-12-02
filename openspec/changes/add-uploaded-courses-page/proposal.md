# Change: Add Uploaded Courses Page

## Why
Users who upload courses need a way to view and manage their uploaded courses. Currently, there's an empty `/my-courses/uploaded` page, but no functionality to display courses created by the logged-in user. This page will complement the existing "Bought" and "Upload" tabs in the my-courses section.

## What Changes
- Add "Uploaded" tab to the my-courses TabMenu navigation
- Create server action to fetch courses by creator address
- Create service/hook for fetching uploaded courses
- Implement UploadedPage component to display user's uploaded courses in a grid layout
- Handle R2 image URL generation for course cover images
- Update my-courses layout to support three tabs (Bought, Upload, Uploaded)

## Impact
- Affected specs: `my-courses` (MODIFIED - add uploaded courses viewing capability)
- Affected code:
  - `app/my-courses/components/TabMenu.tsx` - Add Uploaded tab
  - `app/my-courses/uploaded/page.tsx` - Implement page component
  - `app/my-courses/uploaded/actions.ts` - New server action for fetching courses
  - `app/my-courses/uploaded/service.ts` - New service hook
  - `lib/r2.ts` - May need URL generation helper (or API route for image serving)

