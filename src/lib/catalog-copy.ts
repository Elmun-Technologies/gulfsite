/**
 * KATALOG NUSXA (COPY) KUTUBXONASI
 * ----------------------------------------------------------------
 * Mahsulot tavsiflari va saqlash shartlari.
 * Ma'lumotlar (catalog.json) faqat faktlarni saqlaydi; matn shu yerda,
 * shuning uchun nusxani tahrirlash uchun qayta generatsiya shart emas.
 *
 * Yangi variant qo'shsangiz — copyVariant avtomatik mod-3 bo'yicha tanlanadi.
 */

import type { CategoryId } from './types';
import type { Locale } from './taxonomy';

interface CopyTemplate {
  uz: string[];
  ru: string[];
  en: string[];
}

const APP_LABEL: Record<string, Record<Locale, string>> = {
  bakery:         { uz: 'nonvoyxona',                ru: 'хлебобулочных изделий',          en: 'bakery' },
  confectionery:  { uz: 'konditer mahsulotlari',     ru: 'кондитерских изделий',           en: 'confectionery' },
  dairy:          { uz: 'sut mahsulotlari',          ru: 'молочной продукции',             en: 'dairy' },
  icecream:       { uz: 'muzqaymoq',                 ru: 'мороженого',                     en: 'ice cream' },
  beverages:      { uz: 'ichimliklar',               ru: 'напитков',                       en: 'beverages' },
  sauces:         { uz: 'souslar',                   ru: 'соусов',                         en: 'sauces' },
  snacks:         { uz: 'snacks',                    ru: 'снеков',                         en: 'snacks' },
  meat:           { uz: 'go‘sht mahsulotlari',       ru: 'мясопродуктов',                  en: 'meat products' },
  canned:         { uz: 'konserva',                  ru: 'консервации',                    en: 'canned foods' },
  horeca:         { uz: 'HoReCa',                    ru: 'HoReCa',                         en: 'HoReCa' },
  supplements:    { uz: 'BAA',                       ru: 'БАДов',                          en: 'supplements' },
  tobacco:        { uz: 'chekuv mahsulotlari',       ru: 'табачных изделий',               en: 'tobacco products' },
  'personal-care':{ uz: 'kosmetika',                 ru: 'косметики',                      en: 'personal care' },
  'home-care':    { uz: 'maishiy kimyo',             ru: 'бытовой химии',                  en: 'home care' },
  'fabric-care':  { uz: 'yuvish vositalari',         ru: 'средств для стирки',             en: 'fabric care' },
  pharma:         { uz: 'farmatsevtika',             ru: 'фармацевтики',                   en: 'pharmaceuticals' },
  'pet-food':     { uz: 'hayvonlar ozuqasi',         ru: 'кормов для животных',            en: 'pet food' },
  'flavour-base': { uz: 'aromatizator ishlab chiqarish', ru: 'производства ароматизаторов', en: 'flavour manufacturing' },
  'fragrance-base':{ uz: 'parfumeriya ishlab chiqarish', ru: 'производства парфюмерии',     en: 'fragrance manufacturing' },
  margarine:      { uz: 'margarin',                  ru: 'маргарина',                      en: 'margarine' },
  chocolate:      { uz: 'shokolad',                  ru: 'шоколада',                       en: 'chocolate' },
  soap:           { uz: 'sovun',                     ru: 'мыла',                           en: 'soap' },
  frozen:         { uz: 'muzlatilgan mahsulotlar',   ru: 'замороженных продуктов',         en: 'frozen foods' },
};

