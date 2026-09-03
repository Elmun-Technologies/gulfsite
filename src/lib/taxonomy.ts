/**
 * Taksonomiya — katalog filtrlari uchun barcha o'lchovlar (facets).
 * Har bir qiymat 3 tilda: uz (lotin), ru (kirill), en.
 *
 * Yangi qiymat qo'shish: shu faylga qo'shing, so'ng data/source/catalog.tsv
 * dagi tegishli ustunga yozing va `npm run catalog:build` ni ishga tushiring.
 */

export type Locale = 'uz' | 'ru' | 'en';
export type Trilingual = Record<Locale, string>;

export interface Taxon {
  /** URL va API da ishlatiladigan barqaror identifikator */
  id: string;
  name: Trilingual;
  /** Qisqa izoh (tooltip / kartochka osti) */
  hint?: Trilingual;
  /** Vizual rang (Tailwind emas — to'g'ridan-to'g'ri hex) */
  color?: string;
  /** Ikonka kaliti */
  icon?: string;
  /** Tartib raqami (kichik = oldinroq) */
  order?: number;
}

/* ============================================================
   1. KATEGORIYALAR — mahsulotning yuqori darajasi
   ============================================================ */

export const CATEGORIES: Taxon[] = [
  {
    id: 'flavours',
    icon: 'flavour',
    color: '#0e7c6b',
    order: 1,
    name: {
      uz: "Oziq-ovqat aromatizatorlari",
      ru: 'Пищевые ароматизаторы',
      en: 'Food flavours',
    },
    hint: {
      uz: "Ta'm va hid beruvchi konsentratlar — 4000+ retseptura",
      ru: 'Концентраты вкуса и аромата — более 4000 рецептур',
      en: 'Taste & aroma concentrates — 4,000+ formulations',
    },
  },
  {
    id: 'fragrances',
    icon: 'fragrance',
    color: '#a8552a',
    order: 2,
    name: { uz: 'Atir kompozitsiyalari', ru: 'Парфюмерные композиции и отдушки', en: 'Fragrances & perfumery' },
    hint: {
      uz: 'Parfumeriya, shaxsiy parvarish, uy va mato uchun atirlar',
      ru: 'Парфюмерия, личная гигиена, дом и текстиль',
      en: 'Fine fragrance, personal, home & fabric care',
    },
  },
  {
    id: 'food-ingredients',
    icon: 'ingredient',
    color: '#b8891f',
    order: 3,
    name: { uz: "Oziq-ovqat qo'shimchalari", ru: 'Пищевые добавки', en: 'Food ingredients & additives' },
    hint: {
      uz: 'Konservantlar, shirinlashtirgichlar, quyuqlashtirgichlar, bo\'yoqlar',
      ru: 'Консерванты, подсластители, загустители, красители',
      en: 'Preservatives, sweeteners, thickeners, colourants',
    },
  },
  {
    id: 'essential-oils',
    icon: 'oil',
    color: '#2cc0a8',
    order: 4,
    name: { uz: 'Efir moylari', ru: 'Эфирные масла', en: 'Essential oils' },
    hint: {
      uz: "100% tabiiy, bug' distillash usulida olingan moylar",
      ru: '100% натуральные масла паровой дистилляции',
      en: '100% natural, steam-distilled oils',
    },
  },
  {
    id: 'aroma-chemicals',
    icon: 'molecule',
    color: '#116a5c',
    order: 5,
    name: { uz: 'Aroma kimyoviy moddalari', ru: 'Аромахимикаты', en: 'Aroma chemicals' },
    hint: {
      uz: "Parfumer va R&D uchun yakka tarkibiy moddalar",
      ru: 'Отдельные молекулы для парфюмерии и R&D',
      en: 'Single molecules for perfumery & R&D',
    },
  },
  {
    id: 'commodities',
    icon: 'sack',
    color: '#6b7a76',
    order: 6,
    name: { uz: 'Baza xom-ashyosi', ru: 'Базовое сырьё', en: 'Commodities' },
    hint: {
      uz: "Katta hajmdagi asosiy komponentlar: MPG, glitserin, vanilin",
      ru: 'Крупнотоннажные компоненты: МПГ, глицерин, ванилин',
      en: 'Bulk base components: PG, glycerine, vanillin',
    },
  },
];

