# ⚖️ Apex Legal Counsel LLP — Decoupled Headless Law Firm & CMS Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.23-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Laravel 11](https://img.shields.io/badge/Laravel-11.x-red?style=flat-square&logo=laravel)](https://laravel.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Semantic_Tokens-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![Sanctum Auth](https://img.shields.io/badge/Laravel-Sanctum_Auth-purple?style=flat-square)](https://laravel.com/docs/11.x/sanctum)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 🏛️ 1. Project Nature & Executive Overview

**Apex Legal Counsel LLP** is an enterprise-grade, fully decoupled law firm platform and administrative operations center designed for national trial litigators, corporate counsel, and high-exposure legal practices.

The system is architected as a **headless web application**:
- **Backend API & Core Engine (`/backend`)**: High-performance **Laravel 11 REST API** backed by MySQL, utilizing Laravel Sanctum for secure Bearer Token authentication, Eloquent ORM relations, Form Request validation rules, and API Resource transformations.
- **Frontend & Public Client (`/frontend`)**: **Next.js 15 App Router + React 19 + TypeScript + Tailwind CSS**, featuring Server-Side Rendering (SSR), Static Site Generation (SSG), Structured Data (JSON-LD SEO Schema), Route Groups, and an adaptive Dark/Light theme system.
- **Custom Operations & CMS Dashboard (`/frontend/src/app/admin`)**: A bespoke, proprietary operations center built without third-party monoliths (no Nova/Filament), delivering live firm telemetry, full consultation lead triage CRM, partner directory management, practice discipline administration, and verdict tracking.
- **Dedicated Public Contact Portal (`/frontend/src/app/(public)/contact`)**: A dedicated, fully featured communication hub featuring an encrypted client intake form, 24/7 emergency dispatch info, interactive multi-city Google Map switcher (New York, Washington D.C., San Francisco), transit directions, and verified legal/social directory profiles.
- **Strict Brand Design System & Typography**:
  - **Headings**: Editorial Serif (`Playfair Display`).
  - **Body, UI, & Forms**: Modern Clean Sans-Serif (`Roboto`).
  - **60-30-10 Color System**:
    - **60% Dominant Canvas**: Nepal Royal Blue (`#003893`), Midnight Navy (`#001F54`), Elevated Surface (`#0A2540`), and Alabaster (`#F8FAFC`).
    - **30% Structure & Support**: Sakura accents (`#FFB7C5`, `rgba(255, 183, 197, 0.25)`), neutral card borders (`#E2E8F0`), and soft rose containers (`#FFF1F2`).
    - **10% High-Impact Accent**: Nepal Flag Crimson Red (`#DC143C`, hover `#B80D30`) exclusively for primary CTAs and critical conversion points. Red buttons always have pure white text (`#FFFFFF`).

---

## 🧱 2. High-Level Architecture & Flow

```
                                  ┌──────────────────────────────────────────────┐
                                  │             CLIENTS & VISITORS               │
                                  │      (Web Browsers & Mobile Devices)         │
                                  └──────────────────────┬───────────────────────┘
                                                         │
                                    ┌────────────────────┴────────────────────┐
                                    │                                         │
                                    ▼                                         ▼
                      ┌───────────────────────────┐             ┌───────────────────────────┐
                      │    🌐 Public Website      │             │  🛡️ Admin Operations      │
                      │  http://localhost:3001/   │             │ http://localhost:3001/admin│
                      │  • Route Group: (public)  │             │ • Route Group: admin/     │
                      │  • Firm Navbar & Hotline  │             │ • Dedicated Ops Shell     │
                      │  • Dedicated Contact Hub  │             │ • Leads CRM & Pipeline    │
                      │  • Interactive Google Map │             │ • Attorney Management     │
                      │  • Social Media Profiles  │             │ • Practice & Case CMS     │
                      │  • Practice Areas / Slugs │             │ • Sanctum Bearer Token    │
                      │  • Attorney Credentials   │             │ • Live KPI Telemetry      │
                      │  • Landmark Verdicts      │             │ • Dark / Light Switch     │
                      │  • 60-30-10 Color System  │             │                           │
                      └─────────────┬─────────────┘             └─────────────┬─────────────┘
                                    │                                         │
                                    │  JSON REST Requests (CORS / Bearer)     │
                                    └────────────────────┬────────────────────┘
                                                         │
                                                         ▼
                                      ┌─────────────────────────────────────┐
                                      │       🚀 Laravel 11 Backend         │
                                      │       http://localhost:8000/        │
                                      │  • Routes: routes/api.php & web.php │
                                      │  • Controllers: Api/V1/*            │
                                      │  • Auth: Laravel Sanctum Tokens     │
                                      │  • Validation: FormRequests         │
                                      │  • Serialization: JsonResources     │
                                      └──────────────────┬──────────────────┘
                                                         │
                                                         ▼
                                      ┌─────────────────────────────────────┐
                                      │         🗄️ MySQL Database            │
                                      │     database: law_firm (Port 3306)  │
                                      │  • users, practice_areas,           │
                                      │    attorneys, case_results,         │
                                      │    consultation_leads, pivot tables │
                                      └─────────────────────────────────────┘
```