const TEMPLATES: Record<CategoryId, CopyTemplate> = {
  flavours: {
    uz: [
      '{name} — Gulf Flavours & Fragrances (GFF) laboratoriyasida ishlab chiqilgan yuqori konsentratsiyali oziq-ovqat aromatizatori. {apps} ishlab chiqarishida barqaror va aniq ta‘m profilini beradi. Yuqori konsentratsiya kichik dozada ham kuchli ta‘m beradi — bu tayyor mahsulot tannarxini sezilarli pasaytiradi.',
      '{name} — issiqlikka chidamli formulaga ega aromatizator. Pasterizatsiya, pishirish, ekstruziya va UHT jarayonlaridan keyin ham ta‘m va hid saqlanib qoladi. Asosiy yo‘nalishlari: {apps}. GFF texnologlari sizning retsepturangiz uchun dozani bepul hisoblab beradi.',
      '{name} — Dubaydagi Jebel Ali erkin iqtisodiy zonasidagi zavodda ishlab chiqariladigan professional aromatizator. {apps} uchun mo‘ljallangan. Mahsulotning o‘z ta‘mini niqoblamaydi, aksincha to‘ldiradi va yorqinlashtiradi; xom-ashyodagi keraksiz ta‘mni yopishga yordam beradi.',
    ],
    ru: [
      '{name} — высококонцентрированный пищевой ароматизатор, разработанный в лаборатории Gulf Flavours & Fragrances (GFF). Обеспечивает стабильный и точный вкусовой профиль в производстве: {apps}. Высокая концентрация даёт сильный вкус при малой дозировке и заметно снижает себестоимость готового продукта.',
      '{name} — термостабильный ароматизатор. Вкус и аромат сохраняются после пастеризации, выпечки, экструзии и UHT-обработки. Основные направления: {apps}. Технологи GFF бесплатно рассчитают дозировку под вашу рецептуру.',
      '{name} — профессиональный ароматизатор производства завода в свободной экономической зоне Джебель-Али (Дубай). Предназначен для: {apps}. Не маскирует собственный вкус продукта, а дополняет и усиливает его, помогая скрыть посторонние привкусы сырья.',
    ],
    en: [
      '{name} is a high-concentration food flavour developed in the Gulf Flavours & Fragrances (GFF) laboratory. It delivers a stable, precise taste profile for {apps}. The high concentration gives a strong flavour at a low dose, meaningfully reducing your cost-in-use.',
      '{name} is a heat-stable flavour. Taste and aroma survive pasteurisation, baking, extrusion and UHT processing. Primary applications: {apps}. GFF technologists will calculate the dosage for your recipe free of charge.',
      '{name} is a professional flavour manufactured at the Jebel Ali Free Zone plant in Dubai, designed for {apps}. It complements rather than masks the product’s own taste and helps cover raw-material off-notes.',
    ],
  },
  fragrances: {
    uz: [
      '{name} — GFF parfumerlari tomonidan yaratilgan atir kompozitsiyasi. {apps} mahsulotlari uchun mo‘ljallangan. Hid barqaror, tayyor mahsulot matritsasida o‘zgarmaydi va uzoq saqlanadi.',
      '{name} — premium klassdagi atir kompozitsiyasi. {apps} uchun ishlab chiqilgan; yuqori diffuziya, uzoq muddatli barqarorlik va aniq «ochilish piramidasi» bilan ajralib turadi.',
      '{name} — avtomatlashtirilgan sinov tizimida tekshirilgan atir kompozitsiyasi. {apps} uchun. Har bir partiya bir xil hid profilini kafolatlaydi, bu yirik seriyali ishlab chiqarishda muhim.',
    ],
    ru: [
      '{name} — парфюмерная композиция, созданная парфюмерами GFF. Предназначена для продукции: {apps}. Аромат стойкий, не меняется в матрице готового продукта и хорошо хранится.',
      '{name} — парфюмерная композиция премиум-класса для {apps}. Отличается высокой диффузией, длительной стойкостью и чёткой пирамидой раскрытия.',
      '{name} — парфюмерная композиция, проверенная на автоматизированной испытательной системе, для {apps}. Каждая партия гарантирует идентичный профиль аромата, что критично для серийного производства.',
    ],
    en: [
      '{name} is a fragrance composition created by GFF perfumers for {apps} products. The scent is tenacious, stable in the finished matrix and stores well.',
      '{name} is a premium-grade fragrance composition for {apps}, with high diffusion, long-lasting performance and a clear olfactory pyramid.',
      '{name} is a fragrance composition validated on an automated testing system for {apps}. Every batch guarantees an identical scent profile — critical for serial production.',
    ],
  },
  'essential-oils': {
    uz: [
      '{name} — 100% tabiiy efir moyi, bug‘ distillash yoki sovuq presslash usulida olingan. {apps} sohalarida qo‘llanadi. Har bir partiya GC/MS tahlili bilan tasdiqlanadi va pasport bilan birga yetkaziladi.',
      '{name} — tabiiy efir moyi. Aromaterapiya, oziq-ovqat va kosmetika ({apps}) uchun yaroqli. Soflik darajasi va tarkib barqarorligi laboratoriya nazoratida.',
      '{name} — GFF tomonidan yetkazib beriladigan tabiiy efir moyi. {apps} uchun. Kelib chiqish davlati, hosil mavsumi va ekstraktsiya usuli haqidagi ma‘lumot so‘rovda taqdim etiladi.',
    ],
    ru: [
      '{name} — 100% натуральное эфирное масло, полученное паровой дистилляцией или холодным отжимом. Применяется в: {apps}. Каждая партия подтверждается GC/MS-анализом и поставляется с паспортом.',
      '{name} — натуральное эфирное масло для ароматерапии, пищевой промышленности и косметики ({apps}). Степень чистоты и стабильность состава под лабораторным контролем.',
      '{name} — натуральное эфирное масло от GFF для {apps}. Информация о стране происхождения, сезоне сбора и методе экстракции предоставляется по запросу.',
    ],
    en: [
      '{name} is a 100% natural essential oil obtained by steam distillation or cold pressing, used in {apps}. Every batch is confirmed by GC/MS analysis and supplied with a certificate.',
      '{name} is a natural essential oil suitable for aromatherapy, food and cosmetics ({apps}). Purity and compositional stability are under laboratory control.',
      '{name} is a natural essential oil supplied by GFF for {apps}. Country of origin, harvest season and extraction method are available on request.',
    ],
  },
  'aroma-chemicals': {
    uz: [
      '{name} — parfumeriya va ta‘m kompozitsiyalari uchun yakka aroma kimyoviy moddasi. R&D laboratoriyalari ({apps}) uchun tavsiya etiladi. Yuqori soflik darajasi va barqaror sifat.',
      '{name} — aroma kimyosi monomolekulasi. O‘z retsepturangizni yaratish yoki mavjud kompozitsiyani kuchaytirish uchun. {apps} yo‘nalishlarida qo‘llanadi.',
      '{name} — GFF ta‘minotidagi aroma kimyoviy moddasi. {apps} uchun. Har bir partiya soflik sertifikati va MSDS bilan birga yetkaziladi.',
    ],
    ru: [
      '{name} — отдельное ароматическое вещество для парфюмерных и вкусовых композиций. Рекомендуется для R&D-лабораторий ({apps}). Высокая степень чистоты и стабильное качество.',
      '{name} — мономолекула аромахимии для создания собственных рецептур или усиления существующих композиций. Применяется в {apps}.',
      '{name} — аромахимикат от GFF для {apps}. Каждая партия поставляется с сертификатом чистоты и MSDS.',
    ],
    en: [
      '{name} is a single aroma chemical for perfumery and flavour compositions, recommended for R&D laboratories ({apps}). High purity and consistent quality.',
      '{name} is an aroma-chemistry monomolecule for building your own formulations or boosting existing compositions, used in {apps}.',
      '{name} is an aroma chemical supplied by GFF for {apps}. Every batch comes with a certificate of purity and an MSDS.',
    ],
  },
  'food-ingredients': {
    uz: [
      '{name} — oziq-ovqat sanoati uchun funksional ingredient. {apps} ishlab chiqarishida qo‘llanadi. Xalqaro va mahalliy me‘yoriy talablarga (ISO 22000, EAC) javob beradi.',
      '{name} — sertifikatlangan oziq-ovqat qo‘shimchasi. {apps} uchun barqaror sifat va partiyalararo bir xillik kafolatlanadi. Texnik hujjatlar va spetsifikatsiya so‘rovda yuboriladi.',
      '{name} — GFF distribyutorlik zaxirasidan yetkazib beriladigan ingredient. {apps} uchun. Dozani hisoblash va retsepturani optimallashtirish bo‘yicha texnik yordam bepul.',
    ],
    ru: [
      '{name} — функциональный ингредиент для пищевой промышленности. Применяется в производстве: {apps}. Соответствует международным и местным нормам (ISO 22000, EAC).',
      '{name} — сертифицированная пищевая добавка для {apps}. Гарантировано стабильное качество и однородность от партии к партии. Техническая документация и спецификация высылаются по запросу.',
      '{name} — ингредиент со складского запаса дистрибьютора GFF для {apps}. Бесплатная техническая поддержка по расчёту дозировки и оптимизации рецептуры.',
    ],
    en: [
      '{name} is a functional ingredient for the food industry, used in {apps}. Compliant with international and local regulations (ISO 22000, EAC).',
      '{name} is a certified food additive for {apps} with guaranteed batch-to-batch consistency. Technical documentation and specifications are available on request.',
      '{name} is an ingredient held in the GFF distributor stock for {apps}. Free technical support on dosage calculation and recipe optimisation.',
    ],
  },
  commodities: {
    uz: [
      '{name} — katta hajmda yetkazib beriladigan baza xom-ashyosi. {apps} ishlab chiqaruvchilari uchun barqaror ta‘minot. Konteyner va vagon yetkazib berish imkoniyati mavjud.',
      '{name} — baza komponenti. {apps} sohalarida keng qo‘llanadi. Omborda doimiy zaxira saqlanadi, shartnoma asosida narxlar belgilanadi.',
      '{name} — GFF orqali to‘g‘ridan-to‘g‘ri yetkazib beriladigan baza xom-ashyo. {apps} uchun. Yillik shartnoma bo‘yicha narx va yetkazib berish grafigi kelishiladi.',
    ],
    ru: [
      '{name} — базовое сырьё крупнотоннажных поставок. Стабильное обеспечение для производителей: {apps}. Возможна отгрузка контейнером или вагоном.',
      '{name} — базовый компонент, широко применяемый в {apps}. Постоянный складской запас, договорные цены.',
      '{name} — базовое сырьё с прямой поставкой через GFF для {apps}. Цена и график поставок фиксируются годовым контрактом.',
    ],
    en: [
      '{name} is a bulk base raw material with stable supply for {apps} producers. Container or wagon shipments available.',
      '{name} is a base component widely used in {apps}. Permanent stock and contract pricing.',
      '{name} is a base raw material supplied directly through GFF for {apps}. Price and delivery schedule are fixed by annual contract.',
    ],
  },
};

