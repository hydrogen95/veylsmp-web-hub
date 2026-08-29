CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

INSERT INTO public.admin_users (email) VALUES ('zensuyui@gmail.com');

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users a
    WHERE lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

CREATE POLICY "admin can read admin list" ON public.admin_users
FOR SELECT TO authenticated USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.server_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  server_name text NOT NULL DEFAULT 'VeylSMP',
  description text NOT NULL DEFAULT 'An economy survival Minecraft server with Lifesteal and crossplay.',
  game_modes text NOT NULL DEFAULT 'Economy Survival',
  combat text NOT NULL DEFAULT 'Lifesteal',
  platform text NOT NULL DEFAULT 'Java + Bedrock Crossplay',
  java_ip text NOT NULL DEFAULT 'veyl.playsmp.lol',
  java_port text NOT NULL DEFAULT '34342',
  bedrock_ip text NOT NULL DEFAULT 'veyl.playsmp.lol',
  bedrock_port text NOT NULL DEFAULT '34342',
  max_players integer NOT NULL DEFAULT 100,
  server_version text NOT NULL DEFAULT '1.21.x',
  motd text NOT NULL DEFAULT 'Welcome to VeylSMP',
  status_host text NOT NULL DEFAULT 'veyl.playsmp.lol',
  status_port text NOT NULL DEFAULT '34342',
  check_java boolean NOT NULL DEFAULT true,
  check_bedrock boolean NOT NULL DEFAULT false,
  refresh_interval integer NOT NULL DEFAULT 45,
  show_status boolean NOT NULL DEFAULT true,
  maintenance_mode boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.server_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.server_settings TO authenticated;
GRANT ALL ON public.server_settings TO service_role;
ALTER TABLE public.server_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read server settings" ON public.server_settings FOR SELECT USING (true);
CREATE POLICY "admin write server settings" ON public.server_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_server_settings_updated BEFORE UPDATE ON public.server_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
INSERT INTO public.server_settings (id) VALUES (1);

CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_title text NOT NULL DEFAULT 'VeylSMP',
  hero_headline text NOT NULL DEFAULT 'SURVIVE. BUILD. DOMINATE.',
  hero_subtitle text NOT NULL DEFAULT 'An economy survival Minecraft server with Lifesteal and crossplay.',
  hero_image text DEFAULT NULL,
  hero_background text DEFAULT NULL,
  primary_button_label text NOT NULL DEFAULT 'PLAY NOW',
  primary_button_url text NOT NULL DEFAULT '#connect',
  secondary_button_label text NOT NULL DEFAULT 'JOIN DISCORD',
  discord_url text NOT NULL DEFAULT 'https://discord.gg/veylsmp',
  discord_widget_id text DEFAULT NULL,
  discord_title text NOT NULL DEFAULT 'JOIN THE VEYLSMP COMMUNITY',
  discord_description text NOT NULL DEFAULT 'Connect with other players, get server updates, participate in events, and become part of the VeylSMP community.',
  logo_url text DEFAULT NULL,
  favicon_url text DEFAULT NULL,
  primary_color text NOT NULL DEFAULT '#2563eb',
  secondary_color text NOT NULL DEFAULT '#0ea5e9',
  accent_color text NOT NULL DEFAULT '#22d3ee',
  background_color text NOT NULL DEFAULT '#060b1a',
  text_color text NOT NULL DEFAULT '#eaf2ff',
  font_heading text NOT NULL DEFAULT 'Outfit',
  font_body text NOT NULL DEFAULT 'Inter',
  border_radius numeric NOT NULL DEFAULT 0.9,
  glow_intensity numeric NOT NULL DEFAULT 0.6,
  seo_title text NOT NULL DEFAULT 'VeylSMP | Minecraft Economy Survival Server',
  seo_description text NOT NULL DEFAULT 'Join VeylSMP — a Minecraft Economy Survival server featuring Lifesteal and Java + Bedrock crossplay.',
  java_steps text[] NOT NULL DEFAULT ARRAY['Open Minecraft Java Edition.','Select Multiplayer.','Click Add Server.','Enter veyl.playsmp.lol','Connect.'],
  bedrock_steps text[] NOT NULL DEFAULT ARRAY['Open Minecraft Bedrock Edition.','Go to Servers.','Select Add Server.','Enter address veyl.playsmp.lol and port 34342.','Connect.'],
  sections jsonb NOT NULL DEFAULT '[{"key":"status","label":"Live Server Status","visible":true},{"key":"connect","label":"Connection Card","visible":true},{"key":"crossplay","label":"Java or Bedrock","visible":true},{"key":"features","label":"Why VeylSMP","visible":true},{"key":"info","label":"Server Info","visible":true},{"key":"ranks","label":"Ranks","visible":true},{"key":"news","label":"News","visible":true},{"key":"join","label":"How To Join","visible":true},{"key":"discord","label":"Discord","visible":true}]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "admin write site settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
INSERT INTO public.site_settings (id) VALUES (1);

