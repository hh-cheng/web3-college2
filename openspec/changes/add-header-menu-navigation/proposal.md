# Change: Add Header Menu Navigation

## Why
The HeaderMenu component is currently empty and needs to be implemented to provide navigation between key pages (market, me, my-courses). The project already has a PillNav component that provides an animated pill-style navigation UI, but it currently uses react-router-dom which is incompatible with Next.js routing. We need to implement HeaderMenu using PillNav adapted for Next.js.

## What Changes
- Implement HeaderMenu component using PillNav with Next.js Link integration
- Adapt PillNav to support Next.js Link component (or create a Next.js-compatible wrapper)
- Add navigation items for market, me, and my-courses pages
- Integrate HeaderMenu into HeaderNav component
- Add active route highlighting based on current pathname
- Ensure responsive mobile menu functionality works correctly

## Impact
- Affected specs: New capability `header-navigation`
- Affected code:
  - `components/Layout/HeaderNav/components/HeaderMenu/index.tsx` - Implementation
  - `components/Layout/HeaderNav/index.tsx` - Integration (uncomment HeaderMenu)
  - `components/ui/PillNav.tsx` - May need adaptation for Next.js Link support

