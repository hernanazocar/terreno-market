import { Navbar } from "@/components/portal/navbar"
import { Footer } from "@/components/portal/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Users, Upload, Settings } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: 'Panel Admin - Terreno Market',
  description: 'Gestión de tenants, proyectos y parcelas',
}

export default async function AdminPage() {
  // TODO: Verificar que el usuario es super_admin

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-muted/30">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Panel Admin</h1>
                <p className="text-muted-foreground">
                  Gestión de inmobiliarias, proyectos y parcelas
                </p>
              </div>
              <Badge variant="error" className="w-fit">
                Super Admin
              </Badge>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Inmobiliarias */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Inmobiliarias</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Gestiona las inmobiliarias (tenants) en la plataforma.
                </p>
                <Link href="/admin/tenants">
                  <Button variant="primary" className="w-full">
                    Gestionar Inmobiliarias
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Proyectos */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Proyectos</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Administra proyectos de parcelación y sus términos de financiamiento.
                </p>
                <Link href="/admin/projects">
                  <Button variant="primary" className="w-full">
                    Gestionar Proyectos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Parcelas */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-success" />
                  </div>
                  <CardTitle>Parcelas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  CRUD de parcelas, cargar datos de factibilidad y normativa.
                </p>
                <Link href="/admin/parcels">
                  <Button variant="primary" className="w-full">
                    Gestionar Parcelas
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Usuarios */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-info" />
                  </div>
                  <CardTitle>Usuarios</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Gestiona ejecutivos de inmobiliarias y permisos.
                </p>
                <Link href="/admin/users">
                  <Button variant="primary" className="w-full">
                    Gestionar Usuarios
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Carga Masiva */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-primary/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-warning" />
                  </div>
                  <CardTitle>Carga Masiva IA</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sube Excel/CSV de parcelas. Claude parsea y genera fichas automáticamente.
                </p>
                <Link href="/admin/bulk-upload">
                  <Button variant="primary" className="w-full gap-2">
                    <Upload className="h-4 w-4" />
                    Carga Masiva
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Configuración */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                    <Settings className="h-6 w-6 text-foreground" />
                  </div>
                  <CardTitle>Configuración</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Variables del sistema, integración Twilio, valor UF diario.
                </p>
                <Link href="/admin/settings">
                  <Button variant="outline" className="w-full">
                    Configuración
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Inmobiliarias activas</div>
                <div className="text-2xl font-bold">1</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Proyectos totales</div>
                <div className="text-2xl font-bold">14</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Parcelas disponibles</div>
                <div className="text-2xl font-bold">768</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Leads este mes</div>
                <div className="text-2xl font-bold">47</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
