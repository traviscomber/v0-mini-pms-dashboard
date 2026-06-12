create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'membership_role') then
    create type public.membership_role as enum ('owner', 'admin', 'manager', 'staff');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'reservation_status') then
    create type public.reservation_status as enum ('tentative', 'confirmed', 'checked_in', 'checked_out', 'cancelled');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'task_kind') then
    create type public.task_kind as enum ('housekeeping', 'maintenance', 'guest_service', 'operations');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'task_status') then
    create type public.task_status as enum ('todo', 'in_progress', 'blocked', 'done');
  end if;
end
$$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  default_organization_id uuid references public.organizations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.membership_role not null default 'staff',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  timezone text not null default 'UTC',
  currency text not null default 'USD',
  address_line_1 text,
  address_line_2 text,
  city text,
  region text,
  postal_code text,
  country_code char(2),
  check_in_time time not null default '15:00',
  check_out_time time not null default '11:00',
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  slug text not null,
  unit_type text not null default 'unit',
  capacity integer not null default 1 check (capacity > 0),
  base_price integer not null default 0 check (base_price >= 0),
  color text not null default 'bg-sky-500',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, slug)
);

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  first_name text not null,
  last_name text,
  email text,
  phone text,
  notes text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  unit_id uuid references public.units(id) on delete set null,
  guest_id uuid references public.guests(id) on delete set null,
  source text not null default 'Direct',
  status public.reservation_status not null default 'confirmed',
  payment_status text not null default 'Pending',
  cleaning_status text not null default 'Clean',
  check_in date not null,
  check_out date not null,
  adults integer not null default 1 check (adults > 0),
  children integer not null default 0 check (children >= 0),
  total_price integer not null default 0 check (total_price >= 0),
  balance_amount integer not null default 0 check (balance_amount >= 0),
  notes text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reservations_date_order check (check_out > check_in)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete set null,
  unit_id uuid references public.units(id) on delete set null,
  title text not null,
  kind public.task_kind not null default 'operations',
  status public.task_status not null default 'todo',
  scheduled_for timestamptz,
  assigned_to uuid references auth.users(id) on delete set null,
  notes text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists memberships_user_idx on public.memberships (user_id);
create unique index if not exists memberships_default_per_user_idx
  on public.memberships (user_id)
  where is_default;
create index if not exists properties_organization_idx on public.properties (organization_id);
create index if not exists units_property_idx on public.units (property_id);
create index if not exists guests_organization_idx on public.guests (organization_id);
create index if not exists reservations_org_dates_idx on public.reservations (organization_id, check_in, check_out);
create index if not exists reservations_property_idx on public.reservations (property_id);
create index if not exists tasks_org_status_idx on public.tasks (organization_id, status);
create index if not exists audit_logs_org_created_idx on public.audit_logs (organization_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = case
          when coalesce(excluded.full_name, '') <> '' then excluded.full_name
          else public.profiles.full_name
        end,
        avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

  return new;
end;
$$;

create or replace function public.sync_default_organization()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_default then
    update public.profiles
    set default_organization_id = new.organization_id
    where id = new.user_id;
  end if;

  return new;
end;
$$;

create or replace function public.is_org_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships
    where organization_id = target_organization_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.has_org_role(
  target_organization_id uuid,
  allowed_roles public.membership_role[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships
    where organization_id = target_organization_id
      and user_id = auth.uid()
      and role = any(allowed_roles)
  );
$$;

create or replace function public.bootstrap_workspace(
  organization_name text,
  organization_slug text,
  property_name text,
  property_slug text,
  property_timezone text default 'UTC',
  property_currency text default 'USD'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  workspace_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if coalesce(trim(organization_name), '') = '' then
    raise exception 'Organization name is required';
  end if;

  if coalesce(trim(property_name), '') = '' then
    raise exception 'Property name is required';
  end if;

  insert into public.organizations (name, slug, created_by)
  values (trim(organization_name), trim(organization_slug), current_user_id)
  returning id into workspace_id;

  insert into public.memberships (organization_id, user_id, role, is_default)
  values (workspace_id, current_user_id, 'owner', true);

  update public.profiles
  set default_organization_id = workspace_id
  where id = current_user_id;

  insert into public.properties (
    organization_id,
    name,
    slug,
    timezone,
    currency,
    created_by
  )
  values (
    workspace_id,
    trim(property_name),
    trim(property_slug),
    coalesce(nullif(trim(property_timezone), ''), 'UTC'),
    upper(coalesce(nullif(trim(property_currency), ''), 'USD')),
    current_user_id
  );

  insert into public.audit_logs (organization_id, actor_user_id, entity_type, entity_id, action, payload)
  values (
    workspace_id,
    current_user_id,
    'organization',
    workspace_id,
    'workspace.bootstrap',
    jsonb_build_object('property_name', property_name)
  );

  return workspace_id;
end;
$$;

drop trigger if exists organizations_set_updated_at on public.organizations;
create trigger organizations_set_updated_at
before update on public.organizations
for each row
execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists memberships_set_updated_at on public.memberships;
create trigger memberships_set_updated_at
before update on public.memberships
for each row
execute function public.set_updated_at();

drop trigger if exists memberships_sync_default_org on public.memberships;
create trigger memberships_sync_default_org
after insert or update on public.memberships
for each row
execute function public.sync_default_organization();

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
before update on public.properties
for each row
execute function public.set_updated_at();

drop trigger if exists units_set_updated_at on public.units;
create trigger units_set_updated_at
before update on public.units
for each row
execute function public.set_updated_at();

drop trigger if exists guests_set_updated_at on public.guests;
create trigger guests_set_updated_at
before update on public.guests
for each row
execute function public.set_updated_at();

drop trigger if exists reservations_set_updated_at on public.reservations;
create trigger reservations_set_updated_at
before update on public.reservations
for each row
execute function public.set_updated_at();

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.organizations to authenticated;
grant select, insert, update, delete on public.memberships to authenticated;
grant select, insert, update, delete on public.properties to authenticated;
grant select, insert, update, delete on public.units to authenticated;
grant select, insert, update, delete on public.guests to authenticated;
grant select, insert, update, delete on public.reservations to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
grant select, insert on public.audit_logs to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on function public.bootstrap_workspace(text, text, text, text, text, text) to authenticated;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.has_org_role(uuid, public.membership_role[]) to authenticated;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.properties enable row level security;
alter table public.units enable row level security;
alter table public.guests enable row level security;
alter table public.reservations enable row level security;
alter table public.tasks enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read"
on public.profiles
for select
to authenticated
using (auth.uid() is not null and auth.uid() = id);

drop policy if exists "profiles self insert" on public.profiles;
create policy "profiles self insert"
on public.profiles
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = id);

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update"
on public.profiles
for update
to authenticated
using (auth.uid() is not null and auth.uid() = id)
with check (auth.uid() is not null and auth.uid() = id);

drop policy if exists "organizations member read" on public.organizations;
create policy "organizations member read"
on public.organizations
for select
to authenticated
using (auth.uid() is not null and (created_by = auth.uid() or public.is_org_member(id)));

drop policy if exists "organizations creator insert" on public.organizations;
create policy "organizations creator insert"
on public.organizations
for insert
to authenticated
with check (auth.uid() is not null and created_by = auth.uid());

drop policy if exists "organizations owner admin update" on public.organizations;
create policy "organizations owner admin update"
on public.organizations
for update
to authenticated
using (public.has_org_role(id, array['owner', 'admin']::public.membership_role[]))
with check (public.has_org_role(id, array['owner', 'admin']::public.membership_role[]));

drop policy if exists "memberships member read" on public.memberships;
create policy "memberships member read"
on public.memberships
for select
to authenticated
using (auth.uid() is not null and (user_id = auth.uid() or public.is_org_member(organization_id)));

drop policy if exists "memberships owner admin insert" on public.memberships;
create policy "memberships owner admin insert"
on public.memberships
for insert
to authenticated
with check (
  auth.uid() is not null
  and public.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[])
);

drop policy if exists "memberships owner admin update" on public.memberships;
create policy "memberships owner admin update"
on public.memberships
for update
to authenticated
using (public.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]))
with check (public.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]));

