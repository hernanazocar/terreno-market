import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marca */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-background font-bold text-xl">T</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Terreno Market
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Marketplace de parcelas en Chile. Leads calificados con IA, no formularios muertos.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Explorar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/parcelas" className="text-muted-foreground hover:text-primary transition-colors">
                  Ver parcelas
                </Link>
              </li>
              <li>
                <Link href="/proyectos" className="text-muted-foreground hover:text-primary transition-colors">
                  Proyectos
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-muted-foreground hover:text-primary transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/preguntas-frecuentes" className="text-muted-foreground hover:text-primary transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Para inmobiliarias */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Para inmobiliarias</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Acceso inmobiliaria
                </Link>
              </li>
              <li>
                <Link href="/vender-parcelas" className="text-muted-foreground hover:text-primary transition-colors">
                  Vender parcelas
                </Link>
              </li>
              <li>
                <Link href="/planes" className="text-muted-foreground hover:text-primary transition-colors">
                  Planes y precios
                </Link>
              </li>
              <li>
                <Link href="/contacto-comercial" className="text-muted-foreground hover:text-primary transition-colors">
                  Contacto comercial
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <span>contacto@terrenomarket.cl</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary" />
                <span>+56 9 1234 5678</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>Santiago, Chile</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Terreno Market. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/terminos" className="text-muted-foreground hover:text-primary transition-colors">
                Términos
              </Link>
              <Link href="/privacidad" className="text-muted-foreground hover:text-primary transition-colors">
                Privacidad
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
