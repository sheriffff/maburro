create extension if not exists "pgcrypto";

create table attributes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table attribute_values (
  id uuid primary key default gen_random_uuid(),
  attribute_id uuid not null references attributes(id) on delete cascade,
  label text not null,
  position smallint not null default 0,
  created_at timestamptz not null default now()
);
create index idx_attribute_values_attribute_id on attribute_values(attribute_id);

create table activities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table activity_attribute_values (
  activity_id uuid not null references activities(id) on delete cascade,
  attribute_value_id uuid not null references attribute_values(id) on delete cascade,
  primary key (activity_id, attribute_value_id)
);
create index idx_aav_activity_id on activity_attribute_values(activity_id);
create index idx_aav_attribute_value_id on activity_attribute_values(attribute_value_id);

create table activity_log (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references activities(id) on delete cascade,
  date date not null default current_date,
  day_of_week smallint not null default extract(dow from current_date),
  time time not null default current_time,
  created_at timestamptz not null default now()
);
create index idx_activity_log_activity_id on activity_log(activity_id);
create index idx_activity_log_date on activity_log(date);

-- RLS: acceso abierto (sin auth)
alter table attributes enable row level security;
alter table attribute_values enable row level security;
alter table activities enable row level security;
alter table activity_attribute_values enable row level security;
alter table activity_log enable row level security;

create policy "Open access" on attributes for all using (true) with check (true);
create policy "Open access" on attribute_values for all using (true) with check (true);
create policy "Open access" on activities for all using (true) with check (true);
create policy "Open access" on activity_attribute_values for all using (true) with check (true);
create policy "Open access" on activity_log for all using (true) with check (true);

-- Seed: 4 atributos predefinidos
do $$
declare
  attr_duracion uuid;
  attr_ubicacion uuid;
  attr_compania uuid;
  attr_obligacion uuid;
begin
  insert into attributes (name) values ('Duración') returning id into attr_duracion;
  insert into attributes (name) values ('Ubicación') returning id into attr_ubicacion;
  insert into attributes (name) values ('Compañía') returning id into attr_compania;
  insert into attributes (name) values ('Obligación') returning id into attr_obligacion;

  insert into attribute_values (attribute_id, label, position) values
    (attr_duracion, '1h', 0),
    (attr_duracion, '2h', 1),
    (attr_duracion, '>2h', 2);

  insert into attribute_values (attribute_id, label, position) values
    (attr_ubicacion, 'Casa', 0),
    (attr_ubicacion, 'Fuera', 1);

  insert into attribute_values (attribute_id, label, position) values
    (attr_compania, 'Solo', 0),
    (attr_compania, 'Acompañado', 1);

  insert into attribute_values (attribute_id, label, position) values
    (attr_obligacion, 'Obligación', 0),
    (attr_obligacion, 'Ocio', 1),
    (attr_obligacion, 'Rutina', 2);
end $$;
