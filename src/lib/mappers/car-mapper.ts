import type { DbCar } from '@/lib/supabase/types'
import type { Car } from '@/types'

export function dbCarToCar(db: DbCar): Car {
  return {
    id:               db.id,
    slug:             db.slug,
    category:         db.category,
    status:           db.status,
    brand:            db.brand,
    model:            db.model,
    version:          db.version ?? undefined,
    year:             db.year,
    modelYear:        db.model_year,
    km:               db.km,
    fuel:             db.fuel ?? undefined,
    transmission:     db.transmission ?? undefined,
    color:            db.color ?? undefined,
    doors:            db.doors ?? undefined,
    price:            db.price,
    oldPrice:         db.old_price ?? undefined,
    negotiable:       db.negotiable,
    shortDescription: db.short_description,
    description:      db.description,
    features:         db.features,
    highlights:       db.highlights,
    images:           db.images?.length ? db.images : ['/images/placeholder-car.svg'],
    coverImage:       db.cover_image || '/images/placeholder-car.svg',
    featured:         db.featured,
    views:            db.views,
    createdAt:        db.created_at,
    soldAt:           db.sold_at ?? undefined,
    metaTitle:        db.meta_title ?? undefined,
    metaDescription:  db.meta_description ?? undefined,

    // Consórcio
    consorcioTipoGrupo:     db.consorcio_tipo_grupo    ?? undefined,
    consorcioValorCarta:    db.consorcio_valor_carta   ?? undefined,
    consorcioValorParcela:  db.consorcio_valor_parcela ?? undefined,
    consorcioPrazo:         db.consorcio_prazo         ?? undefined,
    consorcioTaxaAdmin:     db.consorcio_taxa_admin    ?? undefined,
    consorcioFundoReserva:  db.consorcio_fundo_reserva ?? undefined,
    consorcioAssembleia:    db.consorcio_assembleia    ?? undefined,
    consorcioDiaVencimento: db.consorcio_dia_vencimento ?? undefined,
    consorcioCashback:      db.consorcio_cashback      ?? undefined,

    // Entrega
    entregaData:        db.entrega_data         ?? undefined,
    entregaClienteNome: db.entrega_cliente_nome ?? undefined,
    entregaVeiculo:     db.entrega_veiculo      ?? undefined,
  }
}

export function dbCarsToCars(dbCars: DbCar[]): Car[] {
  return dbCars.map(dbCarToCar)
}
