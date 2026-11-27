begin;

alter table public.profiles
  add column onboarding_complete boolean not null default false;

update public.profiles
set onboarding_complete = true
where length(trim(name)) > 0;

create table private.account_pins (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  pin_hash text not null check (pin_hash ~ '^[0-9a-f]{128}$'),
  pin_salt text not null check (pin_salt ~ '^[0-9a-f]{32}$'),
  created_at timestamptz not null default now()
);

alter table private.account_pins enable row level security;
revoke all on private.account_pins from public, anon, authenticated;

create function public.set_secure_pin(p_user uuid, p_pin_hash text, p_pin_salt text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_user is null or p_pin_hash !~ '^[0-9a-f]{128}$' or p_pin_salt !~ '^[0-9a-f]{32}$' then
    raise exception 'Invalid secure PIN data';
  end if;
  update public.profiles
  set onboarding_complete = true
  where id = p_user
    and active
    and length(trim(name)) > 0
    and not onboarding_complete;
  if not found then
    raise exception 'Complete profile information is required';
  end if;

  insert into private.account_pins(user_id, pin_hash, pin_salt)
  values (p_user, p_pin_hash, p_pin_salt)
  on conflict (user_id) do update
    set pin_hash = excluded.pin_hash,
        pin_salt = excluded.pin_salt,
        created_at = now();

  return jsonb_build_object('onboarding_complete', true);
end
$$;

revoke all on function public.set_secure_pin(uuid, text, text) from public, anon, authenticated;
grant execute on function public.set_secure_pin(uuid, text, text) to service_role;

commit;
