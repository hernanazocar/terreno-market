import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, User, Menu } from "lucide-react"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-background font-bold text-xl">T</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Terreno Market
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/parcelas" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Ver parcelas
            </Link>
            <Link href="/proyectos" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Proyectos
            </Link>
            <Link href="/como-funciona" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Cómo funciona
            </Link>
            <Link href="/contacto" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contacto
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <User className="h-4 w-4 mr-2" />
                Acceso Inmobiliaria
              </Button>
            </Link>
            <Button variant="default" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
