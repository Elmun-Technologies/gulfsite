# Joylashtirish: sayt — Vercel, backend — fly.io

Sayt (sahifalar) **Vercel**'da (`gulfflavours.uz`), ma'lumotlar (arizalar, analitika,
admin kontenti, logotiplar) **fly.io** volume'ida. Ikkalasi ham shu repodan deploy qilinadi.

```
brauzer ──sahifalar──▶ Vercel (gulfflavours.uz) ──kontent (ISR)──▶ fly /api/content/public
   │                                        ▲
   └──ariza, analitika (CORS)──▶ fly /api/leads, /api/t
admin ──▶ fly /uz/admin ──saqlash──▶ Vercel /api/revalidate (sayt darhol yangilanadi)
```

## 1. fly.io (backend)

```bash
fly volumes create gff_data --size 3 --region fra
fly secrets set ADMIN_PASSWORD=... ADMIN_SECRET=$(openssl rand -hex 32) \
  REVALIDATE_SECRET=$(openssl rand -hex 24) \
  TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=...
fly deploy
```

`fly.toml` da `FRONTEND_URL = "https://gulfflavours.uz"` — shu bilan:
CORS faqat saytga ochiladi, fly domenidagi ommaviy sahifalar saytga yo'naltiriladi
(Google'da dublikat bo'lmaydi), admin saqlaganda Vercel yangilanadi.

Admin panel: `https://<fly-app>.fly.dev/uz/admin` (yoki `admin.gulfflavours.uz`
CNAME → fly, `fly certs add admin.gulfflavours.uz`). Saytdagi `/uz/admin` avtomatik
shu yerga o'tadi.

## 2. Vercel (sayt)

Project → Settings → Environment Variables (Production + Preview):

| O'zgaruvchi | Qiymat |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://gulfflavours.uz` |
| `NEXT_PUBLIC_API_URL` | `https://<fly-app>.fly.dev` |
| `BACKEND_URL` | `https://<fly-app>.fly.dev` |
| `REVALIDATE_SECRET` | fly'dagi bilan bir xil |

O'zgaruvchilarni qo'shgach **Redeploy** (NEXT_PUBLIC_* build vaqtida yoziladi).

## 3. Tekshirish

```bash
curl -s https://<fly-app>.fly.dev/api/content/public | head -c 200      # kontent
curl -sI https://<fly-app>.fly.dev/uz | grep -i location                # → gulfflavours.uz
curl -s -X OPTIONS -H 'Origin: https://gulfflavours.uz' -i https://<fly-app>.fly.dev/api/leads | grep -i allow-origin
```

Saytda forma yuboring → fly admin panelida ariza paydo bo'lishi kerak.
Admin → Kontent → saqlang → saytda bir necha soniyada yangilanadi.

## E-mail (info@gulfflavours.uz)

fly ham, Vercel ham pochta xizmati bermaydi. Pochta uchun domen DNS'iga MX yozuvlari
qo'shiladigan provayder kerak: **Yandex 360 for Business**, **Zoho Mail** (bepul tarif bor)
yoki **Google Workspace**. Quti ochilgach Vercel'da `NEXT_PUBLIC_EMAIL` ni o'zgartiring.
