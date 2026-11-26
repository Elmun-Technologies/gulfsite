/**
 * Tavsiya etilgan doza — qachon KO'RSATILADI (sof, klient uchun ham xavfsiz).
 *
 * `scripts/build-catalog.mjs` har kategoriyaga BITTA shablon doza beradi. Aromatizator,
 * atir, efir moyi va aroma kimyosi uchun bu oraliq umumiy ma'noda to'g'ri, lekin
 * oziq-ovqat qo'shimchalari (shakar, un, jelatin, natriy nitriti…) va komoditi (tuz, un,
 * quruq sut navalom) uchun "0.05–2%" / "0.5–20%" ma'nosiz — ba'zan xavfli darajada noto'g'ri
 * (nitrit). Bunday shablon qiymat sahifada, meta description va JSON-LD'da chiqmaydi;
 * admin haqiqiy qiymat kiritsa (shablondan farq qiladi) — u ko'rsatiladi.
 */

/** build-catalog.mjs dagi shablon [min, max] — faqat ma'nosiz bo'lgan kategoriyalar */
const PLACEHOLDER_DOSE: Readonly<Record<string, readonly [number, number]>> = {
  'food-ingredients': [0.05, 2],
  commodities: [0.5, 20],
};

interface DoseSource {
  category: string;
  dosage: { min: number; max: number; unit: string };
}

/** Doza ma'lumotdan (admin yoki manba) kelganmi — shablon emasmi */
export function hasRealDosage(p: DoseSource): boolean {
  const ph = PLACEHOLDER_DOSE[p.category];
  return !(ph && p.dosage.min === ph[0] && p.dosage.max === ph[1]);
}

/** "0.05–0.3%" yoki `null` (shablon doza — ko'rsatilmaydi) */
export function doseRange(p: DoseSource): string | null {
  return hasRealDosage(p) ? `${p.dosage.min}–${p.dosage.max}${p.dosage.unit}` : null;
}
