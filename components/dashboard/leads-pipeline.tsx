'use client'

import { useState } from "react"
import { LeadCard } from "./lead-card"
import { LeadDetailModal } from "./lead-detail-modal"
import { Badge } from "@/components/ui/badge"

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
  temperature: 'hot' | 'warm' | 'cold' | null
  status: string
  notes: string
  created_at: string
  updated_at: string
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

interface LeadsPipelineProps {
  leads: Lead[]
}

const PIPELINE_STAGES = [
  { key: 'new', label: 'Nuevos', color: 'bg-info/5 border-info' },
  { key: 'contacted', label: 'Contactados', color: 'bg-primary/5 border-primary' },
  { key: 'visit_scheduled', label: 'Visita agendada', color: 'bg-warning/5 border-warning' },
  { key: 'visited', label: 'Visitó', color: 'bg-accent/5 border-accent' },
  { key: 'negotiating', label: 'Negociando', color: 'bg-success/5 border-success' },
  { key: 'won', label: 'Ganado ✅', color: 'bg-success/10 border-success' },
  { key: 'lost', label: 'Perdido ❌', color: 'bg-error/5 border-error' },
]

export function LeadsPipeline({ leads }: LeadsPipelineProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all')

  const filteredLeads = leads.filter(lead => {
    if (filter === 'all') return true
    return lead.temperature === filter
  })

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium mr-2">Filtrar:</span>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-card border border-border hover:bg-muted'
          }`}
        >
          Todos ({leads.length})
        </button>
        <button
          onClick={() => setFilter('hot')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'hot'
              ? 'bg-error text-white shadow-sm'
              : 'bg-card border border-border hover:bg-muted'
          }`}
        >
          🔥 Calientes ({leads.filter(l => l.temperature === 'hot').length})
        </button>
        <button
          onClick={() => setFilter('warm')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'warm'
              ? 'bg-warning text-white shadow-sm'
              : 'bg-card border border-border hover:bg-muted'
          }`}
        >
          Tibios ({leads.filter(l => l.temperature === 'warm').length})
        </button>
        <button
          onClick={() => setFilter('cold')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'cold'
              ? 'bg-info text-white shadow-sm'
              : 'bg-card border border-border hover:bg-muted'
          }`}
        >
          Fríos ({leads.filter(l => l.temperature === 'cold').length})
        </button>
      </div>

      {/* Pipeline Kanban - scroll horizontal en mobile */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {PIPELINE_STAGES.map(stage => {
            const stageLeads = filteredLeads.filter(lead => lead.status === stage.key)

            return (
              <div key={stage.key} className="w-72 flex-shrink-0">
                {/* Header de columna */}
                <div className={`rounded-lg border-2 ${stage.color} p-3 mb-3`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm truncate">{stage.label}</span>
                    <Badge variant="outline" className="ml-2 shrink-0">
                      {stageLeads.length}
                    </Badge>
                  </div>
                </div>

                {/* Cards de leads */}
                <div className="space-y-2 min-h-[200px]">
                  {stageLeads.length > 0 ? (
                    stageLeads.map(lead => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        onClick={() => setSelectedLead(lead)}
                      />
                    ))
                  ) : (
                    <div className="text-center text-xs text-muted-foreground py-8 bg-card rounded-lg border border-dashed border-border">
                      Sin leads
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal de detalle */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  )
}
