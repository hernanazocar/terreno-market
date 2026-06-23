import { Badge } from "@/components/ui/badge"
import { formatCLP, formatUF } from "@/lib/utils"
import { PAYMENT_METHOD_LABELS } from "@/lib/constants"

interface Lead {
  id: string
  buyer_name: string
  buyer_whatsapp: string
  budget_uf: number | null
  payment_method: 'cash' | 'direct_credit' | 'unknown'
  simulated_monthly_payment_clp: number | null
  intent: 'live' | 'invest' | 'second_home' | 'unknown'
  score: number | null
  temperature: 'hot' | 'warm' | 'cold' | null
  parcel: {
    code: string
    project: {
      name: string
    }
  }
}

interface LeadCardProps {
  lead: Lead
  onClick: () => void
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const tempColor = lead.temperature === 'hot' ? 'border-error' : lead.temperature === 'warm' ? 'border-warning' : 'border-info'

  return (
    <div
      onClick={onClick}
      className={`bg-card border-2 ${tempColor} rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow space-y-2`}
    >
      {/* Nombre y score */}
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold text-sm leading-tight flex-1">{lead.buyer_name}</div>
        {lead.score !== null && (
          <Badge variant={lead.temperature === 'hot' ? 'error' : lead.temperature === 'warm' ? 'warning' : 'default'} className="text-xs shrink-0">
            {lead.score}
          </Badge>
        )}
      </div>

      {/* Parcela */}
      <div className="text-xs text-muted-foreground">
        {lead.parcel.project.name} - {lead.parcel.code}
      </div>

      {/* Datos clave */}
      <div className="space-y-1 text-xs">
        {lead.budget_uf && (
          <div>
            <span className="text-muted-foreground">Presupuesto: </span>
            <span className="font-semibold">{formatUF(lead.budget_uf)}</span>
          </div>
        )}
        {lead.payment_method !== 'unknown' && (
          <div>
            <span className="text-muted-foreground">Método: </span>
            <span className="font-semibold">{PAYMENT_METHOD_LABELS[lead.payment_method]}</span>
          </div>
        )}
        {lead.simulated_monthly_payment_clp && (
          <div>
            <span className="text-muted-foreground">Cuota: </span>
            <span className="font-semibold">{formatCLP(lead.simulated_monthly_payment_clp)}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-xs text-muted-foreground pt-2 border-t border-border truncate">
        {lead.buyer_whatsapp}
      </div>
    </div>
  )
}