/* ============================================================
   2. TA'M GURUHLARI — aromatizatorlar uchun asosiy filtr
   ============================================================ */

export const FLAVOUR_GROUPS: Taxon[] = [
  { id: 'fruit',      icon: 'apple',     color: '#c4703a', order: 1,  name: { uz: 'Mevali',           ru: 'Фруктовые',        en: 'Fruit' } },
  { id: 'berry',      icon: 'berry',     color: '#a1305a', order: 2,  name: { uz: 'Rezavor',          ru: 'Ягодные',          en: 'Berry' } },
  { id: 'citrus',     icon: 'citrus',    color: '#d4a63c', order: 3,  name: { uz: 'Sitrus',           ru: 'Цитрусовые',       en: 'Citrus' } },
  { id: 'tropical',   icon: 'palm',      color: '#14a08c', order: 4,  name: { uz: 'Tropik',           ru: 'Тропические',      en: 'Tropical' } },
  { id: 'nut',        icon: 'nut',       color: '#8a5a2b', order: 5,  name: { uz: "Yong'oqli",        ru: 'Ореховые',         en: 'Nutty' } },
  { id: 'dairy',      icon: 'milk',      color: '#6b7a76', order: 6,  name: { uz: 'Sutli',            ru: 'Молочные',         en: 'Dairy' } },
  { id: 'sweet',      icon: 'candy',     color: '#b8891f', order: 7,  name: { uz: 'Shirin va desert', ru: 'Сладкие и десерты', en: 'Sweet & dessert' } },
  { id: 'chocolate',  icon: 'cocoa',     color: '#5b3421', order: 8,  name: { uz: 'Shokolad va kakao', ru: 'Шоколад и какао',  en: 'Chocolate & cocoa' } },
  { id: 'bakery',     icon: 'bread',     color: '#a8552a', order: 9,  name: { uz: 'Non va pishiriq',  ru: 'Хлеб и выпечка',   en: 'Bakery' } },
  { id: 'savoury',    icon: 'meat',      color: '#8c2f2f', order: 10, name: { uz: "Tuzli va go'shtli", ru: 'Солёные и мясные', en: 'Savoury & meat' } },
  { id: 'vegetable',  icon: 'carrot',    color: '#4f7a2a', order: 11, name: { uz: 'Sabzavotli',       ru: 'Овощные',          en: 'Vegetable' } },
  { id: 'herb-spice', icon: 'leaf',      color: '#0d5449', order: 12, name: { uz: "Ziravor va o'tlar", ru: 'Травы и специи',   en: 'Herb & spice' } },
  { id: 'mint-cool',  icon: 'snowflake', color: '#2cc0a8', order: 13, name: { uz: 'Yalpiz va sovutuvchi', ru: 'Мятные и охлаждающие', en: 'Mint & cooling' } },
  { id: 'floral',     icon: 'flower',    color: '#b5477e', order: 14, name: { uz: 'Gulli',            ru: 'Цветочные',        en: 'Floral' } },
  { id: 'beverage',   icon: 'glass',     color: '#116a5c', order: 15, name: { uz: 'Ichimlik',         ru: 'Напитки',          en: 'Beverage' } },
  { id: 'alcohol',    icon: 'bottle',    color: '#7a4a1f', order: 16, name: { uz: "Spirtli ta'mlar",  ru: 'Алкогольные',      en: 'Alcoholic notes' } },
  { id: 'tea-coffee', icon: 'coffee',    color: '#5b3421', order: 17, name: { uz: 'Choy va kofe',     ru: 'Чай и кофе',       en: 'Tea & coffee' } },
  { id: 'tobacco',    icon: 'smoke',     color: '#4f5d59', order: 18, name: { uz: 'Chekuv (tobacco)', ru: 'Табачные',         en: 'Tobacco' } },
  { id: 'snack',      icon: 'chips',     color: '#d4a63c', order: 19, name: { uz: 'Snack ta‘mlari',   ru: 'Снековые',         en: 'Snack' } },
];

/* ============================================================
   3. ATIR GURUHLARI (fragrances)
   ============================================================ */

