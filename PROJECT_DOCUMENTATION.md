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
│  │   • Nepal Flag Blue/Red Palette │   │      • Playfair & Roboto Fonts  │  │
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

### Table: `practice_areas` (Legal Disciplines)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Practice discipline ID |
| `parent_id` | BIGINT UNSIGNED | NULLABLE, FK -> `practice_areas(id)` | Hierarchy parent |
| `title` | VARCHAR(255) | NOT NULL | Discipline title |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | SEO URL slug |
| `icon` | VARCHAR(100) | DEFAULT 'Scale' | Lucide icon identifier |
| `short_summary` | VARCHAR(500) | NOT NULL | Card overview text |
| `description` | LONGTEXT | NOT NULL | Comprehensive practice details |
| `is_featured` | BOOLEAN | DEFAULT FALSE | Highlighted on homepage |

### Table: `attorneys` (Counsel & Partners)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Attorney profile ID |
| `name` | VARCHAR(255) | NOT NULL | Attorney full legal name |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | SEO biographical URL slug |
| `designation` | VARCHAR(255) | NOT NULL | E.g. Senior Partner |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Direct contact email |
| `phone` | VARCHAR(50) | NULLABLE | Direct phone extension |
| `photo_url` | VARCHAR(500) | NULLABLE | Headshot asset link |
| `bio` | LONGTEXT | NOT NULL | Full career biography |
| `bar_admissions` | JSON | NULLABLE | Array of state/federal bar licenses |
| `education` | JSON | NULLABLE | Array of law school degrees & honors |
| `is_active` | BOOLEAN | DEFAULT TRUE | Display status flag |

### Table: `attorney_practice_area` (Pivot Table)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Pivot record ID |
| `attorney_id` | BIGINT UNSIGNED | FK -> `attorneys(id)` ON DELETE CASCADE | Attorney link |
| `practice_area_id`| BIGINT UNSIGNED | FK -> `practice_areas(id)` ON DELETE CASCADE| Discipline link |

### Table: `case_results` (Verdicts & Recoveries)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Verdict ID |
| `practice_area_id`| BIGINT UNSIGNED | FK -> `practice_areas(id)` | Associated discipline |
| `lead_attorney_id`| BIGINT UNSIGNED | FK -> `attorneys(id)` | Lead trial litigator |
| `title` | VARCHAR(255) | NOT NULL | Case / matter title |
| `settlement_verdict`| VARCHAR(255)| NOT NULL | E.g. "$14,250,000 Verdict" |
| `summary` | TEXT | NOT NULL | Brief resolution summary |
| `case_year` | INT | NOT NULL | Year verdict concluded |

### Table: `consultation_leads` (Inbound CRM Inquiries)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Intake record ID |
| `practice_area_id`| BIGINT UNSIGNED | NULLABLE, FK -> `practice_areas(id)` | Requested practice |
| `full_name` | VARCHAR(255) | NOT NULL | Client full legal name |
| `email` | VARCHAR(255) | NOT NULL | Client email |
| `phone` | VARCHAR(50) | NOT NULL | Client direct phone |
| `case_details` | TEXT | NOT NULL | Privileged case statement |
| `status` | VARCHAR(50) | DEFAULT 'pending' | State: pending/contacted/scheduled/closed |
| `source` | VARCHAR(100) | DEFAULT 'website' | Intake source |

---

## 3. CRM Lead State Machine

```
   [Prospective Client Inbound Form Submission]
                        │
                        ▼
                 ┌─────────────┐
                 │   PENDING   │ (New intake file created, awaiting review)
                 └──────┬──────┘
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
  ┌─────────────┐               ┌─────────────┐
  │  CONTACTED  │               │   CLOSED    │ (Not suitable / conflict of interest)
  └──────┬──────┘               └─────────────┘
         │
         ▼
  ┌─────────────┐
  │  SCHEDULED  │ (Formal partner retainer conference booked)
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │   CLOSED    │ (Retained as client / engagement complete)
  └─────────────┘
```

---

## 4. Frontend Route Architecture (Segregated Route Groups)

```
src/app/
├── layout.tsx                     # Global HTML Document Shell (Playfair & Roboto Font Variables)
├── globals.css                    # Nepal Flag Strict Design System Tokens
│
├── (public)/                      # 🌐 PUBLIC FIRM WEBSITE (Route Group)
│   ├── layout.tsx                 # Public Layout (Navbar with 24/7 Hotline + Footer + JSON-LD)
│   ├── page.tsx                   # Public Homepage ($250M+ Hero, Practices, Partners, Verdicts)
│   ├── practice-areas/
│   │   ├── page.tsx               # All Practice Groups Directory
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

## 6. Official Design System & Typography Tokens

| Token | Dark Mode (Prestige Dark) | Light Mode (Editorial Light) | Role |
| :--- | :--- | :--- | :--- |
| **`--font-serif`** | `Playfair Display` | `Playfair Display` | Editorial authority on all headings (`h1`-`h6`) |
| **`--font-sans`** | `Roboto` | `Roboto` | Crystal-clear typography for all body, cards, tables, forms |
| **`--nepal-blue`** | `#003893` | `#003893` | Official Nepal Flag Royal Blue (Primary Brand) |
| **`--nepal-red`** | `#DC143C` | `#DC143C` | Official Nepal Flag Crimson Red (Secondary / Accent) |
| **`--bg-primary`** | `#000000` (Pure Black) | `#FFFFFF` (Pure White) | Main viewport canvas |
| **`--bg-secondary`**| `#00122E` (Deep Nepal Navy) | `#F4F7FC` (Ice Blue Tint) | Hero, section, and card backgrounds |
| **`--bg-surface`** | `#001C4A` (Surface Navy) | `#E6EEFA` (Subtle Ice) | Interactive widgets and dropdown cards |
| **`--text-primary`**| `#FFFFFF` (Pure White) | `#000000` (Pure Black) | High contrast readability |
| **`--text-secondary`**| `#E2E8F0` (Off-white) | `#001F54` (Nepal Deep Navy) | Sub-headings and descriptions |
| **`--border-blue`**| `rgba(0, 56, 147, 0.5)` | `rgba(0, 56, 147, 0.35)` | Structural grid dividers |
| **`--border-red`** | `rgba(220, 20, 60, 0.5)` | `rgba(220, 20, 60, 0.35)` | Focus rings, alert borders & highlights |

---

**Apex Legal Counsel LLP Documentation — Maintained autonomously with every project build.**
