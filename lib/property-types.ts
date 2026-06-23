// Configuración de tipos de propiedades

export const PROPERTY_TYPES = {
  terreno: {
    label: 'Terreno',
    description: 'Terreno sin urbanizar',
    icon: '🗺️',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  parcela: {
    label: 'Parcela',
    description: 'Parcela con urbanización y servicios',
    icon: '🏡',
    color: 'bg-green-100 text-green-800 border-green-300',
  },
  sitio: {
    label: 'Sitio',
    description: 'Sitio urbano para construcción',
    icon: '📍',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  industrial: {
    label: 'Industrial',
    description: 'Terreno de uso industrial',
    icon: '🏭',
    color: 'bg-slate-100 text-slate-800 border-slate-300',
  },
} as const

export type PropertyType = keyof typeof PROPERTY_TYPES

export function getPropertyTypeLabel(type: PropertyType): string {
  return PROPERTY_TYPES[type]?.label || type
}

export function getPropertyTypeIcon(type: PropertyType): string {
  return PROPERTY_TYPES[type]?.icon || '📍'
}

export function getPropertyTypeColor(type: PropertyType): string {
  return PROPERTY_TYPES[type]?.color || 'bg-gray-100 text-gray-800'
}