export const FRAGRANCE_GROUPS: Taxon[] = [
  { id: 'fine-fragrance', icon: 'perfume',   color: '#b5477e', order: 1, name: { uz: 'Nozik atirlar',      ru: 'Тонкая парфюмерия',   en: 'Fine fragrance' } },
  { id: 'personal-care',  icon: 'bottle',    color: '#c4703a', order: 2, name: { uz: 'Shaxsiy parvarish',  ru: 'Личная гигиена',      en: 'Personal care' } },
  { id: 'home-care',      icon: 'house',     color: '#0e7c6b', order: 3, name: { uz: 'Uy uchun',           ru: 'Для дома',            en: 'Home care' } },
  { id: 'fabric-care',    icon: 'shirt',     color: '#116a5c', order: 4, name: { uz: 'Mato parvarishi',    ru: 'Уход за текстилем',   en: 'Fabric care' } },
  { id: 'oriental',       icon: 'star',      color: '#9a7516', order: 5, name: { uz: 'Sharqona',           ru: 'Восточные',           en: 'Oriental' } },
  { id: 'woody',          icon: 'tree',      color: '#5b3421', order: 6, name: { uz: "Yog'ochli",          ru: 'Древесные',           en: 'Woody' } },
  { id: 'fresh-aquatic',  icon: 'wave',      color: '#2cc0a8', order: 7, name: { uz: 'Suvli va yangi',     ru: 'Свежие и акватические', en: 'Fresh & aquatic' } },
];

/* ============================================================
   3b. INGREDIENT GURUHLARI (food-ingredients)
   ============================================================ */

export const INGREDIENT_GROUPS: Taxon[] = [
  { id: 'colour',         icon: 'palette',  color: '#b5477e', order: 1,  name: { uz: 'Bo‘yoqlar',              ru: 'Красители',            en: 'Colourants' } },
  { id: 'preservative',   icon: 'shield',   color: '#8c2f2f', order: 2,  name: { uz: 'Konservantlar',          ru: 'Консерванты',          en: 'Preservatives' } },
  { id: 'antioxidant',    icon: 'shield',   color: '#0d5449', order: 3,  name: { uz: 'Antioksidantlar',        ru: 'Антиоксиданты',        en: 'Antioxidants' } },
  { id: 'thickener',      icon: 'paste',    color: '#b8891f', order: 4,  name: { uz: 'Quyuqlashtirgichlar',    ru: 'Загустители',          en: 'Thickeners & stabilisers' } },
  { id: 'stabiliser',     icon: 'paste',    color: '#9a7516', order: 5,  name: { uz: 'Stabillashtirgichlar',   ru: 'Стабилизаторы',        en: 'Stabilisers' } },
  { id: 'emulsifier',     icon: 'wave',     color: '#116a5c', order: 6,  name: { uz: 'Emulgatorlar',           ru: 'Эмульгаторы',          en: 'Emulsifiers' } },
  { id: 'sweetener',      icon: 'candy',    color: '#c4703a', order: 7,  name: { uz: 'Shirinlashtirgichlar',   ru: 'Подсластители',        en: 'Sweeteners' } },
  { id: 'acidulant',      icon: 'drop',     color: '#d4a63c', order: 8,  name: { uz: 'Kislota regulatorlari',  ru: 'Регуляторы кислотности', en: 'Acidulants' } },
  { id: 'leavening',      icon: 'bread',    color: '#a8552a', order: 9,  name: { uz: 'Qabartuvchilar',         ru: 'Разрыхлители',         en: 'Leavening agents' } },
  { id: 'fortifier',      icon: 'pill',     color: '#0e7c6b', order: 10, name: { uz: 'Vitamin va mineral',     ru: 'Витамины и минералы',  en: 'Fortifiers' } },
  { id: 'mineral',        icon: 'granule',  color: '#6b7a76', order: 11, name: { uz: 'Mineral moddalar',       ru: 'Минеральные вещества', en: 'Minerals' } },
  { id: 'protein',        icon: 'powder',   color: '#8a5a2b', order: 12, name: { uz: 'Oqsillar',               ru: 'Белки',                en: 'Proteins' } },
  { id: 'dairy-base',     icon: 'milk',     color: '#4f5d59', order: 13, name: { uz: 'Sut asoslari',           ru: 'Молочные основы',      en: 'Dairy bases' } },
  { id: 'savoury-base',   icon: 'meat',     color: '#8c2f2f', order: 14, name: { uz: 'Tuzli ta‘m asoslari',    ru: 'Солёные базы',         en: 'Savoury bases' } },
  { id: 'chocolate-base', icon: 'cocoa',    color: '#5b3421', order: 15, name: { uz: 'Kakao va shokolad',      ru: 'Какао и шоколад',      en: 'Cocoa & chocolate' } },
  { id: 'oil-base',       icon: 'oil',      color: '#d4a63c', order: 16, name: { uz: 'O‘simlik moylari',       ru: 'Растительные масла',   en: 'Vegetable oils' } },
];

