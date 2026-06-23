// Constantes del proyecto

// Mapeo de enums a labels en español
export const WATER_SOURCE_LABELS = {
  apr: 'APR',
  well: 'Pozo',
  water_rights: 'Derechos de agua',
  none: 'Sin agua',
  unknown: 'No especificado',
} as const

export const ELECTRICITY_LABELS = {
  available: 'Disponible',
  nearby: 'Cercana',
  none: 'Sin electricidad',
  unknown: 'No especificado',
} as const

export const INTERNET_LABELS = {
  fiber: 'Fibra óptica',
  signal: 'Señal móvil',
  none: 'Sin internet',
  unknown: 'No especificado',
} as const

export const PARCEL_STATUS_LABELS = {
  available: 'Disponible',
  reserved: 'Reservada',
  sold: 'Vendida',
} as const

export const LEAD_STATUS_LABELS = {
  new: 'Nuevo',
  contacted: 'Contactado',
  visit_scheduled: 'Visita agendada',
  visited: 'Visitó',
  negotiating: 'Negociando',
  won: 'Ganado ✅',
  lost: 'Perdido ❌',
} as const

export const PAYMENT_METHOD_LABELS = {
  cash: 'Contado',
  direct_credit: 'Crédito directo',
  unknown: 'No definido',
} as const

export const INTENT_LABELS = {
  live: 'Vivir',
  invest: 'Invertir',
  second_home: 'Segunda vivienda',
  unknown: 'No definido',
} as const

export const TIMEFRAME_LABELS = {
  immediate: 'Inmediato',
  '1_3_months': '1-3 meses',
  '3_6_months': '3-6 meses',
  exploring: 'Explorando',
  unknown: 'No definido',
} as const

export const AMORTIZATION_LABELS = {
  french: 'Francés (cuota fija)',
  german: 'Alemán (amortización constante)',
  american: 'Americano (solo interés)',
  negative: 'Negativo (cuota < interés)',
  balloon: 'Balloon (pago final)',
} as const

// Comunas de Chile (principales)
export const COMUNAS_SANTIAGO = [
  'Colina',
  'Chicureo',
  'Lampa',
  'Til Til',
  'Pirque',
  'San José de Maipo',
  'Buin',
  'Paine',
  'Calera de Tango',
] as const

// Regiones de Chile
export const REGIONES = [
  'Región Metropolitana',
  'Región de Valparaíso',
  'Región de O\'Higgins',
  'Región del Maule',
  'Región del Biobío',
  'Región de La Araucanía',
  'Región de Los Lagos',
  'Región de Los Ríos',
  'Región de Aysén',
  'Región de Magallanes',
  'Región de Antofagasta',
  'Región de Atacama',
  'Región de Coquimbo',
  'Región de Tarapacá',
  'Región de Arica y Parinacota',
  'Región de Ñuble',
] as const
