/**
 * Ma'lum xomashyolar uchun TEXNIK TAVSIF (CAS raqami, tabiati, odatiy qo'llanilishi).
 *
 * Nega: mahsulot sahifalarining tavsifi kategoriya shablonidan quriladi, shu sababli
 * minglab sahifa bir-biriga o'xshaydi. Bu yerda faqat kimyoviy jihatdan aniq,
 * umumiy ma'lum faktlar (CAS, E-raqam, vazifasi) — sertifikat, tozalik foizi,
 * MOQ yoki boshqa tijoriy da'volar YO'Q (CLAUDE.md §4.15: to'qilgan da'vo taqiqlangan).
 *
 * Admin'dagi qo'lda yozilgan tavsif (`product.description`) har doim ustun turadi.
 * Kalit — mahsulot slug'i. O‘zbek apostroflari: o‘/g‘ = U+2018, tutuq ’ = U+2019.
 */

import type { Locale } from '@/lib/taxonomy';

type Facts = Record<Locale, string>;

export const PRODUCT_FACTS: Record<string, Facts> = {
  ambroxan: {
    uz: 'Ambroxan (CAS 6790-58-5) — ambra hidini beruvchi sintetik aroma kimyoviy modda: quruq, yog‘ochsimon-ambrali nota va uzoq saqlanuvchi hid. Atir kompozitsiyalarida baza notasi va mustahkamlovchi sifatida ishlatiladi. Oq kristall shaklda, spirt yoki dipropilenglikolda eritib qo‘llanadi.',
    ru: 'Амброксан (CAS 6790-58-5) — синтетическое ароматическое вещество с амбровым запахом: сухая древесно-амбровая нота и стойкий шлейф. В парфюмерных композициях используется как базовая нота и фиксатор. Белое кристаллическое вещество, применяется в растворе в спирте или дипропиленгликоле.',
    en: 'Ambroxan (CAS 6790-58-5) is a synthetic aroma chemical with an ambergris-type odour: a dry, woody-amber note with long-lasting dry-down. It is used in fragrance compositions as a base note and fixative. Supplied as white crystals and normally dissolved in ethanol or dipropylene glycol before use.',
  },
  'iso-e-super': {
    uz: 'Iso E Super (CAS 54464-57-2) — yumshoq, baxmalsimon sidr-yog‘och notasiga ega aroma kimyoviy modda. Atir kompozitsiyalarida aralashtiruvchi va hidni yumshatuvchi sifatida, shuningdek kir yuvish va uy kimyosi otdushkalarida qo‘llanadi.',
    ru: 'Iso E Super (CAS 54464-57-2) — ароматическое вещество с мягкой бархатистой кедрово-древесной нотой. В парфюмерных композициях выступает как смягчающий и объединяющий компонент, а также применяется в отдушках для стирки и бытовой химии.',
    en: 'Iso E Super (CAS 54464-57-2) is an aroma chemical with a soft, velvety cedar-woody note. In fragrance compositions it acts as a blending and softening component, and it is also used in fabric-care and household-product fragrances.',
  },
  'ethyl-maltol': {
    uz: 'Etilmaltol (CAS 4940-11-8) — shirin karamel va paxta-qand hidiga ega oq kristall modda; ta’m kuchaytiruvchi sifatida qandolat, pishiriq va ichimliklarda, ayniqsa vanil va meva aromatizatorlari bilan birga ishlatiladi. Maltolga qaraganda sezilarli kuchliroq ta’sir qiladi.',
    ru: 'Этилмальтол (CAS 4940-11-8) — белое кристаллическое вещество со сладким карамельным запахом и нотой сахарной ваты; усилитель вкуса и аромата в кондитерских изделиях, выпечке и напитках, особенно в сочетании с ванильными и фруктовыми ароматизаторами. Значительно сильнее мальтола.',
    en: 'Ethyl maltol (CAS 4940-11-8) is a white crystalline substance with a sweet caramel, cotton-candy character. It is used as a flavour enhancer in confectionery, bakery and beverages, particularly with vanilla and fruit flavours. It is considerably stronger than maltol.',
  },
  maltol: {
    uz: 'Maltol (CAS 118-71-8, E636) — qovurilgan non va karamel hidiga ega ta’m kuchaytiruvchi. Pishiriq, qandolat va ichimliklarda shirinlik tuyg‘usini oshirish va ta’mni yumshatish uchun ishlatiladi.',
    ru: 'Мальтол (CAS 118-71-8, E636) — усилитель вкуса с запахом карамели и поджаренного хлеба. Применяется в выпечке, кондитерских изделиях и напитках для усиления ощущения сладости и смягчения вкуса.',
    en: 'Maltol (CAS 118-71-8, E636) is a flavour enhancer with a caramel and toasted-bread character. It is used in bakery, confectionery and beverages to boost perceived sweetness and round off flavour.',
  },
  'ethyl-vanillin': {
    uz: 'Etilvanilin (CAS 121-32-4) — vanilinga o‘xshash, lekin kuchliroq vanil hidiga ega sintetik ta’m beruvchi. Qandolat, pishiriq, sut mahsulotlari va muzqaymoqda vanil ta’mini kuchaytirish uchun qo‘llanadi.',
    ru: 'Этилванилин (CAS 121-32-4) — синтетический вкусоароматический компонент с ванильным запахом, более интенсивным, чем у ванилина. Используется в кондитерских изделиях, выпечке, молочной продукции и мороженом для усиления ванильного вкуса.',
    en: 'Ethyl vanillin (CAS 121-32-4) is a synthetic flavouring with a vanilla character stronger than vanillin. It is used in confectionery, bakery, dairy and ice cream to build a more intense vanilla profile.',
  },
  'mono-propylene-glycol-mpg': {
    uz: 'Monopropilenglikol (MPG, CAS 57-55-6, E1520) — aromatizatorlar uchun keng tarqalgan erituvchi va tashuvchi, shuningdek namlik saqlovchi. Suyuq ta’m beruvchilarni tayyorlashda, oziq-ovqat va texnik yo‘nalishlarda ishlatiladi.',
    ru: 'Монопропиленгликоль (MPG, CAS 57-55-6, E1520) — распространённый растворитель и носитель для ароматизаторов, а также влагоудерживающий агент. Применяется при производстве жидких ароматизаторов в пищевых и технических направлениях.',
    en: 'Mono propylene glycol (MPG, CAS 57-55-6, E1520) is a widely used solvent and carrier for flavours and a humectant. It is used in the production of liquid flavours across food and technical applications.',
  },
  'di-propylene-glycol-dpg': {
    uz: 'Dipropilenglikol (DPG, CAS 25265-71-8) — hidsiz erituvchi; atir kompozitsiyalarida, otdushkalarda va uy kimyosida aromat moylarni eritish va suyultirish uchun qo‘llanadi.',
    ru: 'Дипропиленгликоль (DPG, CAS 25265-71-8) — растворитель без запаха; используется в парфюмерных композициях, отдушках и бытовой химии для растворения и разбавления ароматических масел.',
    en: 'Di propylene glycol (DPG, CAS 25265-71-8) is an odourless solvent used in fragrance compositions, perfume oils and household products to dissolve and dilute aroma materials.',
  },
  'vegetable-glycerine-usp': {
    uz: 'O‘simlik glitserini (CAS 56-81-5, E422) — namlik saqlovchi, erituvchi va yumshoq shirin ta’mli komponent. Oziq-ovqat, kosmetika va aromatizator tayyorlashda ishlatiladi.',
    ru: 'Растительный глицерин (CAS 56-81-5, E422) — влагоудерживающий агент, растворитель и компонент с мягким сладковатым вкусом. Применяется в пищевой промышленности, косметике и при производстве ароматизаторов.',
    en: 'Vegetable glycerine (CAS 56-81-5, E422) is a humectant, solvent and mildly sweet component. It is used in food, cosmetics and flavour manufacturing.',
  },
  'citric-acid-monohydrate': {
    uz: 'Limon kislotasi monogidrati (CAS 5949-29-1, E330) — kislotalilikni rostlovchi va ta’m beruvchi. Ichimliklar, qandolat, jelelar va konservalarda, shuningdek konservant sifatida ishlatiladi.',
    ru: 'Лимонная кислота моногидрат (CAS 5949-29-1, E330) — регулятор кислотности и вкусовой компонент. Используется в напитках, кондитерских изделиях, желе и консервах, а также как вспомогательный консервирующий агент.',
    en: 'Citric acid monohydrate (CAS 5949-29-1, E330) is an acidity regulator and flavour component used in beverages, confectionery, jellies and preserves.',
  },
  'sorbitol-powder': {
    uz: 'Sorbitol (CAS 50-70-4, E420) — shakar o‘rnini bosuvchi va namlik saqlovchi. Qandolat, saqich, pishiriq va kosmetikada shirinlik berish hamda mahsulotning qurib qolishini oldini olish uchun qo‘llanadi.',
    ru: 'Сорбитол (CAS 50-70-4, E420) — подсластитель и влагоудерживающий агент. Применяется в кондитерских изделиях, жевательной резинке, выпечке и косметике для придания сладости и предотвращения высыхания продукта.',
    en: 'Sorbitol (CAS 50-70-4, E420) is a sweetener and humectant used in confectionery, chewing gum, bakery and cosmetics to add sweetness and prevent products from drying out.',
  },
  'soy-lecithin-e322': {
    uz: 'Soya lesitini (CAS 8002-43-5, E322) — emulgator. Shokolad, pishiriq, margarin va kukunli mahsulotlarda yog‘ va suvni birlashtirish hamda aralashmani barqarorlashtirish uchun ishlatiladi.',
    ru: 'Соевый лецитин (CAS 8002-43-5, E322) — эмульгатор. Применяется в шоколаде, выпечке, маргарине и сухих смесях для соединения жира и воды и стабилизации смеси.',
    en: 'Soy lecithin (CAS 8002-43-5, E322) is an emulsifier used in chocolate, bakery, margarine and dry mixes to bind fat and water and stabilise the mixture.',
  },
  'sunflower-lecithin': {
    uz: 'Kungaboqar lesitini (CAS 8002-43-5, E322) — o‘simlik emulgatori, soya lesitiniga muqobil. Shokolad, pishiriq va dietik mahsulotlarda ishlatiladi.',
    ru: 'Подсолнечный лецитин (CAS 8002-43-5, E322) — растительный эмульгатор, альтернатива соевому лецитину. Применяется в шоколаде, выпечке и диетических продуктах.',
    en: 'Sunflower lecithin (CAS 8002-43-5, E322) is a plant-based emulsifier and an alternative to soy lecithin, used in chocolate, bakery and dietary products.',
  },
  citral: {
    uz: 'Sitral (CAS 5392-40-5) — geranial va neral izomerlari aralashmasi; kuchli, toza limon hidiga ega aroma kimyoviy modda. Limon va sitrus aromatizatorlarida (ichimliklar, qandolat), shuningdek atir kompozitsiyalari va uy kimyosi otdushkalarida ishlatiladi. Havo va yorug‘likda oksidlanishga moyil, shuning uchun yopiq idishda saqlanadi.',
    ru: 'Цитраль (CAS 5392-40-5) — смесь изомеров гераниаля и нераля; ароматическое вещество с сильным чистым лимонным запахом. Применяется в лимонных и цитрусовых ароматизаторах (напитки, кондитерские изделия), а также в парфюмерных композициях и отдушках для бытовой химии. Склонен к окислению на воздухе и свету, поэтому хранится в закрытой таре.',
    en: 'Citral (CAS 5392-40-5) is a mixture of the geranial and neral isomers, an aroma chemical with a strong, clean lemon odour. It is used in lemon and citrus flavours (beverages, confectionery) as well as in fragrance compositions and household-product fragrances. It oxidises in air and light, so it is stored in tightly closed containers.',
  },
  'modified-starch-e1442': {
    uz: 'Modifikatsiyalangan kraxmal E1442 (gidroksipropil-distarx-fosfat) — quyultiruvchi va stabilizator. Issiqlik, kislota va muzlatish-eritishga oddiy kraxmalga qaraganda chidamli; sous, mayonez, yogurt, muzqaymoq va konserva mahsulotlarida quyuqlik va barqarorlik uchun ishlatiladi.',
    ru: 'Модифицированный крахмал E1442 (гидроксипропилдикрахмалфосфат) — загуститель и стабилизатор. Устойчивее обычного крахмала к нагреву, кислоте и замораживанию-оттаиванию; применяется в соусах, майонезе, йогуртах, мороженом и консервах для вязкости и стабильности.',
    en: 'Modified starch E1442 (hydroxypropyl distarch phosphate) is a thickener and stabiliser. It withstands heat, acid and freeze-thaw better than native starch and is used in sauces, mayonnaise, yoghurts, ice cream and canned foods for viscosity and stability.',
  },
  'titanium-dioxide-e171': {
    uz: 'Titan dioksidi (CAS 13463-67-7, E171) — oq pigment, mahsulotga oq rang va xiralik beradi. Qandolat qoplamasi, glazur va boshqa oziq-ovqat mahsulotlarida ishlatilgan. Yevropa Ittifoqida 2022-yildan boshlab oziq-ovqat qo‘shimchasi sifatida ruxsat etilmaydi, shuning uchun eksport qilinadigan mahsulotlarda uning qo‘llanilishi bozor talablariga muvofiq tekshirilishi kerak.',
    ru: 'Диоксид титана (CAS 13463-67-7, E171) — белый пигмент, придающий продукту белизну и непрозрачность. Использовался в кондитерских глазурях, драже и других пищевых продуктах. В Европейском союзе с 2022 года не разрешён как пищевая добавка, поэтому его применение в экспортной продукции необходимо проверять на соответствие требованиям рынка назначения.',
    en: 'Titanium dioxide (CAS 13463-67-7, E171) is a white pigment that provides whiteness and opacity. It has been used in confectionery coatings, glazes and other foods. It is no longer authorised as a food additive in the European Union since 2022, so its use in exported products should be checked against the requirements of the destination market.',
  },
  'skimmed-milk-powder': {
    uz: 'Yog‘i olingan quruq sut — pasterizatsiya qilingan yog‘sizlantirilgan sutni bug‘latib, quritish yo‘li bilan olinadi; Codex Alimentarius bo‘yicha sut yog‘i ulushi 1,5% dan oshmaydi. Qandolat, pishiriq, sut mahsulotlari, muzqaymoq va quruq aralashmalarda sut oqsili va laktoza manbai sifatida ishlatiladi.',
    ru: 'Обезжиренное сухое молоко получают выпариванием и сушкой пастеризованного обезжиренного молока; по Codex Alimentarius массовая доля молочного жира не превышает 1,5%. Используется в кондитерских изделиях, выпечке, молочных продуктах, мороженом и сухих смесях как источник молочного белка и лактозы.',
    en: 'Skimmed milk powder is made by evaporating and drying pasteurised skimmed milk; under the Codex Alimentarius milk fat does not exceed 1.5%. It is used in confectionery, bakery, dairy products, ice cream and dry mixes as a source of milk protein and lactose.',
  },
  'whole-milk-powder-26': {
    uz: 'Yog‘li quruq sut (26% yog‘) — pasterizatsiya qilingan butun sutni quritish yo‘li bilan olinadi; Codex Alimentarius bo‘yicha sut yog‘i ulushi kamida 26%. Shokolad, qandolat, sut ichimliklari, muzqaymoq va tayyor aralashmalarda ishlatiladi.',
    ru: 'Цельное сухое молоко (жирность 26%) получают сушкой пастеризованного цельного молока; по Codex Alimentarius массовая доля молочного жира не менее 26%. Применяется в шоколаде, кондитерских изделиях, молочных напитках, мороженом и готовых смесях.',
    en: 'Whole milk powder (26% fat) is made by drying pasteurised whole milk; under the Codex Alimentarius milk fat is at least 26%. It is used in chocolate, confectionery, milk drinks, ice cream and ready mixes.',
  },
  'whey-powder-sweet': {
    uz: 'Shirin zardob kukuni — pishloq tayyorlashda hosil bo‘ladigan zardobni quritib olinadi; laktozaga boy, tarkibida zardob oqsillari va minerallar bor. Pishiriq, qandolat, sut mahsulotlari, sous va quruq aralashmalarda ishlatiladi.',
    ru: 'Сладкая сывороточная сухая смесь получается сушкой сыворотки, образующейся при производстве сыра; богата лактозой, содержит сывороточные белки и минеральные вещества. Применяется в выпечке, кондитерских изделиях, молочных продуктах, соусах и сухих смесях.',
    en: 'Sweet whey powder is made by drying the whey left over from cheese-making; it is rich in lactose and contains whey proteins and minerals. It is used in bakery, confectionery, dairy products, sauces and dry mixes.',
  },
};

export function productFacts(slug: string, locale: Locale): string | null {
  return PRODUCT_FACTS[slug]?.[locale] ?? null;
}
