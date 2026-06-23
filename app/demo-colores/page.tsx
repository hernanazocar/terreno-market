import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Calculator, Shield, CheckCircle2, Droplet, Zap, Home } from "lucide-react"
import Link from "next/link"

export default function DemoColoresPage() {
  const palettes = [
    {
      id: 1,
      name: "Verde Naturaleza + Terracota",
      description: "Evoca naturaleza, tierra y conexión con el campo. Cálido y confiable.",
      colors: {
        primary: "#2d5016", // Verde bosque/pino oscuro
        primaryLight: "#4a7c2c", // Verde más claro
        accent: "#c76e3a", // Terracota/tierra
        bg: "#fafaf9", // Blanco roto cálido
        card: "#ffffff",
        text: "#1a1a1a",
      },
      why: "✅ Representa naturaleza y parcelas. ✅ Terracota añade calidez. ✅ Profesional pero accesible.",
    },
    {
      id: 2,
      name: "Azul Confianza + Verde Agua",
      description: "Confianza institucional con frescura natural. Limpio y moderno.",
      colors: {
        primary: "#0f4c81", // Azul profundo
        primaryLight: "#1e6ba8",
        accent: "#16a085", // Verde agua/turquesa
        bg: "#f8fafc",
        card: "#ffffff",
        text: "#1e293b",
      },
      why: "✅ Azul = confianza bancaria/legal. ✅ Verde agua = naturaleza sin ser obvio. ✅ Muy profesional.",
    },
    {
      id: 3,
      name: "Verde Oliva + Naranja Sunset",
      description: "Campo chileno con atardeceres cordilleranos. Aspiracional y único.",
      colors: {
        primary: "#5f7a3e", // Verde oliva/campo
        primaryLight: "#7a9851",
        accent: "#e67e22", // Naranja atardecer
        bg: "#fef9f3", // Crema muy suave
        card: "#ffffff",
        text: "#2c3e50",
      },
      why: "✅ Verde oliva = parcelas de agrado. ✅ Naranja = atardeceres en la cordillera. ✅ Cálido y diferenciado.",
    },
    {
      id: 4,
      name: "Azul Cielo + Tierra Clara",
      description: "Cielo abierto y tierra fértil. Fresco, amplio, aspiracional.",
      colors: {
        primary: "#3b82f6", // Azul cielo vibrante
        primaryLight: "#60a5fa",
        accent: "#a16207", // Tierra/mostaza
        bg: "#f0f9ff", // Azul muy claro
        card: "#ffffff",
        text: "#0c4a6e",
      },
      why: "✅ Azul cielo = espacio abierto, libertad. ✅ Tierra clara = naturaleza sin ser pesado. ✅ Optimista.",
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-zinc-900">
            Demo de Paletas de Colores
          </h1>
          <p className="text-lg text-zinc-600">
            4 opciones para Terreno Market. Cada una muestra cómo se verían los componentes principales.
          </p>
          <Link href="/" className="inline-block text-sm text-zinc-500 hover:text-zinc-700 underline">
            Volver al home actual
          </Link>
        </div>

        {/* Grid de paletas */}
        <div className="grid gap-12">
          {palettes.map((palette) => (
            <div key={palette.id} className="space-y-6">
              {/* Info de la paleta */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: palette.colors.primary }}>
                      Opción {palette.id}: {palette.name}
                    </h2>
                    <p className="text-zinc-600 mb-3">{palette.description}</p>
                    <p className="text-sm text-zinc-500">{palette.why}</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-lg shadow-md mb-2"
                        style={{ backgroundColor: palette.colors.primary }}
                      />
                      <div className="text-xs text-zinc-500">Primario</div>
                    </div>
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-lg shadow-md mb-2"
                        style={{ backgroundColor: palette.colors.accent }}
                      />
                      <div className="text-xs text-zinc-500">Acento</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo aplicado */}
              <div
                className="rounded-xl p-8 shadow-lg border-2"
                style={{
                  backgroundColor: palette.colors.bg,
                  borderColor: palette.colors.primary + "20",
                }}
              >
                <div className="space-y-8">
                  {/* Hero mini */}
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2"
                      style={{
                        borderColor: palette.colors.primary + "40",
                        backgroundColor: palette.colors.primary + "10",
                      }}>
                      <div className="h-2 w-2 rounded-full animate-pulse"
                        style={{ backgroundColor: palette.colors.primary }} />
                      <span className="text-sm font-medium" style={{ color: palette.colors.primary }}>
                        768 parcelas disponibles
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold" style={{ color: palette.colors.text }}>
                      Encuentra tu{" "}
                      <span style={{ color: palette.colors.primary }}>parcela perfecta</span>
                      {" "}en Chile
                    </h3>
                    <div className="flex gap-3 justify-center">
                      <button
                        className="px-6 py-3 rounded-lg font-medium text-white shadow-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: palette.colors.primary }}
                      >
                        Ver parcelas
                      </button>
                      <button
                        className="px-6 py-3 rounded-lg font-medium border-2 hover:opacity-80 transition-opacity"
                        style={{
                          borderColor: palette.colors.primary,
                          color: palette.colors.primary,
                          backgroundColor: palette.colors.card,
                        }}
                      >
                        Cómo funciona
                      </button>
                    </div>
                  </div>

                  {/* Los 3 pilares */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      {
                        icon: MessageCircle,
                        title: "Agente IA por WhatsApp",
                        desc: "Calificación inteligente de compradores",
                      },
                      {
                        icon: Calculator,
                        title: "Simulador de Crédito",
                        desc: "Cuota real con términos verificados",
                      },
                      {
                        icon: Shield,
                        title: "Datos de Confianza",
                        desc: "Factibilidad y normativa completa",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl p-6 shadow-sm border-2 hover:shadow-md transition-shadow"
                        style={{
                          backgroundColor: palette.colors.card,
                          borderColor: idx === 0 ? palette.colors.primary + "30" : palette.colors.bg,
                        }}
                      >
                        <div
                          className="h-12 w-12 rounded-lg flex items-center justify-center mb-4"
                          style={{ backgroundColor: palette.colors.primary + "15" }}
                        >
                          <item.icon className="h-6 w-6" style={{ color: palette.colors.primary }} />
                        </div>
                        <h4 className="font-bold mb-2" style={{ color: palette.colors.text }}>
                          {item.title}
                        </h4>
                        <p className="text-sm" style={{ color: palette.colors.text + "aa" }}>
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Card de parcela simulada */}
                  <div
                    className="rounded-xl overflow-hidden shadow-lg border-2 hover:shadow-xl transition-all"
                    style={{
                      backgroundColor: palette.colors.card,
                      borderColor: palette.colors.bg,
                    }}
                  >
                    <div className="aspect-video bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center relative">
                      <div className="absolute top-3 left-3 flex gap-2">
                        <div
                          className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 text-white"
                          style={{ backgroundColor: palette.colors.accent }}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Verificada
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 rounded-lg px-3 py-2 backdrop-blur-sm bg-white/95 border"
                        style={{ borderColor: palette.colors.bg }}>
                        <div className="text-xl font-bold" style={{ color: palette.colors.primary }}>
                          3,500 UF
                        </div>
                        <div className="text-xs" style={{ color: palette.colors.text + "99" }}>
                          $140.000.000
                        </div>
                      </div>
                      <div className="text-center">
                        <Home className="h-16 w-16 mx-auto mb-2" style={{ color: palette.colors.primary + "40" }} />
                        <div className="text-sm font-medium" style={{ color: palette.colors.text + "99" }}>
                          Vista previa de imagen
                        </div>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      <h4 className="font-bold text-lg" style={{ color: palette.colors.text }}>
                        Hacienda Las Higueras - Lote HH-001
                      </h4>
                      <div className="flex items-center gap-4 text-sm" style={{ color: palette.colors.text + "cc" }}>
                        <div className="flex items-center gap-1">
                          <Droplet className="h-4 w-4" style={{ color: palette.colors.accent }} />
                          <span>Agua</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4" style={{ color: palette.colors.accent }} />
                          <span>Luz</span>
                        </div>
                        <div className="font-semibold">5,000 m²</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer con instrucciones */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200 text-center">
          <p className="text-zinc-600">
            👆 Revisa cada opción y dime cuál te gusta más (o si quieres ajustes)
          </p>
        </div>
      </div>
    </div>
  )
}
