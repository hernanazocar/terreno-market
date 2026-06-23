// Sistema de scoring de leads 0-100

interface LeadData {
  budget_uf: number | null
  payment_method: 'cash' | 'direct_credit' | 'unknown'
  intent: 'live' | 'invest' | 'second_home' | 'unknown'
  decision_timeframe: 'immediate' | '1_3_months' | '3_6_months' | 'exploring' | 'unknown'
  engagement_level: number // 0-100 basado en respuestas completas
  parcel_price_uf: number
}

interface ScoreBreakdown {
  budget_match: number
  payment_clarity: number
  timeframe_urgency: number
  intent_clarity: number
  engagement: number
}

interface ScoringResult {
  total_score: number
  temperature: 'hot' | 'warm' | 'cold'
  breakdown: ScoreBreakdown
}

/**
 * Calcula el score de un lead basado en múltiples factores
 */
export function calculateLeadScore(data: LeadData): ScoringResult {
  const breakdown: ScoreBreakdown = {
    budget_match: calculateBudgetMatch(data.budget_uf, data.parcel_price_uf),
    payment_clarity: calculatePaymentClarity(data.payment_method),
    timeframe_urgency: calculateTimeframeScore(data.decision_timeframe),
    intent_clarity: calculateIntentScore(data.intent),
    engagement: data.engagement_level,
  }

  // Pesos de cada factor
  const weights = {
    budget_match: 0.30,      // 30% - lo más importante
    payment_clarity: 0.25,   // 25% - clave para saber si puede comprar
    timeframe_urgency: 0.20, // 20% - urgencia de decisión
    intent_clarity: 0.15,    // 15% - claridad de propósito
    engagement: 0.10,        // 10% - nivel de engagement
  }

  // Calcular score total ponderado
  const total_score = Math.round(
    breakdown.budget_match * weights.budget_match +
    breakdown.payment_clarity * weights.payment_clarity +
    breakdown.timeframe_urgency * weights.timeframe_urgency +
    breakdown.intent_clarity * weights.intent_clarity +
    breakdown.engagement * weights.engagement
  )

  // Determinar temperatura
  let temperature: 'hot' | 'warm' | 'cold'
  if (total_score >= 70) {
    temperature = 'hot'
  } else if (total_score >= 40) {
    temperature = 'warm'
  } else {
    temperature = 'cold'
  }

  return {
    total_score,
    temperature,
    breakdown,
  }
}

/**
 * Score de match presupuesto vs precio parcela
 */
function calculateBudgetMatch(budget: number | null, price: number): number {
  if (!budget) return 0

  const ratio = budget / price

  if (ratio >= 1.2) return 100  // Tiene 20% más del precio
  if (ratio >= 1.1) return 95   // Tiene 10% más
  if (ratio >= 1.0) return 90   // Le da justo
  if (ratio >= 0.9) return 70   // Le falta poco (puede negociar o tiene más ahorros)
  if (ratio >= 0.8) return 50   // Le falta bastante
  if (ratio >= 0.7) return 30   // Difícil que le alcance
  return 10                      // No le alcanza
}

/**
 * Score de claridad del método de pago
 */
function calculatePaymentClarity(method: 'cash' | 'direct_credit' | 'unknown'): number {
  switch (method) {
    case 'cash':
      return 100 // Pago al contado es lo mejor
    case 'direct_credit':
      return 85  // Crédito directo definido es muy bueno
    case 'unknown':
      return 0   // No sabe cómo pagar
  }
}

/**
 * Score de urgencia según plazo de decisión
 */
function calculateTimeframeScore(timeframe: 'immediate' | '1_3_months' | '3_6_months' | 'exploring' | 'unknown'): number {
  switch (timeframe) {
    case 'immediate':
      return 100 // Quiere comprar ya
    case '1_3_months':
      return 80  // Corto plazo
    case '3_6_months':
      return 50  // Mediano plazo
    case 'exploring':
      return 20  // Solo mirando
    case 'unknown':
      return 0   // No definió
  }
}

/**
 * Score de claridad de intención
 */
function calculateIntentScore(intent: 'live' | 'invest' | 'second_home' | 'unknown'): number {
  switch (intent) {
    case 'live':
      return 100 // Quiere vivir ahí (más emocional, cierra más rápido)
    case 'invest':
      return 85  // Inversionista (más racional, pero con plata)
    case 'second_home':
      return 90  // Segunda vivienda (balance emocional/racional)
    case 'unknown':
      return 0   // No sabe para qué
  }
}
