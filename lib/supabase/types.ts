// Types generados del schema de Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          primary_color: string
          contact_email: string | null
          contact_phone: string | null
          subscription_tier: 'base' | 'premium'
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tenants']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tenants']['Insert']>
      }
      users: {
        Row: {
          id: string
          tenant_id: string | null
          full_name: string
          email: string
          whatsapp_number: string | null
          role: 'super_admin' | 'tenant_admin' | 'executive'
          is_active: boolean
          created_at: string
        }
      }
      projects: {
        Row: {
          id: string
          tenant_id: string
          name: string
          slug: string
          description: string | null
          commune: string
          region: string
          location_lat: number | null
          location_lng: number | null
          amenities: Json
          status: 'draft' | 'active' | 'paused' | 'sold_out'
          created_at: string
          updated_at: string
        }
      }
      financing_terms: {
        Row: {
          id: string
          project_id: string
          min_down_payment_pct: number
          monthly_interest_rate: number
          max_term_months: number
          amortization_type: 'french' | 'german' | 'american' | 'negative' | 'balloon'
          balloon_pct: number | null
          notes: string | null
          created_at: string
        }
      }
      parcels: {
        Row: {
          id: string
          project_id: string
          tenant_id: string
          code: string
          property_type: 'terreno' | 'parcela' | 'sitio' | 'industrial'
          rol: string | null
          surface_m2: number
          price_uf: number
          price_clp: number
          status: 'available' | 'reserved' | 'sold'
          water_source: 'apr' | 'well' | 'water_rights' | 'none' | 'unknown'
          water_details: string | null
          electricity: 'available' | 'nearby' | 'none' | 'unknown'
          internet: 'fiber' | 'signal' | 'none' | 'unknown'
          buildable_summary: string | null
          max_construction_m2: number | null
          max_houses: number | null
          sag_conaf_restrictions: string | null
          location_lat: number | null
          location_lng: number | null
          slope: string | null
          gallery: Json
          is_verified: boolean
          created_at: string
          updated_at: string
        }
      }
      leads: {
        Row: {
          id: string
          tenant_id: string
          parcel_id: string | null
          project_id: string | null
          buyer_name: string
          buyer_whatsapp: string
          buyer_email: string | null
          budget_uf: number | null
          payment_method: 'cash' | 'direct_credit' | 'unknown'
          simulated_monthly_payment_clp: number | null
          intent: 'live' | 'invest' | 'second_home' | 'unknown'
          decision_timeframe: 'immediate' | '1_3_months' | '3_6_months' | 'exploring' | 'unknown'
          score: number | null
          score_breakdown: Json | null
          temperature: 'hot' | 'warm' | 'cold' | null
          status: 'new' | 'contacted' | 'visit_scheduled' | 'visited' | 'negotiating' | 'won' | 'lost'
          assigned_to: string | null
          notes: string | null
          source: 'parcel_page' | 'whatsapp_search' | 'alert'
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
