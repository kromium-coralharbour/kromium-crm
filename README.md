# Kromium CRM

Agency CRM for Kromium Digital. Built with Next.js 14, Supabase, and Vercel.

## Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Email**: Resend
- **PDF**: @react-pdf/renderer
- **Deployment**: Vercel

## Setup

### 1. Database
Run `supabase-schema.sql` in your Supabase SQL Editor.

### 2. Environment Variables
Copy `.env.example` to `.env.local` and fill in your values:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
NOTIFICATION_EMAIL=hello@kromiumdigital.com
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

### 3. Create First User
In Supabase → Authentication → Users → Invite user.
Then set yourself as admin:
```sql
update profiles set role = 'admin' where email = 'your@email.com';
```

### 4. Deploy
Push to GitHub. Connect to Vercel. Add environment variables in Vercel project settings.

## Pages
- `/dashboard` — KPIs, hot lead alerts, tasks, revenue chart
- `/enquiries` — Lead list with scoring and filtering
- `/enquiries/[id]` — Lead detail, score breakdown, tasks, notes, convert to client
- `/pipeline` — Kanban pipeline board
- `/tasks` — Unified task management
- `/clients` — Client database
- `/clients/[id]` — Client detail with projects and revenue
- `/projects` — Project grid
- `/projects/[id]` — Project detail with interactive task timeline
- `/proposals` — Proposal list
- `/proposals/[id]` — Proposal editor with PDF download
- `/revenue` — Revenue tracking
- `/nurture` — Cold lead sequences
- `/attribution` — Source and form analytics
- `/notifications` — All alerts
- `/team` — Team management (admin only)
- `/settings` — Pipeline stages, task templates, notifications (admin only)

## API Routes
- `POST /api/leads` — Receives form submissions, scores lead, saves to DB, sends email, creates tasks
- `GET /api/proposals/[id]/pdf` — Generates branded PDF for download

## Connecting Website Forms
Replace the submit handler in each HTML form file with:
```javascript
const res = await fetch('https://your-crm.vercel.app/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
})
const { lead_id, score, tier } = await res.json()
```
