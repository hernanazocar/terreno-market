import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Maximize, Droplet, Zap, Wifi, CheckCircle2 } from "lucide-react"
import { formatUF, formatCLP, formatM2 } from "@/lib/utils"
import { WATER_SOURCE_LABELS, ELECTRICITY_LABELS, INTERNET_LABELS } from "@/lib/constants"

interface Parcel {
  id: string
  code: string
  surface_m2: number
  price_uf: number
  price_clp: number
  status: 'available' | 'reserved' | 'sold'
  water_source: keyof typeof WATER_SOURCE_LABELS
  electricity: keyof typeof ELECTRICITY_LABELS
  internet: keyof typeof INTERNET_LABELS
  is_verified: boolean
  gallery: string[]
  project: {
    name: string
    commune: string
  }
}

interface ParcelCardProps {
  parcel: Parcel
}

export function ParcelCard({ parcel }: ParcelCardProps) {
  const mainImage = Array.isArray(parcel.gallery) && parcel.gallery.length > 0
    ? parcel.gallery[0]
    : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'

  return (
    <Link href={`/parcelas/${parcel.id}`}>
      <Card className="group overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer">
        {/* Imagen */}
        <div className="relative h-56 overflow-hidden bg-muted">
          <img
            src={mainImage}
            alt={`Parcela ${parcel.code}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Badges sobre la imagen */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {parcel.is_verified && (
              <Badge variant="success" className="backdrop-blur-sm bg-success/90">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verificada
              </Badge>
            )}
            {parcel.status === 'reserved' && (
              <Badge variant="warning" className="backdrop-blur-sm bg-warning/90">
                Reservada
              </Badge>
            )}
          </div>
          {/* Precio sobre la imagen */}
          <div className="absolute bottom-3 left-3 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
            <div className="text-xl font-bold text-primary">{formatUF(parcel.price_uf)}</div>
            <div className="text-xs text-muted-foreground">{formatCLP(parcel.price_clp)}</div>
          </div>
        </div>

        <CardContent className="p-5 space-y-4">
          {/* Título y ubicación */}
          <div>
            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
              {parcel.project.name} - Lote {parcel.code}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
              {parcel.project.commune}
            </div>
          </div>

          {/* Superficie */}
          <div className="flex items-center gap-2 text-foreground">
            <Maximize className="h-4 w-4 text-primary" />
            <span className="font-semibold">{formatM2(parcel.surface_m2)}</span>
          </div>

          {/* Servicios */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {parcel.water_source !== 'none' && parcel.water_source !== 'unknown' && (
              <div className="flex items-center gap-1" title={WATER_SOURCE_LABELS[parcel.water_source]}>
                <Droplet className="h-4 w-4 text-info" />
                <span className="text-xs">Agua</span>
              </div>
            )}
            {parcel.electricity === 'available' && (
              <div className="flex items-center gap-1" title="Electricidad disponible">
                <Zap className="h-4 w-4 text-warning" />
                <span className="text-xs">Luz</span>
              </div>
            )}
            {parcel.internet === 'fiber' && (
              <div className="flex items-center gap-1" title="Fibra óptica">
                <Wifi className="h-4 w-4 text-success" />
                <span className="text-xs">Fibra</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="pt-2">
            <div className="text-sm font-medium text-primary group-hover:underline">
              Ver detalles →
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
