-- Neo MVP backend schema foundation.
-- This migration is local-only until reviewed and explicitly pushed.
-- RLS planning:
-- - Tables are tenant-scoped by business_id where applicable.
-- - Supabase Edge Functions should use server-side authorization with Clerk claims.
-- - Public anon access policies are intentionally not added in this foundation pass.
-- - Add least-privilege RLS policies only after B04 implements server auth/profile bootstrap.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  business_type text,
  setup_status text not null default 'incomplete',
  profile_data jsonb not null default '{}'::jsonb,
  ai_settings jsonb not null default '{}'::jsonb,
  payment_rules jsonb not null default '{}'::jsonb,
  delivery_zones jsonb not null default '[]'::jsonb,
  product_basics jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'manager', 'staff')),
  status text not null default 'active' check (status in ('active', 'invited', 'disabled')),
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, profile_id)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  display_name text not null,
  phone_e164 text,
  whatsapp_profile_id text,
  tags text[] not null default array[]::text[],
  notes_summary text,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  external_thread_id text,
  status text not null default 'open',
  assigned_member_id uuid references public.business_members(id) on delete set null,
  last_message_at timestamptz,
  unread_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  conversation_id uuid not null references public.whatsapp_conversations(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  external_message_id text,
  direction text not null check (direction in ('inbound', 'outbound')),
  sender_kind text not null check (sender_kind in ('customer', 'business', 'system')),
  message_type text not null default 'text',
  body_preview text,
  media_asset_id uuid,
  sent_at timestamptz,
  received_at timestamptz,
  status text not null default 'received',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  conversation_id uuid references public.whatsapp_conversations(id) on delete set null,
  order_number text,
  status text not null default 'draft',
  payment_status text not null default 'unpaid',
  delivery_status text not null default 'not_started',
  currency text not null default 'NGN',
  subtotal_amount integer not null default 0,
  delivery_fee_amount integer not null default 0,
  total_amount integer not null default 0,
  notes text,
  created_by_member_id uuid references public.business_members(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, order_number)
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_amount integer not null default 0,
  line_total_amount integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  bucket_id text not null,
  object_path text not null,
  media_type text not null,
  source text not null,
  visibility text not null default 'private' check (visibility in ('private', 'signed', 'public')),
  checksum text,
  metadata jsonb not null default '{}'::jsonb,
  created_by_member_id uuid references public.business_members(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket_id, object_path)
);

alter table public.whatsapp_messages
  add constraint whatsapp_messages_media_asset_id_fkey
  foreign key (media_asset_id) references public.media_assets(id) on delete set null;

create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  media_asset_id uuid references public.media_assets(id) on delete set null,
  review_status text not null default 'pending',
  extraction_status text not null default 'not_started',
  payment_decision text not null default 'undecided',
  amount_claimed integer,
  currency text not null default 'NGN',
  risk_flags jsonb not null default '[]'::jsonb,
  reviewed_by_member_id uuid references public.business_members(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  conversation_id uuid references public.whatsapp_conversations(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  reason text not null,
  status text not null default 'queued',
  due_at timestamptz,
  suggested_message_preview text,
  completed_by_member_id uuid references public.business_members(id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  requested_by_member_id uuid references public.business_members(id) on delete set null,
  decided_by_member_id uuid references public.business_members(id) on delete set null,
  subject_type text not null,
  subject_id uuid,
  status text not null default 'pending',
  risk_category text,
  decision_note text,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_drafts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  conversation_id uuid references public.whatsapp_conversations(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  approval_id uuid references public.approvals(id) on delete set null,
  status text not null default 'drafted',
  confidence_band text,
  risk_reasons jsonb not null default '[]'::jsonb,
  draft_text text,
  created_by text not null default 'system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete set null,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  actor_member_id uuid references public.business_members(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  request_id text,
  source text not null default 'edge_function',
  safe_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.raw_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  business_id uuid references public.businesses(id) on delete set null,
  external_event_id text,
  event_type text,
  verification_status text not null default 'unverified',
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists profiles_clerk_user_id_idx on public.profiles (clerk_user_id);
create index if not exists businesses_owner_profile_id_idx on public.businesses (owner_profile_id);
create index if not exists business_members_business_id_idx on public.business_members (business_id);
create index if not exists business_members_profile_id_idx on public.business_members (profile_id);
create index if not exists customers_business_id_idx on public.customers (business_id);
create index if not exists customers_phone_business_idx on public.customers (business_id, phone_e164);
create index if not exists conversations_business_id_idx on public.whatsapp_conversations (business_id);
create index if not exists conversations_customer_id_idx on public.whatsapp_conversations (customer_id);
create index if not exists messages_business_id_idx on public.whatsapp_messages (business_id);
create index if not exists messages_conversation_id_idx on public.whatsapp_messages (conversation_id);
create index if not exists orders_business_id_idx on public.orders (business_id);
create index if not exists orders_customer_id_idx on public.orders (customer_id);
create index if not exists order_items_business_id_idx on public.order_items (business_id);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists media_assets_business_id_idx on public.media_assets (business_id);
create index if not exists receipts_business_id_idx on public.receipts (business_id);
create index if not exists receipts_order_id_idx on public.receipts (order_id);
create index if not exists follow_ups_business_id_idx on public.follow_ups (business_id);
create index if not exists follow_ups_due_at_idx on public.follow_ups (business_id, due_at);
create index if not exists approvals_business_id_idx on public.approvals (business_id);
create index if not exists approvals_status_idx on public.approvals (business_id, status);
create index if not exists ai_drafts_business_id_idx on public.ai_drafts (business_id);
create index if not exists audit_logs_business_id_idx on public.audit_logs (business_id);
create index if not exists audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);
create index if not exists raw_webhook_events_provider_idx on public.raw_webhook_events (provider, external_event_id);

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.customers enable row level security;
alter table public.whatsapp_conversations enable row level security;
alter table public.whatsapp_messages enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.receipts enable row level security;
alter table public.follow_ups enable row level security;
alter table public.approvals enable row level security;
alter table public.ai_drafts enable row level security;
alter table public.media_assets enable row level security;
alter table public.audit_logs enable row level security;
alter table public.raw_webhook_events enable row level security;
