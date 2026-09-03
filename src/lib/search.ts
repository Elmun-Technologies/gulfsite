/**
 * QIDIRUV VA MATNNI NORMALLASHTIRISH
 * ----------------------------------------------------------------
 * O'zbek lotin ↔ kirill ↔ rus ↔ ingliz — bitta qidiruv qutisida.
 * Foydalanuvchi "qulupnay", "қулупнай", "kulupnay", "клубника"
 * yoki "strawberry" yozsa ham bir xil natija chiqadi.
 */

/** O'zbek kirill → lotin jadvali */
const CYR_TO_LAT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'sh', ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya',
  ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h',
};

/** Digraflar (birinchi navbatda moslashtiriladi) */
const CYR_DIGRAPHS: [RegExp, string][] = [
  [/шч/g, 'shch'],
  [/шъ/g, 'sh'],
];

/**
 * Kirill yozuvini lotin yozuviga o'giradi.
 * Lotin matn o'zgarishsiz qoladi — shuning uchun aralash qidiruv ham ishlaydi.
 */
export function cyrToLat(input: string): string {
  let out = '';
  for (const ch of input.toLowerCase()) {
    out += CYR_TO_LAT[ch] ?? ch;
  }
  for (const [re, rep] of CYR_DIGRAPHS) out = out.replace(re, rep);
  return out;
}

/** Tipografik belgilarni soddalashtiradi (o‘ → o, “ → ", — → -) */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\u2018\u2019\u201A\u201B\u02BB\u02BC\u00B4`]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, '-')
    .replace(/ё/g, 'е')
    .replace(/'/g, '')
    .normalize('NFKC');
}

/** Qidiruv uchun to'liq normallashtirish: tipografika + kirill→lotin */
export function searchKey(input: string): string {
  return normalize(cyrToLat(input)).replace(/\s+/g, ' ').trim();
}

/** So'zlarga bo'lish (stop-so'zlarsiz, 2+ belgi) */
export function tokenize(input: string): string[] {
  const key = searchKey(input);
  if (!key) return [];
  return key
    .split(/[^a-z0-9]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'flavour', 'flavors', 'flavor', 'flavours',
  'fragrance', 'aromatizator', 'aromat', 'aroma', 'hidi', 'tami',
  'пищевой', 'ароматизатор', 'ароматизаторы', 'отдушка', 'масло',
  'uchun', 'для', 'for',
]);

export function meaningfulTokens(input: string): string[] {
  return tokenize(input).filter((t) => !STOPWORDS.has(t));
}

/* ------------------------------------------------------------
   Moslik bahosi
   ------------------------------------------------------------ */

export interface ScoredHit {
  score: number;
  matched: boolean;
}

/**
 * Qidiruv so'rovini mahsulotning qidiruv maydoniga solishtiradi.
 *
 * Ball tizimi:
 *   +100  SKU ning aniq mosligi
 *   +60   nom boshlanishida (prefix)
 *   +45   nom ichida to'liq so'z
 *   +18   nom ichida qisman (substring)
 *   +8    tavsif/tag ichida
 *   +4    boshqa tildagi nomda
 *
 * BARCHA tokenlar mos kelishi shart (AND mantig'i) — aks holda matched=false.
 */
export function scoreMatch(
  query: string,
  fields: { primary: string[]; secondary: string[]; sku: string },
): ScoredHit {
  const tokens = meaningfulTokens(query);
  if (!tokens.length) return { score: 0, matched: true };

  const primaryKeys = fields.primary.map(searchKey).filter(Boolean);
  const secondaryKeys = fields.secondary.map(searchKey).filter(Boolean);
  const skuKey = searchKey(fields.sku);
  const rawQuery = searchKey(query);

  let total = 0;
  for (const token of tokens) {
    let best = 0;

    if (skuKey.includes(token)) best = Math.max(best, 100);

    for (const p of primaryKeys) {
      if (p.startsWith(token)) best = Math.max(best, 60);
      else if (p.includes(` ${token}`) || p.includes(`-${token}`)) best = Math.max(best, 45);
      else if (p.includes(token)) best = Math.max(best, 18);
    }
    if (best === 0) {
      for (const s of secondaryKeys) {
        if (s.includes(token)) best = Math.max(best, 8);
      }
    }
    if (best === 0) return { score: 0, matched: false };
    total += best;
  }

  // Butun ibora aniq mos kelsa — bonus
  if (rawQuery.length > 3) {
    for (const p of primaryKeys) {
      if (p === rawQuery) total += 200;
      else if (p.startsWith(rawQuery)) total += 90;
      else if (p.includes(rawQuery)) total += 30;
    }
  }

  return { score: total, matched: true };
}

/* ------------------------------------------------------------
   Yozish xatolarini bag'ishlash (fuzzy)
   ------------------------------------------------------------ */

export function levenshtein(a: string, b: string, max = 3): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1]! + 1, prev[j]! + 1, prev[j - 1]! + cost);
      if (curr[j]! < rowMin) rowMin = curr[j]!;
    }
    if (rowMin > max) return max + 1;
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j]!;
  }
  return prev[b.length]!;
}

/**
 * Bir so'zli qidiruvda yozuv xatosini tuzatish taklifini qaytaradi.
 * Faqat bitta nom bilan solishtiriladi; masofa ≤ 1 (4+ belgi) yoki ≤ 2 (7+ belgi).
 */
export function suggestCorrection(query: string, candidates: Iterable<string>): string | null {
  const tokens = meaningfulTokens(query);
  if (tokens.length !== 1) return null;
  const token = tokens[0]!;
  if (token.length < 4) return null;

  const tolerance = token.length >= 7 ? 2 : 1;
  let best: { word: string; dist: number } | null = null;

  for (const raw of candidates) {
    for (const word of tokenize(raw)) {
      if (word === token) return null; // aniq mos — taklif kerak emas
      if (Math.abs(word.length - token.length) > tolerance) continue;
      const dist = levenshtein(token, word, tolerance);
      if (dist <= tolerance && (!best || dist < best.dist)) {
        best = { word, dist };
        if (dist === 1) return word;
      }
    }
  }
  return best?.word ?? null;
}
