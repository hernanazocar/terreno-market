import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { calculateLeadScore } from '@/lib/lead-scoring'

// Este endpoint recibe los webhooks de Twilio cuando un usuario envía un mensaje por WhatsApp

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

// System prompt del agente (del KICKOFF.md)
const AGENT_SYSTEM_PROMPT = `Eres el asistente de Terreno Market, un portal chileno de venta de parcelas.
Conversas por WhatsApp con una persona interesada en una parcela. Tu objetivo
es ayudarla genuinamente Y calificarla como comprador, de forma natural y
chilena, sin sonar a formulario ni a robot.

TU MISIÓN:
1. Responder dudas reales sobre la parcela usando SOLO los datos del contexto.
   Si no tienes un dato, dilo con honestidad y ofrece que un ejecutivo lo
   confirme. NUNCA inventes factibilidad, precios ni normativa.
2. Calificar al comprador de forma conversacional, sacando con naturalidad:
   - Presupuesto aproximado.
   - Si pagaría al contado o con crédito directo (y si tiene pie).
   - En cuánto tiempo busca decidir.
   - Para qué quiere la parcela (vivir, invertir, segunda vivienda).
3. Cuando sea pertinente, ofrecer simular la cuota del crédito directo con los
   términos reales del proyecto, y mostrar el valor.
4. Cuando el comprador esté interesado, ofrecer coordinar una visita.

ESTILO:
- Español de Chile, cercano, claro, sin tecnicismos innecesarios. Trato de "tú".
- Mensajes cortos, de WhatsApp. Una idea por mensaje. Nada de párrafos largos.
- No interrogues. Saca los datos a lo largo de la conversación, no de una.
- Sé útil primero; la calificación viene de una buena conversación, no de un
  cuestionario.

LÍMITES:
- No prometas precios, descuentos ni condiciones que no estén en el contexto.
- No cierres la venta tú; tu pega es calificar y entregar el lead caliente al
  ejecutivo humano.
- Nunca pidas datos sensibles (RUT completo, datos bancarios, claves).`

export async function POST(request: NextRequest) {
  try {
    // Parsear el body de Twilio
    const body = await request.text()
    const params = new URLSearchParams(body)

    const from = params.get('From') // Número de WhatsApp del comprador
    const messageBody = params.get('Body') // Mensaje del comprador
    const profileName = params.get('ProfileName') // Nombre del comprador

    if (!from || !messageBody) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    console.log(`📱 Mensaje de ${profileName} (${from}): ${messageBody}`)

    // TODO: Obtener contexto de la parcela y conversación previa desde Supabase
    // Por ahora usamos datos mock
    const parcelContext = {
      project_name: 'Hacienda Las Higueras',
      code: 'HH-001',
      commune: 'Colina',
      price_uf: 3500,
      price_clp: 140000000,
      surface_m2: 5000,
      water: 'APR Chicureo con factibilidad inmediata',
      electricity: 'Disponible',
      internet: 'Fibra óptica',
      buildable: 'Hasta 2 viviendas, máximo 500m² edificables',
      restrictions: 'Área de protección de quebrada en sector norte (10%)',
      financing: {
        min_down_payment: '20%',
        monthly_rate: '2.7% mensual',
        max_term: '60 cuotas',
        type: 'Francés (cuota fija)',
      }
    }

    // Contexto para Claude
    const contextMessage = `CONTEXTO DE LA PARCELA:
Proyecto: ${parcelContext.project_name}
Lote: ${parcelContext.code}
Ubicación: ${parcelContext.commune}, Región Metropolitana
Precio: ${parcelContext.price_uf} UF ($${parcelContext.price_clp.toLocaleString()})
Superficie: ${parcelContext.surface_m2} m²

FACTIBILIDAD:
- Agua: ${parcelContext.water}
- Electricidad: ${parcelContext.electricity}
- Internet: ${parcelContext.internet}

NORMATIVA:
- Construcción permitida: ${parcelContext.buildable}
- Restricciones: ${parcelContext.restrictions}

CRÉDITO DIRECTO DISPONIBLE:
- Pie mínimo: ${parcelContext.financing.min_down_payment}
- Tasa: ${parcelContext.financing.monthly_rate}
- Plazo máximo: ${parcelContext.financing.max_term}
- Tipo: ${parcelContext.financing.type}

HISTORIAL DE LA CONVERSACIÓN:
[Esta es la primera interacción]

---

El comprador dice: "${messageBody}"

Responde de forma natural, útil y cercana. Mensaje corto de WhatsApp (máximo 2-3 frases).`

    // Llamar a Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
      system: AGENT_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: contextMessage,
        },
      ],
    })

    const agentReply = response.content[0].type === 'text' ? response.content[0].text : ''

    console.log(`🤖 Respuesta del agente: ${agentReply}`)

    // TODO: Guardar conversación en Supabase
    // TODO: Analizar si ya tenemos suficiente info para crear/actualizar el lead
    // TODO: Si el lead está calificado, disparar notificación push al ejecutivo

    // Responder a Twilio con formato TwiML
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${agentReply}</Message>
</Response>`

    return new NextResponse(twiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  } catch (error) {
    console.error('Error en webhook de WhatsApp:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Endpoint de verificación de Twilio (GET)
export async function GET(request: NextRequest) {
  // Twilio envía un GET para verificar el webhook
  return NextResponse.json({ status: 'Webhook activo' })
}
