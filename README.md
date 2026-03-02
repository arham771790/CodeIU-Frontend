# CodeIU Frontend

A modern, high-performance competitive programming platform built with Next.js.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **State Management**: Zustand
- **Styling**: Vanilla CSS (with custom tokens/variables)
- **Icons**: Lucide React
- **Charts**: Recharts (for profile stats & heatmap)
- **Notifications**: React Toastify
- **Editor**: Custom Code Editor with multi-language support

## Project Structure

- `src/app`: App Router pages and layouts.
  - `(pages)`: Main platform views (Home, Explore, Contest, Profile, Admin).
  - `(auth)`: Login and Signup flows.
- `src/components`: UI components organized by complexity (Atoms, Molecules, Organisms).
- `src/store`: Zustand stores for global state.
- `src/hooks`: Custom React hooks for API interaction and lifecycle.
- `src/utils`: Helper functions and axios instances.

## Global State (Zustand)

The application uses specialized stores for decoupled state management:
- `useAuthStore`: Handles user identity, login/logout, and token persistence.
- `useProblemStore`: Manages problem lists, details, and boilerplate loading.
- `useContestStore`: Controls contest metadata and lifecycle.
- `useSubmissionStore`: Real-time submission results and history.
- `useAdminStore`: Administrative tools for user and content management.

## Environment Variables

Create a `.env.local` for development:

```env
NEXT_PUBLIC_API_URL=http://localhost:8020/auth/api/v1  # Placeholder or direct service
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080           # Submission Service for real-time
```

*Note: In production, requests are typically proxied via `next.config.mjs` or a central Load Balancer.*

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000).

## Design System

CodeIU uses a custom design system focused on:
- **Glassmorphism**: Subtle translucent backgrounds for a premium feel.
- **Vibrant Palettes**: Modern color schemes for difficulty levels and status indicators.
- **Responsiveness**: Fully adaptive layouts for all device types.
