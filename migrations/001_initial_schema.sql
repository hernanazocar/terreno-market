-- Terreno Market - Migración inicial
-- Multi-tenant con RLS estricto

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE user_role AS ENUM ('super_admin', 'tenant_admin', 'executive');
CREATE TYPE subscription_tier AS ENUM ('base', 'premium');
CREATE TYPE project_status AS ENUM ('draft', 'active', 'paused', 'sold_out');
CREATE TYPE parcel_status AS ENUM ('available', 'reserved', 'sold');
CREATE TYPE property_type AS ENUM ('terreno', 'parcela', 'sitio', 'industrial');
CREATE TYPE water_source AS ENUM ('apr', 'well', 'water_rights', 'none', 'unknown');
CREATE TYPE electricity_status AS ENUM ('available', 'nearby', 'none', 'unknown');
CREATE TYPE internet_status AS ENUM ('fiber', 'signal', 'none', 'unknown');
CREATE TYPE amortization_type AS ENUM ('french', 'german', 'american', 'negative', 'balloon');
CREATE TYPE payment_method AS ENUM ('cash', 'direct_credit', 'unknown');
CREATE TYPE buyer_intent AS ENUM ('live', 'invest', 'second_home', 'unknown');
CREATE TYPE decision_timeframe AS ENUM ('immediate', '1_3_months', '3_6_months', 'exploring', 'unknown');
CREATE TYPE lead_temperature AS ENUM ('hot', 'warm', 'cold');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'visit_scheduled', 'visited', 'negotiating', 'won', 'lost');
CREATE TYPE lead_source AS ENUM ('parcel_page', 'whatsapp_search', 'alert');
CREATE TYPE conversation_role AS ENUM ('agent', 'buyer');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'no_show', 'cancelled');

-- ============================================
-- TENANTS (inmobiliarias)
-- ============================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#c9a96e',
  contact_email TEXT,
  contact_phone TEXT,
  subscription_tier subscription_tier DEFAULT 'base',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USERS (ejecutivos + admins)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_number TEXT,
  role user_role NOT NULL DEFAULT 'executive',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- PROJECTS (proyectos de parcelación)
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  commune TEXT NOT NULL,
  region TEXT NOT NULL,
  location_lat NUMERIC(10, 7),
  location_lng NUMERIC(10, 7),
  amenities JSONB DEFAULT '[]'::jsonb,
  status project_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

