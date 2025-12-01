# Change: Add My Courses Layout with Tab Navigation

## Why
The my-courses page needs a proper layout with tab-based navigation between "Bought" and "Upload" sections. Currently, the layout is minimal and there's no navigation mechanism. Users visiting "/my-courses" should be redirected to "/my-courses/bought" as the default view, and the layout should provide tab switching between the two routes.

## What Changes
- Implement redirect from "/my-courses" to "/my-courses/bought" using Next.js App Router redirect
- Add tab navigation component in the layout using the existing Tabs component from `components/ui/tabs.tsx`
- Integrate tabs with Next.js routing to switch between "/my-courses/bought" and "/my-courses/upload"
- Ensure active tab state reflects current route
- Update layout to include tab navigation UI

## Impact
- Affected specs: New capability `my-courses`
- Affected code:
  - `app/my-courses/layout.tsx` - Add tabs and redirect logic
  - `app/my-courses/page.tsx` - Create redirect page (if needed) or handle redirect in layout
  - `app/my-courses/bought/page.tsx` - Existing page (no changes needed)
  - `app/my-courses/upload/page.tsx` - Existing page (no changes needed)