---

## 📂 3. Repository Directory Structure

```
law-firm/
├── backend/                               # Laravel 11 API Backend Engine
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/V1/        # Public & Admin REST Controllers
│   │   │   │   ├── Admin/                 # Admin Auth, Leads CRM, Attorneys, Practices, CaseResults, Analytics
│   │   │   │   ├── AttorneyController.php # Public Attorney API
│   │   │   │   ├── CaseResultController.php # Public Case Results API
│   │   │   │   ├── ConsultationController.php # Rate-limited Lead Intake API
│   │   │   │   ├── PracticeAreaController.php # Public Practices API
│   │   │   │   └── StatController.php     # Public Telemetry API
│   │   │   ├── Requests/                  # FormRequests (Validation & Sanitization)
│   │   │   └── Resources/                 # JsonResources (REST Data Serialization)
│   │   └── Models/                        # Eloquent Models (Attorneys, Practices, Leads, Verdicts, Users)
│   ├── database/
│   │   ├── migrations/                    # MySQL Schema Migrations
│   │   └── seeders/                       # Seeders (Attorneys, Practice Areas, Verdicts, Admin)
│   ├── routes/
│   │   ├── api.php                        # 31 REST API Endpoints (Public & Sanctum-Guarded)
│   │   └── web.php                        # Backend Landing Portal on Port 8000
│   └── resources/views/welcome.blade.php  # Executive Portal Dashboard
│
├── frontend/                              # Next.js 15 App Router Frontend
│   ├── tailwind.config.ts                 # Semantic 60-30-10 Design System Configuration
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/                  # Public Site Route Group (Isolated Layout)
│   │   │   │   ├── layout.tsx             # Public Layout (Firm Navbar + Footer + Schema)
│   │   │   │   ├── page.tsx               # Public Homepage (Hero, Stats, Practices, Team, Verdicts)
│   │   │   │   ├── practice-areas/        # Directory & Slug Detail Pages
│   │   │   │   ├── attorneys/             # Partner Directory & Bio Slug Pages
│   │   │   │   ├── case-results/          # Landmark Verdicts Archive
│   │   │   │   └── contact/               # Dedicated Contact Hub (Form + Info + Map + Social)
│   │   │   ├── admin/                     # Admin Operations Center Route Group
│   │   │   │   ├── layout.tsx             # Admin Shell (Sidebar + Topbar + Sanctum Guard)
│   │   │   │   ├── page.tsx               # Analytics & Operations Dashboard
│   │   │   │   ├── login/                 # 1-Click Fast Access Admin Login
│   │   │   │   ├── leads/                 # Intake Triage Leads CRM
│   │   │   │   ├── attorneys/             # Attorney Management & Headshot Uploads
│   │   │   │   ├── practice-areas/        # Practice Disciplines Manager
│   │   │   │   ├── case-results/          # Landmark Verdicts Manager
│   │   │   │   └── settings/              # System Health & Infrastructure Telemetry
│   │   │   ├── globals.css                # 60-30-10 Tokens & Theme Overrides
│   │   │   └── layout.tsx                 # Root Document Shell (Playfair & Roboto Font Hydration)
│   │   ├── components/                    # Reusable Client & Server Components
│   │   │   ├── Navbar.tsx                 # Public Navigation (Dropdown + Hotline + Theme Toggle)
│   │   │   ├── Footer.tsx                 # Public Credentials Footer
│   │   │   ├── ThemeToggle.tsx            # Sun/Moon Interactive Toggle
│   │   │   ├── ConsultationForm.tsx       # Intake Form with 256-bit Encryption Note
│   │   │   ├── PracticeAreaCard.tsx       # Practice Discipline Card (Sakura Glass Border)
│   │   │   ├── AttorneyCard.tsx           # Partner Card (Sakura Glass Border)
│   │   │   ├── CaseResultCard.tsx         # Verdict Showcase Card
│   │   │   └── StatsSection.tsx           # Firm Recovery Metrics Section
│   │   └── lib/
│   │       └── api.ts                     # Centralized Typed API Client
│   └── package.json
│
├── PROJECT_DOCUMENTATION.md               # Technical Deep-Dive Manual & Database ERD
└── README.md                              # This Documentation Guide
```

