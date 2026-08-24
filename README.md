# ⚖️ Apex Legal Counsel LLP — Decoupled Headless Law Firm & CMS Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.23-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Laravel 11](https://img.shields.io/badge/Laravel-11.x-red?style=flat-square&logo=laravel)](https://laravel.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![Sanctum Auth](https://img.shields.io/badge/Laravel-Sanctum_Auth-purple?style=flat-square)](https://laravel.com/docs/11.x/sanctum)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg?style=flat-square)](LICENSE)

---

## 🏛️ 1. Project Nature & Executive Overview

**Apex Legal Counsel LLP** is an enterprise-grade, fully decoupled law firm platform and administrative operations center designed for national trial litigators, corporate counsel, and high-exposure legal practices.

The system is architected as a **headless web application**:
- **Backend API & Core Engine (`/backend`)**: High-performance **Laravel 11 REST API** backed by MySQL, utilizing Laravel Sanctum for secure Bearer Token authentication, Eloquent ORM relations, Form Request validation rules, and API Resource transformations.
- **Frontend & Public Client (`/frontend`)**: **Next.js 15 App Router + React 19 + TypeScript + Tailwind CSS**, featuring Server-Side Rendering (SSR), Static Site Generation (SSG), Structured Data (JSON-LD SEO Schema), Route Groups, and an adaptive Dark/Light luxury legal theme.
- **Custom Operations & CMS Dashboard (`/frontend/src/app/admin`)**: A bespoke, proprietary operations center built without third-party monoliths (no Nova/Filament), delivering live firm telemetry, full consultation lead triage CRM, partner directory management, practice discipline administration, and verdict tracking.

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
                      │  • Legal Case Intake      │             │ • Leads CRM & Pipeline    │
                      │  • Practice Areas / Slugs │             │ • Attorney Management     │
                      │  • Attorney Credentials   │             │ • Practice & Case CMS     │
                      │  • Landmark Verdicts      │             │ • Sanctum Bearer Token    │
                      │  • Dark / Light Theme     │             │ • Live KPI Telemetry      │
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
│   │   │   │   ├── Admin/
│   │   │   │   │   ├── AdminAuthController.php   # Sanctum Login/Logout/Me
│   │   │   │   │   └── AdminController.php       # Full CRUD for CRM, Attorneys, Areas, Cases
│   │   │   │   ├── AttorneyController.php        # Public Attorney Queries
│   │   │   │   ├── CaseResultController.php      # Public Verdict Queries
│   │   │   │   ├── ConsultationLeadController.php# Retainer Inquiry Submission
│   │   │   │   ├── PracticeAreaController.php    # Practice Hierarchy Queries
│   │   │   │   └── StatsController.php           # Aggregated Firm Statistics
│   │   │   ├── Requests/                         # Validated Form Requests
│   │   │   └── Resources/                        # Eloquent API JSON Resources
│   │   └── Models/                               # Eloquent Models (PracticeArea, Attorney, etc.)
│   ├── bootstrap/                                # App configuration (CSRF exemptions, routing)
│   ├── config/                                   # cors.php, sanctum.php, database.php
│   ├── database/
│   │   ├── migrations/                           # DB Schema migrations
│   │   └── seeders/DatabaseSeeder.php            # Seed data (6 attorneys, 9 practices, 8 verdicts, leads)
│   ├── resources/views/welcome.blade.php         # Backend interactive API portal & directory
│   └── routes/
│       ├── api.php                               # 31 REST API Endpoints (v1 public + v1 admin)
│       └── web.php                               # Backend executive portal
│
└── frontend/                              # Next.js 15 App Router Frontend
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx                        # Global document & flash-free theme hydration shell
    │   │   ├── globals.css                       # Tailwind CSS v4 design tokens (Dark & Light)
    │   │   │
    │   │   ├── (public)/                         # 🌐 Decoupled Public Website Route Group
    │   │   │   ├── layout.tsx                    # Public Layout (Navbar, Hotline, Footer, Schema)
    │   │   │   ├── page.tsx                      # Homepage ($250M+ Stats, Leadership, Verdicts)
    │   │   │   ├── practice-areas/               # Practice areas directory & slug detail pages
    │   │   │   ├── attorneys/                    # Attorney directory & bio profile slug pages
    │   │   │   ├── case-results/                 # Landmark recoveries & settlement history
    │   │   │   └── contact/                      # Case evaluation & consultation intake form
    │   │   │
    │   │   └── admin/                            # 🛡️ Decoupled Operations & CMS Route Group
    │   │       ├── layout.tsx                    # Admin Shell (Sidebar, Topbar, Sanctum Auth Guard)
    │   │       ├── login/page.tsx                # 1-Click Fast Admin Sign-In
    │   │       ├── page.tsx                      # Operations Dashboard & Analytics KPIs
    │   │       ├── leads/page.tsx                # Inbound Consultation CRM & Triage
    │   │       ├── attorneys/page.tsx            # Attorney CRUD & Practice Area Sync
    │   │       ├── practice-areas/page.tsx       # Practice Disciplines CMS & Hierarchies
    │   │       ├── case-results/page.tsx         # Landmark Verdicts & Recoveries CMS
    │   │       └── settings/page.tsx             # Telemetry, Health, and Token Inspection
    │   │
    │   ├── components/                           # Reusable UI Components
    │   │   ├── Navbar.tsx                        # Responsive navigation with practice dropdown
    │   │   ├── Footer.tsx                        # Firm credentials, disclaimers & ethics compliance
    │   │   ├── ThemeToggle.tsx                   # Interactive Sun/Moon theme switcher (Dark/Light)
    │   │   ├── ConsultationForm.tsx              # Validated case evaluation intake form
    │   │   ├── AttorneyCard.tsx                  # Partner photo, credentials & direct contact
    │   │   ├── PracticeAreaCard.tsx              # Practice category card with sub-specialties
    │   │   ├── CaseResultCard.tsx                # Verdict highlight with settlement badge
    │   │   ├── StatsSection.tsx                  # Firm recoveries & win-rate metrics
    │   │   └── JsonLd.tsx                        # Schema.org LegalService & Person structured data
    │   │
    │   └── lib/
    │       └── api.ts                            # Centralized typed TypeScript API Client