export const STORAGE: Record<CategoryId, { uz: string; ru: string; en: string }> = {
  flavours: {
    uz: 'Zich yopilgan original idishda, salqin va quruq joyda, +5…+25 °C. Quyosh nuridan himoyalang.',
    ru: 'В плотно закрытой оригинальной таре, в прохладном сухом месте, +5…+25 °C. Беречь от прямых солнечных лучей.',
    en: 'In tightly closed original packaging, in a cool dry place, +5…+25 °C. Protect from direct sunlight.',
  },
  fragrances: {
    uz: 'Zich yopilgan holda, +10…+30 °C, quyosh nuridan himoyalangan joyda.',
    ru: 'В плотно закрытой таре, +10…+30 °C, в защищённом от солнца месте.',
    en: 'Tightly closed, +10…+30 °C, protected from sunlight.',
  },
  'essential-oils': {
    uz: 'Qorong‘i shisha yoki alyuminiy idishda, +5…+20 °C. Ochilgandan keyin azot bilan himoya qilish tavsiya etiladi.',
    ru: 'В тёмной стеклянной или алюминиевой таре, +5…+20 °C. После вскрытия рекомендуется азотная подушка.',
    en: 'In dark glass or aluminium containers, +5…+20 °C. A nitrogen blanket is recommended after opening.',
  },
  'aroma-chemicals': {
    uz: 'Zich yopilgan holda, +10…+25 °C, yondiruvchi manbalardan uzoqda.',
    ru: 'В плотно закрытой таре, +10…+25 °C, вдали от источников возгорания.',
    en: 'Tightly closed, +10…+25 °C, away from ignition sources.',
  },
  'food-ingredients': {
    uz: 'Quruq omborda, nisbiy namlik ≤ 70%, +5…+25 °C. Hidli va kuchli oksidlovchi moddalardan alohida saqlang.',
    ru: 'В сухом складе, относительная влажность ≤ 70%, +5…+25 °C. Хранить отдельно от пахнущих и сильных окислителей.',
    en: 'In a dry warehouse, relative humidity ≤ 70%, +5…+25 °C. Store away from odorous substances and strong oxidisers.',
  },
  commodities: {
    uz: 'Yopiq idishda, +5…+30 °C, yaxshi ventilyatsiya qilingan omborda.',
    ru: 'В закрытой таре, +5…+30 °C, на хорошо вентилируемом складе.',
    en: 'In closed containers, +5…+30 °C, in a well-ventilated warehouse.',
  },
};

