-- Create saved_items table
create table if not exists public.saved_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  item_id uuid not null,
  item_type text not null check (item_type in ('post', 'event', 'podcast', 'service')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, item_id, item_type)
);

-- Enable RLS
alter table public.saved_items enable row level security;

-- Policies
create policy "Users can view their own saved items"
  on public.saved_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved items"
  on public.saved_items for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own saved items"
  on public.saved_items for delete
  using (auth.uid() = user_id);
