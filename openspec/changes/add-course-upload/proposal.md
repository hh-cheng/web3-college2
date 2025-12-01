# Change: Add Course Upload Functionality

## Why
The course upload page (`/my-courses/upload`) currently only displays a placeholder. Users need the ability to upload courses with cover images and video content, which requires:
- File upload to Cloudflare R2 storage
- Course metadata persistence in PostgreSQL database
- User feedback and page refresh after successful upload

## What Changes
- **ADDED**: Course upload form UI with file inputs for cover image and video
- **ADDED**: Server action to handle course upload workflow (R2 upload → DB write)
- **MODIFIED**: R2 upload function to return the generated key for database storage
- **ADDED**: Form validation for required fields (title, price, cover image, video)
- **ADDED**: Error handling and user feedback (success/error toasts)
- **ADDED**: Page refresh after successful upload

## Impact
- **Affected specs**: 
  - `course-upload` (new capability)
  - `my-courses` (extends existing layout with functional upload page)
- **Affected code**:
  - `app/my-courses/upload/page.tsx` - Main upload page component
  - `app/my-courses/upload/actions.ts` - Server actions for upload workflow
  - `lib/r2.ts` - Modified to return upload key
  - `lib/prisma.ts` - Used for database operations (no changes needed)

