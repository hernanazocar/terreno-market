# 🌾 Terreno Market

**Portal chileno de venta de parcelas para inmobiliarias. Leads calificados con IA, no formularios muertos.**

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## 🎯 El Diferenciador

**Portales tradicionales:**
- Venden visibilidad
- Entregan formularios: "Nombre + Email + Teléfono"
- Ejecutivo recibe: "Juan Pérez - 912345678"
- Sin contexto, sin calificación
- 100 curiosos sin filtrar

**Terreno Market:**
- Entrega leads calificados
- **Agente IA** conversa por WhatsApp y califica
- Ejecutivo recibe: **Presupuesto 3.800 UF, crédito directo, cuota $420k, quiere vivir, plazo 1-3 meses, score 85/100**
- + Historial completo de conversación IA
- 20 compradores reales con contexto

**Eso es lo que hace que un lead valga 10x más.**

---

## ✨ Features Principales

### 🤖 1. Agente IA de Calificación por WhatsApp
- Conversa naturalmente en español chileno
- Extrae presupuesto, método de pago, intención, plazo
- Simula la cuota del crédito directo
- Califica con score 0-100 y temperatura (hot/warm/cold)
- Guarda historial completo de conversación

### 🧮 2. Simulador de Crédito Directo
- **5 tipos de amortización:**
  - Francés (cuota fija)
  - Alemán (amortización constante)
  - Americano (solo interés + capital final)
  - Negativo (cuota < interés, saldo crece)
  - Balloon (cuotas bajas + pago final)
- Tabla de amortización mes por mes
- Usa términos reales del proyecto

### 🛡️ 3. Datos de Confianza
- **Factibilidad de servicios:** agua (APR/pozo/derechos), luz, internet
- **Normativa edificatoria:** qué se puede construir, m² máx, restricciones SAG/CONAF
- **Parcelas verificadas** con badge
- Rol de avalúo visible

### 📊 4. Dashboard de Inmobiliaria
- Pipeline kanban (7 etapas: nuevo → ganado/perdido)
- Filtros por temperatura (calientes/tibios/fríos)
- Modal de detalle con historial IA completo
- Stats: score promedio, leads calientes, seguimiento

### 📲 5. Notificaciones Push
- WhatsApp al ejecutivo cuando lead calificado
- Mensaje con contexto completo (no solo nombre/teléfono)
- Link directo al dashboard
- Recordatorios de visitas

### 👨‍💼 6. Panel Admin
- Gestión de inmobiliarias (tenants)
- CRUD de proyectos y parcelas
- Carga masiva asistida por IA (Excel → Claude → fichas)
- Multi-tenant con RLS

---

## 🚀 Stack Técnico

- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- **Backend:** Next.js Server Actions + API Routes
- **Database:** Supabase (PostgreSQL + RLS + Auth + Storage)
- **IA:** Anthropic API (Claude Sonnet 4.5)
- **WhatsApp:** Twilio WhatsApp Business API
- **Mapas:** Mapbox
- **Hosting:** Vercel

---

## 📦 Instalación Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/terreno-market.git
cd terreno-market
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.local.example .env.local
# Editar .env.local con tus credenciales
```

### 4. Configurar Supabase
Sigue las instrucciones detalladas en **[SETUP_SUPABASE.md](./SETUP_SUPABASE.md)**

### 5. Correr en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 📂 Estructura del Proyecto

```
terreno-market-v2/
├── app/
│   ├── api/whatsapp/webhook/    # Webhook de Twilio
│   ├── parcelas/                # Portal público
│   ├── dashboard/               # Dashboard inmobiliaria
│   └── admin/                   # Panel admin
├── components/
│   ├── portal/                  # Componentes públicos
│   ├── dashboard/               # Componentes dashboard
│   └── ui/                      # Componentes base
├── lib/
│   ├── supabase/                # Clientes Supabase
│   ├── credit-simulator.ts      # Motor de simulación
│   ├── lead-scoring.ts          # Sistema de scoring
│   └── notifications.ts         # Notificaciones push
├── migrations/                  # Migraciones SQL
├── seed/                        # Datos de prueba
├── KICKOFF.md                   # Fuente de verdad del producto
├── SETUP_SUPABASE.md           # Guía de setup
└── DEPLOY_VERCEL.md            # Guía de deploy
```

---

## 🗄️ Modelo de Datos

**Multi-tenant con Row Level Security (RLS)**

### Tablas principales:
- `tenants` — Inmobiliarias
- `users` — Ejecutivos + admins
- `projects` — Proyectos de parcelación
- `financing_terms` — Términos de crédito directo
- `parcels` — Parcelas (con factibilidad rica)
- `leads` — Leads calificados (el activo central)
- `lead_conversations` — Historial del agente IA
- `appointments` — Visitas agendadas

Ver esquema completo en `migrations/001_initial_schema.sql`

---

## 🚢 Deploy a Producción

Sigue la guía completa en **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)**

---

## 📄 Documentación

- **[KICKOFF.md](./KICKOFF.md)** - Fuente de verdad del producto
- **[CLAUDE.md](./CLAUDE.md)** - Guía para desarrollo
- **[SETUP_SUPABASE.md](./SETUP_SUPABASE.md)** - Setup de base de datos
- **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)** - Deploy a producción

---

## 🌟 Primer Tenant

**Inmobiliaria Chicureo** - 768 parcelas en 14 proyectos en Chicureo, Región Metropolitana.

---

<div align="center">

**Hecho con 🌾 para el campo chileno**

</div>
