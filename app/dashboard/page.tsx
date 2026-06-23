import { Navbar } from "@/components/portal/navbar"
import { Footer } from "@/components/portal/footer"
import { LeadsPipeline } from "@/components/dashboard/leads-pipeline"
import { mockLeads } from "@/lib/mock-leads"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Target, Clock } from "lucide-react"

export const metadata = {
  title: 'Dashboard - Terreno Market',
  description: 'Gestiona tus leads calificados con IA',
}

export default async function DashboardPage() {
  // TODO: Obtener leads de Supabase filtrados por tenant_id del usuario autenticado
  const leads = mockLeads

  // Stats
  const hotLeads = leads.filter(l => l.temperature === 'hot').length
  const totalLeads = leads.length
  const avgScore = Math.round(leads.reduce((acc, l) => acc + (l.score || 0), 0) / leads.length)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-muted/30">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                  Gestiona tus leads calificados - Inmobiliaria Chicureo
                </p>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="px-4 py-2">
                  Último lead: hace 2 horas
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline">{totalLeads}</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{totalLeads}</div>
              <div className="text-sm text-muted-foreground">Total leads</div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border border-l-4 border-l-error">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-error/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-error" />
                </div>
                <Badge variant="error">{hotLeads}</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{hotLeads}</div>
              <div className="text-sm text-muted-foreground">Leads calientes 🔥</div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-success" />
                </div>
                <Badge variant="success">{avgScore}</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{avgScore}/100</div>
              <div className="text-sm text-muted-foreground">Score promedio</div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <Badge variant="warning">2</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">2</div>
              <div className="text-sm text-muted-foreground">Requieren seguimiento</div>
            </div>
          </div>

          {/* Pipeline */}
          <LeadsPipeline leads={leads} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