/* ============================================================
   3c. BAZA XOM-ASHYO GURUHLARI (commodities)
   ============================================================ */

export const COMMODITY_GROUPS: Taxon[] = [
  { id: 'solvent',         icon: 'drop',     color: '#116a5c', order: 1, name: { uz: 'Erituvchilar',         ru: 'Растворители',        en: 'Solvents & carriers' } },
  { id: 'sweetener-base',  icon: 'candy',    color: '#c4703a', order: 2, name: { uz: 'Ta‘m asoslari',        ru: 'Вкусовые базы',       en: 'Taste bases' } },
  { id: 'bulk-sugar',      icon: 'sack',     color: '#b8891f', order: 3, name: { uz: 'Shakar va uglevod',    ru: 'Сахар и углеводы',    en: 'Sugars & carbs' } },
  { id: 'bulk-acid',       icon: 'drop',     color: '#d4a63c', order: 4, name: { uz: 'Kislotalar',           ru: 'Кислоты',             en: 'Acids' } },
  { id: 'bulk-phosphate',  icon: 'granule',  color: '#6b7a76', order: 5, name: { uz: 'Fosfatlar',            ru: 'Фосфаты',             en: 'Phosphates' } },
  { id: 'bulk-flour',      icon: 'bread',    color: '#a8552a', order: 6, name: { uz: 'Un va don',            ru: 'Мука и зерно',        en: 'Flour & grains' } },
  { id: 'bulk-fat',        icon: 'oil',      color: '#5b3421', order: 7, name: { uz: 'Yog‘lar',              ru: 'Жиры',                en: 'Fats & butters' } },
  { id: 'bulk-dairy',      icon: 'milk',     color: '#4f5d59', order: 8, name: { uz: 'Sut xom-ashyosi',      ru: 'Молочное сырьё',      en: 'Dairy raw materials' } },
];

/* ============================================================
   4. QO'LLASH SOHALARI (industries / applications)
   ============================================================ */

