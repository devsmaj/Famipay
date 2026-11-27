begin;

alter table public.profiles
  add column first_name text not null default '',
  add column last_name text not null default '';

update public.profiles
set first_name = split_part(btrim(name), ' ', 1),
    last_name = CASE
      WHEN position(' ' in btrim(name)) > 0
      THEN btrim(substr(btrim(name), position(' ' in btrim(name)) + 1))
      ELSE ''
    END;

create function public.update_personal_details(
  p_first_name text,
  p_last_name text,
  p_phone text
) returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare p public.profiles;
begin
  if not private.is_active() then
    raise exception 'Account access denied' using errcode = '42501';
  end if;
  if length(btrim(coalesce(p_first_name, ''))) not between 1 and 80
    or length(btrim(coalesce(p_last_name, ''))) not between 1 and 80
    or coalesce(p_phone, '') !~ '^\+[1-9][0-9]{7,14}$' then
    raise exception 'Invalid personal details';
  end if;

  update public.profiles
  set first_name = btrim(p_first_name),
      last_name = btrim(p_last_name),
      name = btrim(p_first_name) || ' ' || btrim(p_last_name),
      phone = p_phone
  where id = auth.uid()
  returning * into p;

  if not found then
    raise exception 'Profile not found';
  end if;
  return p;
end
$$;

revoke all on function public.update_personal_details(text, text, text)
  from public, anon, authenticated;
grant execute on function public.update_personal_details(text, text, text)
  to authenticated;

commit;
