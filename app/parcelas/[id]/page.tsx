import { notFound } from "next/navigation"
import { Navbar } from "@/components/portal/navbar"
import { Footer } from "@/components/portal/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditSimulator } from "@/components/portal/credit-simulator"
import { WhatsAppCTA } from "@/components/portal/whatsapp-cta"
import { mockParcels } from "@/lib/mock-data"
import { formatUF, formatCLP, formatM2 } from "@/lib/utils"
import {
  MapPin, Maximize, Droplet, Zap, Wifi, Home, Shield, AlertTriangle,
  CheckCircle2, Phone, Mail, ChevronLeft
} from "lucide-react"
import { WATER_SOURCE_LABELS, ELECTRICITY_LABELS, INTERNET_LABELS } from "@/lib/constants"
import Link from "next/link"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ParcelDetailPage({ params }: PageProps) {
  const { id } = await params
  const parcel = mockParcels.find(p => p.id === id)

  if (!parcel) {
    notFound()
  }

  const mainImage = parcel.gallery[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200'

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/parcelas" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Volver a parcelas
            </Link>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Columna izquierda (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {parcel.is_verified && (
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Parcela Verificada
                    </Badge>
                  )}
                  <Badge variant="outline">{parcel.project.commune}</Badge>
                  <Badge variant="outline">Lote {parcel.code}</Badge>
                </div>

                <h1 className="text-4xl font-bold">
                  {parcel.project.name}
                </h1>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{parcel.project.commune}, {parcel.project.region}</span>
                </div>
              </div>

              {/* Galería */}
              <div className="grid grid-cols-1 gap-4">
                <div className="aspect-video rounded-xl overflow-hidden border-2 border-border">
                  <img
                    src={mainImage}
                    alt={`Parcela ${parcel.code}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {parcel.gallery.length > 1 && (
                  <div className="grid grid-cols-3 gap-4">
                    {parcel.gallery.slice(1).map((img, idx) => (
                      <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-border">
                        <img src={img} alt={`Vista ${idx + 2}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Descripción del proyecto */}
              <Card>
                <CardHeader>
                  <CardTitle>Sobre el proyecto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{parcel.project.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Amenidades:</h4>
                    <div className="flex flex-wrap gap-2">
                      {parcel.project.amenities.map((amenity, idx) => (
                        <Badge key={idx} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FACTIBILIDAD (el diferenciador) */}
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Factibilidad de Servicios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Agua */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
                        <Droplet className="h-6 w-6 text-info" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1">
                        Agua: {WATER_SOURCE_LABELS[parcel.water_source]}
                      </div>
                      <p className="text-sm text-muted-foreground">{parcel.water_details}</p>
                    </div>
                  </div>

                  {/* Electricidad */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                        <Zap className="h-6 w-6 text-warning" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1">
                        Electricidad: {ELECTRICITY_LABELS[parcel.electricity]}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {parcel.electricity === 'available'
                          ? 'Electricidad disponible en el sitio.'
                          : 'Electricidad cercana, requiere empalme.'}
                      </p>
                    </div>
                  </div>

                  {/* Internet */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                        <Wifi className="h-6 w-6 text-success" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1">
                        Internet: {INTERNET_LABELS[parcel.internet]}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {parcel.internet === 'fiber'
                          ? 'Fibra óptica disponible en el sector.'
                          : 'Señal móvil disponible.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* NORMATIVA (qué se puede construir) */}
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    ¿Qué puedo construir aquí?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{parcel.buildable_summary}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Superficie máx edificable</div>
                      <div className="text-2xl font-bold text-primary">
                        {parcel.max_construction_m2 ? formatM2(parcel.max_construction_m2) : 'No especificado'}
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Viviendas permitidas</div>
                      <div className="text-2xl font-bold text-primary">
                        {parcel.max_houses || 'No especificado'}
                      </div>
                    </div>
                  </div>

                  {parcel.sag_conaf_restrictions && (
                    <div className="flex gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold mb-1">Restricciones SAG/CONAF</div>
                        <p className="text-sm text-muted-foreground">{parcel.sag_conaf_restrictions}</p>
                      </div>
                    </div>
                  )}

                  {parcel.rol && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Rol de avalúo:</span> {parcel.rol}
                    </div>
                  )}

                  {parcel.slope && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Topografía:</span> {parcel.slope}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Columna derecha (1/3) - Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Precio y datos básicos */}
                <Card className="border-2 border-primary">
                  <CardContent className="p-6 space-y-6">
                    {/* Precio */}
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Precio</div>
                      <div className="text-4xl font-bold text-primary mb-1">
                        {formatUF(parcel.price_uf)}
                      </div>
                      <div className="text-lg text-muted-foreground">
                        {formatCLP(parcel.price_clp)}
                      </div>
                    </div>

                    {/* Superficie */}
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Maximize className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Superficie total</div>
                        <div className="font-semibold">{formatM2(parcel.surface_m2)}</div>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-3">
                      <WhatsAppCTA
                        parcelId={parcel.id}
                        parcelName={parcel.code}
                        projectName={parcel.project.name}
                      />
                      <Button variant="outline" size="lg" className="w-full gap-2">
                        <Phone className="h-5 w-5" />
                        Llamar ahora
                      </Button>
                      <Button variant="ghost" size="lg" className="w-full gap-2">
                        <Mail className="h-5 w-5" />
                        Enviar consulta
                      </Button>
                    </div>

                    {/* Info adicional */}
                    <div className="pt-4 border-t border-border text-sm text-muted-foreground space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Crédito directo disponible</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Visitas coordinadas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Asesoría legal incluida</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Simulador de crédito */}
                <CreditSimulator
                  priceUF={parcel.price_uf}
                  financingTerms={parcel.financing_terms}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
