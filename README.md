# PlanPal — Conversational AI Event Planner for Indian Celebrations

> **Plan grand celebrations in minutes, just by chatting.**  
> PlanPal is a full-stack web application designed specifically for Indian hosts organizing weddings, milestone birthdays, housewarmings (Griha Pravesh), festivals, and community gatherings.

---

## 🌟 Key Features

- **Conversational Planning**: Chat naturally (e.g. *"Plan my sister's 30th birthday, 40 guests, ₹80,000 budget, Hyderabad"*). Voice mic input supported via Web Speech API.
- **Live 40/60 Adaptive Workspace**: Chat panel on the left (40%) and live plan on the right (60%). Modified sections highlight in real time with an "Updated" badge.
- **Realistic Indian Budgets**: Accurate city-wise vendor pricing (Hyderabad, Mumbai, Delhi, Bengaluru, Chennai) across venue, food, decor, photography, entertainment, cake, and misc. Always balances exactly to 100% of the total budget.
- **Budget Donut Chart & Ledger**: Interactive Recharts donut visualization, per-category planned vs actual progress bars, overspend alerts, and AI savings tips.
- **Backward-Planned Timeline**: Automatically calculates milestones leading to the event date. Checkable tasks, assignees, reminder toggles, and toggleable List & Calendar views.
- **Vendor Tracker & Kanban**: Categorized vendor checklist (`To Contact`, `Quoted`, `Booked`, `Paid`). One-click **"Draft WhatsApp Enquiry"** in English, Hindi, or Telugu with a direct `https://wa.me/?text=...` link.
- **Culturally Attuned Menus & Ideas**: Veg, Non-veg, Jain, and Vegan filters, live Chaat & Dosa counter planning, games, memorable surprise elements, and 3-language digital invitation wording (English, हिंदी, తెలుగు).
- **Day-of Run Sheet**: Hour-by-hour operational schedule with vendor contact persons.
- **Read-Only Public Sharing**: Share plans with family and friends via `/share/[token]` with WhatsApp sharing and instant PDF export.
- **Mobile First & PWA**: Installable on Android & iOS as a Progressive Web App (manifest + service worker). On mobile screens (<800px), cleanly stacks into a bottom-tab navigator (Chat / Plan).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router) + TypeScript
- **Styling**: Tailwind CSS with custom Indian festive design tokens (Deep Plum `#1C1530`, Magenta `#C2185B`, Marigold `#F2A900`, Lavender `#FBF9FF`)
- **AI Engine**: Claude API via `@anthropic-ai/sdk` (`claude-sonnet-4-20250514` default), strict JSON output validation via **Zod**
- **Database & Auth**: Supabase Postgres with Row Level Security (RLS), email magic links, and Google OAuth
- **Charts**: Recharts (responsive donut budget chart)
- **PDF Export**: html2pdf.js with fallback to native browser print styling
- **Multilingual Support**: English, हिंदी, and తెలుగు
- **Testing**: Zod schema tests, budget arithmetic sum test, Playwright E2E test suite

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or 20+
- npm or pnpm

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/planpal.git
cd planpal
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials:
```env
# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup (Supabase)
Run the migration in your Supabase SQL Editor:
1. Open `supabase/migrations/001_initial_schema.sql` and run it to create tables (`profiles`, `events`, `messages`, `expenses`, `tasks`, `vendors`) with RLS policies and triggers.
2. (Optional) Run `supabase/seed.sql` to populate a sample birthday event in Hyderabad.

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Tests

### Unit & Schema Tests
Validates all Zod schemas, edge cases, and budget sum rebalancing logic:
```bash
npm test
```

### Type Checking
```bash
npx tsc --noEmit
```

### End-to-End Test (Playwright)
```bash
npm run test:e2e
```

---

## 🚢 Deploying to Render

You can deploy PlanPal to Render as a Node.js Web Service or Docker container with 1 click:

### Option A: Using Render Blueprint (`render.yaml`)
1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com/), click **New +** -> **Blueprint**.
3. Connect your GitHub repository.
4. Render automatically reads `render.yaml`, configures the build command (`npm install && npm run build`) and start command (`npm run start`), and sets the healthcheck to `/api/dev/status`.
5. Enter your environment variables (`ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
6. Click **Apply**. Your app will be live at `https://planpal-xxxx.onrender.com`.

### Option B: Manual Web Service Setup
- **Environment**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`
- **Port**: Automatic (reads `PORT` or defaults to `3000`)
- **Health Check Path**: `/api/dev/status`

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your `planpal` repository.
4. Set the Environment Variables (`ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
5. Click **Deploy**. Vercel will build and serve your production application with global edge caching.

---

## 📱 PWA Mobile Installation

PlanPal includes `manifest.json` and a service worker (`sw.js`).
1. Open the deployed application in Chrome on Android or Safari on iOS.
2. Tap **"Install App"** (or Safari: **"Add to Home Screen"**).
3. PlanPal launches full-screen with offline caching for event details.

---

## 📄 License
MIT License. Built with ❤️ for Indian Celebrations.
