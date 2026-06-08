export type CarCategory     = 'novo' | 'seminovo' | 'venda-direta' | 'consorcio' | 'repasse' | 'entregas'
export type CarStatus       = 'disponivel' | 'reservado' | 'vendido'
export type FuelType        = 'gasolina' | 'etanol' | 'flex' | 'diesel' | 'hibrido' | 'eletrico'
export type TransmissionType = 'manual' | 'automatico' | 'cvt' | 'automatizado'
export type ActivityType    = 'sale' | 'car' | 'client' | 'system'

export const FUEL_LABELS: Record<FuelType, string> = {
  gasolina: 'Gasolina',
  etanol:   'Etanol',
  flex:     'Flex',
  diesel:   'Diesel',
  hibrido:  'Híbrido',
  eletrico: 'Elétrico',
}

export const TRANS_LABELS: Record<TransmissionType, string> = {
  manual:       'Manual',
  automatico:   'Automático',
  cvt:          'CVT',
  automatizado: 'Automatizado',
}

export interface DbCar {
  id:                string
  slug:              string
  category:          CarCategory
  status:            CarStatus
  brand:             string
  model:             string
  version:           string | null
  year:              number
  model_year:        number
  km:                number
  fuel:              FuelType | null
  transmission:      TransmissionType | null
  color:             string | null
  doors:             number | null
  price:             number
  old_price:         number | null
  negotiable:        boolean
  short_description: string
  description:       string
  features:          string[]
  highlights:        string[]
  images:            string[]
  cover_image:       string
  featured:          boolean
  views:             number
  whatsapp_clicks:   number
  created_at:        string
  sold_at:           string | null
  meta_title:        string | null
  meta_description:  string | null

  // Consórcio
  consorcio_tipo_grupo:     string | null
  consorcio_valor_carta:    number | null
  consorcio_valor_parcela:  number | null
  consorcio_prazo:          number | null
  consorcio_taxa_admin:     string | null
  consorcio_fundo_reserva:  string | null
  consorcio_assembleia:     string | null
  consorcio_dia_vencimento: string | null
  consorcio_cashback:       number | null

  // Entrega
  entrega_data:         string | null
  entrega_cliente_nome: string | null
  entrega_veiculo:      string | null
}

export interface DbClient {
  id:         string
  name:       string
  phone:      string
  email:      string | null
  cpf:        string | null
  city:       string | null
  notes:      string | null
  created_at: string
  updated_at: string
}

export interface DbSale {
  id:               string
  car_id:           string | null
  client_id:        string | null
  car_name:         string | null
  client_name:      string | null
  sale_price:       number
  commission_rate:  number
  commission_value: number
  sale_date:        string
  notes:            string | null
  created_at:       string
}

export interface DbActivity {
  id:           string
  type:         ActivityType
    title:        string
  subtitle:     string | null
  entity_id:    string | null
  entity_table: string | null
  created_at:   string
}

export interface DbSettings {
  id:               string
  whatsapp_number:  string
  business_name:    string
  business_hours:   { seg_sex: string; sab: string }
  commission_rate:  number
  updated_at:       string
}

export interface DbNote {
  id:          string
  title:       string | null
  content:     string
  tags:        string[]
  is_pinned:   boolean
  is_completed: boolean
  related_client_id: string | null
  created_at:  string
  updated_at:  string
}

type R = []

export interface Database {
  public: {
    Tables: {
      cars:         { Row: DbCar;      Insert: Omit<DbCar, 'id' | 'created_at' | 'views' | 'whatsapp_clicks'>; Update: Partial<DbCar>;      Relationships: R }
      clients:      { Row: DbClient;   Insert: Omit<DbClient, 'id' | 'created_at' | 'updated_at'>;             Update: Partial<DbClient>;   Relationships: R }
      sales:        { Row: DbSale;     Insert: Omit<DbSale, 'id' | 'created_at' | 'commission_value'>;         Update: Partial<DbSale>;     Relationships: R }
      activity_log: { Row: DbActivity; Insert: Omit<DbActivity, 'id' | 'created_at'>;                          Update: Partial<DbActivity>; Relationships: R }
      settings:     { Row: DbSettings; Insert: Omit<DbSettings, 'id' | 'updated_at'>;                          Update: Partial<DbSettings>; Relationships: R }
      notes:        { Row: DbNote;     Insert: Omit<DbNote, 'id' | 'created_at' | 'updated_at'>;               Update: Partial<DbNote>;     Relationships: R }
    }
  }
}
