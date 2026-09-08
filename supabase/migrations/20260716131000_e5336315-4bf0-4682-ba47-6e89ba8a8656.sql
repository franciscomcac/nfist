
-- ==== ROLES ====
create type public.app_role as enum ('admin','editor');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  section_slug text,
  created_at timestamptz not null default now(),
  unique(user_id, role, section_slug)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

create or replace function public.can_edit_section(_user_id uuid, _section text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.user_roles
    where user_id=_user_id
      and (role='admin' or (role='editor' and (section_slug is null or section_slug=_section)))
  )
$$;

create policy "users read own roles" on public.user_roles for select to authenticated using (auth.uid()=user_id);
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Auto-grant admin to bootstrap email on verified sign-up
create or replace function public.grant_bootstrap_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is not null
     and lower(new.email) = 'nfist@tecnico.ulisboa.pt' then
    insert into public.user_roles(user_id, role) values (new.id, 'admin')
    on conflict do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_created_bootstrap after insert on auth.users
  for each row execute function public.grant_bootstrap_admin();
create trigger on_auth_user_confirmed_bootstrap after update of email_confirmed_at on auth.users
  for each row when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
  execute function public.grant_bootstrap_admin();

-- ==== updated_at helper ====
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

-- ==== SECTIONS ====
create table public.sections (
  slug text primary key,
  name text not null,
  eyebrow text,
  tagline text,
  short text,
  hero_url text,
  about jsonb not null default '[]'::jsonb,
  activities jsonb not null default '[]'::jsonb,
  participation jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  related_events jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.sections to anon, authenticated;
grant insert, update, delete on public.sections to authenticated;
grant all on public.sections to service_role;
alter table public.sections enable row level security;
create policy "sections public read" on public.sections for select to anon, authenticated using (true);
create policy "sections editor update" on public.sections for update to authenticated
  using (public.can_edit_section(auth.uid(), slug)) with check (public.can_edit_section(auth.uid(), slug));
create policy "sections admin insert" on public.sections for insert to authenticated
  with check (public.has_role(auth.uid(),'admin'));
create policy "sections admin delete" on public.sections for delete to authenticated
  using (public.has_role(auth.uid(),'admin'));
create trigger sections_touch before update on public.sections for each row execute function public.touch_updated_at();

-- ==== EVENTS ====
create table public.events (
  slug text primary key,
  name text not null,
  eyebrow text,
  category text not null default 'recorrente',
  period text,
  location text,
  short text,
  hero_url text,
  gallery jsonb not null default '[]'::jsonb,
  description jsonb not null default '[]'::jsonb,
  programme jsonb not null default '[]'::jsonb,
  info jsonb not null default '[]'::jsonb,
  locations jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published boolean not null default true,
  section_slug text references public.sections(slug) on delete set null,
  event_date date,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
grant all on public.events to service_role;
alter table public.events enable row level security;
create policy "events public read published" on public.events for select to anon using (published);
create policy "events auth read all" on public.events for select to authenticated using (true);
create policy "events editor insert" on public.events for insert to authenticated
  with check (public.can_edit_section(auth.uid(), section_slug));
create policy "events editor update" on public.events for update to authenticated
  using (public.can_edit_section(auth.uid(), section_slug))
  with check (public.can_edit_section(auth.uid(), section_slug));
create policy "events editor delete" on public.events for delete to authenticated
  using (public.can_edit_section(auth.uid(), section_slug));
create trigger events_touch before update on public.events for each row execute function public.touch_updated_at();

-- ==== REPOSITORY ====
create table public.repository_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null,
  topic text,
  author text,
  item_date text,
  href text,
  file_url text,
  section_slug text references public.sections(slug) on delete set null,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.repository_items to anon, authenticated;
grant insert, update, delete on public.repository_items to authenticated;
grant all on public.repository_items to service_role;
alter table public.repository_items enable row level security;
create policy "repo public read published" on public.repository_items for select to anon using (published);
create policy "repo auth read all" on public.repository_items for select to authenticated using (true);
create policy "repo editor insert" on public.repository_items for insert to authenticated
  with check (public.can_edit_section(auth.uid(), section_slug));
create policy "repo editor update" on public.repository_items for update to authenticated
  using (public.can_edit_section(auth.uid(), section_slug))
  with check (public.can_edit_section(auth.uid(), section_slug));
create policy "repo editor delete" on public.repository_items for delete to authenticated
  using (public.can_edit_section(auth.uid(), section_slug));
create trigger repo_touch before update on public.repository_items for each row execute function public.touch_updated_at();

-- ==== SITE SETTINGS ====
create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "settings public read" on public.site_settings for select to anon, authenticated using (true);
create policy "settings admin write" on public.site_settings for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger settings_touch before update on public.site_settings for each row execute function public.touch_updated_at();

-- ==== SEED: sections ====
insert into public.sections (slug,name,eyebrow,tagline,short,hero_url,about,activities,participation,gallery,related_events,sort_order) values
('circo','Circo da Física','Divulgação','Demonstrações e ciência experimental para todos os públicos.','Bancas demonstrativas, workshops itinerantes e mediação em escolas e eventos públicos.','https://nfist.tecnico.ulisboa.pt/media/grupos/circo/circo-bg.JPG',
 '["O Circo da Física é a secção do NFIST dedicada à divulgação científica através de exposições interativas. Levamos experiências e demonstrações a escolas, feiras e ao público em geral, mostrando como a Física explica fenómenos do quotidiano.","É a face mais visível do núcleo: um laboratório itinerante que combina rigor experimental com uma linguagem acessível a qualquer idade."]',
 '[{"title":"Exposições interativas","body":"Bancas demonstrativas com experiências simples e visuais que qualquer pessoa pode explorar em contacto directo."},{"title":"Divulgação em escolas","body":"Visitas a escolas do país, com sessões adaptadas a diferentes ciclos e programas curriculares."},{"title":"Workshops e atividades","body":"Sessões temáticas e actividades práticas conduzidas por estudantes do IST em ambiente informal."}]',
 '["Demonstrações experimentais","Montagem e logística","Divulgação em escolas","Mediação com o público","Concepção de novas atividades"]',
 '["https://nfist.tecnico.ulisboa.pt/media/grupos/circo/team.JPG","https://nfist.tecnico.ulisboa.pt/media/photos/pacman.JPG","https://nfist.tecnico.ulisboa.pt/media/eventos/SF/sf-main.png"]',
 '["semana-da-fisica","fisica-sobre-rodas","estrelas-sobre-o-atlantico"]',1),
('astro','Astro','Astronomia','Observação astronómica, astrofísica e divulgação do céu profundo.','Saídas de observação, workshops de instrumentação, astrofotografia e sessões públicas de planetário.','https://nfist.tecnico.ulisboa.pt/media/grupos/astro/astro-bg.JPG',
 '["A Astro é a secção do NFIST dedicada à Astronomia, Astrofísica e Astrofotografia. Entre saídas de observação, workshops, palestras e actividades para escolas, procuramos aproximar o céu nocturno de quem o quer explorar com curiosidade e rigor.","Desde os seus primórdios, a humanidade contempla as estrelas com fascínio. Na Astro trabalhamos para recuperar essa ligação ao céu — e para partilhá-la com a comunidade através de programas estruturados de formação e observação."]',
 '[{"title":"Observação e astrofotografia","body":"Saídas para locais com melhores condições de céu escuro, introdução à observação e ao processamento de imagem astronómica."},{"title":"Palestras e workshops","body":"Formação em áreas das ciências do espaço — da física matemática à astrobiologia, da astrofísica teórica à instrumentação."},{"title":"Escolas e divulgação","body":"Sessões de planetário móvel, observação solar, montagem de telescópios e atividades adaptadas a diferentes idades."}]',
 '["Saídas de observação","Astrofotografia e processamento","Palestras e conteúdo técnico","Instrumentação e telescópios","Divulgação em escolas"]',
 '["https://nfist.tecnico.ulisboa.pt/media/grupos/astro/eva25-7.jpg"]',
 '["escola-de-verao-de-astronomia","estrelas-sobre-o-atlantico"]',2),
('pulsar','Pulsar','Publicação','Revista semestral de divulgação científica.','Artigos de divulgação, entrevistas com investigadores e peças sobre investigação em Física — em linguagem acessível.','https://nfist.tecnico.ulisboa.pt/media/grupos/pulsar/pulsar-bg.JPG',
 '["A Pulsar é a revista semestral do NFIST. Publicamos artigos de divulgação científica, explicações de experiências, entrevistas e peças sobre investigação em Física — sempre em linguagem cuidada e curiosa.","A publicação é editada por estudantes, com processos próprios de revisão, paginação e design, e distribuída na comunidade do IST e além dela."]',
 '[{"title":"Artigos de divulgação","body":"Textos sobre Física moderna, experiências marcantes e curiosidades científicas."},{"title":"Entrevistas","body":"Conversas com investigadores, docentes e convidados sobre ciência e percurso académico."},{"title":"Edições anuais","body":"Produção editorial completa: escrita, revisão, design e publicação da revista."}]',
 '["Redação","Revisão editorial","Entrevistas","Design e paginação","Coordenação de edição"]',
 '["https://nfist.tecnico.ulisboa.pt/media/grupos/pulsar/team.JPG"]','[]',3),
('recreativa','ReCreativa','Comunidade','Vida académica, integração e cultura científica estudantil.','Convívios, actividades culturais e programas de integração para a comunidade do NFIST.','https://nfist.tecnico.ulisboa.pt/media/grupos/recreativa/recreativa-bg.JPG',
 '["A ReCreativa é a secção do NFIST dedicada ao lazer, convívio e integração entre estudantes, promovendo um ambiente próximo e activo dentro da comunidade do IST.","É o tecido humano do núcleo: garante que o trabalho científico e de divulgação assenta numa comunidade coesa e viva."]',
 '[{"title":"Lazer e convívio","body":"Momentos descontraídos ao longo do semestre para fortalecer a comunidade."},{"title":"Atividades culturais","body":"Saídas culturais, visitas e iniciativas fora do contexto académico."},{"title":"Jantares e passeios","body":"Almoços, jantares de curso e passeios que criam espírito de grupo."},{"title":"Jogos e competições","body":"Torneios e desafios lúdicos — tabuleiro, desporto, quizzes."}]',
 '["Programação de atividades","Logística e produção","Integração de novos alunos","Comunicação","Parcerias e convívios"]',
 '["https://nfist.tecnico.ulisboa.pt/media/grupos/recreativa/team.JPG","https://nfist.tecnico.ulisboa.pt/media/photos/nfist-bolo.JPG"]','[]',4),
('info','Info','Tecnologia','Comunicações digitais, produção multimédia e infraestrutura.','Website, bases de dados, apoio técnico às secções, newsletter PhysikUPDATE e podcast Watt''s Beyond.','https://nfist.tecnico.ulisboa.pt/media/grupos/info/info-bg.JPG',
 '["A Info é a secção do NFIST dedicada à gestão tecnológica e informativa do núcleo. Mantemos a infra-estrutura digital, bases de dados e ajudamos a comunidade MEFT com oportunidades académicas e profissionais.","É também a equipa por trás das comunicações digitais — a newsletter PhysikUPDATE, o podcast Watt''s Beyond e a presença nas plataformas do núcleo."]',
 '[{"title":"Website e infraestrutura","body":"Gestão e actualização do site do NFIST e recursos digitais associados."},{"title":"Bases de dados","body":"Organização de informação interna: membros, actividades e histórico do núcleo."},{"title":"Oportunidades MEFT","body":"Divulgação de estágios, bolsas, programas internacionais e oportunidades profissionais."},{"title":"Apoio técnico","body":"Suporte informático às secções para eventos, inscrições e comunicação."},{"title":"Comunicação digital","body":"Automatizações, newsletters e ferramentas para aproximar o NFIST da comunidade."}]',
 '["Website e frontend","Infraestrutura digital","Bases de dados","Apoio técnico a eventos","Automação e ferramentas internas"]',
 '["https://nfist.tecnico.ulisboa.pt/media/grupos/info/team.JPG"]','[]',5);

-- ==== SEED: events ====
insert into public.events (slug,name,eyebrow,category,period,location,short,hero_url,gallery,description,programme,info,locations,featured,section_slug,sort_order) values
('semana-da-fisica','Semana da Física','Evento principal','principal','Anual · Primavera','Campus Alameda, IST',
 'Uma semana no IST que traz milhares de estudantes de todo o país ao contacto directo com a Física — laboratórios, planetário, palestras e o Circo da Física.',
 'https://nfist.tecnico.ulisboa.pt/media/eventos/SF/sf-main.png',
 '["https://nfist.tecnico.ulisboa.pt/media/photos/NFIST-bg.JPG","https://nfist.tecnico.ulisboa.pt/media/photos/pacman.JPG","https://nfist.tecnico.ulisboa.pt/media/photos/meet-greet.JPG","https://nfist.tecnico.ulisboa.pt/media/photos/image.png","https://nfist.tecnico.ulisboa.pt/media/grupos/circo/circo-bg.JPG"]',
 '["A Semana da Física é o principal evento científico e pedagógico do NFIST. Todos os anos traz milhares de estudantes do ensino básico e secundário ao campus do Instituto Superior Técnico, num contacto directo e envolvente com o mundo da Física.","O objectivo é despertar o interesse pela ciência através de uma abordagem prática e interativa — os participantes exploram fenómenos físicos, colocam questões, experimentam e compreendem o papel da Física no quotidiano e no desenvolvimento tecnológico.","O destaque do evento é o Circo da Física — um conjunto de experiências e demonstrações interativas dinamizadas por estudantes do IST. Além disso, o programa inclui sessões de planetário, visitas a laboratórios de investigação, palestras e workshops."]',
 '[{"title":"Circo da Física","body":"Bancas demonstrativas conduzidas pelos estudantes do IST."},{"title":"Sessões de planetário","body":"Programa de astronomia e cosmologia para grupos escolares."},{"title":"Laboratórios de investigação","body":"Visitas guiadas a laboratórios activos do Departamento de Física."},{"title":"Palestras","body":"Comunicações curtas de investigadores e docentes."}]',
 '[{"label":"Público-alvo","value":"Ensino básico e secundário"},{"label":"Duração","value":"5 dias"},{"label":"Local","value":"IST — Campus Alameda"},{"label":"Organização","value":"NFIST · Circo da Física"}]',
 '[]',true,'circo',1),
('jornadas-engenharia-fisica','Jornadas de Engenharia Física','Evento anual · JEF','recorrente','Anual','IST — Alameda',
 'Palestras, workshops e networking que aproximam estudantes de Engenharia Física do mundo académico e empresarial.',
 'https://nfist.tecnico.ulisboa.pt/media/logos/JEF-logo.jpg',
 '["https://nfist.tecnico.ulisboa.pt/media/photos/meet-greet.JPG"]',
 '["As Jornadas de Engenharia Física (JEF) são um programa anual organizado por estudantes do NFIST para aproximar alunos do mundo académico e empresarial — com palestras, workshops e momentos estruturados de networking.","O programa procura ajudar estudantes a explorar saídas profissionais, temas actuais da Física e competências úteis para o mercado de trabalho."]',
 '[{"title":"Palestras","body":"Conversas com investigadores, alumni e profissionais da indústria."},{"title":"Workshops","body":"Sessões práticas em temas técnicos e de soft skills."},{"title":"Meet & Greet","body":"Contacto directo entre estudantes e convidados."}]',
 '[{"label":"Público-alvo","value":"Alunos de Engenharia Física, Física e áreas afins"},{"label":"Periodicidade","value":"Anual"},{"label":"Local","value":"IST — Alameda"},{"label":"Formato","value":"Palestras e workshops"}]',
 '[]',false,null,2),
('escola-de-verao-de-astronomia','Escola de Verão de Astronomia','EVA · Programa de Verão','recorrente','Julho · 5 dias','IST — Lisboa',
 'Programa de cinco dias para alunos do ensino secundário: palestras, workshops de instrumentação e observações nocturnas guiadas pela Astro.',
 'https://nfist.tecnico.ulisboa.pt/media/grupos/astro/eva25-7.jpg',
 '["https://nfist.tecnico.ulisboa.pt/media/eventos/EVA/team.JPG","https://nfist.tecnico.ulisboa.pt/media/grupos/astro/astro-bg.JPG"]',
 '["A EVA — Escola de Verão de Astronomia é um programa de vários dias para alunos do Ensino Secundário que querem aprender Astronomia de forma prática, com palestras, workshops, observações nocturnas e atividades guiadas pela secção Astro.","A escola equilibra conteúdos introdutórios e actividades práticas para dar uma experiência completa de Astronomia e Astrofísica."]',
 '[{"title":"Palestras","body":"Evolução estelar, cosmologia, exploração espacial — em linguagem acessível."},{"title":"Workshops","body":"Observação, uso de telescópios e noções de astrofotografia para iniciantes."},{"title":"Observações nocturnas","body":"Noites dedicadas ao céu profundo e reconhecimento de constelações."}]',
 '[{"label":"Público-alvo","value":"Ensino secundário"},{"label":"Duração","value":"5 dias"},{"label":"Local","value":"IST — Lisboa"},{"label":"Contacto","value":"astro.nfist@gmail.com"}]',
 '[]',false,'astro',3),
('fisica-sobre-rodas','Física sobre Rodas','Exposição itinerante','recorrente','Julho · anual','Escolas, feiras e eventos públicos',
 'Exposição itinerante que percorre Portugal continental levando o Circo da Física a comunidades sem acesso regular a divulgação científica.',
 'https://nfist.tecnico.ulisboa.pt/media/grupos/circo/circo-bg.JPG',
 '["https://nfist.tecnico.ulisboa.pt/media/photos/pacman.JPG"]',
 '["A Física sobre Rodas é uma exposição interativa de física que viaja pelo país todos os anos, levando conhecimento através de experiências e observações a diferentes regiões do território continental. O objectivo é divulgar a Física de forma dinâmica, atractiva e acessível a toda a comunidade.","É também uma oportunidade para os colaboradores do NFIST partilharem o seu interesse pela área e desenvolverem as suas competências de comunicação científica.","Na edição de 2025, o projecto passou pelos municípios de Estarreja, Fafe, Mondim de Basto, Murtosa, Vila Flor, Vila Real e Viana do Castelo, entre 16 e 26 de Julho."]',
 '[]',
 '[{"label":"Periodicidade","value":"Anual"},{"label":"Duração típica","value":"10 dias"},{"label":"Formato","value":"Feira pública de experiências"},{"label":"Entrada","value":"Gratuita"}]',
 '["Viana do Castelo","Fafe","Mondim de Basto","Vila Real","Vila Flor","Estarreja","Murtosa"]',false,'circo',4),
('estrelas-sobre-o-atlantico','Estrelas Sobre o Atlântico','Projeto especial · ESA','especial','Fevereiro · bienal','Açores · Madeira',
 'Projecto de divulgação científica que leva o NFIST a comunidades insulares — Circo da Física, planetário móvel e observações solares.',
 'https://nfist.tecnico.ulisboa.pt/media/eventos/ESA/ESA-main.JPG',
 '["https://nfist.tecnico.ulisboa.pt/media/grupos/astro/eva25-7.jpg"]',
 '["O Estrelas Sobre o Atlântico é um projecto de divulgação científica que leva o NFIST a comunidades insulares, aproximando a ciência de públicos que nem sempre têm acesso regular a este tipo de iniciativas.","Reúne experiências do Circo da Física, sessões da Astro com planetário móvel e observações solares e nocturnas, numa abordagem interativa e inclusiva.","A primeira edição decorreu entre 4 e 10 de Fevereiro de 2024, nas ilhas Terceira e São Miguel, com sessões em escolas, infantários, centros de atividades de tempos livres e instituições de solidariedade social — cerca de 800 participantes.","A segunda edição decorreu entre 11 e 16 de Fevereiro de 2026, com atividades em escolas do Funchal, Calheta e Machico, e uma Feira da Ciência em parceria com o Museu de História Natural do Funchal e o Departamento de Física da Universidade da Madeira."]',
 '[]',
 '[{"label":"Edições","value":"Açores 2024 · Madeira 2026"},{"label":"Participantes","value":"≈ 800 (Açores)"},{"label":"Formato","value":"Planetário móvel + Circo da Física"},{"label":"Cobertura","value":"RTP Açores · RTP Madeira"}]',
 '[]',false,'circo',5);

-- ==== SEED: repository ====
insert into public.repository_items (title,type,topic,author,item_date,href,sort_order) values
('Pulsar — Edição Primavera 2025','Revista','Divulgação','Pulsar','2025-04','#',1),
('Apontamentos de Mecânica Clássica (MEFT 1º ano)','Apontamentos','Mecânica','Repositório MEFT','2025-02','#',2),
('Watt''s Beyond · Ep. 07 — Buracos negros','Vídeo','Astrofísica','Info','2025-01','#',3),
('Guia de instrumentação para observação nocturna','PDF','Astronomia','Astro','2024-11','#',4),
('Relatório Estrelas Sobre o Atlântico — Açores 2024','PDF','Divulgação','NFIST','2024-06','#',5),
('Introdução à Física Quântica — notas de leitura','Apontamentos','Quântica','Repositório MEFT','2024-05','#',6),
('Pulsar — Edição Outono 2024','Revista','Divulgação','Pulsar','2024-10','#',7),
('Experiências do Circo — manual de montagem','PDF','Experimental','Circo da Física','2024-03','#',8),
('Astrofotografia com câmara DSLR — workshop','Vídeo','Astronomia','Astro','2024-02','#',9),
('Termodinâmica — resumos de exame','Apontamentos','Termodinâmica','Repositório MEFT','2023-12','#',10),
('Relatório JEF 2023','PDF','Institucional','NFIST','2023-11','#',11),
('Electromagnetismo — problemas resolvidos','Apontamentos','Electromagnetismo','Repositório MEFT','2023-09','#',12);
