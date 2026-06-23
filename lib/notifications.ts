// Sistema de notificaciones push por WhatsApp al ejecutivo

interface Lead {
  buyer_name: string
  buyer_whatsapp: string
  budget_uf: number | null
  payment_method: 'cash' | 'direct_credit' | 'unknown'
  simulated_monthly_payment_clp: number | null
  intent: 'live' | 'invest' | 'second_home' | 'unknown'
  decision_timeframe: 'immediate' | '1_3_months' | '3_6_months' | 'exploring' | 'unknown'
  score: number
  temperature: 'hot' | 'warm' | 'cold'
  parcel: {
    code: string
    project: {
      name: string
    }
  }
}

interface Executive {
  whatsapp_number: string
  full_name: string
}

/**
 * Genera el mensaje de notificación para el ejecutivo
 */
export function generateExecutiveNotification(lead: Lead, dashboardUrl: string): string {
  const emoji = lead.temperature === 'hot' ? '🔥' : lead.temperature === 'warm' ? '🟡' : '🔵'
  const tempLabel = lead.temperature === 'hot' ? 'CALIENTE' : lead.temperature === 'warm' ? 'TIBIO' : 'FRÍO'

  const intentLabels = {
    live: 'vivir',
    invest: 'invertir',
    second_home: 'segunda vivienda',
    unknown: 'uso no definido',
  }

  const timeframeLabels = {
    immediate: 'inmediato',
    '1_3_months': '1-3 meses',
    '3_6_months': '3-6 meses',
    exploring: 'explorando',
    unknown: 'no definido',
  }

  const paymentLabels = {
    cash: 'contado',
    direct_credit: 'crédito directo',
    unknown: 'no definido',
  }

  let message = `${emoji} *Nuevo lead ${tempLabel}* - ${lead.parcel.project.name}, Lote ${lead.parcel.code}\n\n`

  message += `👤 *${lead.buyer_name}*\n`

  if (lead.budget_uf) {
    message += `💰 Presupuesto: *${lead.budget_uf.toLocaleString()} UF*\n`
  }

  message += `💳 Método: *${paymentLabels[lead.payment_method]}*\n`

  if (lead.simulated_monthly_payment_clp) {
    message += `📅 Cuota simulada: *$${lead.simulated_monthly_payment_clp.toLocaleString()}*\n`
  }

  message += `🎯 Busca para: *${intentLabels[lead.intent]}*\n`
  message += `⏱️ Plazo: *${timeframeLabels[lead.decision_timeframe]}*\n`
  message += `📊 Score: *${lead.score}/100*\n\n`

  message += `Ver y contactar 👉 ${dashboardUrl}/leads/${lead.buyer_whatsapp.replace(/\D/g, '')}`

  return message
}

/**
 * Envía notificación por WhatsApp al ejecutivo usando Twilio
 */
export async function sendWhatsAppNotification(
  to: string,
  message: string
): Promise<boolean> {
  try {
    // TODO: Integrar con Twilio
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
    const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER

    if (!twilioAccountSid || !twilioAuthToken || !twilioWhatsAppNumber) {
      console.error('Twilio credentials not configured')
      return false
    }

    // Aquí iría la llamada real a la API de Twilio
    // const client = twilio(twilioAccountSid, twilioAuthToken)
    // await client.messages.create({
    //   from: `whatsapp:${twilioWhatsAppNumber}`,
    //   to: `whatsapp:${to}`,
    //   body: message,
    // })

    console.log(`📲 Notificación enviada a ${to}:`)
    console.log(message)

    return true
  } catch (error) {
    console.error('Error enviando notificación WhatsApp:', error)
    return false
  }
}

/**
 * Notifica a un ejecutivo sobre un nuevo lead calificado
 */
export async function notifyExecutiveNewLead(
  lead: Lead,
  executive: Executive,
  dashboardUrl: string
): Promise<void> {
  const message = generateExecutiveNotification(lead, dashboardUrl)
  await sendWhatsAppNotification(executive.whatsapp_number, message)
}

/**
 * Envía recordatorio de visita agendada
 */
export async function sendVisitReminder(
  executiveWhatsApp: string,
  buyerName: string,
  parcelName: string,
  visitDate: Date
): Promise<void> {
  const dateStr = new Intl.DateTimeFormat('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(visitDate)

  const message = `📅 *Recordatorio de visita*\n\n` +
    `Cliente: ${buyerName}\n` +
    `Parcela: ${parcelName}\n` +
    `Fecha: ${dateStr}\n\n` +
    `No olvides confirmar 24 horas antes.`

  await sendWhatsAppNotification(executiveWhatsApp, message)
}
