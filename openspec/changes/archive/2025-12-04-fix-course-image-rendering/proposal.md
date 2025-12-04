# Change: Fix Course Image Rendering Issue

## Why
Uploaded course cover images are failing to render with 404 errors. The issue occurs when Next.js Image Optimization encodes the URL parameter, resulting in double-encoded keys that the API route handler cannot properly decode. This prevents users from seeing course cover images across the application (marketplace, my courses pages, course detail pages).

## What Changes
- **MODIFIED**: Improve URL decoding logic in `/api/course-image/[key]/route.ts` to robustly handle multiple levels of URL encoding
- **MODIFIED**: Enhance error handling and logging to aid debugging of image serving issues
- **MODIFIED**: Strengthen key validation to work correctly after decoding operations
- **ADDED**: Add comprehensive URL decoding that handles edge cases with special characters and multiple encoding levels

## Impact
- **Affected specs**: New capability `course-image-serving` (to be added)
- **Affected code**: 
  - `app/api/course-image/[key]/route.ts` - Main route handler for image serving
  - Potentially affects all pages displaying course images: `app/market/page.tsx`, `app/my-courses/uploaded/page.tsx`, `app/my-courses/bought/page.tsx`, `app/learn/[courseId]/page.tsx`
- **User-facing**: Course cover images will render correctly across all pages
- **Breaking changes**: None - this is a bug fix that restores intended behavior

