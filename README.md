# Happy Cart Challenge

## 🚀 Demo

[https://happy-cart-seven.vercel.app](https://happy-cart-seven.vercel.app)

## 🏃 Levantar en local

```bash
git clone https://github.com/vivianafb/happy-cart.git
cd happy-cart
npm install
npm run dev
```

## ⚙️ Variables de entorno

Crea un archivo `.env.local` en la raíz con lo siguiente:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/catalog
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/catalog
APP_URL=
WEBHOOK_URL=
```

## 🔗 Webhook SII

El webhook funciona en producción vía Vercel. Al generar una boleta:

1. Se crea en Supabase con status `pending`
2. Se hace POST a Pipedream con `documentId` y `callbackUrl`
3. Pipedream llama de vuelta a `/api/webhooks/sii`
4. La boleta se actualiza con `siiCode`, `pdfUrl` y status `issued`

Para evidenciarlo: genera una boleta en el deploy de producción y verás el estado cambiar de **Pendiente** a **Emitida** automáticamente.