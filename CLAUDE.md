# Terreno Market - Guía para Claude Code

## Filosofía del producto

**Insight central:** Los portales tradicionales venden visibilidad y entregan formularios muertos. Terreno Market entrega **leads calificados con presupuesto, intención y cuota simulada**.

El agente IA por WhatsApp es el corazón del producto, no un add-on. Si se le quita, esto vuelve a ser un clasificado más.

## Stack y convenciones

- **Frontend:** Next.js 16 App Router + TypeScript + Tailwind CSS 4
- **Backend:** Next.js API Routes + Server Actions + Supabase
- **DB:** Supabase PostgreSQL con RLS multi-tenant
- **IA:** Anthropic API (Claude) — usa el modelo más capaz para calificación
- **WhatsApp:** Twilio WhatsApp Business API
- **Tema:** Cálido natural con verde oliva `#5f7a3e` y naranja sunset `#e67e22` (campo chileno + atardeceres cordilleranos)

### Reglas de código

- TypeScript estricto — no `any` sin justificación
- Identificadores en **inglés**, contenido UI en **español de Chile**
- Server Components por defecto; Client Components solo con interactividad
- **NUNCA bypassear RLS** salvo en panel admin con service role explícito
- Variables monetarias: guardar en **UF** y **CLP** (la UF cambia diariamente)
- Validación con Zod en todos los inputs
- Componentes reutilizables, no copy-paste

## Arquitectura multi-tenant

Cada inmobiliaria es un `tenant`. Casi todas las tablas tienen `tenant_id`. RLS asegura que cada tenant solo ve sus datos.

**Excepciones de lectura pública:**
- `projects` con `status='active'`
- `parcels` con `status='available'`
- `financing_terms` (alimentan el simulador público)

## Módulos principales

### 1. Portal público (`/portal` o `/`)
- Catálogo de parcelas con filtros (comuna, precio UF, m², agua, crédito directo)
- Ficha rica: galería, mapa, factibilidad (agua/luz/internet), normativa (qué se puede construir)
- Simulador de crédito directo (5 tipos de amortización)
- CTA: **"Conversar por WhatsApp"** → dispara agente IA

### 2. Agente IA por WhatsApp (core del producto)
- Comprador hace clic → mensaje a Twilio → webhook a nuestra API
- API arma contexto (parcela, términos, historial) → llama a Claude
- Agente conversa, califica (presupuesto, método pago, plazo, intención), simula cuota
- Cuando tiene info suficiente → calcula score 0-100, crea/actualiza lead, push al ejecutivo

**System prompt:** Ver sección 6 de KICKOFF.md. El agente solo afirma datos reales de la DB, nunca inventa.

### 3. Simulador de crédito directo
5 tipos de amortización:
- **Francés:** cuota fija
- **Alemán:** amortización constante
- **Americano:** solo interés + capital al final
- **Negativo:** cuota < interés, saldo crece
- **Balloon:** cuotas bajas + pago final grande

Usa los `financing_terms` reales del proyecto. Es **referencial**, no gestiona créditos reales.

### 4. Dashboard inmobiliaria (`/dashboard`)
Login → ve SOLO sus leads (RLS).
- Pipeline kanban por `status` (nuevo → contactado → visita → negociando → ganado/perdido)
- Cada lead muestra: score (hot/warm/cold), presupuesto, método pago, cuota simulada, historial de conversación IA
- Acciones: cambiar estado, asignar ejecutivo, agendar visita, notas
- **NO hay carga de parcelas acá**, solo gestión de leads

### 5. Panel admin (`/admin`)
Solo para nosotros (super_admin con service role).
- CRUD de tenants, proyectos, parcelas, términos de financiamiento
- **Carga masiva asistida por IA:** Excel → Claude parsea y genera fichas → nosotros revisamos → publicamos

### 6. Notificaciones push
Lead calificado → WhatsApp inmediato al ejecutivo con contexto completo:
> 🔥 *Nuevo lead caliente — Hacienda Las Higueras, Lote 14*  
> Juan Pérez · busca para **vivir** · presupuesto **3.500 UF** · necesita **crédito directo** · cuota simulada **$420.000** · quiere **visitar este fin de semana**. Score 82/100.  
> Ver y contactar 👉 [link al dashboard]

El lead persigue al ejecutivo, NO al revés.

## Scoring de leads (0-100)

Factores con peso:
- **Presupuesto vs precio parcela** (¿le da la plata?) — peso alto
- **Método de pago definido** (contado/crédito con pie > "no sé") — peso alto
- **Plazo de decisión** (inmediato/1-3 meses > explorando) — peso alto
- **Intención clara** (vivir/invertir > "mirando") — peso medio
- **Engagement** (respondió todo, pidió simular, pidió visita) — peso medio

Temperatura:
- `hot` ≥ 70
- `warm` 40-69
- `cold` < 40

Guardar desglose en `score_breakdown` (JSONB).

## Scope del MVP

### ✅ SÍ construir
- Portal público (catálogo + ficha rica)
- Simulador de crédito directo
- Agente IA por WhatsApp
- Dashboard inmobiliaria (gestión leads)
- Panel admin (carga proyectos/parcelas)
- Notificaciones push por WhatsApp
- Carga masiva IA (Excel → fichas)

### ❌ NO construir
- Sistema de cobranza/pagos/recaudación (el simulador solo *muestra* la cuota)
- Carga self-service para inmobiliarias (nosotros cargamos vía admin)
- Pagos/escrituración/promesas/firma
- App móvil nativa
- Features "nice to have" (render IA, isócronas, match inverso)

**Pregúntame antes de construir algo fuera del scope.**

## Primer tenant

**Inmobiliaria Chicureo** — slug `chicureo`, color `#c9a96e`. Es el único tenant del MVP. Seed incluye proyecto "Hacienda Las Higueras" con 4 parcelas de muestra.

## Orden de construcción

Trabajar en fases secuenciales:

1. **Fase 0:** Setup + migraciones + RLS + seed ✅
2. **Fase 1:** Portal público (catálogo + ficha rica)
3. **Fase 2:** Simulador de crédito
4. **Fase 3:** Dashboards (inmobiliaria + admin)
5. **Fase 4:** Agente IA por WhatsApp
6. **Fase 5:** Notificaciones push
7. **Fase 6:** Carga masiva IA

Mostrar cada fase antes de avanzar a la siguiente.

## Definición de "listo" del MVP

1. Una parcela de Chicureo publicada con ficha rica (factibilidad + normativa + simulador)
2. Comprador hace clic "Conversar por WhatsApp" → agente IA conversa, califica, simula cuota
3. Lead scoreado creado con conversación guardada
4. Ejecutivo recibe WhatsApp con lead y contexto completo + link al dashboard
5. Ejecutivo gestiona lead en dashboard y agenda visita

Todo lo demás es post-MVP.

---

**Fuente de verdad completa:** `KICKOFF.md`

@AGENTS.md