export const APPLICATIONS: Taxon[] = [
  { id: 'bakery',        icon: 'bread',     color: '#a8552a', order: 1,  name: { uz: 'Nonvoyxona va pishiriq', ru: 'Хлебобулочные и выпечка', en: 'Bakery & pastry' } },
  { id: 'confectionery', icon: 'candy',     color: '#b5477e', order: 2,  name: { uz: 'Konditer mahsulotlari',  ru: 'Кондитерские изделия',    en: 'Confectionery' } },
  { id: 'dairy',         icon: 'milk',      color: '#6b7a76', order: 3,  name: { uz: 'Sut mahsulotlari',       ru: 'Молочная продукция',      en: 'Dairy' } },
  { id: 'icecream',      icon: 'icecream',  color: '#2cc0a8', order: 4,  name: { uz: 'Muzqaymoq',              ru: 'Мороженое',               en: 'Ice cream' } },
  { id: 'beverages',     icon: 'glass',     color: '#116a5c', order: 5,  name: { uz: 'Ichimliklar',            ru: 'Напитки',                 en: 'Beverages' } },
  { id: 'sauces',        icon: 'sauce',     color: '#8c2f2f', order: 6,  name: { uz: 'Souslar va dressinglar', ru: 'Соусы и заправки',        en: 'Sauces & dressings' } },
  { id: 'snacks',        icon: 'chips',     color: '#d4a63c', order: 7,  name: { uz: 'Snacks va quruq nonushta', ru: 'Снеки и сухие завтраки', en: 'Snacks & cereals' } },
  { id: 'meat',          icon: 'meat',      color: '#8c2f2f', order: 8,  name: { uz: "Go'sht va kolbasa",      ru: 'Мясо и колбасы',          en: 'Meat & sausages' } },
  { id: 'canned',        icon: 'jar',       color: '#4f7a2a', order: 9,  name: { uz: 'Konserva va marinadlar', ru: 'Консервация и маринады',  en: 'Canning & preserves' } },
  { id: 'horeca',        icon: 'chef',      color: '#0e7c6b', order: 10, name: { uz: 'HoReCa va qandolat',     ru: 'HoReCa и кейтеринг',      en: 'HoReCa & catering' } },
  { id: 'supplements',   icon: 'pill',      color: '#0d5449', order: 11, name: { uz: 'BAA va sport ovqatlanishi', ru: 'БАДы и спортпит',      en: 'Supplements & sports nutrition' } },
  { id: 'tobacco',       icon: 'smoke',     color: '#4f5d59', order: 12, name: { uz: 'Chekuv va HTP',          ru: 'Табак и СНТП',            en: 'Tobacco & HTP' } },
  { id: 'personal-care', icon: 'bottle',    color: '#c4703a', order: 13, name: { uz: 'Kosmetika va parvarish', ru: 'Косметика и уход',        en: 'Cosmetics & personal care' } },
  { id: 'home-care',     icon: 'house',     color: '#14a08c', order: 14, name: { uz: 'Maishiy kimyo',          ru: 'Бытовая химия',           en: 'Home care' } },
  { id: 'fabric-care',   icon: 'shirt',     color: '#116a5c', order: 15, name: { uz: 'Yuvish vositalari',      ru: 'Средства для стирки',     en: 'Fabric & laundry' } },
  { id: 'pharma',        icon: 'pill',      color: '#0d5449', order: 16, name: { uz: 'Farmatsevtika',          ru: 'Фармацевтика',            en: 'Pharmaceuticals' } },
  { id: 'pet-food',      icon: 'paw',       color: '#8a5a2b', order: 17, name: { uz: 'Hayvonlar ozuqasi',      ru: 'Корма для животных',      en: 'Pet food' } },
  { id: 'flavour-base',   icon: 'flask',    color: '#0d5449', order: 18, name: { uz: 'Aromatizator ishlab chiqarish', ru: 'Производство ароматизаторов', en: 'Flavour manufacturing' } },
  { id: 'fragrance-base', icon: 'perfume',  color: '#b5477e', order: 19, name: { uz: 'Parfumeriya ishlab chiqarish',  ru: 'Производство парфюмерии',   en: 'Fragrance manufacturing' } },
];

/* ============================================================
   5. SHAKL (form)
   ============================================================ */

export const FORMS: Taxon[] = [
  { id: 'liquid',     icon: 'drop',    order: 1, name: { uz: 'Suyuq',          ru: 'Жидкий',       en: 'Liquid' } },
  { id: 'powder',     icon: 'powder',  order: 2, name: { uz: 'Kukun',          ru: 'Порошковый',   en: 'Powder' } },
  { id: 'paste',      icon: 'paste',   order: 3, name: { uz: 'Pasta',          ru: 'Паста',        en: 'Paste' } },
  { id: 'emulsion',   icon: 'wave',    order: 4, name: { uz: 'Emulsiya',       ru: 'Эмульсия',     en: 'Emulsion' } },
  { id: 'oil',        icon: 'oil',     order: 5, name: { uz: "Moyli (efir)",   ru: 'Масляный',     en: 'Oil-based' } },
  { id: 'granular',   icon: 'granule', order: 6, name: { uz: 'Granulalangan',  ru: 'Гранулированный', en: 'Granular' } },
  { id: 'encapsulated', icon: 'capsule', order: 7, name: { uz: 'Kapsulalangan', ru: 'Инкапсулированный', en: 'Encapsulated' } },
];

/* ============================================================
   6. QADOQ (packaging) — kg
   ============================================================ */

