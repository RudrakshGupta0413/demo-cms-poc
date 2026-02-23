# Desi CMS (BunderBrains)

A modern, high-fidelity Content Management System built with **Next.js 15** and **Payload CMS 3.0**. This project features a custom "Two-Step" page creation workflow and premium, design-accurate frontend schemas.

## Features

- **Next.js 15 & React 19:** Utilizing the latest App Router and Server Components.
- **Payload CMS 3.0 (Beta):** Cutting-edge headless CMS with a custom admin experience.
- **Unified "Pages" Collection:** Replaces improper separate collections for Blog/Process with a single, polymorphic `Pages` collection.
- **Visual Page Creation:**
  - **Step 1:** Select a layout from beautiful, CSS-based mini-preview cards.
  - **Step 2:** Seamlessly transition to the content editor for that specific layout.
- **Custom Admin Components:**
  - `LayoutSelector`: A visual card interface for choosing page templates.
  - `ChangeLayoutButton`: A theme-aware utility to switch layouts dynamically.
- **High-Fidelity Frontend:**
  - **Blog Layout:** Editorial style with alternating rows and uppercase typography.
  - **Process Layout:** Immersive full-screen timeline experience.
- **Live Preview:** Real-time visual editing directly from the Admin panel.

## Getting Started

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Environment Setup:**
    Create a `.env` file in the root configuration (see `.env.example` if available, or ask the team for keys). You surely need:

    ```bash
    DATABASE_URI=postgres://...
    PAYLOAD_SECRET=...
    NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN=http://localhost:3010
    ```

3.  **Run Development Server:**

    ```bash
    npm run dev
    ```

    - Frontend: [http://localhost:3010](http://localhost:3010)
    - Admin Panel: [http://localhost:3010/admin](http://localhost:3010/admin)

## Project Structure

- `src/collections/Pages.ts`: The core collection definition. Handling dynamic layout fields.
- `src/components/payload/`: Custom Admin UI components (`LayoutSelector`, `ChangeLayoutButton`).
- `src/app/(frontend)/[slug]`: Dynamic catch-all route that renders the correct layout based on the page configuration.
- `src/components/LivePreview*.tsx`: The frontend renderers for different layouts.

## Workflow

To create a new page:

1.  Go to **Pages > Create New**.
2.  Choose **Blog Layout** or **Process Layout** from the visual cards.
3.  Fill in the content (the form adapts to your choice).
4.  Publish!

---

Built with ❤️ at BunderBrains.