/** Qisqa izoh (kartochka uchun, 1 jumlada) */
const BLURBS: Record<CategoryId, { uz: string; ru: string; en: string }> = {
  flavours: {
    uz: 'Yuqori konsentratsiyali ta‘m va hid — {apps} uchun.',
    ru: 'Высококонцентрированный вкус и аромат для {apps}.',
    en: 'High-concentration taste and aroma for {apps}.',
  },
  fragrances: {
    uz: 'Barqaror atir kompozitsiyasi — {apps} uchun.',
    ru: 'Стойкая парфюмерная композиция для {apps}.',
    en: 'Tenacious fragrance composition for {apps}.',
  },
  'essential-oils': {
    uz: '100% tabiiy efir moyi — GC/MS tasdiqli.',
    ru: '100% натуральное эфирное масло — подтверждено GC/MS.',
    en: '100% natural essential oil — GC/MS verified.',
  },
  'aroma-chemicals': {
    uz: 'R&D uchun sof aroma monomolekulasi.',
    ru: 'Чистая арома-мономолекула для R&D.',
    en: 'Pure aroma monomolecule for R&D.',
  },
  'food-ingredients': {
    uz: 'Sertifikatlangan funksional ingredient — {apps}.',
    ru: 'Сертифицированный функциональный ингредиент — {apps}.',
    en: 'Certified functional ingredient — {apps}.',
  },
  commodities: {
    uz: 'Katta hajmdagi baza xom-ashyosi, omborda.',
    ru: 'Базовое сырьё крупным тоннажем, со склада.',
    en: 'Bulk base raw material, ex-stock.',
  },
};

