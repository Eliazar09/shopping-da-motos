-- ============================================================
-- Shopping das Motos — Supabase Schema COMPLETO
-- Atualizado: 2026-06-11
-- Tabelas: settings, admin_users, cars, clients, sales, notes, activity_log
-- Execute no SQL Editor: https://supabase.com/dashboard/project/_/sql/new
-- ATENÇÃO: Este arquivo é para bancos NOVOS (DROP + CREATE).
--          Para bancos existentes, use migration.sql
-- ============================================================

-- ── ENUMs ────────────────────────────────────────────────────
CREATE TYPE car_category      AS ENUM ('novo', 'seminovo', 'repasse', 'venda-direta', 'consorcio', 'entregas');
CREATE TYPE car_status        AS ENUM ('disponivel', 'reservado', 'vendido');
CREATE TYPE fuel_type         AS ENUM ('gasolina', 'etanol', 'flex', 'diesel', 'hibrido', 'eletrico');
CREATE TYPE transmission_type AS ENUM ('manual', 'automatico', 'cvt', 'automatizado');
CREATE TYPE activity_type     AS ENUM ('sale', 'car', 'client', 'system');

-- ── SETTINGS ─────────────────────────────────────────────────
CREATE TABLE settings (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number  TEXT         NOT NULL DEFAULT '5595984102562',
  business_name    TEXT         NOT NULL DEFAULT 'Shopping das Motos',
  business_hours   JSONB                 DEFAULT '{"seg_sex":"08:00-18:00","sab":"08:00-12:00"}',
  commission_rate  NUMERIC(5,2)          DEFAULT 3.00,
  updated_at       TIMESTAMPTZ           DEFAULT NOW()
);

