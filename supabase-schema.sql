-- ── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Profiles (extends auth.users) ────────────────────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text not null,
  role        text not null default 'manager' check (role in ('admin','manager','executive')),
  avatar_url  text,
  created_at  timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "Users can view all profiles" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admin can manage profiles" on profiles for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ── Leads ────────────────────────────────────────────────────────────────────
create table if not exists leads (
  id                uuid primary key default uuid_generate_v4(),
  created_at        timestamptz not null default now(),
  first_name        text not null,
  last_name         text not null,
  email             text not null,
  phone             text,
  company           text,
  country           text,
  industry          text,
  website           text,
  social_instagram  text,
  social_facebook   text,
  social_linkedin   text,
  social_other      text,
  referral_source   text,
  form_type         text not null,
  lead_score        integer not null default 0,
  lead_tier         text not null default 'cold' check (lead_tier in ('hot','warm','cold','unqualified')),
  status            text not null default 'new' check (status in ('new','contacted','proposal_sent','negotiating','won','lost','nurturing')),
  assigned_to       uuid references profiles(id),
  form_data         jsonb not null default '{}',
  score_breakdown   jsonb not null default '{}',
  email_sent        boolean not null default false,
  updated_at        timestamptz not null default now()
);

alter table leads enable row level security;
create policy "Authenticated users can view leads" on leads for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert leads" on leads for insert with check (true);
create policy "Authenticated users can update leads" on leads for update using (auth.role() = 'authenticated');

create index if not exists leads_tier_idx     on leads(lead_tier);
create index if not exists leads_status_idx   on leads(status);
create index if not exists leads_created_idx  on leads(created_at desc);

-- ── Clients ──────────────────────────────────────────────────────────────────
create table if not exists clients (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  lead_id         uuid references leads(id),
  company_name    text not null,
  contact_name    text not null,
  email           text not null,
  phone           text,
  country         text,
  industry        text,
  website         text,
  social_instagram text,
  social_linkedin  text,
  notes           text,
  lifetime_value  numeric not null default 0,
  active          boolean not null default true,
  updated_at      timestamptz not null default now()
);

alter table clients enable row level security;
create policy "Authenticated users can manage clients" on clients for all using (auth.role() = 'authenticated');

-- ── Projects ─────────────────────────────────────────────────────────────────
create table if not exists projects (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  client_id   uuid not null references clients(id) on delete cascade,
  name        text not null,
  type        text not null check (type in ('crm','website','brand','marketing','retainer','other')),
  status      text not null default 'scoping' check (status in ('scoping','active','review','complete','paused')),
  description text,
  value       numeric not null default 0,
  start_date  date,
  due_date    date,
  assigned_to uuid references profiles(id),
  progress    integer not null default 0 check (progress >= 0 and progress <= 100),
  updated_at  timestamptz not null default now()
);

alter table projects enable row level security;
create policy "Authenticated users can manage projects" on projects for all using (auth.role() = 'authenticated');

-- ── Project Tasks ─────────────────────────────────────────────────────────────
create table if not exists project_tasks (
  id           uuid primary key default uuid_generate_v4(),
  created_at   timestamptz not null default now(),
  project_id   uuid not null references projects(id) on delete cascade,
  title        text not null,
  description  text,
  status       text not null default 'open' check (status in ('open','in_progress','done','cancelled')),
  assigned_to  uuid references profiles(id),
  due_date     date,
  order_index  integer not null default 0,
  completed_at timestamptz
);

alter table project_tasks enable row level security;
create policy "Authenticated users can manage project_tasks" on project_tasks for all using (auth.role() = 'authenticated');

-- ── Tasks (unified: lead tasks + project tasks) ───────────────────────────────
create table if not exists tasks (
  id             uuid primary key default uuid_generate_v4(),
  created_at     timestamptz not null default now(),
  title          text not null,
  description    text,
  status         text not null default 'open' check (status in ('open','in_progress','done','cancelled')),
  priority       text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  assigned_to    uuid references profiles(id),
  due_date       timestamptz,
  lead_id        uuid references leads(id) on delete cascade,
  project_id     uuid references projects(id) on delete cascade,
  auto_generated boolean not null default false,
  completed_at   timestamptz
);

