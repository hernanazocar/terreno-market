'use client'

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingDown, Info } from "lucide-react"
import { formatCLP, formatUF } from "@/lib/utils"
import { AMORTIZATION_LABELS } from "@/lib/constants"
import { simulateCredit, type AmortizationType, type FinancingTerms } from "@/lib/credit-simulator"

interface CreditSimulatorProps {
  priceUF: number
  financingTerms: FinancingTerms
}

export function CreditSimulator({ priceUF, financingTerms }: CreditSimulatorProps) {
  const [downPaymentPct, setDownPaymentPct] = useState(financingTerms.min_down_payment_pct)
  const [termMonths, setTermMonths] = useState(Math.min(36, financingTerms.max_term_months))
  const [showSchedule, setShowSchedule] = useState(false)

  // Calcular simulación
  const result = useMemo(() => {
    return simulateCredit({
      propertyPriceUF: priceUF,
      downPaymentPct,
      termMonths,
      monthlyRate: financingTerms.monthly_interest_rate,
      amortizationType: financingTerms.amortization_type,
      balloonPct: financingTerms.balloon_pct,
    })
  }, [priceUF, downPaymentPct, termMonths, financingTerms])

  const downPaymentAmount = priceUF * (downPaymentPct / 100)

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          Simulador de Crédito Directo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pie */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Pie ({downPaymentPct}%)</label>
            <span className="text-sm text-muted-foreground">
              {formatUF(downPaymentAmount)} / {formatCLP(downPaymentAmount * 40000)}
            </span>
          </div>
          <input
            type="range"
            min={financingTerms.min_down_payment_pct}
            max="50"
            step="5"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Mín {financingTerms.min_down_payment_pct}%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Plazo */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Plazo ({termMonths} cuotas)</label>
            <span className="text-sm text-muted-foreground">
              {Math.floor(termMonths / 12)} años {termMonths % 12 > 0 ? `${termMonths % 12} meses` : ''}
            </span>
          </div>
          <input
            type="range"
            min="12"
            max={financingTerms.max_term_months}
            step="6"
            value={termMonths}
            onChange={(e) => setTermMonths(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>12 meses</span>
            <span>{financingTerms.max_term_months} meses</span>
          </div>
        </div>

        {/* Tipo de amortización */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Info className="h-3 w-3" />
            <span>Tipo de amortización</span>
          </div>
          <div className="text-sm font-medium">
            {AMORTIZATION_LABELS[financingTerms.amortization_type]}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Tasa: {(financingTerms.monthly_interest_rate * 100).toFixed(2)}% mensual
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monto a financiar</span>
            <span className="font-semibold">{formatCLP(result.financedAmount)}</span>
          </div>

          <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Cuota mensual</div>
            <div className="text-3xl font-bold text-primary">
              {formatCLP(result.monthlyPayment)}
            </div>
            {financingTerms.amortization_type === 'german' && (
              <div className="text-xs text-muted-foreground mt-1">
                Primera cuota (va decreciendo)
              </div>
            )}
          </div>

          {result.balloonPayment && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2 text-warning mb-1">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">Pago final (balloon)</span>
              </div>
              <div className="text-xl font-bold">{formatCLP(result.balloonPayment)}</div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total a pagar</span>
            <span className="font-semibold">{formatCLP(result.totalPayment)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total intereses</span>
            <span className="text-sm text-error">{formatCLP(result.totalInterest)}</span>
          </div>
        </div>

        {/* Nota */}
        {financingTerms.notes && (
          <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg border border-border">
            {financingTerms.notes}
          </div>
        )}

        {/* Tabla de amortización */}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full"
          >
            {showSchedule ? 'Ocultar' : 'Ver'} tabla de amortización
          </Button>

          {showSchedule && (
            <div className="mt-4 border border-border rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Cuota</th>
                      <th className="px-3 py-2 text-right">Pago</th>
                      <th className="px-3 py-2 text-right">Capital</th>
                      <th className="px-3 py-2 text-right">Interés</th>
                      <th className="px-3 py-2 text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row) => (
                      <tr key={row.month} className="border-t border-border hover:bg-muted/30">
                        <td className="px-3 py-2">{row.month}</td>
                        <td className="px-3 py-2 text-right font-medium">
                          {formatCLP(row.payment)}
                        </td>
                        <td className="px-3 py-2 text-right text-success">
                          {formatCLP(row.principal)}
                        </td>
                        <td className="px-3 py-2 text-right text-error">
                          {formatCLP(row.interest)}
                        </td>
                        <td className="px-3 py-2 text-right text-muted-foreground">
                          {formatCLP(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          * Simulación referencial. Los valores reales pueden variar según evaluación crediticia.
        </div>
      </CardContent>
    </Card>
  )
}
