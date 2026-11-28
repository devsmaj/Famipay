-- FAMIPAY account settings, run once in Supabase SQL Editor.
-- This does NOT create payment PINs or enable paid SMS services.
create table if not exists public.famipay_user_settings (
 user_id uuid primary key references auth.users(id) on delete cascade,
 theme text not null default 'system' check(theme in ('light','dark','system')),
 sms_credit boolean not null default false,
 sms_card boolean not null default false,
 sms_transfer boolean not null default false,
 sms_other boolean not null default false,
 sms_consent_at timestamptz,
 auto_logout_minutes integer not null default 15 check(auto_logout_minutes in (5,15,30)),
 updated_at timestamptz not null default now()
);
alter table public.famipay_user_settings enable row level security;
drop policy if exists "famipay_settings_select_own" on public.famipay_user_settings;
create policy "famipay_settings_select_own" on public.famipay_user_settings for select to authenticated using (auth.uid() = user_id);
drop policy if exists "famipay_settings_insert_own" on public.famipay_user_settings;
create policy "famipay_settings_insert_own" on public.famipay_user_settings for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "famipay_settings_update_own" on public.famipay_user_settings;
create policy "famipay_settings_update_own" on public.famipay_user_settings for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create table if not exists public.famipay_feedback (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 message text not null check(char_length(trim(message)) between 10 and 2000),
 created_at timestamptz not null default now()
);
alter table public.famipay_feedback enable row level security;
drop policy if exists "famipay_feedback_insert_own" on public.famipay_feedback;
create policy "famipay_feedback_insert_own" on public.famipay_feedback for insert to authenticated with check(auth.uid()=user_id);
drop policy if exists "famipay_feedback_select_own" on public.famipay_feedback;
create policy "famipay_feedback_select_own" on public.famipay_feedback for select to authenticated using(auth.uid()=user_id);
-- Private avatar bucket: user can upload only inside their own UUID folder.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('avatars','avatars',true,2097152,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set file_size_limit=2097152,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists "famipay_avatar_upload_own" on storage.objects;
create policy "famipay_avatar_upload_own" on storage.objects for insert to authenticated
with check(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "famipay_avatar_update_own" on storage.objects;
create policy "famipay_avatar_update_own" on storage.objects for update to authenticated
using(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text)
with check(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "famipay_avatar_read" on storage.objects;
create policy "famipay_avatar_read" on storage.objects for select to public using(bucket_id='avatars');
