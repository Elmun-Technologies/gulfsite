/**
 * SOHA (INDUSTRY) SAHIFALARI — qidiruv uchun title
 * ----------------------------------------------------------------
 * Avvalgi shablon "{name}: ароматизаторы" barcha sohaga bir xil edi:
 * otdushka sohalarida (bytovaya ximiya, stirka, kosmetika) noto'g'ri so'z
 * ("ароматизаторы" emas, "отдушки" qidiriladi) va oziq-ovqat sohalarida
 * real so'rov shaklidan uzoq ("Напитки: ароматизаторы" ↔ "ароматизаторы
 * для напитков"). Har soha uchun so'rov shaklidagi title.
 *
 * Qoida: har biri ≤ 43 belgi (+ " — GFF Uzbekistan" = 60, §13.1).
 * Tekshiruv: `npm run audit:seo` title uzunligini (≤ 60) o'lchaydi.
 */
import type { Trilingual } from './taxonomy';

/** Otdushka (fragrance) sohalari — tavsif shabloni boshqacha */
export const FRAGRANCE_INDUSTRIES = new Set(['personal-care', 'home-care', 'fabric-care']);

/** Xomashyo sohalari (aromatizator/atir ishlab chiqaruvchilar) — "issiqqa chidamli forma" ma'nosiz */
export const RAW_INDUSTRIES = new Set(['flavour-base', 'fragrance-base']);

export const INDUSTRY_SEO_TITLE: Record<string, Trilingual> = {
  bakery: { uz: 'Pishiriqlar uchun aromatizatorlar ulgurji', ru: 'Ароматизаторы для выпечки оптом', en: 'Bakery flavours wholesale' },
  confectionery: { uz: 'Konditer mahsulotlari uchun aromatizator', ru: 'Ароматизаторы для кондитерских изделий', en: 'Confectionery flavours supplier' },
  dairy: { uz: 'Sut mahsulotlari uchun aromatizatorlar', ru: 'Ароматизаторы для молочной продукции', en: 'Dairy flavours supplier' },
  icecream: { uz: 'Muzqaymoq uchun aromatizatorlar', ru: 'Ароматизаторы для мороженого оптом', en: 'Ice cream flavours wholesale' },
  beverages: { uz: 'Ichimliklar uchun aromatizatorlar ulgurji', ru: 'Ароматизаторы для напитков оптом', en: 'Beverage flavours wholesale' },
  sauces: { uz: 'Souslar uchun aromatizatorlar', ru: 'Ароматизаторы для соусов и заправок', en: 'Flavours for sauces and dressings' },
  snacks: { uz: 'Snek va chipslar uchun aromatizatorlar', ru: 'Ароматизаторы для снеков и чипсов', en: 'Snack and cereal flavours' },
  meat: { uz: 'Go‘sht va kolbasa uchun aromatizatorlar', ru: 'Ароматизаторы для мяса и колбас', en: 'Flavours for meat and sausages' },
  canned: { uz: 'Konserva uchun aromatizatorlar', ru: 'Ароматизаторы для консервации', en: 'Flavours for canned foods' },
  horeca: { uz: 'HoReCa uchun aromatizatorlar', ru: 'Ароматизаторы для HoReCa и кейтеринга', en: 'Flavours for HoReCa and catering' },
  supplements: { uz: 'BAA va sport ozuqasi uchun aromatizator', ru: 'Ароматизаторы для БАДов и спортпита', en: 'Flavours for supplements & sports food' },
  tobacco: { uz: 'Tamaki va HTP uchun aromatizatorlar', ru: 'Ароматизаторы для табака и СНТП', en: 'Tobacco and HTP flavours' },
  'personal-care': { uz: 'Sovun va kosmetika uchun otdushkalar', ru: 'Отдушки для мыла, шампуней и косметики', en: 'Fragrances for soap & cosmetics' },
  'home-care': { uz: 'Maishiy kimyo uchun otdushkalar', ru: 'Отдушки для бытовой химии оптом', en: 'Fragrances for household chemicals' },
  'fabric-care': { uz: 'Kir yuvish kukuni uchun otdushkalar', ru: 'Отдушки для стирального порошка', en: 'Fragrances for laundry detergents' },
  pharma: { uz: 'Farmatsevtika uchun aromatizatorlar', ru: 'Ароматизаторы для фармацевтики', en: 'Pharmaceutical flavours' },
  'pet-food': { uz: 'Hayvon ozuqasi uchun aromatizatorlar', ru: 'Ароматизаторы для кормов животных', en: 'Pet food flavours' },
  'flavour-base': { uz: 'Aromatizator ishlab chiqarishga xomashyo', ru: 'Сырьё для производства ароматизаторов', en: 'Raw materials for flavour manufacturing' },
  'fragrance-base': { uz: 'Atir ishlab chiqarish uchun xomashyo', ru: 'Сырьё для производства духов и парфюмерии', en: 'Raw materials for perfume manufacturing' },
};