```

---

## ⚡ 4. Work Accomplished & Key Milestones

1. **Complete Database Architecture & Seed Data**:
   - Built database tables for `users`, `practice_areas`, `attorneys`, `attorney_practice_area` (pivot), `case_results`, and `consultation_leads`.
   - Seeded 6 elite trial partners with Ivy League bios, 9 parent & sub-practice disciplines, 8 multi-million dollar landmark case verdicts, and 6 active consultation CRM leads.

2. **Full REST API Suite (`/api/v1`)**:
   - Implemented 31 REST API endpoints supporting full pagination, search, status filtering, and relations.
   - Built API Resources (`AttorneyResource`, `PracticeAreaResource`, `CaseResultResource`, `ConsultationLeadResource`) delivering sanitized and transformed JSON payloads.

3. **Complete Next.js 15 Frontend with Route Group Decoupling**:
   - Grouped all public pages under `src/app/(public)/` and admin pages under `src/app/admin/`.
   - **Zero Layout Bleed**: Public Navbar and Footer are restricted exclusively to the public website, giving the Admin CMS an independent, distraction-free command shell.

4. **Sanctum Authentication & Operations Dashboard**:
   - Secured administrative routes via `auth:sanctum` Bearer token authentication.
   - Built an interactive **Leads CRM** with status triage (`pending`, `reviewed`, `contacted`, `converted`, `rejected`), internal notes, and one-click actions.
   - Built complete administrative CRUD tables with modals for managing Attorneys, Practice Areas, and Verdicts.
   - Added **1-Click Admin Access** on the login screen for instantaneous developer access.

5. **Multi-Port CORS & CSRF Compatibility**:
   - Whitelisted origins `http://localhost:3000`, `http://localhost:3001`, and `http://localhost:3002`.
   - Exempted stateless `/api/*` endpoints from session CSRF cookie requirements in `bootstrap/app.php` to prevent `419 CSRF mismatch` errors across multiple local frontend ports.

6. **Luxury Dark & Light Theme System**:
   - Implemented an interactive **Sun ☀️ / Moon 🌙** theme toggle with `localStorage` persistence and flash-free SSR hydration across the public site, admin dashboard, and backend portal.
   - Tailored custom color tokens for **Prestige Dark Mode** (Deep Navy `#0A192F` + Warm Gold) and **Clean Editorial Light Mode** (Ivory `#F8FAFC` + Slate + Gold).

---

## 🚀 5. Local Setup & Installation Guide

### Prerequisites
- **PHP 8.2+** with `pdo_mysql`, `curl`, `mbstring`, `openssl`
- **Composer 2.x**
- **Node.js 18+** & **npm**
- **MySQL 8.x** running on `127.0.0.1:3306`

---

### Step 1: Backend Setup (Laravel 11)

```bash
# Navigate to the backend directory
cd backend

# Install PHP dependencies
composer install

# Configure environment variables
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database credentials in .env:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=law_firm
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations and seed database with firm data
php artisan migrate:fresh --seed

# Create storage symbolic link
php artisan storage:link

# Start the Laravel API Server (Port 8000)
php artisan serve --port=8000
```

