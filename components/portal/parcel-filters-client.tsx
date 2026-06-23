'use client'

import { useState, useMemo } from "react"
import { ParcelFilters } from "./parcel-filters"
import { ParcelCard } from "./parcel-card"
import { Badge } from "@/components/ui/badge"
import type { PropertyType } from "@/lib/property-types"

interface Parcel {
  id: string
  code: string
  property_type: PropertyType
  surface_m2: number
  price_uf: number
  price_clp: number
  status: 'available' | 'reserved' | 'sold'
  water_source: string
  electricity: string
  internet: string
  is_verified: boolean
  gallery: string[]
  project: {
    name: string
    commune: string
  }
}

interface Filters {
  search: string
  propertyType: PropertyType | null
  comuna: string | null
  minPrice: number | null
  maxPrice: number | null
  minSurface: number | null
  hasWater: boolean
  hasElectricity: boolean
  hasDirectCredit: boolean
}

interface ParcelFiltersClientProps {
  parcels: Parcel[]
}

export function ParcelFiltersClient({ parcels }: ParcelFiltersClientProps) {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    propertyType: null,
    comuna: null,
    minPrice: null,
    maxPrice: null,
    minSurface: null,
    hasWater: false,
    hasElectricity: false,
    hasDirectCredit: false,
  })

  // Filtrar parcelas
  const filteredParcels = useMemo(() => {
    return parcels.filter((parcel) => {
      // Búsqueda por texto
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          parcel.project.name.toLowerCase().includes(searchLower) ||
          parcel.code.toLowerCase().includes(searchLower) ||
          parcel.project.commune.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Tipo de propiedad
      if (filters.propertyType && parcel.property_type !== filters.propertyType) {
        return false
      }

      // Comuna
      if (filters.comuna && parcel.project.commune !== filters.comuna) {
        return false
      }

      // Precio
      if (filters.minPrice !== null && parcel.price_uf < filters.minPrice) {
        return false
      }
      if (filters.maxPrice !== null && parcel.price_uf > filters.maxPrice) {
        return false
      }

      // Superficie
      if (filters.minSurface !== null && parcel.surface_m2 < filters.minSurface) {
        return false
      }

      // Agua
      if (filters.hasWater && !['apr', 'well', 'water_rights'].includes(parcel.water_source)) {
        return false
      }

      // Electricidad
      if (filters.hasElectricity && parcel.electricity !== 'available') {
        return false
      }

      // Crédito directo (asumimos que todas tienen por ahora, esto vendría de financing_terms)
      // if (filters.hasDirectCredit && !parcel.hasFinancing) {
      //   return false
      // }

      return true
    })
  }, [parcels, filters])

  return (
    <div className="space-y-8">
      {/* Filtros */}
      <ParcelFilters onFiltersChange={setFilters} />

      {/* Contador de resultados */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold">{filteredParcels.length}</span>
          <span className="text-muted-foreground ml-2">
            {filteredParcels.length === 1 ? 'parcela encontrada' : 'parcelas encontradas'}
          </span>
        </div>
        {filteredParcels.length > 0 && (
          <Badge variant="outline">
            Ordenado por más recientes
          </Badge>
        )}
      </div>

      {/* Grid de parcelas */}
      {filteredParcels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParcels.map((parcel) => (
            <ParcelCard key={parcel.id} parcel={parcel as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold mb-2">No encontramos parcelas</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Intenta ajustar los filtros para ver más resultados disponibles.
          </p>
        </div>
      )}
    </div>
  )
}
