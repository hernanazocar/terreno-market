'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCLP, formatUF, temperatureLabel, formatDateTime } from "@/lib/utils"
import { PAYMENT_METHOD_LABELS, INTENT_LABELS, TIMEFRAME_LABELS } from "@/lib/constants"
import { X, MessageCircle, Phone, Mail, User, Banknote, Target, Calendar, TrendingUp } from "lucide-react"

interface Lead {
  id: string
  buyer_name: string
  buyer_whatsapp: string
  buyer_email: string | null
  budget_uf: number | null
  payment_method: 'cash' | 'direct_credit' | 'unknown'
  simulated_monthly_payment_clp: number | null
  intent: 'live' | 'invest' | 'second_home' | 'unknown'
  decision_timeframe: 'immediate' | '1_3_months' | '3_6_months' | 'exploring' | 'unknown'
  score: number | null
  score_breakdown?: any
  temperature: 'hot' | 'warm' | 'cold' | null
  status: string
  notes: string
  created_at: string
  parcel: {
    code: string
    project: {
      name: string
      commune: string
    }
  }
  conversations: Array<{
    id: string
    role: 'agent' | 'buyer'
    message: string
    created_at: string
  }>
}

interface LeadDetailModalProps {
  lead: Lead
  onClose: () => void
}

export function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{lead.buyer_name}</h2>
              {lead.score !== null && (
                <Badge variant={lead.temperature === 'hot' ? 'error' : lead.temperature === 'warm' ? 'warning' : 'default'} className="text-base px-3 py-1">
                  {lead.score}/100 - {temperatureLabel(lead.temperature)}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Interesado en {lead.parcel.project.name} - Lote {lead.parcel.code}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Datos de contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">WhatsApp</div>
                  <a href={`https://wa.me/${lead.buyer_whatsapp.replace(/\D/g, '')}`} target="_blank" className="font-medium hover:text-primary">
                    {lead.buyer_whatsapp}
                  </a>
                </div>
              </div>
              {lead.buyer_email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <a href={`mailto:${lead.buyer_email}`} className="font-medium hover:text-primary">
                      {lead.buyer_email}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Datos de calificación */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calificación del Agente IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {lead.budget_uf && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Banknote className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Presupuesto</div>
                      <div className="font-bold">{formatUF(lead.budget_uf)}</div>
                      <div className="text-xs text-muted-foreground">{formatCLP(lead.budget_uf * 40000)}</div>
                    </div>
                  </div>
                )}

                {lead.payment_method !== 'unknown' && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Método de pago</div>
                      <div className="font-bold">{PAYMENT_METHOD_LABELS[lead.payment_method]}</div>
                    </div>
                  </div>
                )}

                {lead.simulated_monthly_payment_clp && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Cuota simulada</div>
                      <div className="font-bold">{formatCLP(lead.simulated_monthly_payment_clp)}</div>
                    </div>
                  </div>
                )}

                {lead.intent !== 'unknown' && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Busca para</div>
                      <div className="font-bold">{INTENT_LABELS[lead.intent]}</div>
                    </div>
                  </div>
                )}

                {lead.decision_timeframe !== 'unknown' && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Plazo de decisión</div>
                      <div className="font-bold">{TIMEFRAME_LABELS[lead.decision_timeframe]}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Score breakdown */}
              {lead.score_breakdown && (
                <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="text-sm font-medium mb-2">Desglose del Score</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(lead.score_breakdown).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}</span>
                        <span className="font-semibold">{value}/100</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historial de conversación */}
          {lead.conversations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Conversación con Agente IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {lead.conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`flex ${conv.role === 'buyer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          conv.role === 'buyer'
                            ? 'bg-primary text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <div className="text-sm">{conv.message}</div>
                        <div className={`text-xs mt-1 ${
                          conv.role === 'buyer' ? 'text-white/70' : 'text-muted-foreground'
                        }`}>
                          {new Date(conv.created_at).toLocaleTimeString('es-CL', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-24 p-3 rounded-lg border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Agregar notas sobre este lead..."
                defaultValue={lead.notes}
              />
            </CardContent>
          </Card>
        </div>

        {/* Footer con acciones */}
        <div className="p-6 border-t border-border flex gap-3">
          <Button variant="primary" size="lg" className="flex-1 gap-2">
            <MessageCircle className="h-5 w-5" />
            Contactar por WhatsApp
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Calendar className="h-5 w-5" />
            Agendar visita
          </Button>
        </div>
      </div>
    </div>
  )
}
