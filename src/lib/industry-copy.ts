/**
 * TARMOQ (INDUSTRY) MATNLARI
 * ----------------------------------------------------------------
 * Har bir qo'llash sohasi uchun alohida, real mazmunli matn:
 *   - intro      : tarmoqning o'ziga xos talablari
 *   - challenges : 3 ta asosiy muammo (va bizning yechimimiz)
 *   - dosage     : tipik doza va qo'shish bosqichi
 *   - forms      : qaysi shakllar mos keladi
 *   - picks      : tavsiya etiladigan guruhlar (katalog filtriga havola)
 *
 * Bu ma'lumot /industries/[slug] sahifalarini to'ldiradi — har biri
 * alohida indekslanadigan, "uzun dumli" qidiruv so'rovlari uchun mo'ljallangan.
 */

import type { Locale, Trilingual } from './taxonomy';

export interface IndustryCopy {
  intro: Trilingual;
  challenges: Trilingual[];
  dosage: Trilingual;
  forms: Trilingual;
  /** Katalogda tavsiya etiladigan guruh ID'lari */
  picks: string[];
  /** Tavsiya etiladigan xususiyatlar */
  features?: string[];
}

export const INDUSTRY_COPY: Record<string, IndustryCopy> = {
  bakery: {
    intro: {
      uz: 'Nonvoyxona mahsulotlari yuqori haroratga bardosh beradigan, pishirish jarayonida hidini yo‘qotmaydigan aromatizatorlarni talab qiladi. Vanil, sariyog‘, shokolad va mevali ta’mlar eng ko‘p ishlatiladigan pozitsiyalar.',
      ru: 'Хлебобулочные изделия требуют термостабильных ароматизаторов, которые не теряют аромат при выпечке. Ваниль, сливочное масло, шоколад и фруктовые вкусы — самые используемые позиции.',
      en: 'Bakery applications need heat-stable flavours that survive baking. Vanilla, butter, chocolate and fruit notes are the workhorses.',
    },
    challenges: [
      {
        uz: 'Yuqori harorat (180–220 °C) — ta’mning bug‘lanib ketishi',
        ru: 'Высокая температура (180–220 °C) — испарение аромата',
        en: 'High baking temperatures (180–220 °C) — aroma burn-off',
      },
      {
        uz: 'Xamirning turli pH va yog‘ miqdori — ta’mning o‘zgarishi',
        ru: 'Разный pH и жирность теста — изменение вкуса',
        en: 'Varying dough pH and fat content — flavour shift',
      },
      {
        uz: 'Partiyalararo barqarorlik — har kuni bir xil ta’m',
        ru: 'Стабильность от партии к партии — одинаковый вкус каждый день',
        en: 'Batch-to-batch consistency — the same taste every day',
      },
    ],
    dosage: {
      uz: 'Odatda 0,1–0,5 % (1–5 kg/tonna). Aromatizatorni xamirga yog‘ yoki shakar bilan aralashtirib, pishirishdan oldingi oxirgi bosqichda qo‘shish tavsiya etiladi.',
      ru: 'Обычно 0,1–0,5 % (1–5 кг/тонна). Рекомендуется вводить ароматизатор с жиром или сахаром на последней стадии замеса.',
      en: 'Typically 0.1–0.5 % (1–5 kg/tonne). Best added with fat or sugar at the final mixing stage.',
    },
    forms: {
      uz: 'Kukun va pasta shakllari issiqlikka chidamliligi yuqori; suyuq shakllar kremlar va to‘ldirmalar uchun qulay.',
      ru: 'Порошковые и пастообразные формы наиболее термостабильны; жидкие удобны для кремов и начинок.',
      en: 'Powder and paste forms are the most heat-stable; liquids suit creams and fillings.',
    },
    picks: ['bakery', 'chocolate', 'sweet', 'herb-spice', 'natural'],
    features: ['heat-stable', 'halal'],
  },

  confectionery: {
    intro: {
      uz: 'Konditer mahsulotlarida ta’m juda zich matritsada (shakar, shokolad, jelatin) ochiladi. Shuning uchun yuqori konsentratsiyali va aniq dozali aromatizatorlar talab qilinadi.',
      ru: 'В кондитерских изделиях вкус раскрывается в плотной матрице (сахар, шоколад, желатин), поэтому нужны высококонцентрированные ароматизаторы с точной дозировкой.',
      en: 'Confectionery releases flavour in a dense matrix (sugar, chocolate, gelatin), so high-strength flavours with precise dosing are essential.',
    },
    challenges: [
      {
        uz: 'Shakar va kislota muvozanati — ta’mning "yopilib" qolishi',
        ru: 'Баланс сахара и кислоты — «закрытие» вкуса',
        en: 'Sugar–acid balance — muted flavour perception',
      },
      {
        uz: 'Karamelizatsiya va Maillard reaksiyalari ta’mni o‘zgartiradi',
        ru: 'Карамелизация и реакция Майяра изменяют вкус',
        en: 'Caramelisation and Maillard reactions alter the profile',
      },
      {
        uz: 'Saqlash muddati davomida ta’mning so‘nishi',
        ru: 'Угасание вкуса в течение срока годности',
        en: 'Flavour fade across shelf life',
      },
    ],
    dosage: {
      uz: '0,05–0,3 %. Karamelda — yuqori chegarada, shokoladda — past chegarada. Yog‘ asosidagi mahsulotlarda suvda eriydigan shakllardan saqlaning.',
      ru: '0,05–0,3 %. В карамели — верхняя граница, в шоколаде — нижняя. В жировых системах избегайте водорастворимых форм.',
      en: '0.05–0.3 %. Use the upper range for hard candy, the lower for chocolate. Avoid water-soluble forms in fat-based systems.',
    },
    forms: {
      uz: 'Suyuq va kapsulalangan shakllar; kukun shakli pralin va quruq aralashmalar uchun.',
      ru: 'Жидкие и инкапсулированные формы; порошок — для пралине и сухих смесей.',
      en: 'Liquid and encapsulated forms; powders for pralines and dry mixes.',
    },
    picks: ['confectionery', 'chocolate', 'berry', 'citrus', 'sweet'],
    features: ['halal', 'heat-stable'],
  },

  dairy: {
    intro: {
      uz: 'Sut mahsulotlari — eng nozik sohalardan biri: ta’m yog‘ miqdori, fermentatsiya va pasteurizatsiyaga bog‘liq. Yogurt, qatiq, pishloq va sutli desertlar uchun maxsus seriyalar mavjud.',
      ru: 'Молочная продукция — одна из самых тонких областей: вкус зависит от жирности, ферментации и пастеризации. Есть специальные серии для йогуртов, творога, сыров и молочных десертов.',
      en: 'Dairy is a delicate category: flavour depends on fat level, fermentation and pasteurisation. Dedicated series exist for yoghurts, quark, cheese and dairy desserts.',
    },
    challenges: [
      {
        uz: 'Past yog‘li mahsulotlarda ta’mning "bo‘sh" chiqishi',
        ru: '«Пустой» вкус в обезжиренных продуктах',
        en: 'Thin, hollow taste in low-fat products',
      },
      {
        uz: 'Kislotali muhit (pH 4–4,6) — ta’m beqarorligi',
        ru: 'Кислая среда (pH 4–4,6) — нестабильность вкуса',
        en: 'Acidic matrix (pH 4–4.6) — flavour instability',
      },
      {
        uz: 'Mevali to‘ldirmalar bilan uyg‘unlik',
        ru: 'Совместимость с фруктовыми наполнителями',
        en: 'Compatibility with fruit preparations',
      },
    ],
    dosage: {
      uz: '0,05–0,2 %. Yogurtlarda — past chegarada (kislota ta’mni kuchaytiradi), desertlarda — yuqoriroq.',
      ru: '0,05–0,2 %. В йогуртах — нижняя граница (кислота усиливает вкус), в десертах — выше.',
      en: '0.05–0.2 %. Lower end for yoghurt (acidity amplifies flavour), higher for desserts.',
    },
    forms: {
      uz: 'Suyuq va emulsiya shakllari; kukun — quruq sut aralashmalari uchun.',
      ru: 'Жидкие и эмульсионные формы; порошок — для сухих молочных смесей.',
      en: 'Liquid and emulsion forms; powders for dry milk blends.',
    },
    picks: ['dairy', 'berry', 'citrus', 'tropical', 'sweet'],
    features: ['halal', 'alcohol-free'],
  },

  icecream: {
    intro: {
      uz: 'Muzqaymoqda ta’m −18 °C da seziladi, shuning uchun "sovuqda ochiladigan" kuchaytirilgan formulalar kerak. Muzlatish-tsikl barqarorligi hal qiluvchi omil.',
      ru: 'В мороженом вкус ощущается при −18 °C, поэтому нужны усиленные рецептуры, «раскрывающиеся на холоде». Критична стабильность к циклам заморозки.',
      en: 'Ice cream is tasted at −18 °C, so boosted formulations that "open up cold" are required. Freeze–thaw stability is critical.',
    },
    challenges: [
      {
        uz: 'Past haroratda ta’m sezgirligining pasayishi',
        ru: 'Снижение вкусовой чувствительности при низких температурах',
        en: 'Reduced flavour perception at freezing temperatures',
      },
      {
        uz: 'Muz kristallari bilan ta’m komponentlarining ajralishi',
        ru: 'Расслоение вкусовых компонентов кристаллами льда',
        en: 'Phase separation caused by ice crystals',
      },
      {
        uz: 'Havo (overrun) miqdorining ta’mga ta’siri',
        ru: 'Влияние степени взбитости (overrun) на вкус',
        en: 'Impact of overrun on perceived intensity',
      },
    ],
    dosage: {
      uz: '0,1–0,3 % — odatdagi muzqaymoq uchun; 0,3–0,5 % — premium va mevali sorbetlar uchun.',
      ru: '0,1–0,3 % для обычного мороженого; 0,3–0,5 % для премиум и фруктовых сорбетов.',
      en: '0.1–0.3 % for standard ice cream; 0.3–0.5 % for premium and fruit sorbets.',
    },
    forms: {
      uz: 'Suyuq va pasta shakllari; mevali preparatlar bilan birgalikda qo‘llash mumkin.',
      ru: 'Жидкие и пастообразные формы; совместимы с фруктовыми препаратами.',
      en: 'Liquid and paste forms; compatible with fruit preparations.',
    },
    picks: ['icecream', 'dairy', 'berry', 'tropical', 'chocolate'],
    features: ['halal', 'gmo-free'],
  },

  beverages: {
    intro: {
      uz: 'Ichimliklar — eng tez o‘sadigan segment: gazlangan ichimliklar, sharbatlar, energetiklar, sovutilgan choy va sutli ichimliklar. Suvda eruvchanlik va kislotali muhit barqarorligi muhim.',
      ru: 'Напитки — самый быстрорастущий сегмент: газированные, соки, энергетики, холодный чай и молочные напитки. Ключевое — растворимость в воде и стабильность в кислой среде.',
      en: 'Beverages are the fastest-growing segment: carbonated soft drinks, juices, energy drinks, iced tea and dairy beverages. Water solubility and acid stability are key.',
    },
    challenges: [
      {
        uz: 'Past pH (2,5–4) — ta’mning tez parchalanishi',
        ru: 'Низкий pH (2,5–4) — быстрое разрушение вкуса',
        en: 'Low pH (2.5–4) — rapid flavour degradation',
      },
      {
        uz: 'Yorug‘lik va harorat ta’sirida saqlash barqarorligi',
        ru: 'Стабильность при хранении на свету и в тепле',
        en: 'Shelf stability under light and heat',
      },
      {
        uz: 'CO₂ va shakar bilan muvozanat (masking)',
        ru: 'Баланс с CO₂ и сахаром (маскировка)',
        en: 'Balance with CO₂ and sweeteners (masking)',
      },
    ],
    dosage: {
      uz: '0,02–0,1 % — gazlangan ichimliklar; 0,05–0,2 % — sharbat va sutli ichimliklar.',
      ru: '0,02–0,1 % — газированные напитки; 0,05–0,2 % — соки и молочные напитки.',
      en: '0.02–0.1 % for carbonated drinks; 0.05–0.2 % for juices and dairy beverages.',
    },
    forms: {
      uz: 'Suvda eriydigan suyuq shakllar va emulsiyalar (bulanmaslik uchun); kukun — instant ichimliklar uchun.',
      ru: 'Водорастворимые жидкие формы и эмульсии (против «кольца»); порошок — для растворимых напитков.',
      en: 'Water-soluble liquids and emulsions (against ring formation); powders for instant drinks.',
    },
    picks: ['beverages', 'citrus', 'berry', 'tropical', 'mint-cool'],
    features: ['halal', 'alcohol-free', 'gmo-free'],
  },

  sauces: {
    intro: {
      uz: 'Sous va dressinglar — issiqlik, kislota va yog‘ bir vaqtda ta’sir qiladigan murakkab muhit. Pomidor, sarimsoq, dudlangan va achchiq profillar eng talabgir.',
      ru: 'Соусы и заправки — сложная среда: одновременно действуют температура, кислота и жир. Самые востребованные профили — томат, чеснок, копчение и острота.',
      en: 'Sauces and dressings are complex matrices where heat, acid and fat act together. Tomato, garlic, smoke and heat profiles are most in demand.',
    },
    challenges: [
      {
        uz: 'Issiqlik bilan ishlov berish (pasterizatsiya, sterilizatsiya)',
        ru: 'Термообработка (пастеризация, стерилизация)',
        en: 'Thermal processing (pasteurisation, sterilisation)',
      },
      {
        uz: 'Emulsiya barqarorligi — yog‘/suv ajralishi',
        ru: 'Стабильность эмульсии — расслоение масла и воды',
        en: 'Emulsion stability — oil/water separation',
      },
      {
        uz: 'Uzoq saqlash muddati davomida ta’m o‘zgarishi',
        ru: 'Изменение вкуса за длительный срок годности',
        en: 'Flavour drift over long shelf life',
      },
    ],
    dosage: {
      uz: '0,1–0,5 % — souslar; 0,05–0,2 % — dressinglar va mayonez.',
      ru: '0,1–0,5 % для соусов; 0,05–0,2 % для заправок и майонезов.',
      en: '0.1–0.5 % for sauces; 0.05–0.2 % for dressings and mayonnaise.',
    },
    forms: {
      uz: 'Suyuq va pasta shakllari; kukun — quruq sous aralashmalari uchun.',
      ru: 'Жидкие и пастообразные формы; порошок — для сухих смесей соусов.',
      en: 'Liquid and paste forms; powders for dry sauce mixes.',
    },
    picks: ['savoury', 'herb-spice', 'savoury-base', 'vegetable'],
    features: ['halal', 'heat-stable'],
  },

  snacks: {
    intro: {
      uz: 'Snaks va quruq nonushtalarda ta’m sirtga sepiladi (seasoning) yoki ekstruziya jarayonida qo‘shiladi. Yuqori harorat va namlikka chidamlilik hal qiluvchi.',
      ru: 'В снеках и сухих завтраках вкус наносится на поверхность (сезонинг) или вводится при экструзии. Решающее значение имеют термо- и влагостойкость.',
      en: 'Snacks and cereals are seasoned on the surface or flavoured during extrusion. Heat and moisture resistance are decisive.',
    },
    challenges: [
      {
        uz: 'Ekstruziya harorati (120–180 °C) va bosim',
        ru: 'Температура и давление экструзии (120–180 °C)',
        en: 'Extrusion temperature and pressure (120–180 °C)',
      },
      {
        uz: 'Mavsumiy sepilma (seasoning) yopishuvchanligi',
        ru: 'Адгезия сезонинга к поверхности',
        en: 'Seasoning adhesion to the product surface',
      },
      {
        uz: 'Namlik yutilishi — ta’mning o‘zgarishi',
        ru: 'Влагопоглощение — изменение вкуса',
        en: 'Moisture uptake — flavour change',
      },
    ],
    dosage: {
      uz: '1–3 % — seasoning aralashmasida (tashqi sepma); 0,2–0,5 % — ekstruziyada.',
      ru: '1–3 % в seasoning-смеси (наружное нанесение); 0,2–0,5 % при экструзии.',
      en: '1–3 % in the seasoning blend (topical); 0.2–0.5 % in extrusion.',
    },
    forms: {
      uz: 'Kukun shakllari — asosiy tanlov; kapsulalangan shakllar uzoq saqlash uchun.',
      ru: 'Порошковые формы — основной выбор; инкапсулированные — для долгого хранения.',
      en: 'Powders are the primary choice; encapsulated forms for long shelf life.',
    },
    picks: ['snacks', 'savoury', 'herb-spice', 'savoury-base'],
    features: ['halal', 'heat-stable'],
  },

  meat: {
    intro: {
      uz: 'Go‘sht va kolbasa mahsulotlarida ta’m nitrit tuzi, dudlash va issiqlik bilan ishlov berish bilan uyg‘un bo‘lishi kerak. Halol talablar alohida e’tibor talab qiladi.',
      ru: 'В мясных и колбасных изделиях вкус должен сочетаться с нитритной солью, копчением и термообработкой. Отдельное внимание — требованиям халяль.',
      en: 'Meat and sausage flavours must harmonise with curing salts, smoke and thermal processing. Halal requirements need particular attention.',
    },
    challenges: [
      {
        uz: 'Halol talablari — spirt va hayvon kelib chiqishi komponentlar yo‘q',
        ru: 'Требования халяль — без спирта и компонентов животного происхождения',
        en: 'Halal compliance — no alcohol or animal-derived components',
      },
      {
        uz: 'Issiqlik bilan ishlov berishda ta’mning yo‘qolishi',
        ru: 'Потеря вкуса при термообработке',
        en: 'Flavour loss during thermal processing',
      },
      {
        uz: 'Yog‘ oksidlanishi — "eskirgan" ta’m paydo bo‘lishi',
        ru: 'Окисление жира — появление «прогорклого» вкуса',
        en: 'Fat oxidation — development of rancid off-notes',
      },
    ],
    dosage: {
      uz: '0,1–0,5 % — kolbasa va delikateslar; 0,3–1 % — marinadlar va injeksion eritmalarda.',
      ru: '0,1–0,5 % для колбас и деликатесов; 0,3–1 % в маринадах и инъекционных растворах.',
      en: '0.1–0.5 % for sausages and deli meats; 0.3–1 % in marinades and injection brines.',
    },
    forms: {
      uz: 'Suyuq va kukun shakllar; spirt tarkibsiz variantlar halol ishlab chiqarish uchun.',
      ru: 'Жидкие и порошковые формы; безспиртовые варианты для халяльного производства.',
      en: 'Liquid and powder forms; alcohol-free options for halal production.',
    },
    picks: ['meat', 'savoury', 'herb-spice', 'savoury-base'],
    features: ['halal', 'alcohol-free', 'heat-stable'],
  },

  canned: {
    intro: {
      uz: 'Konserva va marinadlar sterilizatsiya (115–125 °C) sharoitida ishlaydi. Faqat eng barqaror formulalar bunday rejimga bardosh beradi.',
      ru: 'Консервы и маринады работают в режиме стерилизации (115–125 °C). Выдерживают его только самые стабильные рецептуры.',
      en: 'Canning and preserves are processed under sterilisation (115–125 °C). Only the most stable formulations survive it.',
    },
    challenges: [
      {
        uz: 'Avtoklav sterilizatsiyasi — ta’mning kuchli parchalanishi',
        ru: 'Автоклавная стерилизация — сильное разрушение вкуса',
        en: 'Retort sterilisation — severe flavour degradation',
      },
      {
        uz: 'Metall/quti bilan o‘zaro ta’sir',
        ru: 'Взаимодействие с металлической тарой',
        en: 'Interaction with metal packaging',
      },
      {
        uz: 'Uzoq saqlash (12–24 oy) barqarorligi',
        ru: 'Стабильность при долгом хранении (12–24 месяца)',
        en: 'Stability over long shelf life (12–24 months)',
      },
    ],
    dosage: {
      uz: '0,2–0,6 % — sterilizatsiyadan keyingi yo‘qotishni hisobga olgan holda.',
      ru: '0,2–0,6 % с учётом потерь после стерилизации.',
      en: '0.2–0.6 %, accounting for post-sterilisation losses.',
    },
    forms: {
      uz: 'Issiqlikka chidamli suyuq va pasta shakllar; kapsulalangan variantlar afzal.',
      ru: 'Термостойкие жидкие и пастообразные формы; предпочтительны инкапсулированные.',
      en: 'Heat-resistant liquid and paste forms; encapsulated versions preferred.',
    },
    picks: ['canned', 'vegetable', 'savoury', 'herb-spice'],
    features: ['heat-stable', 'halal'],
  },

  horeca: {
    intro: {
      uz: 'HoReCa — kichik hajm, katta xilma-xillik va tez yetkazib berish. Restoran, kafe va qandolatxonalar uchun 1 kg li qadoq eng qulay.',
      ru: 'HoReCa — малые объёмы, большое разнообразие и быстрая доставка. Для ресторанов, кафе и кондитерских удобнее всего фасовка 1 кг.',
      en: 'HoReCa means small volumes, wide variety and fast delivery. 1 kg packs suit restaurants, cafés and patisseries best.',
    },
    challenges: [
      {
        uz: 'Kichik hajmda aniq dozalash (grammlarda)',
        ru: 'Точное дозирование в малых объёмах (граммы)',
        en: 'Accurate dosing at small scale (grammes)',
      },
      {
        uz: 'Tez-tez o‘zgaradigan menü — ko‘p pozitsiya kerak',
        ru: 'Часто меняющееся меню — нужно много позиций',
        en: 'Frequently changing menus — many SKUs required',
      },
      {
        uz: 'Yetkazib berish tezligi va kichik qadoq',
        ru: 'Скорость доставки и мелкая фасовка',
        en: 'Delivery speed and small pack sizes',
      },
    ],
    dosage: {
      uz: '0,1–0,5 %, lekin amalda 1–5 g/kg. Kichik hajmlar uchun 1 kg va 5 kg qadoqlar mavjud.',
      ru: '0,1–0,5 %, на практике 1–5 г/кг. Для малых объёмов доступны фасовки 1 и 5 кг.',
      en: '0.1–0.5 %, in practice 1–5 g/kg. 1 kg and 5 kg packs are available for small volumes.',
    },
    forms: {
      uz: 'Suyuq shakllar (pipetka bilan dozalash qulay) va pastalar.',
      ru: 'Жидкие формы (удобно дозировать пипеткой) и пасты.',
      en: 'Liquid forms (easy to dose with a pipette) and pastes.',
    },
    picks: ['horeca', 'confectionery', 'bakery', 'sweet', 'tea-coffee'],
    features: ['halal'],
  },

  supplements: {
    intro: {
      uz: 'BAA va sport ovqatlanishida ta’m — mahsulotning muvaffaqiyat omili: aktiv moddalar (vitamin, aminokislota, o‘simlik ekstrakti) yoqimsiz ta’m beradi.',
      ru: 'В БАДах и спортивном питании вкус — фактор успеха: активные вещества (витамины, аминокислоты, экстракты) дают неприятный привкус.',
      en: 'In supplements and sports nutrition, flavour drives success: actives (vitamins, amino acids, botanicals) carry unpleasant off-notes.',
    },
    challenges: [
      {
        uz: 'Achchiq/ metall ta’mni yashirish (masking)',
        ru: 'Маскировка горечи и металлического привкуса',
        en: 'Masking bitterness and metallic off-notes',
      },
      {
        uz: 'Tabletka/kapsula qobig‘i bilan moslik',
        ru: 'Совместимость с оболочкой таблетки/капсулы',
        en: 'Compatibility with tablet and capsule coatings',
      },
      {
        uz: 'Quruq aralashmalarda gigroskopiklik',
        ru: 'Гигроскопичность в сухих смесях',
        en: 'Hygroscopicity in dry blends',
      },
    ],
    dosage: {
      uz: '0,3–2 % — kukun aralashmalarda; 0,1–0,5 % — tabletkalarda. Maxsus masking seriyalari mavjud.',
      ru: '0,3–2 % в порошковых смесях; 0,1–0,5 % в таблетках. Доступны специальные masking-серии.',
      en: '0.3–2 % in powder blends; 0.1–0.5 % in tablets. Dedicated masking series are available.',
    },
    forms: {
      uz: 'Kukun va kapsulalangan shakllar — asosiy tanlov; aglomirlangan variantlar changlashni kamaytiradi.',
      ru: 'Порошковые и инкапсулированные формы — основной выбор; агломерированные снижают пыление.',
      en: 'Powder and encapsulated forms are primary; agglomerated versions reduce dusting.',
    },
    picks: ['supplements', 'citrus', 'berry', 'mint-cool', 'tropical'],
    features: ['gmo-free', 'vegan', 'halal'],
  },

  tobacco: {
    intro: {
      uz: 'Chekuv va qizdiriladigan mahsulotlar (HTP) uchun yuqori konsentratsiyali, issiqlikka chidamli kompozitsiyalar. Mentol, meva va shirin profillar asosiy.',
      ru: 'Для табачных и нагреваемых изделий (HTP) — высококонцентрированные термостабильные композиции. Основные профили: ментол, фрукты и сладкие ноты.',
      en: 'Tobacco and heated-tobacco products need high-strength, heat-stable compositions. Menthol, fruit and sweet profiles dominate.',
    },
    challenges: [
      {
        uz: 'Yuqori haroratda (300+ °C) ta’mning saqlanishi',
        ru: 'Сохранение вкуса при очень высоких температурах (300+ °C)',
        en: 'Flavour retention at very high temperatures (300+ °C)',
      },
      {
        uz: 'Propilen glikol/gliserin asosida eruvchanlik',
        ru: 'Растворимость в пропиленгликоле/глицерине',
        en: 'Solubility in propylene glycol / glycerol',
      },
      {
        uz: 'Saqlashda rang va ta’m o‘zgarishi',
        ru: 'Изменение цвета и вкуса при хранении',
        en: 'Colour and flavour shift during storage',
      },
    ],
    dosage: {
      uz: '0,5–5 % — mahsulot turiga qarab. Yuqori konsentratsiyali formulalar tavsiya etiladi.',
      ru: '0,5–5 % в зависимости от типа продукта. Рекомендуются высококонцентрированные рецептуры.',
      en: '0.5–5 % depending on product type. High-concentration formulations recommended.',
    },
    forms: {
      uz: 'PG/VG asosidagi suyuq shakllar; kukun — filter va quruq aralashmalar uchun.',
      ru: 'Жидкие формы на основе PG/VG; порошок — для фильтров и сухих смесей.',
      en: 'PG/VG-based liquids; powders for filters and dry blends.',
    },
    picks: ['tobacco', 'mint-cool', 'berry', 'sweet', 'tropical'],
    features: ['heat-stable'],
  },

  'personal-care': {
    intro: {
      uz: 'Kosmetika va shaxsiy parvarish — nozik atir kompozitsiyalari, shampon, krem, sovun va losyonlar uchun. IFRA standartlariga muvofiqlik majburiy.',
      ru: 'Косметика и средства личной гигиены — тонкие парфюмерные композиции для шампуней, кремов, мыла и лосьонов. Обязательна соответствие IFRA.',
      en: 'Personal care covers fine fragrance compositions for shampoos, creams, soaps and lotions. IFRA compliance is mandatory.',
    },
    challenges: [
      {
        uz: 'IFRA/ALLERGEN talablariga muvofiqlik',
        ru: 'Соответствие требованиям IFRA и ограничениям по аллергенам',
        en: 'IFRA compliance and allergen restrictions',
      },
      {
        uz: 'Surfaktantli tizimlarda (shampon) barqarorlik',
        ru: 'Стабильность в поверхностно-активных системах (шампуни)',
        en: 'Stability in surfactant systems (shampoos)',
      },
      {
        uz: 'Rang va shaffoflik o‘zgarishi',
        ru: 'Изменение цвета и прозрачности',
        en: 'Colour shift and clarity loss',
      },
    ],
    dosage: {
      uz: '0,1–2 % — krem va losyonlar; 0,5–3 % — shampon va gel; 1–5 % — sovun.',
      ru: '0,1–2 % кремы и лосьоны; 0,5–3 % шампуни и гели; 1–5 % мыло.',
      en: '0.1–2 % creams and lotions; 0.5–3 % shampoos and gels; 1–5 % soaps.',
    },
    forms: {
      uz: 'Suyuq atir kompozitsiyalari; kukun — quruq mahsulotlar va sovun uchun.',
      ru: 'Жидкие парфюмерные композиции; порошок — для сухих продуктов и мыла.',
      en: 'Liquid fragrance compositions; powders for dry products and soap.',
    },
    picks: ['personal-care', 'fine-fragrance', 'floral', 'citrus', 'woody'],
    features: ['vegan', 'natural'],
  },

  'home-care': {
    intro: {
      uz: 'Maishiy kimyo — tozalash vositalari, havo freshenerlari, idish yuvish vositalari. Kuchli, uzoq saqlanadigan va kimyoviy asos bilan mos hidlar.',
      ru: 'Бытовая химия — моющие средства, освежители воздуха, средства для посуды. Нужны сильные, стойкие ароматы, совместимые с химической базой.',
      en: 'Home care covers cleaners, air fresheners and dishwash products. Strong, substantive fragrances compatible with aggressive bases are needed.',
    },
    challenges: [
      {
        uz: 'Ishqorli/kislotali asosda barqarorlik (pH 2–13)',
        ru: 'Стабильность в щелочной/кислой основе (pH 2–13)',
        en: 'Stability in alkaline/acidic bases (pH 2–13)',
      },
      {
        uz: 'Surfaktant va oksidlovchilar bilan moslik',
        ru: 'Совместимость с ПАВ и окислителями',
        en: 'Compatibility with surfactants and oxidisers',
      },
      {
        uz: 'Arzon tannarx — katta hajmli mahsulot',
        ru: 'Низкая себестоимость — продукт массового сегмента',
        en: 'Low cost-in-use — a mass-market product',
      },
    ],
    dosage: {
      uz: '0,2–2 % — suyuq vositalar; 0,5–3 % — kukun va gel; 5–15 % — konsentratlar.',
      ru: '0,2–2 % жидкие средства; 0,5–3 % порошки и гели; 5–15 % концентраты.',
      en: '0.2–2 % liquids; 0.5–3 % powders and gels; 5–15 % concentrates.',
    },
    forms: {
      uz: 'Suyuq kompozitsiyalar; kapsulalangan shakllar — uzoq muddatli hid uchun.',
      ru: 'Жидкие композиции; инкапсулированные формы — для пролонгированного аромата.',
      en: 'Liquid compositions; encapsulated forms for long-lasting scent.',
    },
    picks: ['home-care', 'citrus', 'floral', 'solvent'],
    features: ['vegan'],
  },

  'fabric-care': {
    intro: {
      uz: 'Kir yuvish vositalari va yumshatgichlar — "substantiv" (mato ga yopishadigan) hidlar talab qilinadi. Mikro kapsulalar uzoq muddatli hid beradi.',
      ru: 'Средства для стирки и кондиционеры — требуются «субстантивные» ароматы, закрепляющиеся на ткани. Микрокапсулы дают пролонгированный эффект.',
      en: 'Laundry detergents and softeners require substantive fragrances that bind to fabric. Micro-encapsulation delivers long-lasting scent.',
    },
    challenges: [
      {
        uz: 'Yuvish siklidan keyin hidning saqlanishi',
        ru: 'Сохранение аромата после цикла стирки',
        en: 'Scent retention after the wash cycle',
      },
      {
        uz: 'Yuqori pH va fermentlar bilan moslik',
        ru: 'Совместимость с высоким pH и энзимами',
        en: 'Compatibility with high pH and enzymes',
      },
      {
        uz: 'Quruq kukunlarda changlash va oksidlanish',
        ru: 'Пыление и окисление в сухих порошках',
        en: 'Dusting and oxidation in dry powders',
      },
    ],
    dosage: {
      uz: '0,3–1,5 % — kukun; 0,5–2 % — suyuq va yumshatgichlar; 2–5 % — kapsulalar.',
      ru: '0,3–1,5 % порошок; 0,5–2 % жидкости и кондиционеры; 2–5 % капсулы.',
      en: '0.3–1.5 % powders; 0.5–2 % liquids and softeners; 2–5 % capsules.',
    },
    forms: {
      uz: 'Kapsulalangan va suyuq shakllar; aglomirlangan kukun — chang kamayadi.',
      ru: 'Инкапсулированные и жидкие формы; агломерированный порошок снижает пыление.',
      en: 'Encapsulated and liquid forms; agglomerated powders reduce dusting.',
    },
    picks: ['fabric-care', 'home-care', 'floral', 'citrus'],
    features: ['vegan'],
  },

  pharma: {
    intro: {
      uz: 'Farmatsevtika — sirop, chaynash tabletkalari, vitamin va o‘simlik preparatlarida yoqimsiz ta’mni yashirish. GMP hujjatlari va izchillik talab qilinadi.',
      ru: 'Фармацевтика — сиропы, жевательные таблетки, витамины и растительные препараты: маскировка неприятного вкуса. Требуются документы GMP и прослеживаемость.',
      en: 'Pharma covers syrups, chewables, vitamins and botanicals where bitter actives must be masked. GMP documentation and traceability are required.',
    },
    challenges: [
      {
        uz: 'Achchiq API (aktiv modda) ta’mini yashirish',
        ru: 'Маскировка горечи активного вещества (API)',
        en: 'Masking bitter active pharmaceutical ingredients',
      },
      {
        uz: 'Spirt va shakar tarkibini cheklash',
        ru: 'Ограничение содержания спирта и сахара',
        en: 'Restrictions on alcohol and sugar content',
      },
      {
        uz: 'Hujjatlar va partiyalar izchilligi (traceability)',
        ru: 'Документация и прослеживаемость партий',
        en: 'Documentation and batch traceability',
      },
    ],
    dosage: {
      uz: '0,1–1 % — sirop va suyuqliklar; 0,5–3 % — chaynash tabletkalari.',
      ru: '0,1–1 % сиропы и жидкости; 0,5–3 % жевательные таблетки.',
      en: '0.1–1 % syrups and liquids; 0.5–3 % chewable tablets.',
    },
    forms: {
      uz: 'Spirtsiz suyuq va kukun shakllar; kapsulalangan — tabletkalar uchun.',
      ru: 'Безспиртовые жидкие и порошковые формы; инкапсулированные — для таблеток.',
      en: 'Alcohol-free liquids and powders; encapsulated forms for tablets.',
    },
    picks: ['pharma', 'mint-cool', 'citrus', 'berry', 'sweet'],
    features: ['alcohol-free', 'gmo-free', 'halal'],
  },

  'pet-food': {
    intro: {
      uz: 'Hayvonlar ozuqasi — palatability (yeyishga jalb qiluvchi) moddalar. Mushuk va it uchun ta’mlar farq qiladi; ekstruziya va sterilizatsiyaga chidamlilik muhim.',
      ru: 'Корма для животных — палатабилити-компоненты (привлекательность вкуса). Вкусы для кошек и собак различаются; важна стойкость к экструзии и стерилизации.',
      en: 'Pet food relies on palatability enhancers. Cat and dog profiles differ, and resistance to extrusion and retorting is critical.',
    },
    challenges: [
      {
        uz: 'Ekstruziya va quritish jarayonida ta’mning saqlanishi',
        ru: 'Сохранение вкуса при экструзии и сушке',
        en: 'Flavour retention through extrusion and drying',
      },
      {
        uz: 'Yog‘ sepilmasi (topical coating) bilan moslik',
        ru: 'Совместимость с жировым напылением',
        en: 'Compatibility with fat coating',
      },
      {
        uz: 'Uzoq saqlashda oksidlanish (rancidity)',
        ru: 'Окисление при длительном хранении',
        en: 'Oxidation over long storage',
      },
    ],
    dosage: {
      uz: '1–4 % — topical qoplamada; 0,2–1 % — ekstruziya aralashmasida.',
      ru: '1–4 % в наружном покрытии; 0,2–1 % в экструзионной массе.',
      en: '1–4 % in topical coating; 0.2–1 % in the extrusion mix.',
    },
    forms: {
      uz: 'Kukun va pasta shakllar; kukun shakl sepma uchun afzal.',
      ru: 'Порошковые и пастообразные формы; порошок предпочтителен для напыления.',
      en: 'Powder and paste forms; powders are preferred for topical application.',
    },
    picks: ['pet-food', 'meat', 'savoury', 'savoury-base'],
    features: ['heat-stable'],
  },

  'flavour-base': {
    intro: {
      uz: 'Aromatizator ishlab chiqaruvchilar uchun xom-ashyo: aroma-kimyoviy moddalar, efir moylari, erituvchilar va tashuvchilar. Katta hajm va barqaror yetkazib berish muhim.',
      ru: 'Сырьё для производителей ароматизаторов: ароматические химические вещества, эфирные масла, растворители и носители. Важны большие объёмы и стабильные поставки.',
      en: 'Raw materials for flavour houses: aroma chemicals, essential oils, solvents and carriers. Large volumes and reliable supply matter most.',
    },
    challenges: [
      {
        uz: 'Partiyalararo izchillik va CoA/MSDS hujjatlari',
        ru: 'Постоянство партий и документы CoA/MSDS',
        en: 'Batch consistency and CoA/MSDS documentation',
      },
      {
        uz: 'Katta hajm (200 kg bak, IBC) va logistika',
        ru: 'Большие объёмы (бочки 200 кг, IBC) и логистика',
        en: 'Bulk packaging (200 kg drums, IBC) and logistics',
      },
      {
        uz: 'Xom-ashyoning barqaror narxi',
        ru: 'Стабильная цена на сырьё',
        en: 'Stable raw-material pricing',
      },
    ],
    dosage: {
      uz: 'Retsepturaga qarab; odatda 0,1–30 % kompozitsiya tarkibida. Texnik hujjatlar har bir pozitsiya uchun beriladi.',
      ru: 'Зависит от рецептуры; обычно 0,1–30 % в композиции. Техническая документация предоставляется на каждую позицию.',
      en: 'Formulation-dependent, typically 0.1–30 % of a composition. Technical documents are supplied per item.',
    },
    forms: {
      uz: 'Suyuq, kukun va granula shakllar; 1–1000 kg qadoq.',
      ru: 'Жидкие, порошковые и гранулированные формы; фасовка 1–1000 кг.',
      en: 'Liquid, powder and granular forms; packs from 1 to 1000 kg.',
    },
    picks: ['aroma-chemicals', 'essential-oils', 'solvent', 'natural'],
    features: ['natural'],
  },

  'fragrance-base': {
    intro: {
      uz: 'Parfumeriya ishlab chiqaruvchilari uchun baza: atir kompozitsiyalari, aroma-kimyoviy moddalar (Ambroxan, Citral va h.k.) va efir moylari.',
      ru: 'База для производителей парфюмерии: парфюмерные композиции, аромахимия (Ambroxan, Citral и др.) и эфирные масла.',
      en: 'The base for fragrance manufacturers: perfume compositions, aroma chemicals (Ambroxan, Citral, etc.) and essential oils.',
    },
    challenges: [
      {
        uz: 'IFRA talablari va allergen cheklovlari',
        ru: 'Требования IFRA и ограничения по аллергенам',
        en: 'IFRA requirements and allergen restrictions',
      },
      {
        uz: 'Nozik miqdorlarda izchillik (0,01 % komponentlar)',
        ru: 'Постоянство в микроколичествах (компоненты 0,01 %)',
        en: 'Consistency at trace levels (0.01 % components)',
      },
      {
        uz: 'Uzoq muddatli barqarorlik (36+ oy)',
        ru: 'Долгосрочная стабильность (36+ месяцев)',
        en: 'Long-term stability (36+ months)',
      },
    ],
    dosage: {
      uz: 'Kompozitsiyada 0,01–20 %; tayyor mahsulotda 1–25 %. Har bir komponent uchun texnik pasport.',
      ru: '0,01–20 % в композиции; 1–25 % в готовом продукте. Технический паспорт на каждый компонент.',
      en: '0.01–20 % in the composition; 1–25 % in the finished product. Technical data sheet per component.',
    },
    forms: {
      uz: 'Suyuq kompozitsiyalar va kristall/kukun shakldagi aroma-kimyo.',
      ru: 'Жидкие композиции и кристаллическая/порошковая аромахимия.',
      en: 'Liquid compositions and crystalline/powder aroma chemicals.',
    },
    picks: ['fine-fragrance', 'aroma-chemicals', 'essential-oils', 'woody', 'floral'],
    features: ['vegan', 'natural'],
  },
};

