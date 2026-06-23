import { Navbar } from "@/components/portal/navbar"
import { Footer } from "@/components/portal/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MessageCircle, Calculator, Shield, Sparkles, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 border-b border-border">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              {/* Badge superior */}
              <Badge variant="primary" className="px-4 py-2 text-sm">
                <Sparkles className="h-3 w-3 mr-2" />
                Powered by AI - Calificación inteligente de compradores
              </Badge>

              {/* Título principal */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Encuentra tu{" "}
                <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
                  parcela perfecta
                </span>
                {" "}en Chile
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Leads calificados con IA, simulador de crédito directo y datos de confianza.
                <span className="block mt-2 text-primary font-medium">
                  No más formularios muertos.
                </span>
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/parcelas">
                  <Button variant="primary" size="lg" className="gap-2 shadow-2xl shadow-primary/30">
                    <Search className="h-5 w-5" />
                    Ver parcelas disponibles
                  </Button>
                </Link>
                <Link href="/como-funciona">
                  <Button variant="outline" size="lg" className="gap-2">
                    Cómo funciona
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">768</div>
                  <div className="text-sm text-muted-foreground">Parcelas</div>
                </div>
                <div className="text-center border-x border-border">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">14</div>
                  <div className="text-sm text-muted-foreground">Proyectos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">95%</div>
                  <div className="text-sm text-muted-foreground">Satisfacción</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tres Pilares de Valor */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                El diferenciador
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Por qué{" "}
                <span className="text-primary">Terreno Market</span>
                ?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                No vendemos visibilidad. Entregamos compradores reales con presupuesto verificado.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Pilar 1: Agente IA */}
              <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all border-2 hover:border-primary/50">
                <CardContent className="p-8 space-y-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Agente IA por WhatsApp</h3>
                  <p className="text-muted-foreground">
                    No más formularios. Nuestro agente IA conversa, califica el presupuesto,
                    intención y plazo del comprador. Solo llegan leads con contexto completo.
                  </p>
                  <ul className="space-y-2 pt-2">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Calificación en tiempo real</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Score de 0-100 automático</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Historial completo guardado</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Pilar 2: Simulador */}
              <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all border-2 hover:border-primary/50">
                <CardContent className="p-8 space-y-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calculator className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Simulador de Crédito Directo</h3>
                  <p className="text-muted-foreground">
                    La parcela se vende o se cae en la cuota. Mostramos la cuota real antes
                    del contacto. 5 tipos de amortización con términos verificados.
                  </p>
                  <ul className="space-y-2 pt-2">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Cuota mensual real</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Tabla de amortización</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Sin sorpresas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Pilar 3: Datos de confianza */}
              <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all border-2 hover:border-primary/50">
                <CardContent className="p-8 space-y-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Datos que dan confianza</h3>
                  <p className="text-muted-foreground">
                    Agua, luz, internet, rol, qué se puede construir. Las dudas que frenan
                    una venta, resueltas de entrada. Parcelas verificadas.
                  </p>
                  <ul className="space-y-2 pt-2">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Factibilidad de servicios</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Normativa edificatoria</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span>Restricciones SAG/CONAF</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-background border-y border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              ¿Tienes una inmobiliaria?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Recibe leads calificados con presupuesto, intención y cuota simulada.
              No más curiosos sin filtrar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contacto-comercial">
                <Button variant="primary" size="lg" className="gap-2 shadow-2xl shadow-primary/30">
                  Hablar con un asesor
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/planes">
                <Button variant="outline" size="lg">
                  Ver planes y precios
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
