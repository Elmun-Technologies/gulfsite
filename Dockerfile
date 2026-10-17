# ============================================================
#  GFF UZBEKISTAN — production image
# ------------------------------------------------------------
#  Ko'p bosqichli (multi-stage) build:
#    deps    → faqat node_modules (keshlanadi, package-lock o'zgarmasa)
#    builder → `npm run build` (shriftlar + katalog + Next build)
#    runner  → Next `output: 'standalone'` natijasi: kichik image
#
#  Ishga tushirish:
#    docker build -t gff-uz .
#    docker run -p 3000:3000 \
#      -e NEXT_PUBLIC_SITE_URL=https://gff.uz \
#      -e ADMIN_PASSWORD=... -e ADMIN_SECRET=... \
#      -e TELEGRAM_BOT_TOKEN=... -e TELEGRAM_CHAT_ID=... \
#      -v gff-data:/app/data \
#      gff-uz
#
#  MA'LUMOTLAR: /app/data ichida — leads/ (arizalar), analytics/ (tashriflar),
#  content/ (admin paneldagi kontaktlar, logotiplar, videolar).
#  fly.io: fly.toml dagi [[mounts]] shu papkani volume'ga ulaydi.
#  Volume bermasangiz, konteyner o'chsa ma'lumot yo'qoladi —
#  shuning uchun -v yoki bind-mount MAJBURIY deb hisoblang.
# ============================================================

# ---------- 1. Bog'liqliklar ----------
FROM node:22-alpine AS deps
WORKDIR /app

# Kesh uchun avval manifest fayllari
COPY package.json package-lock.json ./
# postinstall (copy-fonts) build bosqichida bajariladi — bu yerda o'chiramiz
RUN npm ci --no-audit --no-fund --ignore-scripts


# ---------- 2. Build ----------
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build: prepare:assets (shriftlar + katalog.json) + next build (standalone)
RUN npm run build


# ---------- 3. Runner ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    # Lead papkasi: server.js `process.chdir(__dirname)` qiladi, shuning uchun
    # yo'lni ANIQ ko'rsatamiz — volume mount nuqtasi bilan bir xil.
    LEAD_STORAGE_PATH=/app/data/leads \
    DATA_DIR=/app/data

# Xavfsizlik: server root emas, `gff` foydalanuvchisi nomidan ishlaydi.
# su-exec — entrypoint volume egasini tuzatib, keyin huquqni tushiradi.
RUN addgroup -S gff && adduser -S gff -G gff && apk add --no-cache su-exec

# Standalone server + statik fayllar
# --chown: ISR (revalidate) qayta yaratilgan sahifalarni .next ichiga YOZADI —
# root egaligida bu jim yiqilardi va sahifalar yangilanmasdi.
COPY --from=builder --chown=gff:gff /app/.next/standalone ./
COPY --from=builder --chown=gff:gff /app/.next/static ./.next/static
COPY --from=builder --chown=gff:gff /app/public ./public

# Ma'lumotlar (leadlar, analitika, kontent, logotiplar) — volume mount nuqtasi
RUN mkdir -p /app/data/leads /app/data/analytics /app/data/content && chown -R gff:gff /app/data

# fly.io / Docker volume root egaligida ulanadi → entrypoint egani tuzatadi
# va serverni `gff` nomidan ishga tushiradi.
RUN printf '#!/bin/sh\nchown -R gff:gff /app/data 2>/dev/null || true\nexec su-exec gff "$@"\n' > /entrypoint.sh \
  && chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
