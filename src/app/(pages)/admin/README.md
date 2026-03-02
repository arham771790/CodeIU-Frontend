# Admin Panel Architecture

This directory contains the Admin Panel's main routing and specialized views. To maintain consistency and scalability, we follow an **Atomic Design** structure.

## Structure

The Admin page acts as a container that switches between different **Organisms**:

-   **AdminDashboardView**: Overview stats and analytics charts.
-   **AdminUsersView**: User management CRUD interface.
-   **AdminProblemsView**: Problem bank management.
-   **AdminContestView**: Contest scheduling and moderation.

All reusable admin components are located in `src/components/`:
-   `atoms/SidebarLink.jsx`: Navigation items.
-   `organisms/AdminCrudView.jsx`: The standardized table layout used across management views.

## Data Source

The Admin panel is connected to the following services via `axiosInstance`:
-   **Auth Service**: `/admin/getallusers`, `/admin/updateuser`, `/admin/deleteuser`.
-   **Problem Service**: `/problems`.
-   **Submission Service**: `/submission/admin/overview`.
-   **Contest Service**: `/contest`.

## Design System

We use a high-contrast editorial aesthetic:
-   **Typography**: Uppercase labels for headers and metadata (`font-black text-[10px] tracking-widest`).
-   **Shapes**: Large border-radius (`rounded-[2.5rem]`) for main sections and `rounded-2xl` for sub-components.
-   **Visuals**: Glassmorphism (`backdrop-blur-md bg-gray-900/50`) with subtle border glows.