---

### Step 2: Frontend Setup (Next.js 15)

```bash
# Navigate to the frontend directory
cd ../frontend

# Install Node dependencies
npm install

# Configure local environment variables in .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
# NEXT_PUBLIC_STORAGE_URL=http://localhost:8000/storage

# Run Next.js in development mode on port 3001 (or 3000)
npm run dev -- -p 3001
```

---

## 🔑 6. Administrative Credentials & Access

| Portal | URL | Credentials |
| :--- | :--- | :--- |
| **Frontend Public Website** | [`http://localhost:3001/`](http://localhost:3001/) | Open to public |
| **CMS Operations Dashboard** | [`http://localhost:3001/admin`](http://localhost:3001/admin) | Requires sign-in below |
| **Admin Sign-In** | [`http://localhost:3001/admin/login`](http://localhost:3001/admin/login) | **Email**: `admin@lawfirm.com`<br>**Password**: `Password123!` *(or click 1-Click Access)* |
| **Backend API Directory** | [`http://localhost:8000/`](http://localhost:8000/) | Executive landing page & API links |

---

## 📡 7. API Endpoints Reference

### Public Endpoints (`/api/v1/*`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/stats` | Aggregated recoveries, trial win-rate, years of experience |
| `GET` | `/api/v1/practice-areas` | Practice area hierarchies (`?featured=1`, `?parent_only=1`) |
| `GET` | `/api/v1/practice-areas/{slug}` | Detailed practice area with sub-areas & lead attorneys |
| `GET` | `/api/v1/attorneys` | Partner directory with practice areas & filters (`?practice_area=`) |
| `GET` | `/api/v1/attorneys/{slug}` | Full attorney bio, bar admissions, education, and cases |
| `GET` | `/api/v1/case-results` | Case verdicts (`?featured=1`, `?practice_area=`, `?year=`) |
| `GET` | `/api/v1/case-results/{id}` | Specific case verdict summary |
| `POST` | `/api/v1/consultation` | Submit confidential consultation intake form |

### Administrative Endpoints (`/api/v1/admin/*` — Requires Bearer Token)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/admin/login` | Authenticate admin user & issue Sanctum Bearer token |
| `POST` | `/api/v1/admin/logout` | Revoke current Sanctum token |
| `GET` | `/api/v1/admin/me` | Current authenticated administrator profile |
| `GET` | `/api/v1/admin/analytics` | Live KPI dashboard stats, pipeline metrics, recent activity |
| `GET` | `/api/v1/admin/leads` | Paginated CRM consultation inquiries (`?status=`, `?q=`) |
| `PATCH` | `/api/v1/admin/leads/{id}/status` | Update lead status (`pending`, `reviewed`, `contacted`, `converted`, `rejected`) |
| `DELETE` | `/api/v1/admin/leads/{id}` | Delete consultation lead |
| `GET` | `/api/v1/admin/attorneys` | All attorneys list with practice pivots |
| `POST` | `/api/v1/admin/attorneys` | Create attorney with headshot upload & practice area relations |
| `PUT` | `/api/v1/admin/attorneys/{id}` | Update attorney bio, designation, admissions, education |
| `DELETE` | `/api/v1/admin/attorneys/{id}` | Delete attorney profile |
| `GET` | `/api/v1/admin/practice-areas` | All practice disciplines list |
| `POST` | `/api/v1/admin/practice-areas` | Create practice discipline |
| `PUT` | `/api/v1/admin/practice-areas/{id}`| Update practice discipline |
| `DELETE` | `/api/v1/admin/practice-areas/{id}`| Delete practice discipline |
| `GET` | `/api/v1/admin/case-results` | All landmark verdicts & settlements |
| `POST` | `/api/v1/admin/case-results` | Create new verdict entry |
| `PUT` | `/api/v1/admin/case-results/{id}` | Update verdict entry |
| `DELETE` | `/api/v1/admin/case-results/{id}` | Delete verdict entry |

---

## 🧪 8. Testing & Validation

```bash
# Backend Quality Assurance
cd backend
php artisan test

# Frontend Quality Assurance
cd ../frontend
npm run lint       # ESLint 0 errors / 0 warnings
npm run build      # Compiles 31 static & SSG routes successfully
```

---

## 📝 9. Project Maintenance & Documentation Policy

Whenever new features, bug fixes, or architectural adjustments are added to this repository:
1. Update `README.md` to reflect new endpoints, environment flags, and operational procedures.
2. Verify all TypeScript types in `frontend/src/lib/api.ts`.
3. Verify ESLint and production builds (`npm run lint && npm run build`).

---

**© 2026 Apex Legal Counsel LLP. Built with Next.js 15 & Laravel 11.**
