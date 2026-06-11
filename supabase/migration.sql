-- ============================================================
-- Shopping das Motos — Migration para banco EXISTENTE
-- Execute no Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
--
-- Este script é seguro para rodar múltiplas vezes (idempotente).
-- Use schema.sql apenas se o banco for NOVO (criado do zero).
-- ============================================================

-- ── 1. Atualiza ENUM car_category com novas categorias ───────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'car_category'::regtype AND enumlabel = 'venda-direta') THEN
    ALTER TYPE car_category ADD VALUE 'venda-direta';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'car_category'::regtype AND enumlabel = 'consorcio') THEN
    ALTER TYPE car_category ADD VALUE 'consorcio';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'car_category'::regtype AND enumlabel = 'entregas') THEN
    ALTER TYPE car_category ADD VALUE 'entregas';
  END IF;
END $$;

-- ── 2. Torna fuel, transmission, color, doors nullable ───────
-- (consórcio e entrega não preenchem esses campos)
ALTER TABLE cars ALTER COLUMN fuel         DROP NOT NULL;
ALTER TABLE cars ALTER COLUMN transmission DROP NOT NULL;
ALTER TABLE cars ALTER COLUMN color        DROP NOT NULL;
ALTER TABLE cars ALTER COLUMN doors        DROP NOT NULL;

-- ── 3. Adiciona colunas de Consórcio na tabela cars ──────────
ALTER TABLE cars ADD COLUMN IF NOT EXISTS consorcio_tipo_grupo     TEXT;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS consorcio_valor_carta    NUMERIC(12,2);
ALTER TABLE cars ADD COLUMN IF NOT EXISTS consorcio_valor_parcela  NUMERIC(12,2);
ALTER TABLE cars ADD COLUMN IF NOT EXISTS consorcio_prazo          INT;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS consorcio_taxa_admin     TEXT;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS consorcio_fundo_reserva  TEXT;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS consorcio_assembleia     TEXT;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS consorcio_dia_vencimento TEXT;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS consorcio_cashback       NUMERIC(12,2);

-- ── 4. Adiciona colunas de Entrega na tabela cars ────────────
ALTER TABLE cars ADD COLUMN IF NOT EXISTS entrega_data         DATE;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS entrega_cliente_nome TEXT;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS entrega_veiculo      TEXT;

-- ── 5. Adiciona status na tabela sales ───────────────────────
ALTER TABLE sales ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'concluida';

-- ── 6. Atualiza settings (nome e WhatsApp do negócio) ────────
UPDATE settings SET
  business_name   = 'Shopping das Motos',
  whatsapp_number = '5595984102562'
WHERE true;

INSERT INTO settings (business_name, whatsapp_number)
SELECT 'Shopping das Motos', '5595984102562'
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- ── 7. Corrige trigger: só marca vendido quando concluída ────
CREATE OR REPLACE FUNCTION on_sale_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.car_id IS NOT NULL AND (NEW.status IS NULL OR NEW.status = 'concluida') THEN
    UPDATE cars SET status = 'vendido', sold_at = NOW() WHERE id = NEW.car_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── 8. Corrige log de atividade (Carro → Moto) ───────────────
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