/* ------------------------------------------------------------
   API
   ------------------------------------------------------------ */

function joinApps(applications: string[], locale: Locale, max = 3): string {
  if (!applications.length) {
    return locale === 'uz' ? 'oziq-ovqat sanoati' : locale === 'ru' ? 'пищевой промышленности' : 'the food industry';
  }
  const labels = applications.slice(0, max).map((a) => APP_LABEL[a]?.[locale] ?? a);
  const conj = locale === 'uz' ? 'va' : locale === 'ru' ? 'и' : 'and';
  if (labels.length === 1) return labels[0]!;
  return `${labels.slice(0, -1).join(', ')} ${conj} ${labels[labels.length - 1]}`;
}

export function productDescription(
  category: CategoryId,
  name: string,
  applications: string[],
  variant: number,
  locale: Locale,
): string {
  const list = TEMPLATES[category]?.[locale] ?? TEMPLATES.flavours[locale];
  const tpl = list[variant % list.length] ?? list[0]!;
  return tpl.replace(/\{name\}/g, name).replace(/\{apps\}/g, joinApps(applications, locale));
}

export function productBlurb(
  category: CategoryId,
  applications: string[],
  locale: Locale,
): string {
  const tpl = BLURBS[category][locale];
  return tpl.replace(/\{apps\}/g, joinApps(applications, locale, 2));
}

export function storageText(category: CategoryId, locale: Locale): string {
  return STORAGE[category][locale];
}

export function applicationLabel(id: string, locale: Locale): string {
  return APP_LABEL[id]?.[locale] ?? id;
}

