-- LoanServ lead store — run once in Supabase → SQL Editor.
-- The site writes with the service-role key (server-side only). Row Level
-- Security is on with no policies, so the public anon key can read or write
-- nothing.

create table if not exists public.leads (
  id               bigint generated always as identity primary key,
  created_at       timestamptz not null default now(),
  form             text not null,
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

-- Which form a lead came from. (Separate so re-running this file on an older
-- database widens the allowed values.)
alter table public.leads drop constraint if exists leads_form_check;
alter table public.leads add constraint leads_form_check
  check (form in ('apply', 'chat', 'cibil', 'partner', 'whatsapp'));

-- Referral partners who can use /partner-portal. Create logins with
-- `node scripts/create-partner.mjs "Name"`; only a hash of the key is stored.
create table if not exists public.partners (
  code        text primary key check (code ~ '^[a-z0-9][a-z0-9-]{1,59}$'),
  name        text not null,
  key_hash    text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Partner referrals. Stay 'pending' — and uncontacted — until the customer
-- confirms on their link (or declines). Links expire after 7 days.
create table if not exists public.referrals (
  id               bigint generated always as identity primary key,
  created_at       timestamptz not null default now(),
  token_hash       text not null unique,
  partner_code     text not null references public.partners (code),
  partner_name     text,
  full_name        text not null,
  mobile           text not null check (mobile ~ '^[0-9]{10}$'),
  email            text,
  category         text not null,
  loan_type        text not null,
  amount           numeric not null,
  city             text not null,
  employment       text not null,
  monthly_salary   text,
  notes            text,
  status           text not null default 'pending'
                   check (status in ('pending', 'confirmed', 'declined')),
  confirmed_at     timestamptz,
  consent_version  text,
  consent_ip       text
);
create index if not exists referrals_partner_idx on public.referrals (partner_code, created_at desc);

-- WhatsApp assistant conversations (last 20 messages per number).
create table if not exists public.whatsapp_sessions (
  wa_id        text primary key,
  name         text,
  messages     jsonb not null default '[]',
  ad_referral  jsonb,
  lead_at      timestamptz,
  opted_out    boolean not null default false,
  seen_ids     jsonb not null default '[]',
  updated_at   timestamptz not null default now()
);

alter table public.leads       enable row level security;
alter table public.do_not_call enable row level security;
alter table public.voice_calls enable row level security;
alter table public.partners    enable row level security;
alter table public.referrals   enable row level security;
alter table public.whatsapp_sessions enable row level security;

-- To add a number by hand (e.g. someone asks by email not to be called):
--   insert into public.do_not_call (mobile, reason, source)
--   values ('9876543210', 'asked by email', 'manual') on conflict do nothing;