export const PACKAGING: { id: string; kg: number; name: Trilingual }[] = [
  { id: 'p0.25', kg: 0.25, name: { uz: '0.25 kg (namuna)', ru: '0,25 кг (образец)', en: '0.25 kg (sample)' } },
  { id: 'p1',    kg: 1,    name: { uz: '1 kg',             ru: '1 кг',              en: '1 kg' } },
  { id: 'p5',    kg: 5,    name: { uz: '5 kg kanistra',    ru: '5 кг канистра',     en: '5 kg canister' } },
  { id: 'p10',   kg: 10,   name: { uz: '10 kg kanistra',   ru: '10 кг канистра',    en: '10 kg canister' } },
  { id: 'p25',   kg: 25,   name: { uz: '25 kg bak / qop',  ru: '25 кг бочка / мешок', en: '25 kg drum / bag' } },
  { id: 'p50',   kg: 50,   name: { uz: '50 kg qop',        ru: '50 кг мешок',       en: '50 kg bag' } },
  { id: 'p200',  kg: 200,  name: { uz: '200 kg bak',       ru: '200 кг бочка',      en: '200 kg drum' } },
  { id: 'p1000', kg: 1000, name: { uz: '1000 kg IBC',      ru: '1000 кг IBC-контейнер', en: '1000 kg IBC' } },
];

/* ============================================================
   7. XUSUSIYATLAR / SERTIFIKATLAR (features)
   ============================================================ */

export const FEATURES: Taxon[] = [
  { id: 'halal',       icon: 'halal',    order: 1, name: { uz: 'Halol sertifikati',   ru: 'Сертификат Халяль',  en: 'Halal certified' } },
  { id: 'gmo-free',    icon: 'gmo',      order: 2, name: { uz: "GMO'siz",            ru: 'Без ГМО',            en: 'GMO-free' } },
  { id: 'alcohol-free',icon: 'no-alcohol',order: 3,name: { uz: 'Spirtsiz',           ru: 'Без спирта',         en: 'Alcohol-free' } },
  { id: 'heat-stable', icon: 'thermo',   order: 4, name: { uz: 'Issiqqa chidamli',   ru: 'Термостабильный',    en: 'Heat stable' } },
  { id: 'natural',     icon: 'leaf',     order: 5, name: { uz: 'Tabiiy',             ru: 'Натуральный',        en: 'Natural' } },
  { id: 'vegan',       icon: 'vegan',    order: 6, name: { uz: 'Vegan',              ru: 'Веган',              en: 'Vegan' } },
  { id: 'kosher',      icon: 'kosher',   order: 7, name: { uz: 'Kosher',             ru: 'Кошерный',           en: 'Kosher' } },
  { id: 'water-soluble', icon: 'drop',   order: 8, name: { uz: 'Suvda eruvchan',     ru: 'Водорастворимый',    en: 'Water soluble' } },
  { id: 'oil-soluble', icon: 'oil',      order: 9, name: { uz: "Moyda eruvchan",     ru: 'Жирорастворимый',    en: 'Oil soluble' } },
  { id: 'eac',         icon: 'eac',      order: 10, name: { uz: 'EAC (YEOII) muvofiqligi', ru: 'Соответствие EAC (ЕАЭС)', en: 'EAC conformity' } },
  { id: 'iso',         icon: 'iso',      order: 11, name: { uz: 'ISO 22000 / HACCP',  ru: 'ISO 22000 / HACCP', en: 'ISO 22000 / HACCP' } },
];

/* ============================================================
   8. MAVJUDLIK (availability)
   ============================================================ */

export const AVAILABILITY: Taxon[] = [
  { id: 'in-stock',   color: '#0e7c6b', order: 1, name: { uz: "Omborda bor",        ru: 'В наличии',        en: 'In stock' } },
  { id: 'on-order',   color: '#d4a63c', order: 2, name: { uz: 'Buyurtma asosida',   ru: 'Под заказ',        en: 'Made to order' } },
  { id: 'new',        color: '#a8552a', order: 3, name: { uz: 'Yangi',              ru: 'Новинка',          en: 'New arrival' } },
];

/* ============================================================
   9. O'ZBEKISTON HUDUDLARI — lead formasi uchun
   ============================================================ */

