// Simulador de crédito directo - 5 tipos de amortización

export type AmortizationType = 'french' | 'german' | 'american' | 'negative' | 'balloon'

export interface FinancingTerms {
  min_down_payment_pct: number
  monthly_interest_rate: number
  max_term_months: number
  amortization_type: AmortizationType
  balloon_pct?: number | null
  notes?: string | null
}

export interface SimulationParams {
  propertyPriceUF: number
  downPaymentPct: number
  termMonths: number
  monthlyRate: number
  amortizationType: AmortizationType
  balloonPct?: number | null
}

export interface PaymentScheduleRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface SimulationResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  financedAmount: number
  schedule: PaymentScheduleRow[]
  balloonPayment?: number
}

// Valor UF (idealmente vendría de una API)
const UF_VALUE = 40000 // CLP

// Convertir UF a CLP
export function ufToCLP(uf: number): number {
  return Math.round(uf * UF_VALUE)
}

/**
 * Sistema Francés - Cuota fija
 * Cada cuota es igual, pero la distribución entre interés y capital cambia.
 */
function calculateFrench(params: SimulationParams): SimulationResult {
  const { propertyPriceUF, downPaymentPct, termMonths, monthlyRate } = params
  const downPayment = propertyPriceUF * (downPaymentPct / 100)
  const financedAmount = propertyPriceUF - downPayment

  // Fórmula de cuota fija: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyPaymentUF =
    financedAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)

  const schedule: PaymentScheduleRow[] = []
  let balance = financedAmount

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate
    const principal = monthlyPaymentUF - interest
    balance -= principal

    schedule.push({
      month,
      payment: ufToCLP(monthlyPaymentUF),
      principal: ufToCLP(principal),
      interest: ufToCLP(interest),
      balance: ufToCLP(Math.max(0, balance)),
    })
  }

  return {
    monthlyPayment: ufToCLP(monthlyPaymentUF),
    totalPayment: ufToCLP(monthlyPaymentUF * termMonths),
    totalInterest: ufToCLP(monthlyPaymentUF * termMonths - financedAmount),
    financedAmount: ufToCLP(financedAmount),
    schedule,
  }
}

/**
 * Sistema Alemán - Amortización constante
 * La amortización de capital es constante, los intereses decrecen.
 */
function calculateGerman(params: SimulationParams): SimulationResult {
  const { propertyPriceUF, downPaymentPct, termMonths, monthlyRate } = params
  const downPayment = propertyPriceUF * (downPaymentPct / 100)
  const financedAmount = propertyPriceUF - downPayment

  const constantPrincipal = financedAmount / termMonths
  const schedule: PaymentScheduleRow[] = []
  let balance = financedAmount
  let totalPayment = 0

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate
    const payment = constantPrincipal + interest
    balance -= constantPrincipal

    schedule.push({
      month,
      payment: ufToCLP(payment),
      principal: ufToCLP(constantPrincipal),
      interest: ufToCLP(interest),
      balance: ufToCLP(Math.max(0, balance)),
    })

    totalPayment += payment
  }

  return {
    monthlyPayment: schedule[0].payment, // Primera cuota (la más alta)
    totalPayment: ufToCLP(totalPayment),
    totalInterest: ufToCLP(totalPayment - financedAmount),
    financedAmount: ufToCLP(financedAmount),
    schedule,
  }
}

/**
 * Sistema Americano - Solo interés + capital al final
 * Cuotas bajas de solo interés, al final se paga todo el capital.
 */
function calculateAmerican(params: SimulationParams): SimulationResult {
  const { propertyPriceUF, downPaymentPct, termMonths, monthlyRate } = params
  const downPayment = propertyPriceUF * (downPaymentPct / 100)
  const financedAmount = propertyPriceUF - downPayment

  const monthlyInterestPayment = financedAmount * monthlyRate
  const schedule: PaymentScheduleRow[] = []
  let totalPayment = 0

  for (let month = 1; month <= termMonths; month++) {
    const isLastMonth = month === termMonths
    const payment = isLastMonth ? monthlyInterestPayment + financedAmount : monthlyInterestPayment
    const principal = isLastMonth ? financedAmount : 0
    const interest = monthlyInterestPayment
    const balance = isLastMonth ? 0 : financedAmount

    schedule.push({
      month,
      payment: ufToCLP(payment),
      principal: ufToCLP(principal),
      interest: ufToCLP(interest),
      balance: ufToCLP(balance),
    })

    totalPayment += payment
  }

  return {
    monthlyPayment: ufToCLP(monthlyInterestPayment),
    totalPayment: ufToCLP(totalPayment),
    totalInterest: ufToCLP(monthlyInterestPayment * termMonths),
    financedAmount: ufToCLP(financedAmount),
    schedule,
    balloonPayment: ufToCLP(financedAmount),
  }
}

