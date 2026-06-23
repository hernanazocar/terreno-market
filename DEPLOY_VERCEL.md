# Deploy a Vercel - Terreno Market

## Pre-requisitos

✅ Supabase configurado (ver `SETUP_SUPABASE.md`)  
✅ Código commiteado en Git  
✅ Cuenta en Vercel (vercel.com)

## 1. Push del Código a GitHub

```bash
# Inicializar git (si no está)
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit - Terreno Market MVP completo

- Portal público con catálogo y fichas ricas
- Simulador de crédito directo (5 tipos)
- Dashboard de inmobiliaria con pipeline kanban
- Agente IA de calificación por WhatsApp
- Sistema de notificaciones push
- Tema verde oliva + naranja sunset"

# Crear repositorio en GitHub
# Ve a github.com y crea un nuevo repo: terreno-market

# Conectar y pushear
git branch -M main
git remote add origin https://github.com/TU-USUARIO/terreno-market.git
git push -u origin main
```

## 2. Importar en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click en **"Import Git Repository"**
3. Selecciona el repo `terreno-market`
4. Framework Preset: **Next.js** (detectado automáticamente)
5. Root Directory: `./` (raíz)
6. **NO hagas click en Deploy todavía** - primero configurar variables

## 3. Configurar Variables de Entorno

En la pantalla de deploy, expande **"Environment Variables"** y agrega:

### Variables Públicas (todas empiezan con NEXT_PUBLIC_)
```
NEXT_PUBLIC_SUPABASE_URL = https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_MAPBOX_TOKEN = pk.xxxxxxxxx (opcional por ahora)
NEXT_PUBLIC_APP_URL = https://terreno-market.vercel.app
```

### Variables Secretas (NUNCA comitear al repo)
```
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...(KEY SECRETA)
ANTHROPIC_API_KEY = sk-ant-api03-xxx
TWILIO_ACCOUNT_SID = ACxxxxxxxxxxx
TWILIO_AUTH_TOKEN = xxxxxxxxxx
TWILIO_WHATSAPP_NUMBER = +14155238886
```

**Importante:** Marca todas las secretas para **Production, Preview y Development**.

## 4. Deploy

1. Click en **"Deploy"**
2. Vercel va a:
   - Instalar dependencias (`npm install`)
   - Compilar el proyecto (`npm run build`)
   - Deployar a producción
3. Tiempo estimado: **2-3 minutos**

## 5. Verificar Deploy

Una vez completado:

1. Click en **"Visit"** para abrir la app
2. Verifica estas URLs:
   - `/` - Home
   - `/parcelas` - Debería mostrar las parcelas de Supabase
   - `/parcelas/[id]` - Ficha con simulador
   - `/dashboard` - Dashboard de leads
   - `/admin` - Panel admin

### Si hay errores:

1. Ve a **"Deployment" > "Logs"** en Vercel
2. Busca errores en la sección de **Build** o **Runtime**
3. Problemas comunes:
   - **Supabase connection error:** Verifica las variables de entorno
   - **Build error:** Verifica que el proyecto compile localmente (`npm run build`)
   - **Module not found:** Verifica que todas las deps estén en `package.json`

## 6. Configurar Dominio Personalizado (Opcional)

Si tienes un dominio (ej: `terrenomarket.cl`):

1. En Vercel, ve a **Settings > Domains**
2. Click **"Add Domain"**
3. Ingresa tu dominio: `terrenomarket.cl`
4. Vercel te dará registros DNS para agregar en tu proveedor:
   - Tipo `A` apuntando a Vercel IP
   - O tipo `CNAME` apuntando a `cname.vercel-dns.com`
5. Espera propagación DNS (5-30 minutos)
6. Vercel automáticamente genera SSL con Let's Encrypt ✅

### Actualizar variables con dominio real:
```
NEXT_PUBLIC_APP_URL = https://terrenomarket.cl
```

## 7. Configurar Twilio Webhook

Para que el agente IA funcione, Twilio necesita saber dónde enviar los mensajes:

1. Ve a [Twilio Console](https://console.twilio.com)
2. **Messaging > Settings > WhatsApp sandbox settings** (desarrollo)
3. O **WhatsApp > Senders** (producción con número aprobado)
4. En **"When a message comes in":**
   ```
   https://tu-dominio.vercel.app/api/whatsapp/webhook
   ```
5. Método: **POST**
6. Save

### Testing del webhook:
```bash
# Envía un mensaje de prueba al número de Twilio
# Deberías recibir una respuesta del agente IA
```

## 8. Monitoreo y Logs

### Ver logs en tiempo real:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Ver logs
vercel logs terreno-market --follow
```

### Desde el Dashboard:
1. Ve a tu proyecto en Vercel
2. **Deployments > Latest** > **"View Function Logs"**
3. Verás todos los console.log del webhook y API routes

## 9. Configurar Analytics (Opcional)

Vercel incluye analytics gratis:

1. En el proyecto, ve a **Analytics**
2. Enable **Web Analytics**
3. Verás:
   - Page views
   - Visitors únicos
   - Top pages
   - Dispositivos/países

## 10. Optimizaciones de Producción

### Habilitar ISR (Incremental Static Regeneration) para parcelas:

En `app/parcelas/[id]/page.tsx`:
```typescript
// Regenerar cada 1 hora
export const revalidate = 3600

// Generar páginas estáticas para las primeras 10 parcelas
export async function generateStaticParams() {
  const supabase = await createClient()
  const { data: parcels } = await supabase
    .from('parcels')
    .select('id')
    .eq('status', 'available')
    .limit(10)

  return parcels?.map(p => ({ id: p.id })) || []
}
```

### Habilitar Image Optimization:

Si usas Supabase Storage para imágenes, en `next.config.ts`:
```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}
```

## 11. CI/CD Automático

Vercel automáticamente:
- ✅ Deploy cada push a `main` → Producción
- ✅ Deploy cada PR → Preview URL única
- ✅ Ejecuta build y tests
- ✅ Preview comments en GitHub

Para configurar branch protections en GitHub:
1. Settings > Branches > Add rule
2. Branch name pattern: `main`
3. ✅ Require pull request reviews before merging
4. ✅ Require status checks to pass (Vercel builds)

## 12. Backup de Base de Datos

Supabase hace backups automáticos, pero para estar seguro:

```bash
# Exportar schema
pg_dump $DATABASE_URL -s > backup-schema.sql

# Exportar datos
pg_dump $DATABASE_URL -a > backup-data.sql
```

Haz esto semanalmente y guárdalo en un lugar seguro (no en el repo).

## Checklist de Deploy ✅

- [ ] Código pusheado a GitHub
- [ ] Variables de entorno configuradas en Vercel
- [ ] Deploy exitoso sin errores
- [ ] Home carga correctamente
- [ ] Parcelas se ven desde Supabase
- [ ] Dashboard funciona
- [ ] Webhook de Twilio configurado
- [ ] Dominio personalizado (opcional)
- [ ] SSL activo (automático con Vercel)
- [ ] Analytics habilitado
- [ ] Logs monitoreando

---

**🚀 ¡Listo!** Terreno Market está en producción.

**URLs importantes:**
- App: https://terreno-market.vercel.app
- Dashboard Vercel: https://vercel.com/dashboard
- Supabase: https://app.supabase.com
- Logs: `vercel logs terreno-market --follow`
