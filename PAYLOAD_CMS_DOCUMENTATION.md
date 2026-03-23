# Payload CMS — Complete Documentation

> **Audience:** This document is written for **everyone** — whether you have never written a line of code or you are a seasoned full-stack developer. Each section starts with a plain-English explanation and then dives into the technical details.

---

## Table of Contents

1. [What is Payload CMS?](#1-what-is-payload-cms)
2. [How This Project is Structured (Bird's Eye View)](#2-how-this-project-is-structured)
3. [Tech Stack at a Glance](#3-tech-stack-at-a-glance)
4. [Prerequisites — What You Need Before Starting](#4-prerequisites)
5. [Step-by-Step Setup Guide](#5-step-by-step-setup-guide)
6. [Understanding the Configuration (`payload.config.ts`)](#6-understanding-the-configuration)
7. [Collections — Where Your Data Lives](#7-collections)
8. [The Admin Panel — Your Content Dashboard](#8-the-admin-panel)
9. [Live Preview — See Changes in Real Time](#9-live-preview)
10. [Form Builder Plugin — Collect User Data Without Code](#10-form-builder-plugin)
11. [The Frontend — How Pages Are Rendered](#11-the-frontend)
12. [Environment Variables — App Secrets & Settings](#12-environment-variables)
13. [Useful Commands](#13-useful-commands)
14. [Deployment & Production Notes](#14-deployment--production-notes)
15. [Glossary](#15-glossary)

---

## 1. What is Payload CMS?

### For Non-Coders

Think of a **CMS (Content Management System)** like the control panel of your website. Instead of editing raw code every time you want to change text, images, or pages, you use a visual dashboard — much like editing a Google Doc.

**Payload CMS** is one such tool, but unlike WordPress or Wix, it gives developers full control over _how_ the dashboard looks and _what_ content types exist, while still keeping the editing experience simple and friendly for non-technical users.

### For Developers

Payload CMS (v3) is a **headless, code-first CMS** built on **Next.js**. It runs as part of your Next.js app (not a separate server), shares the same build pipeline, and stores data in a relational database (PostgreSQL in this project). Key highlights:

| Feature       | Detail                                     |
| ------------- | ------------------------------------------ |
| **Version**   | Payload 3.74.0                             |
| **Framework** | Next.js 15 (App Router)                    |
| **Database**  | PostgreSQL 16 (via Docker)                 |
| **Editor**    | Lexical Rich Text Editor                   |
| **Language**  | TypeScript                                 |
| **Auth**      | Built-in authentication (email + password) |
| **Plugins**   | Form Builder, Live Preview                 |

---

## 2. How This Project is Structured

### For Non-Coders

Imagine a filing cabinet:

```
📁 demo-cms-poc/
├── 📄 .env                    ← Secret settings (passwords, URLs)
├── 📄 docker-compose.yml      ← Starts the database with one command
├── 📄 package.json            ← List of all software this project needs
├── 📁 src/                    ← All the actual code
│   ├── 📄 payload.config.ts   ← The "blueprint" of the entire CMS
│   ├── 📁 collections/        ← Definitions of content types (Users, Media, Pages)
│   ├── 📁 components/         ← Reusable building blocks for the website
│   ├── 📁 app/
│   │   ├── 📁 (payload)/      ← The admin dashboard (auto-generated)
│   │   └── 📁 (frontend)/     ← The public-facing website visitors see
│   └── 📄 payload-types.ts    ← Auto-generated TypeScript types
```

### For Developers

| Path                      | Purpose                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `src/payload.config.ts`   | Central Payload configuration — collections, plugins, DB adapter, editor, admin panel customization, live preview breakpoints. |
| `src/collections/`        | Collection definitions (`Users.ts`, `Media.ts`, `Pages.ts`) — schema, access control, hooks.                                   |
| `src/components/payload/` | Custom admin UI components — `LayoutSelector`, `ChangeLayoutButton`, `AdminInspectorBridge`, row labels.                       |
| `src/components/`         | Frontend React components — `Header`, `CartSidebar`, `CheckoutFlow`, `FormBuilder`, `LivePreviewBlog`, etc.                    |
| `src/app/(payload)/`      | Payload admin routes (auto-mounted at `/admin`), admin API routes, and custom CSS.                                             |
| `src/app/(frontend)/`     | Public-facing Next.js routes — home page, dynamic `[slug]` pages, form page, menu page.                                        |
| `src/app/api/`            | Custom Next.js API routes (e.g., `menu-proxy`).                                                                                |
| `src/payload-types.ts`    | Auto-generated TypeScript interfaces mirroring your collection schemas.                                                        |
| `docker-compose.yml`      | Defines a PostgreSQL 16 container with health checks.                                                                          |
| `.env`                    | Environment variables (DB connection, secrets, URLs).                                                                          |
| `next.config.mjs`         | Next.js config — transpiles Payload packages, ignores type/lint errors during build.                                           |

---

## 3. Tech Stack at a Glance

```
┌─────────────────────────────────────────────┐
│                  FRONTEND                   │
│  Next.js 15  •  React 19  •  TypeScript     │
├─────────────────────────────────────────────┤
│                   CMS                       │
│  Payload 3.74  •  Lexical Editor            │
│  Form Builder Plugin  •  Live Preview       │
├─────────────────────────────────────────────┤
│                 DATABASE                    │
│  PostgreSQL 16 (Docker)                     │
├─────────────────────────────────────────────┤
│               UTILITIES                     │
│  Sharp (image processing)  •  GraphQL       │
│  cross-env  •  dotenv                       │
└─────────────────────────────────────────────┘
```

### What Each Piece Does

| Technology      | What It Does (Simple)                          | What It Does (Technical)                                                                 |
| --------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Next.js**     | The engine that builds and serves your website | React-based framework with server-side rendering, API routes, and file-based routing     |
| **React**       | The building blocks of your user interface     | Component-based UI library for declarative rendering                                     |
| **Payload CMS** | The admin dashboard where you edit content     | Code-first headless CMS that generates admin UI, REST/GraphQL APIs, and auth from config |
| **PostgreSQL**  | The database where all content is stored       | Relational database management system; stores collections, users, media metadata         |
| **Docker**      | Runs the database in an isolated container     | Containerization platform that ensures consistent environments                           |
| **Lexical**     | The text editor inside the admin panel         | Meta's extensible rich-text editor framework                                             |
| **Sharp**       | Optimizes images you upload                    | High-performance Node.js image processing library (resize, crop, format conversion)      |
| **TypeScript**  | Helps catch coding mistakes before they happen | Typed superset of JavaScript that compiles to plain JS                                   |

---

## 4. Prerequisites

### For Non-Coders

Before you can run this project on your computer, you need to install a few free tools:

| Tool                            | Why You Need It               | How to Get It                                                 |
| ------------------------------- | ----------------------------- | ------------------------------------------------------------- |
| **Node.js** (v18.20+ or v20.9+) | Runs the JavaScript code      | [nodejs.org](https://nodejs.org) — download the LTS version   |
| **npm**                         | Installs project dependencies | Comes bundled with Node.js                                    |
| **Docker Desktop**              | Runs the PostgreSQL database  | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **Git** (optional)              | Downloads the project code    | [git-scm.com](https://git-scm.com/)                           |
| **A code editor** (optional)    | To view or edit code          | [VS Code](https://code.visualstudio.com/) is recommended      |

### For Developers

```bash
# Verify your setup
node -v    # Must be >= 18.20.2 or >= 20.9.0
npm -v     # Comes with Node
docker -v  # Docker Engine
```

---

## 5. Step-by-Step Setup Guide

### Step 1: Clone or Download the Project

```bash
git clone <your-repository-url>
cd demo-cms-poc
```

> **Non-coder tip:** "Cloning" means downloading a copy of the project. If you don't have Git, you can download the project as a ZIP file from GitHub and unzip it.

---

### Step 2: Install Dependencies

```bash
npm install
```

This reads `package.json` and downloads all the required libraries into a folder called `node_modules`. Think of it like installing all the apps your project needs to run.

**What gets installed:**

- `payload` — The CMS core
- `@payloadcms/db-postgres` — Database connector for PostgreSQL
- `@payloadcms/richtext-lexical` — Rich text editor
- `@payloadcms/plugin-form-builder` — Form creation plugin
- `@payloadcms/live-preview-react` — Real-time page preview
- `next`, `react`, `react-dom` — The web framework
- `sharp` — Image optimization
- And more (see `package.json` for the full list)

---

### Step 3: Start the Database

```bash
docker compose up -d
```

> **What happens:** Docker starts a PostgreSQL database in the background. The `-d` flag means "detached" — it runs silently without taking over your terminal.

**Database details (from `docker-compose.yml`):**

| Setting            | Value                               |
| ------------------ | ----------------------------------- |
| Image              | `postgres:16-alpine`                |
| Container name     | `demo-postgres`                     |
| Username           | `payload`                           |
| Password           | `payload`                           |
| Database name      | `demo_db`                           |
| Host port          | `5435` (maps to container's `5432`) |
| Persistent storage | Docker volume `demo_postgres_data`  |

> **Non-coder tip:** Think of Docker like a virtual machine that runs just the database. Your data is saved even if you stop and restart Docker.

---

### Step 4: Configure Environment Variables

The `.env` file at the project root contains settings your app reads at startup:

```env
DATABASE_URL=postgresql://payload:payload@localhost:5435/demo_db
PAYLOAD_SECRET=desi-development-secret-change-in-production
NEXT_PUBLIC_SERVER_URL=http://localhost:3010
NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN=http://localhost:3010
```

| Variable                           | What It Does                                                                              |
| ---------------------------------- | ----------------------------------------------------------------------------------------- |
| `DATABASE_URL`                     | Connection string telling the app _where_ the database is and _how_ to connect            |
| `PAYLOAD_SECRET`                   | A secret key used to encrypt session tokens and passwords. **Change this in production!** |
| `NEXT_PUBLIC_SERVER_URL`           | The URL where your app runs (used for live preview, links, etc.)                          |
| `NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN` | The URL of the admin panel (usually same as above)                                        |

> ⚠️ **Important:** Never commit production secrets to Git. Use environment variables provided by your hosting platform (Vercel, Railway, etc.) in production.

---

### Step 5: Start the Development Server

```bash
npm run dev
```

This starts the app on **http://localhost:3010**. The first time you run it, Payload will automatically:

1. Connect to PostgreSQL
2. Create all necessary database tables based on your collections
3. Generate TypeScript types in `src/payload-types.ts`

> **Non-coder tip:** Open your web browser and go to `http://localhost:3010` — you should see the homepage. Go to `http://localhost:3010/admin` to see the admin dashboard.

---

### Step 6: Create Your First Admin User

When you visit `http://localhost:3010/admin` for the first time, Payload will show you a registration form. Fill in your email and password — this becomes the **super admin** account.

---

## 6. Understanding the Configuration

### For Non-Coders

The file `src/payload.config.ts` is like the **blueprint** of your CMS. It tells Payload:

- What types of content exist (Pages, Media, Users)
- Which database to use
- What plugins to enable (Forms, Live Preview)
- How the admin panel should behave

You don't need to edit this file to manage content — it's only changed when you want to add new content types or features.

### For Developers

The configuration is built using `buildConfig()`:

```typescript
export default buildConfig({
    admin: { ... },         // Admin panel settings
    editor: lexicalEditor(), // Rich text editor
    db: postgresAdapter({   // Database connection
        pool: { connectionString: process.env.DATABASE_URL || '' },
    }),
    collections: [Users, Media, Pages],  // Data models
    secret: process.env.PAYLOAD_SECRET,  // Encryption key
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    sharp,                  // Image processing
    plugins: [
        formBuilderPlugin({ ... }),  // Form builder
    ],
})
```

**Key Configuration Sections:**

| Section                 | Purpose                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| `admin.user`            | Which collection handles authentication (set to `Users`)                                           |
| `admin.livePreview`     | Enables real-time preview with responsive breakpoints (Mobile 375px, Tablet 768px, Desktop 1440px) |
| `admin.importMap`       | Tells Payload where to resolve custom component imports                                            |
| `editor`                | The rich text editor engine (Lexical)                                                              |
| `db`                    | Database adapter and connection pool configuration                                                 |
| `collections`           | Array of all content collections                                                                   |
| `secret`                | JWT signing secret for authentication tokens                                                       |
| `typescript.outputFile` | Path where auto-generated types are written                                                        |
| `sharp`                 | Enables server-side image processing (resizing, optimization)                                      |
| `plugins`               | Array of plugins (Form Builder in this project)                                                    |

---

## 7. Collections

### For Non-Coders

**Collections** are like different types of filing drawers. Each collection stores a specific kind of content:

| Collection | What It Stores   | Example                       |
| ---------- | ---------------- | ----------------------------- |
| **Users**  | Admin accounts   | `admin@example.com`           |
| **Media**  | Images and files | A hero background image       |
| **Pages**  | Website pages    | A blog post or a process page |

### For Developers

#### 7.1 Users (`src/collections/Users.ts`)

```typescript
export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email" },
  auth: true, // Enables authentication (login, JWT, sessions)
  fields: [
    // Email + password are added automatically by `auth: true`
  ],
};
```

- **`auth: true`** — Payload automatically adds email, password (hashed), login/logout endpoints, JWT token generation, and session management.
- **`useAsTitle: 'email'`** — In the admin panel, users are listed by their email address.

---

#### 7.2 Media (`src/collections/Media.ts`)

```typescript
export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true }, // Anyone can read/view media
  fields: [{ name: "alt", type: "text", required: true }],
  upload: true, // Enables file upload functionality
};
```

- **`upload: true`** — Turns this collection into a file upload handler. Uploaded files are stored in the `media/` directory.
- **`access.read: () => true`** — Media files are publicly accessible (no login required to view images).
- **`alt` field** — Requires an alt-text description for every uploaded image (important for accessibility and SEO).

---

#### 7.3 Pages (`src/collections/Pages.ts`)

This is the most complex collection. It supports **two layout types**: Blog and Process.

**Top-level fields:**

| Field          | Type          | Purpose                                                     |
| -------------- | ------------- | ----------------------------------------------------------- |
| `layoutType`   | Select        | Choose between "Blog Layout" and "Process Layout"           |
| `title`        | Text          | Page title                                                  |
| `slug`         | Text (unique) | URL-friendly identifier (e.g., `my-blog-post`)              |
| `hero`         | Group         | Hero section with heading, subheading, and background image |
| `changeLayout` | UI            | Custom button to reset layout selection                     |

**Blog Layout Fields (shown when `layoutType === 'blog'`):**

| Field                   | Type  | Contains                                                                    |
| ----------------------- | ----- | --------------------------------------------------------------------------- |
| `section1` – `section4` | Group | Each has: `heading` (text), `image` (upload → media), `content` (rich text) |

**Process Layout Fields (shown when `layoutType === 'process'`):**

| Field             | Type  | Contains                                                                       |
| ----------------- | ----- | ------------------------------------------------------------------------------ |
| `step1` – `step4` | Group | Each has: `heading` (text), `description` (textarea), `image` (upload → media) |
| `discoverMore`    | Group | Heading + 3 items, each with image, heading, and link                          |

**Conditional Fields:** The admin panel uses `admin.condition` to show/hide fields based on the selected layout. For example, `section1` only appears when `layoutType === 'blog'`.

**Custom Admin Components:**

- `LayoutSelector` — A visual card-based layout picker (replaces the default select dropdown)
- `ChangeLayoutButton` — Allows resetting the layout choice
- `AdminInspectorBridge` — Debugging tool injected before document controls

---

## 8. The Admin Panel

### For Non-Coders

The **Admin Panel** is your content command center. Access it at:

```
http://localhost:3010/admin
```

Here's what you can do:

| Action              | How                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------- |
| **Create a page**   | Go to "Pages" → click "Create New" → choose Blog or Process layout → fill in content → save |
| **Upload an image** | Go to "Media" → click "Create New" → upload a file and add alt text                         |
| **Manage users**    | Go to "Users" → add, edit, or remove admin accounts                                         |
| **Build a form**    | Go to "Forms" (under Config) → create a form with fields like text, email, etc.             |
| **Preview a page**  | While editing a page, click the Live Preview button to see your changes in real time        |

### For Developers

Payload auto-generates the admin panel at the `(payload)` route group:

```
src/app/(payload)/
├── admin/           ← Admin UI pages (auto-generated)
│   ├── [[...segments]]/page.tsx
│   └── importMap.js
├── api/             ← REST API routes (auto-generated)
│   └── [...slug]/route.ts
│   └── graphql/route.ts     ← GraphQL endpoint
├── layout.tsx       ← Payload admin root layout
├── custom.css       ← Custom admin panel styles
└── actions.ts       ← Server actions
```

**API Endpoints (auto-generated):**

| Endpoint           | Method   | Description         |
| ------------------ | -------- | ------------------- |
| `/api/pages`       | GET      | List all pages      |
| `/api/pages`       | POST     | Create a new page   |
| `/api/pages/:id`   | GET      | Get a single page   |
| `/api/pages/:id`   | PATCH    | Update a page       |
| `/api/pages/:id`   | DELETE   | Delete a page       |
| `/api/media`       | GET/POST | List/upload media   |
| `/api/users`       | GET/POST | List/create users   |
| `/api/users/login` | POST     | Authenticate a user |
| `/api/users/me`    | GET      | Get logged-in user  |
| `/api/graphql`     | POST     | GraphQL endpoint    |

---

## 9. Live Preview

### For Non-Coders

**Live Preview** lets you see how your page looks _while you're editing it_ — no need to save and refresh. As you type or upload images, the preview updates instantly.

It supports three screen sizes:

- 📱 **Mobile** (375 × 667 px)
- 📱 **Tablet** (768 × 1024 px)
- 🖥️ **Desktop** (1440 × 900 px)

### For Developers

Live Preview is configured in two places:

**1. Global config (`payload.config.ts`):**

```typescript
livePreview: {
    collections: ['pages'],
    url: ({ data }) => {
        const origin = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3010'
        return `${origin}/${data?.slug}?livePreview=true`
    },
    breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
    ],
}
```

**2. Collection-level config (`Pages.ts`):**

```typescript
admin: {
    livePreview: {
        url: ({ data }) => {
            const origin = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3010'
            return `${origin}/${data?.slug}?livePreview=true`
        },
    },
}
```

**Frontend integration** uses the `@payloadcms/live-preview-react` package with dedicated components:

- `LivePreviewBlog.tsx` — Live preview wrapper for blog layout pages
- `LivePreviewProcessOfDyeing.tsx` — Live preview wrapper for process layout pages

These components use the `useLivePreview` hook to receive real-time data updates from the admin panel via postMessage.

---

## 10. Form Builder Plugin

### For Non-Coders

The **Form Builder** lets you create forms (like contact forms, waitlists, surveys) directly from the admin panel — **no coding required**.

**How it works:**

1. Go to Admin → Config → Forms
2. Create a new form (e.g., "Contact Us")
3. Add fields: Name, Email, Phone, Message, etc.
4. Save the form
5. The form automatically appears on your website at the designated form page
6. When someone submits the form, their data is saved as a "Form Submission" in the admin panel

**Bonus:** Every submission also automatically sends the data to an external API (Synergy Waitlist) via a backend hook — no additional setup needed.

### For Developers

The Form Builder is configured as a plugin in `payload.config.ts`:

```typescript
formBuilderPlugin({
  fields: {
    payment: false, // Disable payment fields
  },
  formOverrides: {
    admin: { group: "Config" }, // Place in "Config" sidebar group
  },
  formSubmissionOverrides: {
    admin: { group: "Config" },
    hooks: {
      afterChange: [
        async ({ doc, operation }) => {
          if (operation === "create") {
            // Extract fields from submissionData array
            // POST to external Synergy Waitlist API
          }
          return doc;
        },
      ],
    },
  },
});
```

**How the submission hook works:**

```
User submits form → Payload saves to DB
                  → afterChange hook fires
                  → Extracts email, name, phone from submissionData
                  → POST to https://papi.misrut.com/papi/opn/synergy/waitlist
```

The hook intelligently maps fields by checking for keywords (`email`, `name`, `phone`) in field names, making it flexible regardless of exact field naming.

---

## 11. The Frontend

### For Non-Coders

The **frontend** is what website visitors see. It's completely separate from the admin panel:

| URL                            | What You See                                          |
| ------------------------------ | ----------------------------------------------------- |
| `http://localhost:3010/`       | Homepage with links to Admin, Blog, and Process pages |
| `http://localhost:3010/admin`  | Admin dashboard (login required)                      |
| `http://localhost:3010/{slug}` | Any page created in the CMS (e.g., `/my-blog`)        |
| `http://localhost:3010/form`   | Form page                                             |
| `http://localhost:3010/menu`   | Menu page                                             |

### For Developers

**Route structure:**

```
src/app/(frontend)/
├── layout.tsx       ← Root layout (Header, CartProvider, CartSidebar)
├── page.tsx         ← Homepage
├── [slug]/          ← Dynamic route — fetches page by slug from Payload
│   └── page.tsx
├── form/            ← Form page
│   └── page.tsx
├── form-success/    ← Post-submission success page
│   └── page.tsx
└── menu/            ← Menu page
    └── page.tsx
```

**Dynamic page rendering (`[slug]/page.tsx`):**

1. Receives the slug from the URL
2. Queries Payload's Local API: `payload.find({ collection: 'pages', where: { slug: { equals: slug } } })`
3. Checks the `layoutType` field
4. Renders either `LivePreviewBlog` or `LivePreviewProcessOfDyeing` component
5. If `?livePreview=true` query param is present, enables real-time updates from admin

**Frontend Layout** wraps all pages with:

- `<CartProvider>` — React Context for shopping cart state
- `<Header />` — Navigation header
- `<CartSidebar />` — Slide-out cart panel

---

## 12. Environment Variables

| Variable                           | Required       | Default                 | Description                                                                                    |
| ---------------------------------- | -------------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                     | ✅ Yes         | —                       | PostgreSQL connection string. Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`          |
| `PAYLOAD_SECRET`                   | ✅ Yes         | `SETUP_YOUR_SECRET`     | Secret key for JWT tokens and password hashing. Must be a strong, unique string in production. |
| `NEXT_PUBLIC_SERVER_URL`           | ✅ Yes         | `http://localhost:3010` | Base URL of the application. Used for live preview URLs, API calls, and link generation.       |
| `NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN` | ⚠️ Recommended | —                       | Origin URL for admin panel CORS. Usually same as `NEXT_PUBLIC_SERVER_URL`.                     |

### Setting Up for Production

```env
DATABASE_URL=postgresql://user:strongpassword@your-db-host:5432/production_db
PAYLOAD_SECRET=a-very-long-random-string-at-least-32-characters
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN=https://yourdomain.com
```

> 💡 **Tip:** Generate a strong secret with: `openssl rand -base64 32`

---

## 13. Useful Commands

| Command                      | What It Does                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`                | Starts the development server on port 3010 with hot reload                     |
| `npm run build`              | Creates an optimized production build                                          |
| `npm run start`              | Runs the production build on port 3010                                         |
| `npm run devsafe`            | Deletes `.next` cache folder then starts dev server (fixes stale build issues) |
| `npm run generate:types`     | Regenerates `payload-types.ts` from your collection schemas                    |
| `npm run generate:importmap` | Regenerates the import map for custom admin components                         |
| `npm run lint`               | Runs ESLint to check for code quality issues                                   |
| `docker compose up -d`       | Starts the PostgreSQL database                                                 |
| `docker compose down`        | Stops the PostgreSQL database (data is preserved)                              |
| `docker compose down -v`     | Stops the database **and deletes all data** (fresh start)                      |

---

## 14. Deployment & Production Notes

### For Non-Coders

When you're ready to make your website live on the internet:

1. Push your code to GitHub
2. Connect your repository to a hosting platform like **Vercel**
3. Set your environment variables in the hosting platform's dashboard
4. Deploy — the platform handles everything else

### For Developers

**Recommended Hosting:**

| Component               | Recommended Service              |
| ----------------------- | -------------------------------- |
| App (Next.js + Payload) | Vercel, Railway, Render          |
| Database (PostgreSQL)   | Neon, Supabase, Railway, AWS RDS |

**Deployment Checklist:**

- [ ] Set `PAYLOAD_SECRET` to a cryptographically strong value
- [ ] Set `DATABASE_URL` to your production PostgreSQL instance
- [ ] Set `NEXT_PUBLIC_SERVER_URL` to your production domain
- [ ] Ensure the Node.js version is >= 18.20.2 or >= 20.9.0
- [ ] The build command is `npm run build` (allocates 8GB memory via `--max-old-space-size=8000`)
- [ ] The start command is `npm run start`
- [ ] Media files: configure S3 or cloud storage for production (local `media/` folder doesn't persist on serverless platforms)
- [ ] Enable HTTPS
- [ ] Set up database backups

**Build Notes:**

- TypeScript errors are ignored during build (`ignoreBuildErrors: true` in `next.config.mjs`)
- ESLint is disabled during build (`ignoreDuringBuilds: true`)
- Payload packages are transpiled via `transpilePackages` in Next.js config

---

## 15. Glossary

| Term                     | Meaning                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| **CMS**                  | Content Management System — software for creating and managing digital content                   |
| **Headless CMS**         | A CMS that provides content via APIs, without a built-in frontend template                       |
| **Collection**           | A type of content (like a database table) — e.g., Users, Pages, Media                            |
| **Slug**                 | A URL-friendly identifier, e.g., `my-first-blog-post`                                            |
| **Admin Panel**          | The web dashboard where you manage content (at `/admin`)                                         |
| **API**                  | Application Programming Interface — how different software systems communicate                   |
| **REST API**             | A style of API that uses HTTP methods (GET, POST, PATCH, DELETE)                                 |
| **GraphQL**              | A query language for APIs that lets you request exactly the data you need                        |
| **JWT**                  | JSON Web Token — a secure token used for authentication                                          |
| **Rich Text**            | Formatted text with bold, italics, headings, images, etc.                                        |
| **Lexical**              | The rich text editor engine used by Payload (built by Meta)                                      |
| **Live Preview**         | Real-time rendering of page changes as you edit in the admin panel                               |
| **Docker**               | A platform that runs software in isolated containers                                             |
| **PostgreSQL**           | A powerful, open-source relational database                                                      |
| **Next.js**              | A React framework for building full-stack web applications                                       |
| **TypeScript**           | A typed version of JavaScript that catches errors at compile time                                |
| **Environment Variable** | A setting stored outside your code (like passwords and URLs)                                     |
| **Sharp**                | A Node.js library for fast image processing                                                      |
| **Hook**                 | Code that runs automatically at specific points (e.g., after a form is submitted)                |
| **Plugin**               | An add-on that extends Payload's functionality                                                   |
| **Breakpoint**           | A screen width at which the layout changes (for responsive design)                               |
| **Route**                | A URL pattern that maps to a specific page or API endpoint                                       |
| **CORS**                 | Cross-Origin Resource Sharing — a security feature controlling which domains can access your API |

---

## Architecture Diagram

```
                    ┌─────────────────────┐
                    │   Web Browser        │
                    │  (Admin / Visitor)   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │                     │
                    │   Next.js 15 App    │
                    │   (Port 3010)       │
                    │                     │
                    │  ┌───────────────┐  │
                    │  │ /admin        │  │ ← Payload Admin Panel
                    │  │ (Payload UI)  │  │
                    │  └───────────────┘  │
                    │  ┌───────────────┐  │
                    │  │ /api/*        │  │ ← REST + GraphQL APIs
                    │  │ (Auto-gen)    │  │
                    │  └───────────────┘  │
                    │  ┌───────────────┐  │
                    │  │ /{slug}       │  │ ← Public Frontend Pages
                    │  │ (Dynamic)     │  │
                    │  └───────────────┘  │
                    │                     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │                     │
                    │   PostgreSQL 16     │
                    │   (Docker)          │
                    │   Port: 5435        │
                    │                     │
                    └─────────────────────┘
```

---

## Quick Start Summary

```bash
# 1. Install dependencies
npm install

# 2. Start the database
docker compose up -d

# 3. Start the app
npm run dev

# 4. Open in browser
#    Homepage:    http://localhost:3010
#    Admin Panel: http://localhost:3010/admin

# 5. Create your first admin user at the registration screen

# 6. Start creating pages! 🎉
```

---

_Last updated: March 6, 2026_