/** Tarmoq matnini olish (topilmasa — standart shablon) */
export function industryCopy(id: string): IndustryCopy | null {
  return INDUSTRY_COPY[id] ?? null;
}

export function industryIds(): string[] {
  return Object.keys(INDUSTRY_COPY);
}

/** Standart matn — ma'lumot topilmasa ishlatiladi */
export function fallbackIndustryCopy(name: Trilingual): IndustryCopy {
  return {
    intro: {
      uz: `${name.uz} uchun aromatizatorlar, atir kompozitsiyalari va ingredientlar — Toshkentdagi ombordan. Texnologimiz doza va shaklni jarayoningizga moslab beradi.`,
      ru: `Ароматизаторы, парфюмерные композиции и ингредиенты для «${name.ru}» — со склада в Ташкенте. Наш технолог подберёт дозировку и форму под ваш процесс.`,
      en: `Flavours, fragrance compositions and ingredients for ${name.en} — from our Tashkent warehouse. Our technologist will match dosage and form to your process.`,
    },
    challenges: [
      {
        uz: 'Barqaror yetkazib berish va ombor zaxirasi',
        ru: 'Стабильные поставки и складской запас',
        en: 'Reliable supply and local stock',
      },
      {
        uz: 'To‘g‘ri doza va shaklni tanlash',
        ru: 'Подбор правильной дозировки и формы',
        en: 'Selecting the right dosage and form',
      },
      {
        uz: 'Hujjatlar va sertifikatlar to‘plami',
        ru: 'Полный пакет документов и сертификатов',
        en: 'Complete documentation and certificates',
      },
    ],
    dosage: {
      uz: 'Doza mahsulot turiga qarab 0,05–2 % oralig‘ida. Bepul namunada aniq dozani texnologimiz bilan birga belgilaysiz.',
      ru: 'Дозировка 0,05–2 % в зависимости от продукта. Точную дозу определите вместе с нашим технологом на бесплатных образцах.',
      en: 'Typical dosage ranges from 0.05 % to 2 %. Confirm the exact level with our technologist using free samples.',
    },
    forms: {
      uz: 'Suyuq, kukun, pasta va emulsiya shakllari mavjud.',
      ru: 'Доступны жидкие, порошковые, пастообразные и эмульсионные формы.',
      en: 'Liquid, powder, paste and emulsion forms are available.',
    },
    picks: [],
  };
}

export function industryText(copy: IndustryCopy, key: 'intro' | 'dosage' | 'forms', locale: Locale): string {
  return copy[key][locale] || copy[key].en;
}
