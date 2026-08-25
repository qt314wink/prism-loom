create table if not exists looms (
  id text primary key,
  user_id text not null,
  title text not null,
  sequence_json text not null,
  motion_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists looms_user_id_idx on looms (user_id);
