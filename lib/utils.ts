import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formateo de precios
export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatUF(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' UF'
}

// Valor de UF actualizado (este valor cambia diariamente - idealmente vendría de una API)
export const VALOR_UF_HOY = 40000 // CLP por UF (valor referencial)

export function ufToCLP(uf: number): number {
  return Math.round(uf * VALOR_UF_HOY)
}

export function clpToUF(clp: number): number {
  return parseFloat((clp / VALOR_UF_HOY).toFixed(2))
}

// Formateo de superficie
export function formatM2(m2: number): string {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(m2) + ' m²'
}

// Formateo de fechas
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// Formateo de números de teléfono chilenos
export function formatPhoneCL(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('569')) {
    // +569 1234 5678
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
  }
  return phone
}

// Score a temperatura
export function scoreToTemperature(score: number | null): 'hot' | 'warm' | 'cold' | null {
  if (score === null) return null
  if (score >= 70) return 'hot'
  if (score >= 40) return 'warm'
  return 'cold'
}

// Color según temperatura
export function temperatureColor(temp: 'hot' | 'warm' | 'cold' | null): string {
  if (!temp) return 'text-muted-foreground'
  switch (temp) {
    case 'hot':
      return 'text-error'
    case 'warm':
      return 'text-warning'
    case 'cold':
      return 'text-info'
  }
}

// Badge de temperatura
export function temperatureLabel(temp: 'hot' | 'warm' | 'cold' | null): string {
  if (!temp) return 'Sin calificar'
  switch (temp) {
    case 'hot':
      return 'Caliente 🔥'
    case 'warm':
      return 'Tibio'
    case 'cold':
      return 'Frío'
  }
}
