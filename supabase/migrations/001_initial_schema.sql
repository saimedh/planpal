-- ============================================================
-- PlanPal: Initial Database Schema Migration
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. Helper function: auto-update `updated_at` column
-- ────────────────────────────────────────────────────────────
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- ────────────────────────────────────────────────────────────
-- 2. Tables
-- ────────────────────────────────────────────────────────────

-- profiles ───────────────────────────────────────────────────
create table public.profiles (
  id                 uuid        primary key references auth.users(id) on delete cascade,
  full_name          text,
  avatar_url         text,
  preferred_language text        default 'en',
  preferred_currency text        default 'INR',
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

comment on table public.profiles is 'User profile extended from auth.users';

-- events ─────────────────────────────────────────────────────
create table public.events (
  id          uuid          primary key default gen_random_uuid(),
  user_id     uuid          not null references public.profiles(id) on delete cascade,
  title       text          not null,
  type        text          not null check (type in ('wedding','birthday','housewarming','festival','community')),
  date        date,
  guests      int,
  budget      numeric(12,2),
  city        text,
  theme       text,
  plan        jsonb         default '{}',
  share_token text          unique default encode(gen_random_bytes(16), 'hex'),
  created_at  timestamptz   default now(),
  updated_at  timestamptz   default now()
);

comment on table public.events is 'Celebrations planned by users';

-- messages ───────────────────────────────────────────────────
create table public.messages (
  id         uuid        primary key default gen_random_uuid(),
  event_id   uuid        not null references public.events(id) on delete cascade,
  role       text        not null check (role in ('user','assistant')),
  content    text        not null,
  created_at timestamptz default now()
);

comment on table public.messages is 'Chat history between user and AI planner per event';

-- expenses ───────────────────────────────────────────────────
create table public.expenses (
  id         uuid          primary key default gen_random_uuid(),
  event_id   uuid          not null references public.events(id) on delete cascade,
  category   text          not null,
  amount     numeric(12,2) not null,
  note       text,
  spent_on   date          default current_date,
  created_at timestamptz   default now()
);

comment on table public.expenses is 'Actual spend tracking per event';

-- tasks ──────────────────────────────────────────────────────
create table public.tasks (
  id         uuid        primary key default gen_random_uuid(),
  event_id   uuid        not null references public.events(id) on delete cascade,
  title      text        not null,
  due_date   date,
  assignee   text,
  done       boolean     default false,
  reminder   boolean     default false,
  created_at timestamptz default now()
);

comment on table public.tasks is 'Checklist items for event preparation';

-- vendors ────────────────────────────────────────────────────
create table public.vendors (
  id         uuid          primary key default gen_random_uuid(),
  event_id   uuid          not null references public.events(id) on delete cascade,
  type       text          not null,
  name       text,
  phone      text,
  status     text          default 'to_contact' check (status in ('to_contact','quoted','booked','paid')),
  quote      numeric(12,2),
  notes      text,
  created_at timestamptz   default now()
);

comment on table public.vendors is 'Vendor contacts and booking status per event';

-- ────────────────────────────────────────────────────────────
-- 3. Indexes
-- ────────────────────────────────────────────────────────────
create index idx_events_user_id      on public.events   (user_id);
create index idx_events_share_token  on public.events   (share_token);
create index idx_messages_event_time on public.messages  (event_id, created_at);
create index idx_expenses_event_id   on public.expenses  (event_id);
create index idx_tasks_event_id      on public.tasks     (event_id);
create index idx_vendors_event_id    on public.vendors   (event_id);

-- ────────────────────────────────────────────────────────────
-- 4. updated_at triggers
-- ────────────────────────────────────────────────────────────
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger trg_events_updated_at
  before update on public.events
  for each row execute function public.update_updated_at();

-- ────────────────────────────────────────────────────────────
-- 5. Auto-create profile on signup
-- ────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 6. Row Level Security
-- ────────────────────────────────────────────────────────────

-- profiles ───────────────────────────────────────────────────
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- events ─────────────────────────────────────────────────────
alter table public.events enable row level security;

create policy "Users can view own events"
  on public.events for select
  using (auth.uid() = user_id);

create policy "Users can insert own events"
  on public.events for insert
  with check (auth.uid() = user_id);

create policy "Users can update own events"
  on public.events for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own events"
  on public.events for delete
  using (auth.uid() = user_id);

-- messages ───────────────────────────────────────────────────
alter table public.messages enable row level security;

create policy "Users can view own event messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.events
      where events.id = messages.event_id
        and events.user_id = auth.uid()
    )
  );