CREATE TABLE public.features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Sparkles',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.features TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.features TO authenticated;
GRANT ALL ON public.features TO service_role;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read features" ON public.features FOR SELECT USING (true);
CREATE POLICY "admin write features" ON public.features FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
INSERT INTO public.features (icon, title, description, sort_order) VALUES
 ('Coins','ECONOMY','Build your wealth, trade with players, and create your own empire.',1),
 ('Pickaxe','SURVIVAL','Explore, build, gather resources, and survive in a persistent world.',2),
 ('HeartPulse','LIFESTEAL','Fight other players and experience the Lifesteal gameplay system.',3),
 ('Users','CROSSPLAY','Play together with both Java and Bedrock players.',4);

CREATE TABLE public.rank_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rank_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rank_categories TO authenticated;
GRANT ALL ON public.rank_categories TO service_role;
ALTER TABLE public.rank_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read rank categories" ON public.rank_categories FOR SELECT USING (true);
CREATE POLICY "admin write rank categories" ON public.rank_categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
INSERT INTO public.rank_categories (name, description, sort_order) VALUES ('PLAYER RANKS','Support the server and unlock perks.',1);

CREATE TABLE public.ranks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.rank_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'PHP',
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  duration text NOT NULL DEFAULT 'Lifetime',
  color text NOT NULL DEFAULT '#22d3ee',
  icon text NOT NULL DEFAULT 'Crown',
  purchase_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ranks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ranks TO authenticated;
GRANT ALL ON public.ranks TO service_role;
ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read ranks" ON public.ranks FOR SELECT USING (true);
CREATE POLICY "admin write ranks" ON public.ranks FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
INSERT INTO public.ranks (category_id, name, price, currency, description, features, color, icon, sort_order)
SELECT c.id, v.name, v.price, 'PHP', v.description, v.features, v.color, v.icon, v.sort_order
FROM public.rank_categories c,
 (VALUES
  ('VIP', 99, 'A great start for new supporters.', ARRAY['Colored chat','/kit vip','2 extra homes'], '#38bdf8', 'Star', 1),
  ('MVP', 199, 'More perks and more power.', ARRAY['All VIP perks','/kit mvp','4 extra homes','/feed'], '#22d3ee', 'Gem', 2),
  ('PRO', 349, 'For dedicated players.', ARRAY['All MVP perks','/kit pro','6 extra homes','/heal'], '#60a5fa', 'Shield', 3),
  ('ELITE', 599, 'Elite status on VeylSMP.', ARRAY['All PRO perks','/kit elite','10 extra homes','Priority queue'], '#818cf8', 'Crown', 4),
  ('LEGEND', 999, 'The ultimate VeylSMP rank.', ARRAY['All ELITE perks','/kit legend','Unlimited homes','Custom prefix'], '#a78bfa', 'Flame', 5)
 ) AS v(name, price, description, features, color, icon, sort_order)
WHERE c.name = 'PLAYER RANKS';

CREATE TABLE public.rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  content text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rules TO authenticated;
GRANT ALL ON public.rules TO service_role;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read rules" ON public.rules FOR SELECT USING (true);
CREATE POLICY "admin write rules" ON public.rules FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
INSERT INTO public.rules (content, sort_order) VALUES
 ('No cheating or unauthorized clients.',1),
 ('No exploiting server bugs.',2),
 ('Respect other players.',3),
 ('No harassment.',4),
 ('No inappropriate content.',5),
 ('Do not intentionally damage the server experience.',6),
 ('Follow staff instructions.',7);

CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Announcement',
  image_url text DEFAULT NULL,
  author text NOT NULL DEFAULT 'VeylSMP Staff',
  published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news TO authenticated;
GRANT ALL ON public.news TO service_role;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published news" ON public.news FOR SELECT USING (published = true);
CREATE POLICY "admin read all news" ON public.news FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin write news" ON public.news FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
INSERT INTO public.news (title, description, category, author) VALUES
 ('VeylSMP is now open!','Join our economy survival world with Lifesteal and full Java + Bedrock crossplay. Grab a starter kit at spawn and begin your empire.','Announcement','VeylSMP Staff');

CREATE TABLE public.navigation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.navigation TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.navigation TO authenticated;
GRANT ALL ON public.navigation TO service_role;
ALTER TABLE public.navigation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read navigation" ON public.navigation FOR SELECT USING (true);
CREATE POLICY "admin write navigation" ON public.navigation FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
INSERT INTO public.navigation (label, href, sort_order) VALUES
 ('Home','/',1),('Server','/server',2),('Ranks','/ranks',3),('Rules','/rules',4),('News','/news',5);

CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  path text NOT NULL,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read media" ON public.media FOR SELECT USING (true);
CREATE POLICY "admin write media" ON public.media FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  admin_email text NOT NULL DEFAULT '',
  target text NOT NULL DEFAULT '',
  details jsonb DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read logs" ON public.activity_logs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin insert logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "admin read media bucket" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "admin insert media bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "admin update media bucket" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "admin delete media bucket" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin());