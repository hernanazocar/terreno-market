# Setup de Supabase para Terreno Market

## 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Click en "New Project"
3. Nombre: `terreno-market-production`
4. Database Password: (guarda esto de forma segura)
5. Región: South America (São Paulo) - la más cercana a Chile
6. Plan: Free (para empezar) o Pro ($25/mes para producción)

## 2. Ejecutar Migraciones

Una vez creado el proyecto:

### Paso 1: SQL Editor
1. En Supabase, ve a **SQL Editor** (menú izquierdo)
2. Click en **"New Query"**
3. Copia y pega el contenido completo de `migrations/001_initial_schema.sql`
4. Click en **"Run"**
5. Verifica que se crearon todas las tablas en **Table Editor**

### Paso 2: Seed con Inmobiliaria Chicureo
1. Nueva query en SQL Editor
2. Copia y pega el contenido de `seed/001_seed_chicureo.sql`
3. Click en **"Run"**
4. Ve a **Table Editor > parcels** - deberías ver 4 parcelas

## 3. Obtener Credenciales

Ve a **Settings > API** y copia:

1. **Project URL** - Ejemplo: `https://xyzcompany.supabase.co`
2. **anon/public key** - La key pública (empieza con `eyJhbGc...`)
3. **service_role key** - La key secreta (NUNCA exponerla al cliente)

## 4. Configurar Variables de Entorno

### Desarrollo Local (.env.local)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...(KEY SECRETA)

# Anthropic (para agente IA)
ANTHROPIC_API_KEY=sk-ant-api03-xxx

# Twilio (para WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886

# Mapbox (para mapas)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

### Producción (Vercel)
Se configuran en el dashboard de Vercel (paso siguiente).

## 5. Verificar RLS (Row Level Security)

Las políticas RLS ya están aplicadas por la migración. Verifica en Supabase:

1. Ve a **Authentication > Policies**
2. Deberías ver políticas para cada tabla
3. **Importante:** Las parcelas con `status='available'` son públicas
4. Los leads solo son visibles por el tenant que los creó

## 6. Configurar Storage (para imágenes de parcelas)

1. Ve a **Storage** en Supabase
2. Click **"New Bucket"**
3. Nombre: `parcel-images`
4. **Public bucket:** ✅ Sí (las imágenes son públicas)
5. Allowed MIME types: `image/jpeg, image/png, image/webp`
6. Max file size: `5MB`

### Política de Storage
```sql
-- Permitir lectura pública
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'parcel-images');

-- Solo admins pueden subir
CREATE POLICY "Admin upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'parcel-images' AND
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'super_admin'
    )
  );
```

## 7. Crear Usuario Admin

En SQL Editor:

```sql
-- Primero crea el usuario en Auth (hazlo desde Supabase UI > Authentication > Add User)
-- Email: tu@email.com
-- Password: (elige uno seguro)
-- Copia el UUID del usuario creado

-- Luego inserta en tu tabla users
INSERT INTO users (id, tenant_id, full_name, email, role, is_active)
VALUES (
  'uuid-del-usuario-creado',  -- El UUID de auth.users
  NULL,                        -- NULL porque es super_admin
  'Tu Nombre',
  'tu@email.com',
  'super_admin',
  true
);
```

## 8. Testing de Conexión

Reinicia el servidor de desarrollo:

```bash
npm run dev
```

Abre http://localhost:3002/parcelas - Si ves las parcelas de Chicureo, ¡funciona! ✅

## 9. Problemas Comunes

### Error: "relation parcels does not exist"
- Las migraciones no se ejecutaron. Vuelve al paso 2.

### Error: "Invalid API key"
- Revisa que copiaste bien las keys de Supabase.
- Verifica que están en `.env.local` (NO `.env`).
- Reinicia el servidor después de cambiar variables.

### No veo las parcelas
- Verifica que ejecutaste el seed (paso 2.2).
- Revisa la tabla en **Table Editor > parcels**.
- Verifica RLS: las parcelas deben tener `status='available'`.

### Images no cargan
- Configura el bucket de Storage (paso 6).
- Las URLs de las imágenes mock son de Unsplash, no Supabase.
- Para usar Supabase Storage, sube imágenes y actualiza `gallery` en la tabla.

## 10. Migrar Datos Mock a Supabase

Para reemplazar los datos mock con datos reales de Supabase:

### En `app/parcelas/page.tsx`
```typescript
// ANTES (mock):
const availableParcels = mockParcels

// DESPUÉS (Supabase):
const supabase = await createClient()
const { data: parcels } = await supabase
  .from('parcels')
  .select(`
    id, code, surface_m2, price_uf, price_clp, status,
    water_source, electricity, internet, is_verified, gallery,
    project:projects (name, commune)
  `)
  .eq('status', 'available')
  .order('created_at', { ascending: false })

const availableParcels = parcels || []
```

### En `app/dashboard/page.tsx`
```typescript
// DESPUÉS (Supabase con RLS):
const supabase = await createClient()
const { data: leads } = await supabase
  .from('leads')
  .select(`
    *,
    parcel:parcels (code, project:projects (name, commune)),
    conversations:lead_conversations (*)
  `)
  .order('created_at', { ascending: false })
```

---

**¡Listo!** Supabase configurado. Siguiente paso: Deploy a Vercel.
