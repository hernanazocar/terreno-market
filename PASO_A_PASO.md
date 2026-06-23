# 🚀 Configuración y Deploy - Paso a Paso

## PARTE 1: SUPABASE (15 minutos)

### ✅ Paso 1: Crear Proyecto en Supabase

1. **Abre en tu navegador:** https://supabase.com
2. Click en **"Start your project"** o **"Sign in"** si ya tienes cuenta
3. Una vez dentro, click en **"New Project"**

**Configuración del proyecto:**
```
Organization: (selecciona o crea una)
Name: terreno-market-production
Database Password: (GENERA UNO SEGURO - guárdalo!)
Region: South America (São Paulo) ← Más cercano a Chile
Pricing Plan: Free (para empezar)
```

4. Click **"Create new project"**
5. ⏳ Espera 2-3 minutos mientras se crea el proyecto

---

### ✅ Paso 2: Ejecutar Migraciones SQL

Una vez que el proyecto esté listo (verás el dashboard):

1. En el menú izquierdo, click en **"SQL Editor"**
2. Click en **"New Query"**

**Abre este archivo en tu editor:**
```
/Users/hernanazocar/dev/terreno-market-v2/migrations/001_initial_schema.sql
```

3. **Copia TODO el contenido** del archivo (Cmd+A, Cmd+C)
4. **Pégalo** en el SQL Editor de Supabase
5. Click en **"Run"** (botón verde abajo a la derecha)
6. ✅ Deberías ver: "Success. No rows returned"

**Verifica:**
- Ve a **"Table Editor"** (menú izquierdo)
- Deberías ver 8 tablas: `tenants`, `users`, `projects`, `financing_terms`, `parcels`, `leads`, `lead_conversations`, `appointments`

---

### ✅ Paso 3: Ejecutar Seed (Datos de Chicureo)

1. En **SQL Editor**, click **"New Query"** de nuevo

**Abre este archivo:**
```
/Users/hernanazocar/dev/terreno-market-v2/seed/001_seed_chicureo.sql
```

2. **Copia TODO** el contenido
3. **Pégalo** en el SQL Editor
4. Click **"Run"**
5. ✅ Deberías ver: "Success. 1 rows affected" (varias veces)

**Verifica:**
- Ve a **"Table Editor" > "parcels"**
- Deberías ver **4 parcelas** de Hacienda Las Higueras

---

### ✅ Paso 4: Obtener Credenciales de Supabase

1. En el menú izquierdo, ve a **"Settings" > "API"**

Verás 3 datos importantes:

**A) Project URL**
```
https://XXXXXXXX.supabase.co
```
📋 Copia esto

**B) Project API keys > anon/public**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz...
```
📋 Copia esto (es la key pública, larga)

**C) Project API keys > service_role** (⚠️ click "Reveal" para verla)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz...
```
📋 Copia esto (es la key SECRETA, nunca la compartas)

---

### ✅ Paso 5: Configurar .env.local

**Abre este archivo en tu editor:**
```
/Users/hernanazocar/dev/terreno-market-v2/.env.local
```

**Reemplaza las líneas con tus credenciales:**

```bash
# Supabase - REEMPLAZAR con tus valores
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...(LA SECRETA)

# Anthropic (OPCIONAL por ahora - déjalo vacío si no tienes)
ANTHROPIC_API_KEY=

# Twilio (OPCIONAL por ahora - déjalo vacío si no tienes)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=

# Mapbox (OPCIONAL - déjalo vacío por ahora)
NEXT_PUBLIC_MAPBOX_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

**Guarda el archivo** (Cmd+S)

---

### ✅ Paso 6: Probar Conexión Local

**En la terminal:**

```bash
cd ~/dev/terreno-market-v2

# Si el servidor está corriendo, detenlo (Ctrl+C) y reinicia
npm run dev
```

**Abre en el navegador:**
```
http://localhost:3002/parcelas
```

✅ **Si ves las 4 parcelas de Hacienda Las Higueras → ¡FUNCIONA!**

❌ **Si no funciona:**
- Revisa que las credenciales en `.env.local` sean correctas
- Verifica que las tablas existan en Supabase
- Revisa la consola del navegador (F12) y terminal por errores

---

## PARTE 2: DEPLOY A VERCEL (10 minutos)

### ✅ Paso 1: Push a GitHub

**En la terminal:**

```bash
cd ~/dev/terreno-market-v2

# Inicializar git (si no está)
git init

# Agregar todo
git add .

# Commit
git commit -m "feat: Terreno Market MVP completo

- Portal público con catálogo y fichas ricas
- Simulador de crédito directo (5 tipos)
- Dashboard con pipeline kanban
- Agente IA por WhatsApp
- Sistema de notificaciones push
- Panel admin

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Crear repo en GitHub:**

1. Abre https://github.com/new
2. Repository name: `terreno-market`
3. Description: `Portal chileno de parcelas con IA - Leads calificados, no formularios muertos`
4. **Private** (recomendado)
5. NO marques: README, .gitignore, license
6. Click **"Create repository"**

**Conectar y pushear:**

```bash
git branch -M main
git remote add origin https://github.com/TU-USUARIO/terreno-market.git
git push -u origin main
```

✅ **Deberías ver:** "Enumerating objects... done"