/** Batafsil sahifa uchun „afzalliklar“ bloki — kategoriya bo'yicha */
export const BENEFITS: Record<CategoryId, { uz: string[]; ru: string[]; en: string[] }> = {
  flavours: {
    uz: [
      'Yuqori konsentratsiya — kichik doza, past tannarx',
      'Issiqlikka chidamli: pishirish va pasterizatsiyaga bardosh beradi',
      '4000+ xom-ashyo bazasi — individual retseptura yaratish imkoni',
      'Xalqaro standartlarga muvofiqlik: ISO 22000, HACCP, Halol',
      'Bepul namuna va texnologik qo‘llab-quvvatlash',
    ],
    ru: [
      'Высокая концентрация — малая дозировка, низкая себестоимость',
      'Термостабильность: выдерживает выпечку и пастеризацию',
      'База из 4000+ видов сырья — возможность индивидуальной рецептуры',
      'Соответствие международным стандартам: ISO 22000, HACCP, Халяль',
      'Бесплатные образцы и технологическая поддержка',
    ],
    en: [
      'High concentration — low dosage, low cost-in-use',
      'Heat stable: survives baking and pasteurisation',
      'Base of 4,000+ raw materials — bespoke formulations possible',
      'Compliant with international standards: ISO 22000, HACCP, Halal',
      'Free samples and technical support',
    ],
  },
  fragrances: {
    uz: [
      'Uzoq muddatli barqarorlik va yuqori diffuziya',
      'Avtomatlashtirilgan sinov tizimi — partiyalararo bir xillik',
      'Nozik parfumeriya, shaxsiy, uy va mato parvarishi uchun',
      'Mijoz talabiga moslashtirilgan kompozitsiyalar',
      'Bepul namuna va parfumer maslahati',
    ],
    ru: [
      'Длительная стойкость и высокая диффузия',
      'Автоматизированная система тестирования — идентичность партий',
      'Для тонкой парфюмерии, личной гигиены, дома и текстиля',
      'Композиции, адаптированные под требования клиента',
      'Бесплатные образцы и консультация парфюмера',
    ],
    en: [
      'Long-lasting performance and high diffusion',
      'Automated testing system — batch-to-batch consistency',
      'For fine fragrance, personal, home and fabric care',
      'Compositions tailored to client requirements',
      'Free samples and perfumer consultation',
    ],
  },
  'essential-oils': {
    uz: [
      '100% tabiiy, sintetik aralashmasiz',
      'Har bir partiya GC/MS tahlili bilan tasdiqlanadi',
      'Bug‘ distillash va sovuq presslash usullari',
      'Kosmetika, oziq-ovqat va aromaterapiya uchun yaroqli',
      'Kelib chiqish hujjatlari so‘rovda taqdim etiladi',
    ],
    ru: [
      '100% натуральные, без синтетических примесей',
      'Каждая партия подтверждается GC/MS-анализом',
      'Паровая дистилляция и холодный отжим',
      'Подходят для косметики, пищевой промышленности и ароматерапии',
      'Документы о происхождении предоставляются по запросу',
    ],
    en: [
      '100% natural, free of synthetic adulterants',
      'Every batch confirmed by GC/MS analysis',
      'Steam distillation and cold pressing',
      'Suitable for cosmetics, food and aromatherapy',
      'Origin documentation available on request',
    ],
  },
  'aroma-chemicals': {
    uz: [
      'Yuqori soflik darajasi',
      'Har bir partiya uchun CoA va MSDS',
      'R&D va kichik seriyali ishlab chiqarish uchun qulay qadoq',
      'Keng assortiment — monomolekuladan kompozitsiyagacha',
      'Texnik maslahat va formulatsiya yordami',
    ],
    ru: [
      'Высокая степень чистоты',
      'CoA и MSDS на каждую партию',
      'Удобная фасовка для R&D и малосерийного производства',
      'Широкий ассортимент — от мономолекулы до композиции',
      'Техническая консультация и помощь в формулировании',
    ],
    en: [
      'High purity grade',
      'CoA and MSDS for every batch',
      'Convenient pack sizes for R&D and small-batch production',
      'Broad range — from single molecules to compositions',
      'Technical consultation and formulation support',
    ],
  },
  'food-ingredients': {
    uz: [
      'Barcha hujjatlar: deklaratsiya, CoA, spetsifikatsiya',
      'Ombor zaxirasi — tez yetkazib berish',
      'Partiyalararo barqaror sifat',
      'Dozani hisoblash bo‘yicha texnik yordam',
      'Halol va EAC talablariga muvofiqlik',
    ],
    ru: [
      'Полный пакет документов: декларация, CoA, спецификация',
      'Складской запас — быстрая отгрузка',
      'Стабильное качество от партии к партии',
      'Техническая помощь в расчёте дозировки',
      'Соответствие требованиям Халяль и EAC',
    ],
    en: [
      'Full documentation set: declaration, CoA, specification',
      'Warehouse stock — fast dispatch',
      'Consistent batch-to-batch quality',
      'Technical assistance with dosage calculation',
      'Halal and EAC compliant',
    ],
  },
  commodities: {
    uz: [
      'Katta hajm — raqobatbardosh narx',
      'Barqaror yetkazib berish grafigi',
      'Konteyner va vagon yetkazib berish',
      'Yillik shartnoma imkoniyati',
      'Sifat nazorati har bir partiyada',
    ],
    ru: [
      'Большой объём — конкурентная цена',
      'Стабильный график поставок',
      'Отгрузка контейнером или вагоном',
      'Возможность годового контракта',
      'Контроль качества каждой партии',
    ],
    en: [
      'High volume — competitive pricing',
      'Stable delivery schedule',
      'Container and wagon shipments',
      'Annual contract options',
      'Quality control on every batch',
    ],
  },
};