export const UZ_REGIONS: { id: string; name: Trilingual }[] = [
  { id: 'tashkent-city',   name: { uz: 'Toshkent shahri',        ru: 'г. Ташкент',            en: 'Tashkent city' } },
  { id: 'tashkent-region', name: { uz: 'Toshkent viloyati',      ru: 'Ташкентская область',   en: 'Tashkent region' } },
  { id: 'andijan',         name: { uz: 'Andijon viloyati',       ru: 'Андижанская область',   en: 'Andijan' } },
  { id: 'bukhara',         name: { uz: 'Buxoro viloyati',        ru: 'Бухарская область',     en: 'Bukhara' } },
  { id: 'fergana',         name: { uz: "Farg'ona viloyati",      ru: 'Ферганская область',    en: 'Fergana' } },
  { id: 'jizzakh',         name: { uz: 'Jizzax viloyati',        ru: 'Джизакская область',    en: 'Jizzakh' } },
  { id: 'kashkadarya',     name: { uz: 'Qashqadaryo viloyati',   ru: 'Кашкадарьинская область', en: 'Kashkadarya' } },
  { id: 'namangan',        name: { uz: 'Namangan viloyati',      ru: 'Наманганская область',  en: 'Namangan' } },
  { id: 'navoiy',          name: { uz: 'Navoiy viloyati',        ru: 'Навоийская область',    en: 'Navoiy' } },
  { id: 'samarkand',       name: { uz: 'Samarqand viloyati',     ru: 'Самаркандская область', en: 'Samarkand' } },
  { id: 'sirdaryo',        name: { uz: 'Sirdaryo viloyati',      ru: 'Сырдарьинская область', en: 'Sirdaryo' } },
  { id: 'surkhandarya',    name: { uz: 'Surxondaryo viloyati',   ru: 'Сурхандарьинская область', en: 'Surkhandarya' } },
  { id: 'khorezm',         name: { uz: 'Xorazm viloyati',        ru: 'Хорезмская область',    en: 'Khorezm' } },
  { id: 'karakalpakstan',  name: { uz: "Qoraqalpog'iston Respublikasi", ru: 'Республика Каракалпакстан', en: 'Karakalpakstan' } },
  { id: 'other',           name: { uz: 'Boshqa',                 ru: 'Другое',                en: 'Other' } },
];

/* ============================================================
   10. BIZNES TURI (lead kvalifikatsiyasi uchun)
   ============================================================ */

export const BUSINESS_TYPES: { id: string; name: Trilingual }[] = [
  { id: 'manufacturer',   name: { uz: 'Ishlab chiqaruvchi zavod',      ru: 'Производство / завод',        en: 'Manufacturer' } },
  { id: 'confectionery',  name: { uz: 'Konditer / qandolat sexi',       ru: 'Кондитерское производство',   en: 'Confectionery producer' } },
  { id: 'bakery-chain',   name: { uz: 'Nonvoyxona tarmog\'i',           ru: 'Сеть пекарен',                en: 'Bakery chain' } },
  { id: 'beverage',       name: { uz: 'Ichimliklar ishlab chiqarish',   ru: 'Производство напитков',       en: 'Beverage producer' } },
  { id: 'dairy',          name: { uz: 'Sut kombinati',                  ru: 'Молочный комбинат',           en: 'Dairy plant' } },
  { id: 'horeca',         name: { uz: 'HoReCa / restoran',              ru: 'HoReCa / ресторан',           en: 'HoReCa / restaurant' } },
  { id: 'distributor',    name: { uz: 'Distribyutor / ulgurji savdo',   ru: 'Дистрибьютор / опт',          en: 'Distributor / wholesale' } },
  { id: 'retail',         name: { uz: 'Chakana savdo tarmog\'i',        ru: 'Розничная сеть',              en: 'Retail chain' } },
  { id: 'cosmetics',      name: { uz: 'Kosmetika va maishiy kimyo',     ru: 'Косметика и бытовая химия',   en: 'Cosmetics & home care' } },
  { id: 'lab-rd',         name: { uz: 'Laboratoriya / R&D',             ru: 'Лаборатория / R&D',           en: 'Lab / R&D' } },
  { id: 'startup',        name: { uz: 'Startap / yangi loyiha',         ru: 'Стартап / новый проект',      en: 'Startup / new project' } },
  { id: 'other',          name: { uz: 'Boshqa',                         ru: 'Другое',                      en: 'Other' } },
];