alter table tasks enable row level security;
create policy "Authenticated users can manage tasks" on tasks for all using (auth.role() = 'authenticated');

create index if not exists tasks_assigned_idx on tasks(assigned_to);
create index if not exists tasks_due_idx      on tasks(due_date);
create index if not exists tasks_status_idx   on tasks(status);

-- ── Notes ────────────────────────────────────────────────────────────────────
create table if not exists notes (
  id         uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  content    text not null,
  author_id  uuid not null references profiles(id),
  lead_id    uuid references leads(id) on delete cascade,
  client_id  uuid references clients(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade
);

alter table notes enable row level security;
create policy "Authenticated users can manage notes" on notes for all using (auth.role() = 'authenticated');

-- ── Proposals ────────────────────────────────────────────────────────────────
create table if not exists proposals (
  id                  uuid primary key default uuid_generate_v4(),
  created_at          timestamptz not null default now(),
  lead_id             uuid references leads(id),
  client_id           uuid references clients(id),
  title               text not null,
  status              text not null default 'draft' check (status in ('draft','sent','negotiating','won','lost')),
  value               numeric not null default 0,
  services            text[] not null default '{}',
  scope               text not null default '',
  deliverables        text not null default '',
  timeline            text not null default '',
  pricing_breakdown   jsonb not null default '[]',
  terms               text not null default '',
  valid_until         date,
  sent_at             timestamptz,
  notes               text,
  updated_at          timestamptz not null default now()
);

alter table proposals enable row level security;
create policy "Authenticated users can manage proposals" on proposals for all using (auth.role() = 'authenticated');

-- ── Nurture ───────────────────────────────────────────────────────────────────
create table if not exists nurture_entries (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  lead_id         uuid not null references leads(id) on delete cascade,
  sequence_type   text not null default '30-day',
  touchpoint      text not null,
  sent_at         timestamptz,
  next_action     text,
  next_due        timestamptz
);

alter table nurture_entries enable row level security;
create policy "Authenticated users can manage nurture_entries" on nurture_entries for all using (auth.role() = 'authenticated');

-- ── Revenue Records ───────────────────────────────────────────────────────────
create table if not exists revenue_records (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  client_id       uuid not null references clients(id) on delete cascade,
  project_id      uuid references projects(id),
  amount          numeric not null,
  description     text not null,
  date            date not null default current_date,
  invoice_number  text,
  paid            boolean not null default false,
  updated_at      timestamptz not null default now()
);

alter table revenue_records enable row level security;
create policy "Authenticated users can manage revenue_records" on revenue_records for all using (auth.role() = 'authenticated');

-- ── Notifications ─────────────────────────────────────────────────────────────
create table if not exists notifications (
  id         uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  user_id    uuid references profiles(id) on delete cascade,
  type       text not null,
  title      text not null,
  body       text not null,
  read       boolean not null default false,
  link       text
);

alter table notifications enable row level security;
create policy "Users can view own notifications" on notifications for select using (user_id = auth.uid() or user_id is null);
create policy "System can insert notifications" on notifications for insert with check (true);
create policy "Users can update own notifications" on notifications for update using (user_id = auth.uid() or user_id is null);

-- ── Updated_at triggers ───────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists leads_updated_at      on leads;
drop trigger if exists clients_updated_at    on clients;
drop trigger if exists projects_updated_at   on projects;
drop trigger if exists proposals_updated_at  on proposals;
drop trigger if exists revenue_updated_at    on revenue_records;

create trigger leads_updated_at      before update on leads           for each row execute function set_updated_at();
create trigger clients_updated_at    before update on clients         for each row execute function set_updated_at();
create trigger projects_updated_at   before update on projects        for each row execute function set_updated_at();
create trigger proposals_updated_at  before update on proposals       for each row execute function set_updated_at();
create trigger revenue_updated_at    before update on revenue_records for each row execute function set_updated_at();

-- ── Profile auto-creation on signup ──────────────────────────────────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'manager')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Project tasks enhancements (run after initial schema) ─────────────────────
alter table project_tasks add column if not exists priority text default 'medium' check (priority in ('low','medium','high','urgent'));
alter table project_tasks add column if not exists section text default 'Tasks';
alter table project_tasks add column if not exists notes text;
