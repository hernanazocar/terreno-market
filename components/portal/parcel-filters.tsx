'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { COMUNAS_SANTIAGO } from "@/lib/constants"

interface Filters {
  search: string
  comuna: string | null
  minPrice: number | null
  maxPrice: number | null
  minSurface: number | null
  hasWater: boolean
  hasElectricity: boolean
  hasDirectCredit: boolean
}

interface ParcelFiltersProps {
  onFiltersChange: (filters: Filters) => void
}

export function ParcelFilters({ onFiltersChange }: ParcelFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    comuna: null,
    minPrice: null,
    maxPrice: null,
    minSurface: null,
    hasWater: false,
    hasElectricity: false,
    hasDirectCredit: false,
  })

  const updateFilter = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: Filters = {
      search: '',
      comuna: null,
      minPrice: null,
      maxPrice: null,
      minSurface: null,
      hasWater: false,
      hasElectricity: false,
      hasDirectCredit: false,
    }
    setFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const activeFiltersCount = [
    filters.comuna,
    filters.minPrice,
    filters.maxPrice,
    filters.minSurface,
    filters.hasWater,
    filters.hasElectricity,
    filters.hasDirectCredit,
  ].filter(Boolean).length

  return (
    <Card className="border-2">
      <CardContent className="p-6 space-y-4">
        {/* Búsqueda rápida */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por proyecto, código o comuna..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="primary" className="ml-1 px-1.5 py-0">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filtros avanzados */}
        {showAdvanced && (
          <div className="pt-4 border-t border-border space-y-4">
            {/* Comuna */}
            <div>
              <label className="block text-sm font-medium mb-2">Comuna</label>
              <select
                value={filters.comuna || ''}
                onChange={(e) => updateFilter('comuna', e.target.value || null)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todas las comunas</option>
                {COMUNAS_SANTIAGO.map((comuna) => (
                  <option key={comuna} value={comuna}>
                    {comuna}
                  </option>
                ))}
              </select>
            </div>

            {/* Precio */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Precio mín (UF)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Precio máx (UF)</label>
                <input
                  type="number"
                  placeholder="Sin límite"
                  value={filters.maxPrice || ''}
                  onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Superficie mínima */}
            <div>
              <label className="block text-sm font-medium mb-2">Superficie mín (m²)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minSurface || ''}
                onChange={(e) => updateFilter('minSurface', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasWater}
                  onChange={(e) => updateFilter('hasWater', e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">Con agua</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasElectricity}
                  onChange={(e) => updateFilter('hasElectricity', e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">Con electricidad</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasDirectCredit}
                  onChange={(e) => updateFilter('hasDirectCredit', e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">Crédito directo disponible</span>
              </label>
            </div>

            {/* Acciones */}
            {activeFiltersCount > 0 && (
              <div className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