/**
 * Sistema Negativo - Cuota < interés, saldo crece
 * La cuota es menor al interés generado, la diferencia se capitaliza.
 */
function calculateNegative(params: SimulationParams): SimulationResult {
  const { propertyPriceUF, downPaymentPct, termMonths, monthlyRate } = params
  const downPayment = propertyPriceUF * (downPaymentPct / 100)
  const financedAmount = propertyPriceUF - downPayment

  // Cuota fija más baja (ej: 70% del interés del primer mes)
  const interestFirstMonth = financedAmount * monthlyRate
  const fixedPayment = interestFirstMonth * 0.7 // Cuota artificial baja

  const schedule: PaymentScheduleRow[] = []
  let balance = financedAmount
  let totalPayment = 0

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate
    const principal = fixedPayment - interest // Negativo
    balance -= principal // Aumenta porque principal es negativo

    schedule.push({
      month,
      payment: ufToCLP(fixedPayment),
      principal: ufToCLP(principal),
      interest: ufToCLP(interest),
      balance: ufToCLP(balance),
    })

    totalPayment += fixedPayment
  }

  // Al final queda un saldo pendiente (balloon)
  const finalBalance = balance

  return {
    monthlyPayment: ufToCLP(fixedPayment),
    totalPayment: ufToCLP(totalPayment + finalBalance),
    totalInterest: ufToCLP(totalPayment + finalBalance - financedAmount),
    financedAmount: ufToCLP(financedAmount),
    schedule,
    balloonPayment: ufToCLP(finalBalance),
  }
}

/**
 * Sistema Balloon - Cuotas bajas + pago final grande
 * Cuotas bajas durante el plazo, al final un pago grande (% del capital).
 */
function calculateBalloon(params: SimulationParams): SimulationResult {
  const { propertyPriceUF, downPaymentPct, termMonths, monthlyRate, balloonPct } = params
  const downPayment = propertyPriceUF * (downPaymentPct / 100)
  const financedAmount = propertyPriceUF - downPayment

  const balloonAmount = financedAmount * ((balloonPct || 30) / 100) // Default 30%
  const amortizedAmount = financedAmount - balloonAmount

  // Calcular cuota regular para el monto amortizado
  const monthlyPaymentUF =
    amortizedAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)

  const schedule: PaymentScheduleRow[] = []
  let balance = amortizedAmount
  let totalPayment = 0

  for (let month = 1; month <= termMonths; month++) {
    const isLastMonth = month === termMonths
    const interest = balance * monthlyRate
    const principal = monthlyPaymentUF - interest
    balance -= principal

    const payment = isLastMonth ? monthlyPaymentUF + balloonAmount : monthlyPaymentUF

    schedule.push({
      month,
      payment: ufToCLP(payment),
      principal: ufToCLP(isLastMonth ? principal + balloonAmount : principal),
      interest: ufToCLP(interest),
      balance: ufToCLP(Math.max(0, isLastMonth ? 0 : balance + balloonAmount)),
    })

    totalPayment += payment
  }

  return {
    monthlyPayment: ufToCLP(monthlyPaymentUF),
    totalPayment: ufToCLP(totalPayment),
    totalInterest: ufToCLP(totalPayment - financedAmount),
    financedAmount: ufToCLP(financedAmount),
    schedule,
    balloonPayment: ufToCLP(balloonAmount),
  }
}

/**
 * Función principal del simulador
 */
export function simulateCredit(params: SimulationParams): SimulationResult {
  switch (params.amortizationType) {
    case 'french':
      return calculateFrench(params)
    case 'german':
      return calculateGerman(params)
    case 'american':
      return calculateAmerican(params)
    case 'negative':
      return calculateNegative(params)
    case 'balloon':
      return calculateBalloon(params)
    default:
      return calculateFrench(params)
  }
}
