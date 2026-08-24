<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Apex Legal Counsel | Backend Core API</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        :root {
            --bg-body: #000000;
            --bg-container: #00122E;
            --bg-card: #001C4A;
            --bg-badge: #001C4A;
            --text-primary: #FFFFFF;
            --text-secondary: #E2E8F0;
            --text-accent: #DC143C;
            --border-primary: rgba(0, 56, 147, 0.6);
            --border-card: rgba(0, 56, 147, 0.4);
            --code-bg: #000000;
        }

        body.light-theme {
            /* Light mode: clean white and light neutral backgrounds, no blue or black section backgrounds */
            --bg-body: #FFFFFF;
            --bg-container: #F8FAFC;
            --bg-card: #FFFFFF;
            --bg-badge: #F1F5F9;
            --text-primary: #000000;
            --text-secondary: #1E293B;
            --text-accent: #DC143C;
            --border-primary: rgba(0, 56, 147, 0.2);
            --border-card: rgba(0, 56, 147, 0.15);
            --code-bg: #F8FAFC;
        }

        body {
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--bg-body);
            color: var(--text-secondary);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 40px 24px;
            width: 100%;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 24px;
            border-bottom: 1px solid var(--border-primary);
            margin-bottom: 40px;
            flex-wrap: wrap;
            gap: 16px;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 14px;
        }
        .brand-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: #003893;
            border: 1px solid #DC143C;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 22px;
        }
        .brand-text h1 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
            color: var(--text-primary);
        }
        .brand-text span {
            color: var(--text-accent);
            font-weight: 300;
        }
        .brand-sub {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--text-accent);
            font-weight: 700;
            display: block;
        }
        .header-controls {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .theme-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 7px 16px;
            border-radius: 10px;
            background-color: var(--bg-badge);
            border: 1px solid var(--border-primary);
            color: var(--text-accent);
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .theme-btn:hover {
            filter: brightness(1.1);
            transform: translateY(-1px);
        }
        .badge-live {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 7px 14px;
            border-radius: 9999px;
            background-color: rgba(0, 56, 147, 0.12);
            border: 1px solid rgba(0, 56, 147, 0.4);
            color: var(--text-primary);
            font-size: 12px;
            font-weight: 700;
        }
        .pulse-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #DC143C;
            box-shadow: 0 0 8px #DC143C;
        }
        .hero {
            background: var(--bg-container);
            border: 1px solid var(--border-primary);
            border-radius: 24px;
            padding: 48px;
            margin-bottom: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .hero h2 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 36px;
            color: var(--text-primary);
            margin-bottom: 12px;
        }
        .hero p {
            color: var(--text-secondary);
            font-size: 15px;
            line-height: 1.6;
            max-width: 680px;
            margin-bottom: 32px;
        }
        .cta-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 14px 28px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.2s ease;
            cursor: pointer;
        }
        /* Button with red background ALWAYS has white text */
        .btn-primary {
            background: #DC143C !important;
            color: #FFFFFF !important;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 25px rgba(220, 20, 60, 0.25);
        }
        .btn-primary:hover {
            background: #B00E2F !important;
            color: #FFFFFF !important;
            transform: translateY(-2px);
        }
        .btn-secondary {
            background: #003893;
            color: #FFFFFF !important;
            border: 1px solid #003893;
        }
        .btn-secondary:hover {
            background: #DC143C;
            color: #FFFFFF !important;
            transform: translateY(-2px);
        }
        .btn-ghost {
            background: transparent;
            color: var(--text-secondary);
            border: 1px solid var(--border-card);
        }
        .btn-ghost:hover {
            color: var(--text-primary);
            border-color: #DC143C;
        }
        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .card {
            background: var(--bg-card);
            border: 1px solid var(--border-card);
            border-radius: 16px;
            padding: 24px;
            transition: all 0.2s ease;
        }
        .card:hover {
            border-color: #DC143C;
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 56, 147, 0.12);
        }
        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
        }
        .card-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 18px;
            font-weight: 700;
            color: var(--text-primary);
        }
        .card-method {
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
            text-transform: uppercase;
        }
        .method-get { background: rgba(0, 56, 147, 0.2); color: #003893; border: 1px solid rgba(0, 56, 147, 0.4); }
        .method-post { background: rgba(220, 20, 60, 0.2); color: #DC143C; border: 1px solid rgba(220, 20, 60, 0.4); }
        body:not(.light-theme) .method-get { color: #FFFFFF; }
        body:not(.light-theme) .method-post { color: #FFFFFF; }
        .card-url {
            font-family: monospace;
            font-size: 12px;
            color: var(--text-accent);
            background: var(--code-bg);
            padding: 8px 12px;
            border-radius: 8px;
            margin-bottom: 10px;
            display: block;
            text-decoration: none;
            overflow-x: auto;
            border: 1px solid var(--border-card);
            font-weight: 700;
        }
        .card-url:hover { text-decoration: underline; }
        .card-desc {
            font-size: 12px;
            color: var(--text-secondary);
            line-height: 1.5;
        }
        footer {
            border-top: 1px solid var(--border-card);
            padding: 24px 0;
            text-align: center;
            font-size: 12px;
            color: #64748B;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <div class="brand">
                <div class="brand-icon">⚖</div>
                <div class="brand-text">
                    <h1>APEX <span>LEGAL</span></h1>
                    <span class="brand-sub">Laravel 11 REST API Engine</span>
                </div>
            </div>
            <div class="header-controls">
                <button id="themeToggle" class="theme-btn" type="button" aria-label="Toggle Theme">
                    <span id="themeIcon">☀️</span>
                    <span id="themeText">Light Mode</span>
                </button>
                <div class="badge-live">
                    <span class="pulse-dot"></span>
                    <span>API Status: Online (Port 8000)</span>
                </div>
            </div>
        </header>

        <!-- Main Action Hero -->
        <div class="hero">
            <h2>Headless Law Firm Core Backend</h2>
            <p>
                The high-performance Laravel 11 API engine for Apex Legal Counsel LLP. Powers decoupled Next.js 15 frontend applications, Sanctum bearer authentication, and enterprise CRM operations.
            </p>
            <div class="cta-grid">
                <!-- 1. Direct Public Website Link -->
                <a href="http://localhost:3001/" target="_blank" class="btn btn-primary">
                    <span>🌐 Launch Public Firm Website (Port 3001)</span>
                </a>
                <a href="http://localhost:3000/" target="_blank" class="btn btn-ghost">
                    <span>🌐 Public Site (Port 3000)</span>
                </a>
                <!-- 2. Direct Admin Dashboard Link -->
                <a href="http://localhost:3001/admin" target="_blank" class="btn btn-secondary">
                    <span>🛡️ Open CMS Admin Dashboard</span>
                </a>
            </div>
        </div>

        <!-- Endpoints Grid -->
        <div class="cards">
            <div class="card">
                <div class="card-header">
                    <span class="card-title">Firm Intelligence Stats</span>
                    <span class="card-method method-get">GET</span>
                </div>
                <a href="/api/v1/stats" target="_blank" class="card-url">/api/v1/stats</a>
                <p class="card-desc">Returns aggregate recoveries ($250M+), trial win rates, and years of experience.</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Practice Disciplines</span>
                    <span class="card-method method-get">GET</span>
                </div>
                <a href="/api/v1/practice-areas" target="_blank" class="card-url">/api/v1/practice-areas</a>
                <p class="card-desc">Delivers legal practice hierarchies, parent-child disciplines, and lead attorneys.</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Distinguished Attorneys</span>
                    <span class="card-method method-get">GET</span>
                </div>
                <a href="/api/v1/attorneys" target="_blank" class="card-url">/api/v1/attorneys</a>
                <p class="card-desc">Delivers partner bios, bar admissions, Ivy League credentials, and contact endpoints.</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Landmark Verdicts</span>
                    <span class="card-method method-get">GET</span>
                </div>
                <a href="/api/v1/case-results" target="_blank" class="card-url">/api/v1/case-results</a>
                <p class="card-desc">Case settlement amounts, litigation categories, and trial counsel history.</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Consultation Intake</span>
                    <span class="card-method method-post">POST</span>
                </div>
                <span class="card-url">/api/v1/consultations</span>
                <p class="card-desc">Direct retainer inquiry intake endpoint with rate-limited submission protection.</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Admin Sanctum Auth</span>
                    <span class="card-method method-post">POST</span>
                </div>
                <span class="card-url">/api/v1/admin/login</span>
                <p class="card-desc">Issues Sanctum bearer tokens for authorized firm administrators.</p>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer>
        <p>© {{ date('Y') }} Apex Legal Counsel LLP • Laravel v{{ Illuminate\Foundation\Application::VERSION }} (PHP v{{ PHP_VERSION }})</p>
    </footer>

    <script>
        (function() {
            const toggle = document.getElementById('themeToggle');
            const themeIcon = document.getElementById('themeIcon');
            const themeText = document.getElementById('themeText');
            
            function setTheme(isLight) {
                if (isLight) {
                    document.body.classList.add('light-theme');
                    themeIcon.textContent = '🌙';
                    themeText.textContent = 'Dark Mode';
                    localStorage.setItem('apex_theme', 'light');
                } else {
                    document.body.classList.remove('light-theme');
                    themeIcon.textContent = '☀️';
                    themeText.textContent = 'Light Mode';
                    localStorage.setItem('apex_theme', 'dark');
                }
            }

            const stored = localStorage.getItem('apex_theme');
            if (stored === 'light') {
                setTheme(true);
            }

            toggle.addEventListener('click', function() {
                const isLight = document.body.classList.contains('light-theme');
                setTheme(!isLight);
            });
        })();
    </script>
</body>
</html>