---

## 🎨 4. Semantic Color System & 60-30-10 Rule

```ts
// frontend/tailwind.config.ts
colors: {
  nepal: {
    blue: '#003893',        // Primary Nepal Blue
    dark: '#001F54',        // Midnight Canvas (60% Dominant)
    surface: '#0A2540',     // Elevated Dark Card Surface
  },
  crimson: {
    DEFAULT: '#DC143C',     // Nepal Flag Red (10% High-Impact Primary CTAs)
    hover: '#B80D30',       // Darker Crimson on hover
    subtle: '#FFF1F2',      // Soft Rose container for light cards
  },
  sakura: {
    light: '#FFF0F3',       // Ultra-light Cherry Blossom for badges
    DEFAULT: '#FFB7C5',     // Cherry Blossom Accent (30% Structure)
    border: 'rgba(255, 183, 197, 0.25)', // Subtle glass borders
  },
  canvas: {
    light: '#F8FAFC',       // Clean Alabaster for light sections
    card: '#FFFFFF',        // Pure White card surface
    border: '#E2E8F0',      // Neutral gray borders
  },
}
```

---

## 🚀 5. Quick Start & Local Installation

### Prerequisites
- **PHP** >= 8.2 with `pdo_mysql`, `mbstring`, `openssl`, `curl` extensions.
- **Composer** >= 2.x
- **Node.js** >= 18.x and **npm**
- **MySQL** / MariaDB Server running on port 3306

### Step 1: Database Setup
Create the MySQL database:
```sql
CREATE DATABASE law_firm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Backend Setup (Laravel 11)
```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```
*The Laravel backend is now live at `http://localhost:8000`.*

### Step 3: Frontend Setup (Next.js 15)
```bash
cd frontend
npm install
npm run dev -- -p 3001
```
*The Public Law Firm website is now accessible at `http://localhost:3001` and the CMS Operations Center at `http://localhost:3001/admin`.*

---

## 🔑 6. Administrative Access & Credentials

- **Admin Login URL**: `http://localhost:3001/admin/login`
- **Email**: `admin@lawfirm.com`
- **Password**: `Password123!`
- **1-Click Quick Access**: Built-in 1-Click Fast Sign-In button pre-fills and authenticates via Sanctum instantly.

---

## 🌐 7. REST API Endpoints Directory (31 Routes)

### Public Endpoints
- `GET /api/v1/stats` — Firm public telemetry metrics ($250M+ recoveries, success rate)
- `GET /api/v1/practice-areas` — Practice area disciplines with hierarchy
- `GET /api/v1/practice-areas/{slug}` — Practice area detail by unique slug
- `GET /api/v1/attorneys` — Active attorneys directory with practice associations
- `GET /api/v1/attorneys/{slug}` — Full attorney biographical profile
- `GET /api/v1/case-results` — Landmark verdicts and recoveries archive
- `POST /api/v1/consultations` — Inbound consultation lead intake (Rate-limited to 6 req/min)

### Admin Operations Endpoints (`auth:sanctum` Guarded)
- `POST /api/v1/admin/login` — Sanctum Bearer Token generation
- `POST /api/v1/admin/logout` — Token revocation
- `GET /api/v1/admin/analytics` — Executive dashboard KPI metrics & activity stream
- `GET /api/v1/admin/leads` — Paginated CRM leads with status & query filtering
- `PATCH /api/v1/admin/leads/{id}/status` — Status transition (`pending`, `contacted`, `scheduled`, `closed`)
- `DELETE /api/v1/admin/leads/{id}` — Permanent inquiry record deletion
- `GET / POST / PUT / DELETE /api/v1/admin/attorneys` — Complete attorney lifecycle
- `GET / POST / PUT / DELETE /api/v1/admin/practice-areas` — Complete practice discipline lifecycle
- `GET / POST / PUT / DELETE /api/v1/admin/case-results` — Complete verdict record lifecycle
- `POST /api/v1/admin/upload` — Multipart file storage for headshots & attachments
