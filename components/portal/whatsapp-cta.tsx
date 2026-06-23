'use client'

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface WhatsAppCTAProps {
  parcelId: string
  parcelName: string
  projectName: string
}

export function WhatsAppCTA({ parcelId, parcelName, projectName }: WhatsAppCTAProps) {
  const handleClick = () => {
    // Número de WhatsApp del portal (configurar en .env)
    const whatsappNumber = '56912345678' // TODO: Obtener de variable de entorno

    // Mensaje pre-cargado
    const message = `Hola! Me interesa la parcela ${parcelName} en ${projectName}`
    const encodedMessage = encodeURIComponent(message)

    // Abrir WhatsApp
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(url, '_blank')
  }

  return (
    <Button
      variant="primary"
      size="lg"
      className="w-full gap-2 shadow-xl shadow-primary/30"
      onClick={handleClick}
    >
      <MessageCircle className="h-5 w-5" />
      Conversar por WhatsApp
    </Button>
  )
}
