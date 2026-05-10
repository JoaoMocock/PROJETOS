create extension if not exists "pgcrypto";

create table if not exists perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  avatar_url text,
  moeda text not null default 'R$',
  meta_mensal numeric(12,2) default 0,
  criado_em timestamptz not null default now()
);

create table if not exists transacoes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('receita', 'despesa')),
  valor numeric(12,2) not null check (valor > 0),
  categoria text not null,
  forma_pagamento text,
  data date not null,
  descricao text,
  recorrente boolean not null default false,
  regra_recorrencia text,
  url_comprovante text,
  criado_em timestamptz not null default now()
);

create table if not exists cartoes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  banco text not null,
  limite numeric(12,2) not null,
  dia_fechamento int not null check (dia_fechamento between 1 and 31),
  dia_vencimento int not null check (dia_vencimento between 1 and 31),
  cor text not null,
  criado_em timestamptz not null default now()
);

create table if not exists compras_cartao (
  id uuid primary key default gen_random_uuid(),
  cartao_id uuid not null references cartoes(id) on delete cascade,
  usuario_id uuid not null references auth.users(id) on delete cascade,
  valor numeric(12,2) not null,
  descricao text,
  data date not null,
  categoria text not null,
  criado_em timestamptz not null default now()
);

create table if not exists orcamentos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  categoria text not null,
  valor numeric(12,2) not null,
  mes date not null,
  criado_em timestamptz not null default now()
);

create table if not exists despesas_fixas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  valor numeric(12,2) not null,
  dia_vencimento int not null check (dia_vencimento between 1 and 31),
  categoria text not null,
  pago boolean not null default false,
  mes date not null,
  criado_em timestamptz not null default now()
);

create table if not exists metas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  valor_alvo numeric(12,2) not null,
  valor_atual numeric(12,2) not null default 0,
  data_limite date,
  icone text,
  cor text,
  prioridade text,
  criado_em timestamptz not null default now()
);

create table if not exists investimentos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null,
  nome text not null,
  valor numeric(12,2) not null,
  data date not null,
  criado_em timestamptz not null default now()
);

alter table perfis enable row level security;
alter table transacoes enable row level security;
alter table cartoes enable row level security;
alter table compras_cartao enable row level security;
alter table orcamentos enable row level security;
alter table despesas_fixas enable row level security;
alter table metas enable row level security;
alter table investimentos enable row level security;

create policy "Acesso próprio em perfis" on perfis for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Acesso próprio em transacoes" on transacoes for all using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);
create policy "Acesso próprio em cartoes" on cartoes for all using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);
create policy "Acesso próprio em compras_cartao" on compras_cartao for all using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);
create policy "Acesso próprio em orcamentos" on orcamentos for all using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);
create policy "Acesso próprio em despesas_fixas" on despesas_fixas for all using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);
create policy "Acesso próprio em metas" on metas for all using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);
create policy "Acesso próprio em investimentos" on investimentos for all using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);
