# 📚 Apex Legal Counsel LLP — Comprehensive Technical & Architectural Documentation

This document serves as the in-depth technical manual for the **Apex Legal Counsel LLP** decoupled web platform and operations center.

---

## 1. System Philosophy & Decoupled Architecture

The platform is designed around strict separation of concerns:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js 15)                             │
│                                                                             │
│  ┌─────────────────────────────────┐   ┌─────────────────────────────────┐  │
│  │   (public) Route Group          │   │      admin Route Group          │  │
│  │   • Public firm layout          │   │      • Bespoke Operations Shell │  │
│  │   • SEO & JSON-LD metadata      │   │      • Sanctum Auth Guard       │  │
│  │   • Dynamic SSR / SSG routes    │   │      • Live Leads Triage CRM    │  │
│  │   • Firm branding & hotline     │   │      • Partner Directory CRUD   │  │
│  └────────────────┬────────────────┘   └────────────────┬────────────────┘  │
└───────────────────┼─────────────────────────────────────┼───────────────────┘
                    │                                     │
                    │ HTTP REST (JSON)                    │ HTTP REST + Bearer Token
                    │                                     │
┌───────────────────▼─────────────────────────────────────▼───────────────────┐
│                           BACKEND (Laravel 11 API)                          │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                       API Routing & Middleware Layer                   │  │
│  │  • CORS Handler (Multi-Port Allowed: 3000, 3001, 3002)                │  │
│  │  • CSRF Exemption for Stateless /api/* routes                         │  │
│  │  • Sanctum auth:sanctum Token Guard for /api/v1/admin/*               │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                       │
│  ┌───────────────────────────────────▼───────────────────────────────────┐  │
│  │                 Controllers, Requests & JsonResources                 │  │
│  │  • StoreConsultationRequest (Validation rules)                        │  │
│  │  • ConsultationLeadResource, AttorneyResource, PracticeAreaResource   │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                       │
│  ┌───────────────────────────────────▼───────────────────────────────────┐  │
│  │                         Eloquent ORM & Models                         │  │
│  │  • Attorney (BelongsToMany PracticeArea, HasMany CaseResult)          │  │
│  │  • PracticeArea (HasMany Children, BelongsTo Parent, HasMany Cases)   │  │
│  │  • ConsultationLead (Audit logs & status state machine)               │  │
│  │  • CaseResult (BelongsTo PracticeArea, BelongsTo LeadAttorney)        │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │
                                       ▼
                     ┌──────────────────────────────────┐
                     │          MySQL Database          │
                     │          (database: law_firm)    │
                     └──────────────────────────────────┘
```

---

## 2. Database Schema & Data Models

### Table: `users` (Administrators)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Administrator ID |
| `name` | VARCHAR(255) | NOT NULL | Admin full name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Admin email login |
| `password` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `role` | VARCHAR(50) | DEFAULT 'admin' | Role level |

---

### Table: `practice_areas` (Legal Disciplines)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Practice Area ID |
| `title` | VARCHAR(255) | NOT NULL | Discipline title |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | URL slug (e.g. `corporate-law-mergers`) |
| `short_summary` | TEXT | NULLABLE | Teaser description |
| `full_description`| LONGTEXT | NOT NULL | Comprehensive practice overview |
| `key_services` | JSON | NULLABLE | Array of specialty service items |
| `icon` | VARCHAR(100) | NULLABLE | Lucide icon identifier |
| `is_featured` | BOOLEAN | DEFAULT FALSE | Highlighted on homepage |
| `parent_id` | BIGINT UNSIGNED | FK -> `practice_areas.id` | Hierarchical parent for sub-specialties |
| `sort_order` | INT | DEFAULT 0 | Display ordering |

---

### Table: `attorneys` (Partners & Litigators)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Attorney ID |
| `name` | VARCHAR(255) | NOT NULL | Attorney full legal name |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | URL slug (e.g. `jonathan-sterling`) |
| `designation` | VARCHAR(255) | NOT NULL | Title (e.g. `Founding Partner`) |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Direct contact email |
| `phone` | VARCHAR(50) | NULLABLE | Direct telephone number |
| `bio` | LONGTEXT | NOT NULL | Professional biography |
| `photo_url` | VARCHAR(500) | NULLABLE | Portrait headshot asset URL |
| `bar_admissions` | JSON | NULLABLE | Array of jurisdictions admitted |
| `education` | JSON | NULLABLE | Array of law school & degree credentials |
| `sort_order` | INT | DEFAULT 0 | Priority ranking |

---

### Table: `attorney_practice_area` (Pivot Table)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `attorney_id` | BIGINT UNSIGNED | FK -> `attorneys.id`, CASCADE | Attorney reference |
| `practice_area_id`| BIGINT UNSIGNED | FK -> `practice_areas.id`, CASCADE| Practice discipline reference |

---

### Table: `case_results` (Landmark Verdicts & Recoveries)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Case Result ID |
| `title` | VARCHAR(255) | NOT NULL | Case / Matter title |
| `settlement_verdict`| VARCHAR(100) | NOT NULL | Monetary recovery (e.g. `$42,500,000 Verdict`) |
| `summary` | TEXT | NOT NULL | Case overview and trial narrative |
| `case_year` | INT | NOT NULL | Year resolved |
| `is_featured` | BOOLEAN | DEFAULT FALSE | Displayed on homepage |
| `practice_area_id`| BIGINT UNSIGNED | FK -> `practice_areas.id` | Associated practice discipline |
| `lead_attorney_id`| BIGINT UNSIGNED | FK -> `attorneys.id` | Lead trial partner |

---

### Table: `consultation_leads` (Inbound CRM Pipeline)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Lead ID |
| `full_name` | VARCHAR(255) | NOT NULL | Prospective client name |
| `email` | VARCHAR(255) | NOT NULL | Contact email |
| `phone` | VARCHAR(50) | NOT NULL | Phone number |
| `case_details` | LONGTEXT | NOT NULL | Client matter description |
| `status` | ENUM | `pending`, `reviewed`, `contacted`, `converted`, `rejected` | CRM Pipeline State |
| `practice_area_id`| BIGINT UNSIGNED | FK -> `practice_areas.id` | Requested legal discipline |
| `source` | VARCHAR(100) | DEFAULT 'website' | Referral / Landing source |
| `notes` | TEXT | NULLABLE | Confidential partner intake notes |

---

## 3. CRM Lead Status State Machine

```
               ┌─────────────┐
               │   PENDING   │ (Initial Intake via Form)
               └──────┬──────┘
                      │
                      ├──────────────────────────┐
                      ▼                          ▼
               ┌─────────────┐            ┌─────────────┐
               │  REVIEWED   │            │  REJECTED   │ (Out of jurisdiction/scope)
               └──────┬──────┘            └─────────────┘
                      │
                      ▼
               ┌─────────────┐
               │  CONTACTED  │ (Initial Client Interview scheduled)
               └──────┬──────┘
                      │
                      ▼
               ┌─────────────┐
               │  CONVERTED  │ (Formal Retainer Agreement Executed)
               └─────────────┘
```

---

## 4. Frontend Route Groups & Layout Segregation

```
frontend/src/app/
├── layout.tsx                     # <html> & <body> Shell with Flash-Free Theme Hydration
│
├── (public)/                      # 🌐 PUBLIC LAW FIRM PAGES
│   ├── layout.tsx                 # Public Layout: Firm Navbar + Hotline + Footer + JSON-LD
│   ├── page.tsx                   # Homepage (Hero, $250M+ Stats, Leaders, Verdicts, Intake)
│   ├── practice-areas/
│   │   ├── page.tsx               # All 8 Practice Disciplines Directory
│   │   └── [slug]/page.tsx        # Dynamic Practice Discipline with sub-specialties & counsel
│   ├── attorneys/
│   │   ├── page.tsx               # Distinguished Attorneys Directory & Filter by Practice
│   │   └── [slug]/page.tsx        # Attorney Bio, Bar Admissions, Education, and Cases
│   ├── case-results/page.tsx      # Landmark Verdicts History & Filter by Year/Practice
│   └── contact/page.tsx           # Contact Office & Confidential Case Evaluation Intake Form
│
└── admin/                         # 🛡️ CMS OPERATIONS CENTER
    ├── layout.tsx                 # Standalone Admin Shell (Sidebar, Topbar, Sanctum Auth Guard)
    ├── login/page.tsx             # 1-Click Fast Administrative Login
    ├── page.tsx                   # Live Firm Analytics KPIs & Triage Stream
    ├── leads/page.tsx             # Leads CRM Pipeline (Filter, Search, Status Update, Notes)
    ├── attorneys/page.tsx         # Attorney Profiles CRUD & Pivot Sync
    ├── practice-areas/page.tsx    # Practice Disciplines & Hierarchies CMS
    ├── case-results/page.tsx      # Verdicts & Settlements CMS
    └── settings/page.tsx          # System Telemetry, Health, and Token Inspection
```

---

## 5. Security & Authentication Architecture

1. **Sanctum Bearer Tokens**:
   - Token issued upon `POST /api/v1/admin/login` with personal access token expiration.
   - Frontend stores token in `sessionStorage` and `localStorage ('admin_token')`.
   - All admin requests transmit `Authorization: Bearer <token>`.

2. **CORS & Multi-Port Whitelisting**:
   - `backend/config/cors.php` accepts requests from `http://localhost:3000`, `http://localhost:3001`, `http://localhost:3002`, and `http://127.0.0.1:*`.
   - Supports parallel frontend development environments seamlessly.

3. **CSRF Exemption for Stateless API**:
   - `backend/bootstrap/app.php` validates that stateless API endpoints (`api/*`) bypass session cookie CSRF requirements, eliminating `419 CSRF mismatch` errors.

4. **Input Sanitization & Server-side Validation**:
   - `StoreConsultationRequest` enforces strict email formats, required phone numbers, minimum detail lengths, and foreign key verification.

---

## 6. Luxury Dark / Light Theme Tokens

| Token | Dark Mode (Prestige) | Light Mode (Editorial) |
| :--- | :--- | :--- |
| **`--bg-primary`** | `#0A192F` (Deep Navy) | `#F8FAFC` (Ivory Alabaster) |
| **`--bg-secondary`** | `#0B192C` (Navy Surface) | `#FFFFFF` (Pure White) |
| **`--bg-surface`** | `#060D17` (Darkest Navy) | `#F1F5F9` (Slate Tint) |
| **`--text-primary`** | `#F8FAFC` (Pure White) | `#0F172A` (Midnight Slate) |
| **`--text-secondary`** | `#CBD5E1` (Light Slate) | `#334155` (Deep Slate) |
| **`--text-muted`** | `#94A3B8` (Muted Slate) | `#64748B` (Neutral Slate) |
| **`--gold-primary`** | `#C5A880` (Warm Legal Gold) | `#9F8259` (Deep Rich Gold) |
| **`--gold-light`** | `#DFC7A5` (Champagne Gold) | `#856E4D` (Burnished Gold) |

---

**Apex Legal Counsel LLP Documentation — Maintained autonomously with every project build.**
