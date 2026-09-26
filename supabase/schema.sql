-- LoanServ lead store — run once in Supabase → SQL Editor.
-- The site writes with the service-role key (server-side only). Row Level
-- Security is on with no policies, so the public anon key can read or write
-- nothing.

create table if not exists public.leads (
  id               bigint generated always as identity primary key,
  created_at       timestamptz not null default now(),
  form             text not null check (form in ('apply', 'chat', 'cibil')),
  full_name        text not null,
  mobile           text not null check (mobile ~ '^[0-9]{10}$'),
  email            text not null,
  category         text,
  loan_type        text,
  amount           numeric,
  city             text,
  employment       text,
  channel          text,            -- e.g. 'Google Ads', 'Partner: sri-sai-builders'
  attribution      jsonb,           -- campaign / partner / referrer details
  details          jsonb,           -- form extras; never full PAN or DOB
  consent_version  text not null,
  consent_at       timestamptz not null,
  consent_ip       text,
  status           text not null default 'new'   -- for your own follow-up tracking
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_mobile_idx on public.leads (mobile);

-- Numbers that must never be called again (voice-agent opt-outs, wrong numbers,
-- or anyone who asks). The voice agent checks this before every call.
create table if not exists public.do_not_call (
  mobile      text primary key check (mobile ~ '^[0-9]{10}$'),
  created_at  timestamptz not null default now(),
  reason      text,
  source      text
);

-- Voice-agent call results (one row per Dograh run).
create table if not exists public.voice_calls (
  call_id      text primary key,
  created_at   timestamptz not null default now(),
  mobile       text,
  disposition  text,
  payload      jsonb
);

alter table public.leads       enable row level security;
alter table public.do_not_call enable row level security;
alter table public.voice_calls enable row level security;

-- To add a number by hand (e.g. someone asks by email not to be called):
--   insert into public.do_not_call (mobile, reason, source)
--   values ('9876543210', 'asked by email', 'manual') on conflict do nothing;