drop policy if exists "memberships owner admin delete" on public.memberships;
create policy "memberships owner admin delete"
on public.memberships
for delete
to authenticated
using (public.has_org_role(organization_id, array['owner', 'admin']::public.membership_role[]));

drop policy if exists "properties member read" on public.properties;
create policy "properties member read"
on public.properties
for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "properties manager insert" on public.properties;
create policy "properties manager insert"
on public.properties
for insert
to authenticated
with check (
  public.has_org_role(organization_id, array['owner', 'admin', 'manager']::public.membership_role[])
  and created_by = auth.uid()
);

drop policy if exists "properties manager update" on public.properties;
create policy "properties manager update"
on public.properties
for update
to authenticated
using (public.has_org_role(organization_id, array['owner', 'admin', 'manager']::public.membership_role[]))
with check (public.has_org_role(organization_id, array['owner', 'admin', 'manager']::public.membership_role[]));

drop policy if exists "units member read" on public.units;
create policy "units member read"
on public.units
for select
to authenticated
using (
  exists (
    select 1
    from public.properties
    where public.properties.id = property_id
      and public.is_org_member(public.properties.organization_id)
  )
);

drop policy if exists "units manager write" on public.units;
create policy "units manager write"
on public.units
for all
to authenticated
using (
  exists (
    select 1
    from public.properties
    where public.properties.id = property_id
      and public.has_org_role(public.properties.organization_id, array['owner', 'admin', 'manager']::public.membership_role[])
  )
)
with check (
  exists (
    select 1
    from public.properties
    where public.properties.id = property_id
      and public.has_org_role(public.properties.organization_id, array['owner', 'admin', 'manager']::public.membership_role[])
  )
);

drop policy if exists "guests member read" on public.guests;
create policy "guests member read"
on public.guests
for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "guests manager write" on public.guests;
create policy "guests manager write"
on public.guests
for all
to authenticated
using (public.has_org_role(organization_id, array['owner', 'admin', 'manager', 'staff']::public.membership_role[]))
with check (public.has_org_role(organization_id, array['owner', 'admin', 'manager', 'staff']::public.membership_role[]));

drop policy if exists "reservations member read" on public.reservations;
create policy "reservations member read"
on public.reservations
for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "reservations staff write" on public.reservations;
create policy "reservations staff write"
on public.reservations
for all
to authenticated
using (public.has_org_role(organization_id, array['owner', 'admin', 'manager', 'staff']::public.membership_role[]))
with check (public.has_org_role(organization_id, array['owner', 'admin', 'manager', 'staff']::public.membership_role[]));

drop policy if exists "tasks member read" on public.tasks;
create policy "tasks member read"
on public.tasks
for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "tasks staff write" on public.tasks;
create policy "tasks staff write"
on public.tasks
for all
to authenticated
using (public.has_org_role(organization_id, array['owner', 'admin', 'manager', 'staff']::public.membership_role[]))
with check (public.has_org_role(organization_id, array['owner', 'admin', 'manager', 'staff']::public.membership_role[]));

drop policy if exists "audit logs member read" on public.audit_logs;
create policy "audit logs member read"
on public.audit_logs
for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "audit logs member insert" on public.audit_logs;
create policy "audit logs member insert"
on public.audit_logs
for insert
to authenticated
with check (public.is_org_member(organization_id));