---

### ✅ Paso 2: Import en Vercel

1. **Abre:** https://vercel.com
2. **Login** con GitHub
3. Click **"Add New..." > "Project"**
4. **Busca** tu repo `terreno-market`
5. Click **"Import"**

**NO hagas click en Deploy todavía** ⚠️

---

### ✅ Paso 3: Configurar Variables de Entorno en Vercel

En la página de configuración, **expande "Environment Variables"**

**Agrega estas variables UNA POR UNA:**

**Variables Públicas:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://XXXXXXXX.supabase.co (tu URL de Supabase)
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGci... (tu anon key de Supabase)
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: NEXT_PUBLIC_APP_URL
Value: https://terreno-market.vercel.app (Vercel te lo dirá después del deploy)
Environments: ✅ Production
```

**Variables Secretas:**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGci... (tu service_role key SECRETA)
Environments: ✅ Production ✅ Preview
```

**Las demás (Anthropic, Twilio, Mapbox) son OPCIONALES por ahora - déjalas para después**

---

### ✅ Paso 4: Deploy

1. Click **"Deploy"** (botón azul)
2. ⏳ Espera 2-3 minutos
3. Verás logs en tiempo real:
   - Installing dependencies...
   - Building...
   - Deploying...

✅ **Cuando veas:** "🎉 Deployment Ready" → **¡ÉXITO!**

---

### ✅ Paso 5: Verificar Deploy

1. Click en **"Visit"** o en la URL que te dio Vercel
2. Deberías ver tu app en producción

**Verifica estas páginas:**
```
https://tu-proyecto.vercel.app/
https://tu-proyecto.vercel.app/parcelas
https://tu-proyecto.vercel.app/parcelas/1
https://tu-proyecto.vercel.app/dashboard
```

✅ **Si todo carga correctamente → ¡DEPLOYADO!**

---

### ✅ Paso 6: Actualizar NEXT_PUBLIC_APP_URL

Ahora que conoces tu URL final:

1. En Vercel, ve a tu proyecto
2. **Settings > Environment Variables**
3. Edita `NEXT_PUBLIC_APP_URL`
4. Cámbiala a tu URL real: `https://terreno-market.vercel.app`
5. Click **"Save"**
6. Ve a **"Deployments"** y click **"Redeploy"** en el último deploy

---

## PARTE 3: CONFIGURACIÓN OPCIONAL (hacer después)

### 📱 Twilio WhatsApp (para agente IA real)

1. Crea cuenta en https://twilio.com
2. Ve a **Console > Messaging > Try it out > Send a WhatsApp message**
3. Sigue el wizard para activar el sandbox
4. Ve a **Settings**
5. Webhook URL: `https://tu-dominio.vercel.app/api/whatsapp/webhook`
6. Método: **POST**

**Obtener credenciales:**
- Account SID: En el dashboard principal
- Auth Token: Click en "Show" en el dashboard
- WhatsApp Number: `whatsapp:+14155238886` (sandbox) o tu número aprobado

**Agregar a Vercel:**
- Settings > Environment Variables
- Agregar: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`
- Redeploy

### 🤖 Anthropic API (para agente IA)

1. Abre https://console.anthropic.com
2. Settings > API Keys
3. Create Key
4. Copia la key (empieza con `sk-ant-`)
5. Agrégala a Vercel: `ANTHROPIC_API_KEY`
6. Redeploy

### 🗺️ Mapbox (para mapas)

1. Abre https://mapbox.com
2. Sign up / Login
3. Account > Tokens
4. Copy default public token (empieza con `pk.`)
5. Agrégala a Vercel: `NEXT_PUBLIC_MAPBOX_TOKEN`

---

## ✅ CHECKLIST FINAL

### Supabase:
- [ ] Proyecto creado
- [ ] Migraciones ejecutadas (8 tablas)
- [ ] Seed ejecutado (4 parcelas)
- [ ] Credenciales copiadas
- [ ] .env.local configurado
- [ ] Probado localmente (parcelas se ven)

### Vercel:
- [ ] Código pusheado a GitHub
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] App funciona en producción
- [ ] URL actualizada en variables

### Opcional:
- [ ] Twilio configurado (WhatsApp)
- [ ] Anthropic API configurada (agente IA)
- [ ] Mapbox configurado (mapas)

---

## 🆘 PROBLEMAS COMUNES

### "relation parcels does not exist"
→ Las migraciones no se ejecutaron. Vuelve al Paso 2 de Supabase.

### "Invalid API key"
→ Revisa las credenciales en `.env.local` o Vercel variables.

### Build error en Vercel
→ Revisa los logs. Probablemente falta una variable de entorno.

### WhatsApp no responde
→ Necesitas configurar Twilio y Anthropic API primero.

---

## 📞 SIGUIENTE PASO

Una vez que todo esté funcionando, ve a:
```
https://tu-proyecto.vercel.app/dashboard
```

Ahí verás el dashboard con los 4 leads mock. Para tener leads reales, necesitas:
1. Configurar Twilio + Anthropic
2. Que un comprador real use el botón "Conversar por WhatsApp" en una ficha de parcela

---

**¿En qué paso estás? Dime si necesitas ayuda con algo específico.** 🚀