-- ── ADMIN USERS ──────────────────────────────────────────────
CREATE TABLE admin_users (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  username     TEXT        UNIQUE NOT NULL,
  display_name TEXT        NOT NULL,
  email        TEXT        NOT NULL,
  role         TEXT        NOT NULL DEFAULT 'admin',
  last_login   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── CARS ─────────────────────────────────────────────────────
-- Nota: fuel, transmission, color, doors são nullable porque
-- consórcio e entrega não preenchem esses campos.
CREATE TABLE cars (
  id                UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT              UNIQUE NOT NULL,
  category          car_category      NOT NULL DEFAULT 'seminovo',
  status            car_status        NOT NULL DEFAULT 'disponivel',

  brand             TEXT              NOT NULL,
  model             TEXT              NOT NULL,
  version           TEXT,
  year              INT               NOT NULL,
  model_year        INT               NOT NULL,

  km                INT               NOT NULL DEFAULT 0,
  fuel              fuel_type,
  transmission      transmission_type,
  color             TEXT,
  doors             INT,

  price             NUMERIC(12,2)     NOT NULL DEFAULT 0,
  old_price         NUMERIC(12,2),
  negotiable        BOOLEAN           NOT NULL DEFAULT false,

  short_description TEXT              NOT NULL DEFAULT '',
  description       TEXT              NOT NULL DEFAULT '',
  features          TEXT[]            NOT NULL DEFAULT '{}',
  highlights        TEXT[]            NOT NULL DEFAULT '{}',

  images            TEXT[]            NOT NULL DEFAULT '{}',
  cover_image       TEXT              NOT NULL DEFAULT '',

  featured          BOOLEAN           NOT NULL DEFAULT false,
  views             INT               NOT NULL DEFAULT 0,
  whatsapp_clicks   INT               NOT NULL DEFAULT 0,

  -- Campos de Consórcio
  consorcio_tipo_grupo      TEXT,
  consorcio_valor_carta     NUMERIC(12,2),
  consorcio_valor_parcela   NUMERIC(12,2),
  consorcio_prazo           INT,
  consorcio_taxa_admin      TEXT,
  consorcio_fundo_reserva   TEXT,
  consorcio_assembleia      TEXT,
  consorcio_dia_vencimento  TEXT,
  consorcio_cashback        NUMERIC(12,2),

  -- Campos de Entrega
  entrega_data          DATE,
  entrega_cliente_nome  TEXT,
  entrega_veiculo       TEXT,

  created_at        TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  sold_at           TIMESTAMPTZ,
  meta_title        TEXT,
  meta_description  TEXT
);

-- ── CLIENTS ──────────────────────────────────────────────────
CREATE TABLE clients (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  phone      TEXT        NOT NULL,
  email      TEXT,
  cpf        TEXT,
  city       TEXT,
  state      TEXT,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── SALES ────────────────────────────────────────────────────
CREATE TABLE sales (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id           UUID          REFERENCES cars(id) ON DELETE SET NULL,
  client_id        UUID          REFERENCES clients(id) ON DELETE SET NULL,
  car_name         TEXT,
  client_name      TEXT,
  sale_price       NUMERIC(12,2) NOT NULL,
  commission_rate  NUMERIC(5,2)  NOT NULL DEFAULT 3.00,
  commission_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  sale_date        DATE          NOT NULL DEFAULT CURRENT_DATE,
  status           TEXT          NOT NULL DEFAULT 'concluida',
  notes            TEXT,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── NOTES ────────────────────────────────────────────────────
CREATE TABLE notes (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title              TEXT,
  content            TEXT        NOT NULL DEFAULT '',
  tags               TEXT[]      NOT NULL DEFAULT '{}',
  is_pinned          BOOLEAN     NOT NULL DEFAULT false,
  is_completed       BOOLEAN     NOT NULL DEFAULT false,
  related_client_id  UUID        REFERENCES clients(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── ACTIVITY LOG ─────────────────────────────────────────────
CREATE TABLE activity_log (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  type         activity_type NOT NULL,
  title        TEXT          NOT NULL,
  subtitle     TEXT,
  entity_id    UUID,
  entity_table TEXT,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── FUNCTIONS ────────────────────────────────────────────────

-- Resolve username → email para o login (chamada via RPC pelo cliente)
CREATE OR REPLACE FUNCTION get_email_by_username(input_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT email INTO v_email
  FROM admin_users
  WHERE username = input_username
  LIMIT 1;
  RETURN v_email;
END;
$$;

-- Auto updated_at genérico
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calcula commission_value automaticamente
CREATE OR REPLACE FUNCTION calc_commission()
RETURNS TRIGGER AS $$
BEGIN
  NEW.commission_value := NEW.sale_price * NEW.commission_rate / 100;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sales_calc_commission
  BEFORE INSERT OR UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION calc_commission();

-- Marca carro como vendido ao registrar venda concluída
CREATE OR REPLACE FUNCTION on_sale_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.car_id IS NOT NULL AND (NEW.status IS NULL OR NEW.status = 'concluida') THEN
    UPDATE cars SET status = 'vendido', sold_at = NOW() WHERE id = NEW.car_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sale_marks_car_sold
  AFTER INSERT ON sales
  FOR EACH ROW EXECUTE FUNCTION on_sale_completed();

-- Log de atividade ao registrar venda
CREATE OR REPLACE FUNCTION log_sale_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_car_name    TEXT;
  v_client_name TEXT;
BEGIN
  v_car_name    := COALESCE(NEW.car_name, 'Moto');
  v_client_name := COALESCE(NEW.client_name, 'Desconhecido');
  INSERT INTO activity_log (type, title, subtitle, entity_id, entity_table)
  VALUES (
    'sale',
    v_car_name || ' vendida',
    'Cliente: ' || v_client_name || ' · Comissão: R$ ' ||
      TO_CHAR(NEW.commission_value, 'FM999G999D00'),
    NEW.id,
    'sales'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_sale
  AFTER INSERT ON sales
  FOR EACH ROW EXECUTE FUNCTION log_sale_activity();

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users  ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars         ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Cars: público vê disponíveis e reservados; autenticado vê tudo
CREATE POLICY "cars_public_select" ON cars
  FOR SELECT USING (status IN ('disponivel', 'reservado') OR auth.role() = 'authenticated');

CREATE POLICY "cars_auth_insert" ON cars
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "cars_auth_update" ON cars
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "cars_auth_delete" ON cars
  FOR DELETE TO authenticated USING (true);

-- Admin users
CREATE POLICY "admin_users_auth_select" ON admin_users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_users_auth_update" ON admin_users
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Demais tabelas: apenas autenticado
CREATE POLICY "settings_auth"     ON settings     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "clients_auth"      ON clients      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "sales_auth"        ON sales        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "notes_auth"        ON notes        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "activity_log_auth" ON activity_log FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── STORAGE — bucket car-photos ──────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'car-photos',
  'car-photos',
  true,
  10485760,  -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "car_photos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'car-photos');

CREATE POLICY "car_photos_auth_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'car-photos');

CREATE POLICY "car_photos_auth_update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'car-photos');

CREATE POLICY "car_photos_auth_delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'car-photos');

-- ── SEED: configurações iniciais ─────────────────────────────
INSERT INTO settings (whatsapp_number, business_name)
VALUES ('5595984102562', 'Shopping das Motos')
ON CONFLICT DO NOTHING;
