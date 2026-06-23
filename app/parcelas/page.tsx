import { Navbar } from "@/components/portal/navbar"
import { Footer } from "@/components/portal/footer"
import { ParcelCard } from "@/components/portal/parcel-card"
import { ParcelFiltersClient } from "@/components/portal/parcel-filters-client"
import { mockParcels } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

export const metadata = {
  title: 'Parcelas Disponibles - Terreno Market',
  description: 'Encuentra y compara parcelas disponibles en Chile con datos verificados y simulador de crédito directo.',
}

export default async function ParcelasPage() {
  // TODO: Reemplazar con datos de Supabase cuando esté configurado
  // const supabase = await createClient()
  // const { data: parcels } = await supabase.from('parcels')...

  const availableParcels = mockParcels

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero compacto */}
        <section className="bg-gradient-to-br from-background via-background to-primary/5 border-b border-border py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Parcelas en Chile</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Encuentra tu{" "}
                <span className="text-primary">parcela perfecta</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                {availableParcels.length} parcelas disponibles con datos verificados,
                factibilidad de servicios y crédito directo.
              </p>
            </div>
          </div>
        </section>

        {/* Filtros y resultados */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ParcelFiltersClient parcels={availableParcels} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