/* ============================================================
   11. LEAD TURLARI
   ============================================================ */

export const LEAD_TYPES = {
  sample: {
    name: { uz: 'Namuna qutisi (test box)', ru: 'Тест-бокс образцов', en: 'Sample test box' },
    color: '#0e7c6b',
    icon: 'box',
  },
  quote: {
    name: { uz: 'Narx so\'rovi (RFQ)', ru: 'Запрос цены (RFQ)', en: 'Price request (RFQ)' },
    color: '#b8891f',
    icon: 'invoice',
  },
  product: {
    name: { uz: 'Mahsulot bo\'yicha so\'rov', ru: 'Запрос по товару', en: 'Product enquiry' },
    color: '#116a5c',
    icon: 'tag',
  },
  callback: {
    name: { uz: 'Qo\'ng\'iroq so\'rovi', ru: 'Запрос звонка', en: 'Callback request' },
    color: '#c4703a',
    icon: 'phone',
  },
  contact: {
    name: { uz: 'Umumiy murojaat', ru: 'Общее обращение', en: 'General contact' },
    color: '#6b7a76',
    icon: 'mail',
  },
  catalog: {
    name: { uz: 'Katalog yuklab olish', ru: 'Скачать каталог', en: 'Catalogue download' },
    color: '#4f5d59',
    icon: 'download',
  },
} as const satisfies Record<string, { name: Trilingual; color: string; icon: string }>;

export type LeadType = keyof typeof LEAD_TYPES;

/* ============================================================
   12. LEAD HOLATLARI (admin pipeline)
   ============================================================ */

export const LEAD_STATUSES = {
  new:       { name: { uz: 'Yangi',            ru: 'Новая',           en: 'New' },          color: '#2cc0a8', order: 1 },
  contacted: { name: { uz: 'Bog\'lanildi',     ru: 'Связались',       en: 'Contacted' },    color: '#116a5c', order: 2 },
  qualified: { name: { uz: 'Malakali',         ru: 'Квалифицирован',  en: 'Qualified' },    color: '#d4a63c', order: 3 },
  sample_sent: { name: { uz: 'Namuna yuborildi', ru: 'Образец отправлен', en: 'Sample sent' }, color: '#c4703a', order: 4 },
  proposal:  { name: { uz: 'KP yuborildi',     ru: 'КП отправлено',   en: 'Proposal sent' }, color: '#9a7516', order: 5 },
  won:       { name: { uz: 'Bitim yopildi',    ru: 'Сделка закрыта',  en: 'Won' },          color: '#0e7c6b', order: 6 },
  lost:      { name: { uz: 'Rad etildi',       ru: 'Отказ',           en: 'Lost' },         color: '#8c2f2f', order: 7 },
  spam:      { name: { uz: 'Spam',             ru: 'Спам',            en: 'Spam' },         color: '#6b7a76', order: 8 },
} as const satisfies Record<string, { name: Trilingual; color: string; order: number }>;

export type LeadStatus = keyof typeof LEAD_STATUSES;

/* ============================================================
   Helpers
   ============================================================ */

export const ALL_GROUPS = [
  ...FLAVOUR_GROUPS,
  ...FRAGRANCE_GROUPS,
  ...INGREDIENT_GROUPS,
  ...COMMODITY_GROUPS,
];

export function byId<T extends { id: string }>(list: readonly T[]) {
  const map = new Map<string, T>();
  for (const item of list) map.set(item.id, item);
  return (id: string): T | undefined => map.get(id);
}

export const getCategory = byId(CATEGORIES);
export const getGroup = byId(ALL_GROUPS);
export const getApplication = byId(APPLICATIONS);
export const getForm = byId(FORMS);
export const getFeature = byId(FEATURES);
export const getAvailability = byId(AVAILABILITY);
export const getRegion = byId(UZ_REGIONS);
export const getBusinessType = byId(BUSINESS_TYPES);

export function tr(t: Trilingual | undefined, locale: Locale, fallback = '—'): string {
  if (!t) return fallback;
  return t[locale] || t.uz || t.ru || t.en || fallback;
}

export function sortTaxons<T extends Taxon>(list: T[]): T[] {
  return [...list].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}