CREATE INDEX idx_projects_tenant ON projects(tenant_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_commune ON projects(commune);

-- ============================================
-- FINANCING TERMS (términos de crédito directo)
-- ============================================
CREATE TABLE financing_terms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  min_down_payment_pct NUMERIC(5, 2) NOT NULL,
  monthly_interest_rate NUMERIC(6, 5) NOT NULL,
  max_term_months INTEGER NOT NULL,
  amortization_type amortization_type NOT NULL DEFAULT 'french',
  balloon_pct NUMERIC(5, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_financing_project ON financing_terms(project_id);

-- ============================================
-- PARCELS (la unidad vendible)
-- ============================================
CREATE TABLE parcels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  property_type property_type NOT NULL DEFAULT 'parcela',
  rol TEXT,
  surface_m2 NUMERIC(10, 2) NOT NULL,
  price_uf NUMERIC(12, 2) NOT NULL,
  price_clp NUMERIC(15, 0) NOT NULL,
  status parcel_status DEFAULT 'available',

  -- FACTIBILIDAD
  water_source water_source DEFAULT 'unknown',
  water_details TEXT,
  electricity electricity_status DEFAULT 'unknown',
  internet internet_status DEFAULT 'unknown',

  -- NORMATIVA
  buildable_summary TEXT,
  max_construction_m2 NUMERIC(10, 2),
  max_houses INTEGER,
  sag_conaf_restrictions TEXT,

  -- UBICACIÓN Y MEDIA
  location_lat NUMERIC(10, 7),
  location_lng NUMERIC(10, 7),
  slope TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,

  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(project_id, code)
);

CREATE INDEX idx_parcels_project ON parcels(project_id);
CREATE INDEX idx_parcels_tenant ON parcels(tenant_id);
CREATE INDEX idx_parcels_status ON parcels(status);
CREATE INDEX idx_parcels_property_type ON parcels(property_type);
CREATE INDEX idx_parcels_price ON parcels(price_uf);
CREATE INDEX idx_parcels_location ON parcels(location_lat, location_lng);

-- ============================================
-- LEADS (el activo central)
-- ============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  parcel_id UUID REFERENCES parcels(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,

  buyer_name TEXT NOT NULL,
  buyer_whatsapp TEXT NOT NULL,
  buyer_email TEXT,

  -- CALIFICACIÓN
  budget_uf NUMERIC(12, 2),
  payment_method payment_method DEFAULT 'unknown',
  simulated_monthly_payment_clp NUMERIC(12, 0),
  intent buyer_intent DEFAULT 'unknown',
  decision_timeframe decision_timeframe DEFAULT 'unknown',

  -- SCORING
  score INTEGER CHECK (score >= 0 AND score <= 100),
  score_breakdown JSONB,
  temperature lead_temperature,

  -- GESTIÓN
  status lead_status DEFAULT 'new',
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  source lead_source NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_tenant ON leads(tenant_id);
CREATE INDEX idx_leads_parcel ON leads(parcel_id);
CREATE INDEX idx_leads_project ON leads(project_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_temperature ON leads(temperature);
CREATE INDEX idx_leads_buyer_whatsapp ON leads(buyer_whatsapp);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- ============================================
-- LEAD CONVERSATIONS (historial del agente IA)
-- ============================================
CREATE TABLE lead_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  role conversation_role NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_lead ON lead_conversations(lead_id);
CREATE INDEX idx_conversations_created ON lead_conversations(created_at);

-- ============================================
-- APPOINTMENTS (visitas agendadas)
-- ============================================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  executive_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_lead ON appointments(lead_id);
CREATE INDEX idx_appointments_parcel ON appointments(parcel_id);
CREATE INDEX idx_appointments_executive ON appointments(executive_id);
CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS en todas las tablas
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE financing_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- TENANTS: lectura pública para info básica
CREATE POLICY "Tenants públicos para lectura" ON tenants
  FOR SELECT USING (true);

-- USERS: solo ven su tenant
CREATE POLICY "Users ven su tenant" ON users
  FOR ALL USING (
    auth.uid() = id OR
    tenant_id IN (
      SELECT tenant_id FROM users WHERE id = auth.uid()
    )
  );

-- PROJECTS: lectura pública si status=active, escritura solo su tenant
CREATE POLICY "Projects públicos si activos" ON projects
  FOR SELECT USING (status = 'active' OR tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Projects escritura tenant" ON projects
  FOR ALL USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- FINANCING TERMS: lectura pública, escritura tenant
CREATE POLICY "Financing terms públicos" ON financing_terms
  FOR SELECT USING (true);

CREATE POLICY "Financing terms escritura tenant" ON financing_terms
  FOR ALL USING (project_id IN (
    SELECT id FROM projects WHERE tenant_id IN (
      SELECT tenant_id FROM users WHERE id = auth.uid()
    )
  ));

-- PARCELS: lectura pública si available, escritura solo su tenant
CREATE POLICY "Parcels públicos si disponibles" ON parcels
  FOR SELECT USING (status = 'available' OR tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Parcels escritura tenant" ON parcels
  FOR ALL USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- LEADS: solo su tenant
CREATE POLICY "Leads solo su tenant" ON leads
  FOR ALL USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- CONVERSATIONS: solo si tienen acceso al lead
CREATE POLICY "Conversations solo su tenant" ON lead_conversations
  FOR ALL USING (lead_id IN (
    SELECT id FROM leads WHERE tenant_id IN (
      SELECT tenant_id FROM users WHERE id = auth.uid()
    )
  ));

-- APPOINTMENTS: solo su tenant
CREATE POLICY "Appointments solo su tenant" ON appointments
  FOR ALL USING (lead_id IN (
    SELECT id FROM leads WHERE tenant_id IN (
      SELECT tenant_id FROM users WHERE id = auth.uid()
    )
  ));

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_parcels_updated_at BEFORE UPDATE ON parcels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
