# Dashboard Layout Refactor

## Goal
Make `src/app/(dashboard)/layout.tsx` thinner (less code) and SEO-friendly by converting it to a server component.

## Changes

### 1. New file: `src/components/(dashboard)/DashboardLayoutClient.tsx`
Client component extracted from the layout. Houses all interactive logic:
- `'use client'` directive
- Mobile sidebar toggle (`useState`)
- `storeUser` mutation (`useMutation` + `useEffect`)
- Zustand `useAnalysisStore` reads
- Renders `<Sidebar>`, `<AnalysisLoadingOverlay>`, `<ErrorToast>`, mobile header, and `{children}`

### 2. Modified file: `src/app/(dashboard)/layout.tsx`
Converted to a server component:
- Remove `'use client'`, `useState`, `useEffect`, `useMutation`, `Menu`, `useAnalysisStore`, `Sidebar`, `AnalysisLoadingOverlay`, `ErrorToast`
- Export `metadata` for SEO (`title: 'Dashboard | ApplyAI'`)
- Render structural `<main>` + `<DashboardLayoutClient>{children}</DashboardLayoutClient>`

## Result
- `layout.tsx` shrinks from ~47 lines to ~15 lines
- Dashboard shell is SSR-friendly with SEO metadata
- Follows existing `XxxClient.tsx` pattern used by `ApplicationBoardClient`, `ResumeTemplatesClient`