create policy "Users can insert own event messages"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.events
      where events.id = messages.event_id
        and events.user_id = auth.uid()
    )
  );

create policy "Users can update own event messages"
  on public.messages for update
  using (
    exists (
      select 1 from public.events
      where events.id = messages.event_id
        and events.user_id = auth.uid()
    )
  );

create policy "Users can delete own event messages"
  on public.messages for delete
  using (
    exists (
      select 1 from public.events
      where events.id = messages.event_id
        and events.user_id = auth.uid()
    )
  );

-- expenses ───────────────────────────────────────────────────
alter table public.expenses enable row level security;

create policy "Users can view own event expenses"
  on public.expenses for select
  using (
    exists (
      select 1 from public.events
      where events.id = expenses.event_id
        and events.user_id = auth.uid()
    )
  );

create policy "Users can insert own event expenses"
  on public.expenses for insert
  with check (
    exists (
      select 1 from public.events
      where events.id = expenses.event_id
        and events.user_id = auth.uid()
    )
  );

create policy "Users can update own event expenses"
  on public.expenses for update
  using (
    exists (
      select 1 from public.events
      where events.id = expenses.event_id
        and events.user_id = auth.uid()
    )
  );

create policy "Users can delete own event expenses"
  on public.expenses for delete
  using (
    exists (
      select 1 from public.events
      where events.id = expenses.event_id
        and events.user_id = auth.uid()
    )
  );

-- tasks ──────────────────────────────────────────────────────
alter table public.tasks enable row level security;

create policy "Users can view own event tasks"
  on public.tasks for select
  using (
    exists (
      select 1 from public.events
      where events.id = tasks.event_id
        and events.user_id = auth.uid()
    )
  );

create policy "Users can insert own event tasks"
  on public.tasks for insert
  with check (
    exists (
      select 1 from public.events
      where events.id = tasks.event_id
        and events.user_id = auth.uid()
    )
  );

create policy "Users can update own event tasks"
  on public.tasks for update
  using (
    exists (
      select 1 from public.events
      where events.id = tasks.event_id
        and events.user_id = auth.uid()
    )
  );

create policy "Users can delete own event tasks"
  on public.tasks for delete
  using (
    exists (
      select 1 from public.events
      where events.id = tasks.event_id
        and events.user_id = auth.uid()
    )
  );

-- vendors ────────────────────────────────────────────────────
alter table public.vendors enable row level security;

create policy "Users can view own event vendors"
  on public.vendors for select
  using (
    exists (
      select 1 from public.events
      where events.id = vendors.event_id
        and events.user_id = auth.uid()
    )
  );

create policy "Users can insert own event vendors"
  on public.vendors for insert
  with check (
    exists (
      select 1 from public.events
      where events.id = vendors.event_id
        and events.user_id = auth.uid()
    )
  );

create policy "Users can update own event vendors"
  on public.vendors for update
  using (
    exists (
      select 1 from public.events
      where events.id = vendors.event_id
        and events.user_id = auth.uid()
    )
  );

create policy "Users can delete own event vendors"
  on public.vendors for delete
  using (
    exists (
      select 1 from public.events
      where events.id = vendors.event_id
        and events.user_id = auth.uid()
    )
  );
