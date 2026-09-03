CREATE TABLE public.players (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  display_name text,
  minecraft_username text,
  platform text NOT NULL DEFAULT 'java',
  rank_id uuid REFERENCES public.ranks(id) ON DELETE SET NULL,
  rank_label text,
  points integer NOT NULL DEFAULT 0,
  join_status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX players_username_unique ON public.players (lower(minecraft_username)) WHERE minecraft_username IS NOT NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.players TO authenticated;
GRANT ALL ON public.players TO service_role;

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view their own profile" ON public.players
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Players can create their own profile" ON public.players
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Players can update their own profile" ON public.players
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all players" ON public.players
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert players" ON public.players
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update players" ON public.players
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete players" ON public.players
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.protect_player_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin() THEN
    NEW.updated_at = now();
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.points = 0;
    NEW.rank_id = NULL;
    NEW.rank_label = NULL;
    NEW.join_status = 'pending';
    NEW.notes = NULL;
  ELSE
    NEW.points = OLD.points;
    NEW.rank_id = OLD.rank_id;
    NEW.rank_label = OLD.rank_label;
    NEW.join_status = OLD.join_status;
    NEW.notes = OLD.notes;
    NEW.user_id = OLD.user_id;
  END IF;

  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER players_protect_fields
BEFORE INSERT OR UPDATE ON public.players
FOR EACH ROW EXECUTE FUNCTION public.protect_player_fields();