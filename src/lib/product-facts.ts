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
    ru: 'Сухая сладкая сыворотка (сыворотка в порошке) получается сушкой сыворотки, образующейся при производстве сыра; богата лактозой, содержит сывороточные белки и минеральные вещества. Применяется в выпечке, кондитерских изделиях, молочных продуктах, соусах и сухих смесях.',
    en: 'Sweet whey powder is made by drying the whey left over from cheese-making; it is rich in lactose and contains whey proteins and minerals. It is used in bakery, confectionery, dairy products, sauces and dry mixes.',
  },
  'vanillin-pure': {
    uz: 'Vanilin (CAS 121-33-5, 4-gidroksi-3-metoksibenzaldegid) — vanilning asosiy hid beruvchi moddasi; oq yoki och sarg‘ish kristall kukun. Qandolat, pishiriq, shokolad, muzqaymoq, sut mahsulotlari va ichimliklarda vanil ta’mini berish uchun, shuningdek atir kompozitsiyalarida shirin nota sifatida ishlatiladi. Etilvanilinga qaraganda yumshoqroq hidga ega.',
    ru: 'Ванилин (CAS 121-33-5, 4-гидрокси-3-метоксибензальдегид) — основное ароматическое вещество ванили; белый или слегка желтоватый кристаллический порошок. Применяется для придания ванильного вкуса в кондитерских изделиях, выпечке, шоколаде, мороженом, молочной продукции и напитках, а также как сладкая нота в парфюмерных композициях. Аромат мягче, чем у этилванилина.',
    en: 'Vanillin (CAS 121-33-5, 4-hydroxy-3-methoxybenzaldehyde) is the main odour compound of vanilla, supplied as a white to pale-yellow crystalline powder. It gives a vanilla taste to confectionery, bakery, chocolate, ice cream, dairy and beverages, and is used as a sweet note in fragrance compositions. Its character is softer than ethyl vanillin.',
  },
  'maltodextrin-de10-15': {
    uz: 'Maltodekstrin (CAS 9050-36-6) — kraxmalni qisman gidrolizlash yo‘li bilan olinadigan oq kukun; shirinligi past, suvda yaxshi eriydi. Quruq aralashmalar, kukunli ichimliklar, sport ovqatlanishi va qandolatda to‘ldiruvchi hamda quruq aromatizatorlar uchun tashuvchi sifatida ishlatiladi.',
    ru: 'Мальтодекстрин (CAS 9050-36-6) — белый порошок, получаемый частичным гидролизом крахмала; слабосладкий, хорошо растворяется в воде. Используется как наполнитель и носитель для сухих ароматизаторов в сухих смесях, порошковых напитках, спортивном питании и кондитерских изделиях.',
    en: 'Maltodextrin (CAS 9050-36-6) is a white powder made by partial hydrolysis of starch; it is only mildly sweet and dissolves readily in water. It is used as a bulking agent and as a carrier for dry flavours in dry mixes, powdered drinks, sports nutrition and confectionery.',
  },
  'dextrose-monohydrate': {
    uz: 'Dekstroza monogidrati (CAS 5996-10-1) — kristall glyukoza; saxarozaga qaraganda kamroq shirin. Pishiriqda xamirturush uchun oziq, qandolat, ichimliklar va go‘sht mahsulotlarida shirinlik hamda qovurilganda rang hosil bo‘lishi uchun ishlatiladi.',
    ru: 'Декстроза моногидрат (CAS 5996-10-1) — кристаллическая глюкоза, менее сладкая, чем сахароза. Используется в выпечке как питание для дрожжей, в кондитерских изделиях, напитках и мясной продукции — для сладости и образования цвета при термообработке.',
    en: 'Dextrose monohydrate (CAS 5996-10-1) is crystalline glucose and is less sweet than sucrose. It is used in bakery as yeast food and in confectionery, beverages and meat products for sweetness and colour development during heating.',
  },
  'sodium-tripolyphosphate-bulk': {
    uz: 'Natriy tripolifosfati (CAS 7758-29-4, E451) — go‘sht va baliq mahsulotlarida namlikni ushlab turuvchi va tuzilmani yaxshilovchi fosfat. Kolbasa, sosiska, dudlangan va qiyma mahsulotlarda, shuningdek texnik maqsadlarda (yuvish vositalari) qo‘llanadi.',
    ru: 'Триполифосфат натрия (CAS 7758-29-4, E451) — фосфат, удерживающий влагу и улучшающий структуру мясных и рыбных продуктов. Применяется в колбасах, сосисках, копчёностях и фарше, а также в технических целях (моющие средства).',
    en: 'Sodium tripolyphosphate (CAS 7758-29-4, E451) is a phosphate that retains moisture and improves texture in meat and fish products. It is used in sausages, frankfurters, smoked and minced products, and in technical applications such as detergents.',
  },
  'citric-acid-bulk': {
    uz: 'Limon kislotasi (E330) — eng keng tarqalgan oziq-ovqat kislotasi: kislotalilikni rostlaydi, nordon ta’m beradi va antioksidantlar ta’sirini kuchaytiradi. Ichimliklar, qandolat, konservalar va sut mahsulotlarida, shuningdek tozalash vositalarida ishlatiladi.',
    ru: 'Лимонная кислота (E330) — наиболее распространённая пищевая кислота: регулирует кислотность, придаёт кислый вкус и усиливает действие антиоксидантов. Применяется в напитках, кондитерских изделиях, консервах и молочной продукции, а также в чистящих средствах.',
    en: 'Citric acid (E330) is the most widely used food acid: it regulates acidity, provides a sour taste and supports the action of antioxidants. It is used in beverages, confectionery, preserves and dairy products, as well as in cleaning products.',
  },
  'benzyl-alcohol': {
    uz: 'Benzil spirti (CAS 100-51-6, E1519) — kuchsiz yoqimli hidli rangsiz suyuqlik. Aromatizatorlar uchun erituvchi, atir va kosmetikada erituvchi hamda konservant sifatida qo‘llanadi.',
    ru: 'Бензиловый спирт (CAS 100-51-6, E1519) — бесцветная жидкость со слабым приятным запахом. Используется как растворитель для ароматизаторов, а в парфюмерии и косметике — как растворитель и консервант.',
    en: 'Benzyl alcohol (CAS 100-51-6, E1519) is a colourless liquid with a faint pleasant odour. It is used as a solvent for flavours and, in perfumery and cosmetics, as a solvent and preservative.',
  },
  triacetin: {
    uz: 'Triatsetin (glitserin triatsetati, CAS 102-76-1, E1518) — rangsiz, deyarli hidsiz suyuqlik; aromatizatorlar uchun erituvchi va tashuvchi, namlik saqlovchi. Saqichda plastifikator sifatida ham ishlatiladi.',
    ru: 'Триацетин (триацетат глицерина, CAS 102-76-1, E1518) — бесцветная, почти без запаха жидкость; растворитель и носитель для ароматизаторов, влагоудерживающий агент. Также применяется как пластификатор в жевательной резинке.',
    en: 'Triacetin (glycerol triacetate, CAS 102-76-1, E1518) is a colourless, almost odourless liquid used as a solvent and carrier for flavours and as a humectant. It also serves as a plasticiser in chewing gum.',
  },
  'triethyl-citrate': {
    uz: 'Trietilsitrat (CAS 77-93-0, E1505) — limon kislotasining efiri; aromatizatorlar va atir kompozitsiyalari uchun hidsiz erituvchi, shuningdek plastifikator. Tuxum oqi mahsulotlarida ko‘pik stabilizatori sifatida ham qo‘llanadi.',
    ru: 'Триэтилцитрат (CAS 77-93-0, E1505) — эфир лимонной кислоты; растворитель без запаха для ароматизаторов и парфюмерных композиций, а также пластификатор. Применяется и как стабилизатор пены в продуктах из яичного белка.',
    en: 'Triethyl citrate (CAS 77-93-0, E1505) is an ester of citric acid and an odourless solvent for flavours and fragrance compositions, as well as a plasticiser. It is also used as a foam stabiliser in egg-white products.',
  },
  'isopropyl-myristate': {
    uz: 'Izopropilmiristat (IPM, CAS 110-27-0) — moysimon, yog‘li iz qoldirmaydigan suyuqlik. Kosmetikada emolent, atir moylarini suyultirish va eritish uchun erituvchi sifatida ishlatiladi.',
    ru: 'Изопропилмиристат (IPM, CAS 110-27-0) — маслянистая жидкость, не оставляющая жирного следа. В косметике используется как эмолент, а также как растворитель для разбавления парфюмерных масел.',
    en: 'Isopropyl myristate (IPM, CAS 110-27-0) is an oily liquid that leaves no greasy feel. It is used in cosmetics as an emollient and as a solvent for diluting perfume oils.',
  },
  linalool: {
    uz: 'Linalool (CAS 78-70-6) — gulli-yangi, lavanda va bergamotga xos hidli terpen spirti; lavanda, koriandr va bergamot moylarida tabiiy uchraydi. Atir kompozitsiyalari, kosmetika va uy kimyosi otdushkalarida, kichik miqdorda meva va sitrus aromatizatorlarida qo‘llanadi.',
    ru: 'Линалоол (CAS 78-70-6) — терпеновый спирт со свежим цветочным запахом с нотами лаванды и бергамота; в природе содержится в лавандовом, кориандровом и бергамотовом маслах. Применяется в парфюмерных композициях, косметике и отдушках для бытовой химии, в малых количествах — во фруктовых и цитрусовых ароматизаторах.',
    en: 'Linalool (CAS 78-70-6) is a terpene alcohol with a fresh floral odour reminiscent of lavender and bergamot, occurring naturally in lavender, coriander and bergamot oils. It is used in fragrance compositions, cosmetics and household fragrances, and at low levels in fruit and citrus flavours.',
  },
  coumarin: {
    uz: 'Kumarin (CAS 91-64-5) — pichan va tonka loviyasiga xos shirin hidli oq kristall modda. Atir kompozitsiyalarida (fuger va sharqona notalar), sovun va uy kimyosi otdushkalarida ishlatiladi; oziq-ovqatga alohida qo‘shimcha sifatida qo‘shilmaydi.',
    ru: 'Кумарин (CAS 91-64-5) — белое кристаллическое вещество со сладким запахом сена и бобов тонка. Используется в парфюмерных композициях (фужерные и восточные ноты), отдушках для мыла и бытовой химии; в пищевые продукты как самостоятельная добавка не вносится.',
    en: 'Coumarin (CAS 91-64-5) is a white crystalline substance with a sweet hay and tonka-bean odour. It is used in fragrance compositions (fougère and oriental accords) and in soap and household fragrances; it is not added to food as a stand-alone additive.',
  },
  hedione: {
    uz: 'Gedion (metildigidrojasmonat, CAS 24851-98-7) — yengil, havodor yasmin-sitrus hidli aroma kimyoviy modda. Atir kompozitsiyalarida hidni “ochish” va tarqalishini kuchaytirish uchun keng qo‘llanadi, shuningdek kosmetika va uy kimyosi otdushkalarida ishlatiladi.',
    ru: 'Гедион (метилдигидрожасмонат, CAS 24851-98-7) — ароматическое вещество с лёгким воздушным жасминово-цитрусовым запахом. Широко применяется в парфюмерных композициях для «раскрытия» и усиления диффузии аромата, а также в отдушках для косметики и бытовой химии.',
    en: 'Hedione (methyl dihydrojasmonate, CAS 24851-98-7) is an aroma chemical with a light, airy jasmine-citrus odour. It is widely used in fragrance compositions to lift and diffuse the scent, and in cosmetic and household fragrances.',
  },
  'caster-sugar-fine': {
    uz: 'Mayda kristalli shakar (kaster, saxaroza, CAS 57-50-1) — oddiy kristall shakarga qaraganda maydaroq donalardan iborat, shuning uchun tezroq eriydi. Bisqvit, krem, beze, ichimliklar va qandolat massalarida ishlatiladi.',
    ru: 'Сахар мелкий (кастер, сахароза, CAS 57-50-1) — сахар с более мелкими кристаллами, чем у обычного песка, поэтому быстрее растворяется. Применяется в бисквитах, кремах, меренге, напитках и кондитерских массах.',
    en: 'Caster sugar (sucrose, CAS 57-50-1) has finer crystals than granulated sugar, so it dissolves faster. It is used in sponge cakes, creams, meringues, drinks and confectionery masses.',
  },
  'sugar-powder-icing-sugar': {
    uz: 'Shakar upasi — saxaroza (CAS 57-50-1) ni nozik kukunga aylantirib maydalash orqali olinadi; ko‘pincha yopishib qolmaslik uchun oz miqdorda kraxmal kabi qo‘shimcha bo‘ladi. Glazur, krem, fondan va pishiriqni bezashda ishlatiladi.',
    ru: 'Сахарная пудра — сахароза (CAS 57-50-1), измельчённая в тонкий порошок; часто содержит небольшую добавку антислёживателя, например крахмала. Применяется для глазурей, кремов, помадок и декора выпечки.',
    en: 'Icing sugar is sucrose (CAS 57-50-1) ground to a fine powder; it often contains a small amount of an anti-caking agent such as starch. It is used for glazes, creams, fondant and decorating bakery products.',
  },
  'glucose-syrup-bulk': {
    uz: 'Glyukoza siropi (CAS 8029-43-4) — kraxmalni gidroliz qilib olinadigan quyuq shirin sirop; shirinlik va quyuqlikni boshqaradi, shakarning kristallanishiga yo‘l qo‘ymaydi. Qandolat, muzqaymoq, pishiriq va ichimliklarda ishlatiladi.',
    ru: 'Глюкозный сироп (CAS 8029-43-4) — вязкий сладкий сироп, получаемый гидролизом крахмала; регулирует сладость и вязкость, препятствует кристаллизации сахара. Применяется в кондитерских изделиях, мороженом, выпечке и напитках.',
    en: 'Glucose syrup (CAS 8029-43-4) is a viscous sweet syrup made by starch hydrolysis; it controls sweetness and viscosity and prevents sugar from crystallising. It is used in confectionery, ice cream, bakery and beverages.',
  },
  'malic-acid': {
    uz: 'Olma kislotasi (DL-olma kislotasi, CAS 6915-15-7, E296) — o‘tkir, mevali nordon ta’mli oziq-ovqat kislotasi. Nordon qandolat va draje, ichimliklar, murabbo va jelelarda ishlatiladi.',
    ru: 'Яблочная кислота (DL-яблочная, CAS 6915-15-7, E296) — пищевая кислота с резким фруктовым кисловатым вкусом. Применяется в кислых карамелях и драже, напитках, джемах и желе.',
    en: 'Malic acid (DL-malic, CAS 6915-15-7, E296) is a food acid with a sharp, fruity sourness. It is used in sour sweets and dragees, beverages, jams and jellies.',
  },
  'lactic-acid': {
    uz: 'Sut kislotasi (CAS 50-21-5, E270) — yumshoq nordon ta’mli organik kislota; kislotalik rostlagich va konservalovchi komponent. Ichimliklar, qandolat, go‘sht va sut mahsulotlari, marinadlarda ishlatiladi.',
    ru: 'Молочная кислота (CAS 50-21-5, E270) — органическая кислота с мягким кислым вкусом; регулятор кислотности и консервирующий компонент. Применяется в напитках, кондитерских изделиях, мясных и молочных продуктах, маринадах.',
    en: 'Lactic acid (CAS 50-21-5, E270) is an organic acid with a mild sour taste, used as an acidity regulator and preserving component. It is applied in beverages, confectionery, meat and dairy products and marinades.',
  },
  'sodium-citrate': {
    uz: 'Natriy sitrat (uch o‘rinli, CAS 68-04-2, E331) — limon kislotasining tuzi; kislotalik rostlagich, bufer va eritgich tuz. Ichimliklar, eritilgan pishloq, muzqaymoq va jele desertlarida ishlatiladi.',
    ru: 'Цитрат натрия (трёхзамещённый, CAS 68-04-2, E331) — соль лимонной кислоты; регулятор кислотности, буфер и соль-плавитель. Применяется в напитках, плавленом сыре, мороженом и желейных десертах.',
    en: 'Sodium citrate (trisodium, CAS 68-04-2, E331) is a salt of citric acid used as an acidity regulator, buffer and emulsifying salt. It is applied in beverages, processed cheese, ice cream and jelly desserts.',
  },
  'potassium-sorbate': {
    uz: 'Kaliy sorbat (CAS 24634-61-5, E202) — mog‘or va achitqilar o‘sishini to‘xtatuvchi konservant; kuchsiz kislotali muhitda samaraliroq. Ichimliklar, souslar, murabbo, pishiriq va sut mahsulotlarida ishlatiladi.',
    ru: 'Сорбат калия (CAS 24634-61-5, E202) — консервант, подавляющий рост плесени и дрожжей; эффективнее в слабокислой среде. Применяется в напитках, соусах, джемах, выпечке и молочных продуктах.',
    en: 'Potassium sorbate (CAS 24634-61-5, E202) is a preservative that inhibits moulds and yeasts and works best in mildly acidic conditions. It is used in beverages, sauces, jams, bakery and dairy products.',
  },
  'sodium-benzoate': {
    uz: 'Natriy benzoat (CAS 532-32-1, E211) — kislotali muhitda ishlaydigan konservant. Ichimliklar, souslar, marinadlar va murabbolarda ishlatiladi; dozasi texnik reglamentlar bilan cheklanadi.',
    ru: 'Бензоат натрия (CAS 532-32-1, E211) — консервант, действующий в кислой среде. Применяется в напитках, соусах, маринадах и джемах; дозировка ограничивается техническими регламентами.',
    en: 'Sodium benzoate (CAS 532-32-1, E211) is a preservative that works in acidic conditions. It is used in beverages, sauces, marinades and jams; levels are limited by technical regulations.',
  },
  'calcium-propionate': {
    uz: 'Kalsiy propionat (CAS 4075-81-4, E282) — non-bulka mahsulotlarida mog‘or o‘sishini sekinlashtiruvchi konservant. Non, pishiriq va ba’zi pishloq turlarida ishlatiladi.',
    ru: 'Пропионат кальция (CAS 4075-81-4, E282) — консервант, замедляющий рост плесени в хлебобулочных изделиях. Применяется в хлебе, выпечке и некоторых видах сыров.',
    en: 'Calcium propionate (CAS 4075-81-4, E282) is a preservative that slows mould growth in bakery products. It is used in bread, baked goods and some cheeses.',
  },
  'ascorbic-acid-vitamin-c': {
    uz: 'Askorbin kislotasi (vitamin C, CAS 50-81-7, E300) — antioksidant va vitamin. Ichimliklar, go‘sht mahsulotlari va pishiriqda (un yaxshilagich sifatida) hamda boyitishda ishlatiladi.',
    ru: 'Аскорбиновая кислота (витамин C, CAS 50-81-7, E300) — антиокислитель и витамин. Применяется в напитках, мясных изделиях, выпечке (как улучшитель муки) и для обогащения продуктов.',
    en: 'Ascorbic acid (vitamin C, CAS 50-81-7, E300) is an antioxidant and vitamin. It is used in beverages, meat products, bakery (as a flour improver) and for fortification.',
  },
  'xanthan-gum': {
    uz: 'Ksantan kamedi (CAS 11138-66-2, E415) — fermentatsiya orqali olinadigan polisaharid; oz dozada ham yopishqoqlik beruvchi quyultiruvchi va stabilizator. Sous, dressing, ichimlik, sut deserti va glyutensiz pishiriqda ishlatiladi.',
    ru: 'Ксантановая камедь (CAS 11138-66-2, E415) — полисахарид, получаемый ферментацией; загуститель и стабилизатор, создающий вязкость при малой дозировке. Применяется в соусах, заправках, напитках, молочных десертах и безглютеновой выпечке.',
    en: 'Xanthan gum (CAS 11138-66-2, E415) is a fermentation-derived polysaccharide that thickens and stabilises at low dosage. It is used in sauces, dressings, beverages, dairy desserts and gluten-free bakery.',
  },
  'guar-gum': {
    uz: 'Guar kamedi (CAS 9000-30-0, E412) — guar urug‘idan olinadigan quyultiruvchi; sovuq suvda ham yaxshi shishadi. Muzqaymoq, sous, pishiriq va sut mahsulotlarida ishlatiladi.',
    ru: 'Гуаровая камедь (CAS 9000-30-0, E412) — загуститель из семян гуара; хорошо набухает даже в холодной воде. Применяется в мороженом, соусах, выпечке и молочных продуктах.',
    en: 'Guar gum (CAS 9000-30-0, E412) is a thickener from guar seeds that hydrates well even in cold water. It is used in ice cream, sauces, bakery and dairy products.',
  },
  'pectin-hm-citrus': {
    uz: 'Sitrus pektini HM (CAS 9000-69-5, E440) — yuqori metoksillangan jelelovchi polisaharid; shakar miqdori yuqori va muhit kislotali bo‘lganda jele hosil qiladi. Murabbo, marmelad va jele konfetlarida ishlatiladi.',
    ru: 'Пектин HM цитрусовый (CAS 9000-69-5, E440) — высокоэтерифицированный желирующий полисахарид; образует гель при высоком содержании сахара и кислой среде. Применяется в джемах, мармеладе и желейных конфетах.',
    en: 'Citrus pectin HM (CAS 9000-69-5, E440) is a high-methoxyl gelling polysaccharide that forms a gel at high sugar content and in acidic conditions. It is used in jams, marmalade and jelly confectionery.',
  },
  sucralose: {
    uz: 'Sukraloza (CAS 56038-13-2, E955) — intensiv sun’iy shirinlashtirgich, saxarozadan taxminan 600 marta shirin; issiqlikka chidamli. Ichimliklar, pishiriq, desertlar va dietik mahsulotlarda ishlatiladi.',
    ru: 'Сукралоза (CAS 56038-13-2, E955) — интенсивный подсластитель, примерно в 600 раз слаще сахарозы; устойчива к нагреву. Применяется в напитках, выпечке, десертах и диетических продуктах.',
    en: 'Sucralose (CAS 56038-13-2, E955) is an intense sweetener about 600 times sweeter than sucrose and stable to heat. It is used in beverages, bakery, desserts and diet products.',
  },
  aspartame: {
    uz: 'Aspartam (CAS 22839-47-0, E951) — saxarozadan taxminan 200 marta shirin intensiv shirinlashtirgich; uzoq qizdirishga chidamsiz. Fenilalanin tutadi, shuning uchun fenilketonuriyada qo‘llanmaydi va markirovkada ko‘rsatiladi.',
    ru: 'Аспартам (CAS 22839-47-0, E951) — интенсивный подсластитель, примерно в 200 раз слаще сахарозы; нестоек при длительном нагреве. Содержит фенилаланин, поэтому при фенилкетонурии не используется и указывается в маркировке.',
    en: 'Aspartame (CAS 22839-47-0, E951) is an intense sweetener about 200 times sweeter than sucrose and is not stable to prolonged heating. It contains phenylalanine, so it must be declared on labels and avoided in phenylketonuria.',
  },
  'acesulfame-k': {
    uz: 'Atsesulfam kaliy (CAS 55589-62-3, E950) — saxarozadan taxminan 200 marta shirin, issiqlikka chidamli shirinlashtirgich; ko‘pincha boshqa shirinlashtirgichlar bilan aralashmada ishlatiladi. Ichimliklar, qandolat, pishiriq va sut mahsulotlarida qo‘llanadi.',
    ru: 'Ацесульфам калия (CAS 55589-62-3, E950) — подсластитель, примерно в 200 раз слаще сахарозы, устойчив к нагреву; часто применяется в смеси с другими подсластителями. Используется в напитках, кондитерских изделиях, выпечке и молочных продуктах.',
    en: 'Acesulfame potassium (CAS 55589-62-3, E950) is a heat-stable sweetener about 200 times sweeter than sucrose, often used in blends with other sweeteners. It is applied in beverages, confectionery, bakery and dairy products.',
  },
  erythritol: {
    uz: 'Eritritol (CAS 149-32-6, E968) — poliol (shakar spirti), shirinligi saxarozaning taxminan 60–70% i, deyarli kaloriyasiz; erishda salqinlik hissi beradi. Shakarsiz qandolat, ichimliklar va pishiriqda ishlatiladi.',
    ru: 'Эритритол (CAS 149-32-6, E968) — полиол (сахарный спирт) со сладостью около 60–70% от сахарозы и очень низкой калорийностью; при растворении даёт ощущение прохлады. Применяется в кондитерских изделиях без сахара, напитках и выпечке.',
    en: 'Erythritol (CAS 149-32-6, E968) is a polyol (sugar alcohol) with about 60–70% of the sweetness of sucrose and very low calories; it gives a cooling sensation on dissolving. It is used in sugar-free confectionery, beverages and bakery.',
  },
  xylitol: {
    uz: 'Ksilit (CAS 87-99-0, E967) — shirinligi saxarozaga yaqin poliol (shakar spirti); erishda salqinlik hissi beradi. Saqich, shakarsiz konfet va dietik mahsulotlarda ishlatiladi.',
    ru: 'Ксилит (CAS 87-99-0, E967) — полиол (сахарный спирт) со сладостью, близкой к сахарозе; при растворении даёт ощущение прохлады. Применяется в жевательной резинке, конфетах без сахара и диетических продуктах.',
    en: 'Xylitol (CAS 87-99-0, E967) is a polyol (sugar alcohol) with sweetness close to sucrose and a cooling effect on dissolving. It is used in chewing gum, sugar-free sweets and diet products.',
  },
  'sodium-bicarbonate-baking-soda': {
    uz: 'Ichimlik sodasi (natriy gidrokarbonat, CAS 144-55-8, E500) — qizdirilganda va kislotali muhitda karbonat angidrid ajratib, xamirni ko‘taruvchi bo‘shatuvchi. Pishiriq, pechenye va keksda ishlatiladi.',
    ru: 'Пищевая сода (гидрокарбонат натрия, CAS 144-55-8, E500) — разрыхлитель: при нагреве и в кислой среде выделяет углекислый газ и поднимает тесто. Применяется в выпечке, печенье и кексах.',
    en: 'Baking soda (sodium bicarbonate, CAS 144-55-8, E500) is a leavening agent that releases carbon dioxide on heating and in acidic conditions, raising the dough. It is used in bakery, biscuits and cakes.',
  },
  'sodium-alginate': {
    uz: 'Natriy alginat (CAS 9005-38-3, E401) — jigarrang suv o‘tlaridan olinadi; kalsiy ionlari bilan jele hosil qiluvchi quyultiruvchi. Muzqaymoq, sous va tuzilmali mahsulotlarda ishlatiladi.',
    ru: 'Альгинат натрия (CAS 9005-38-3, E401) — получают из бурых водорослей; загуститель, образующий гель с ионами кальция. Применяется в мороженом, соусах и структурированных продуктах.',
    en: 'Sodium alginate (CAS 9005-38-3, E401) is obtained from brown seaweed and is a thickener that forms gels with calcium ions. It is used in ice cream, sauces and restructured foods.',
  },
  'cmc-carboxymethylcellulose': {
    uz: 'Karboksimetilsellyuloza (CMC, CAS 9004-32-4, E466) — quyultiruvchi va stabilizator. Muzqaymoq, ichimliklar, sous va qandolat massalarida ishlatiladi.',
    ru: 'Карбоксиметилцеллюлоза (КМЦ, CAS 9004-32-4, E466) — загуститель и стабилизатор. Применяется в мороженом, напитках, соусах и кондитерских массах.',
    en: 'Carboxymethylcellulose (CMC, CAS 9004-32-4, E466) is a thickener and stabiliser. It is used in ice cream, beverages, sauces and confectionery masses.',
  },
  'carrageenan-kappa': {
    uz: 'Kappa-karragenan (karragenan, CAS 9000-07-1, E407) — qizil suv o‘tlaridan olinadi; qattiq, mo‘rt jele hosil qiladi, ayniqsa sut oqsillari bilan yaxshi ishlaydi. Sut deserti, jele, go‘sht mahsulotlarida ishlatiladi.',
    ru: 'Каррагинан каппа (CAS 9000-07-1, E407) — получают из красных водорослей; образует плотный хрупкий гель, особенно хорошо работает с молочными белками. Применяется в молочных десертах, желе и мясных продуктах.',
    en: 'Kappa carrageenan (CAS 9000-07-1, E407) is extracted from red seaweed and forms a firm, brittle gel, working particularly well with milk proteins. It is used in dairy desserts, jellies and meat products.',
  },
  'carrageenan-iota': {
    uz: 'Yota-karragenan (karragenan, CAS 9000-07-1, E407) — qizil suv o‘tlaridan olinadi; yumshoq, elastik jele hosil qiladi. Sut deserti, sous va to‘ldirmalarda ishlatiladi.',
    ru: 'Каррагинан йота (CAS 9000-07-1, E407) — получают из красных водорослей; образует мягкий эластичный гель. Применяется в молочных десертах, соусах и начинках.',
    en: 'Iota carrageenan (CAS 9000-07-1, E407) is extracted from red seaweed and forms a soft, elastic gel. It is used in dairy desserts, sauces and fillings.',
  },
  'agar-agar-powder': {
    uz: 'Agar-agar (CAS 9002-18-0, E406) — qizil suv o‘tlaridan olinadi; qizdirilganda eriydi va sovuganda qattiq, issiqlikka qaytuvchi jele hosil qiladi. Marmelad, zefir, pastila va desertlarda ishlatiladi.',
    ru: 'Агар-агар (CAS 9002-18-0, E406) — получают из красных водорослей; растворяется при нагреве и при охлаждении образует плотный термообратимый гель. Применяется в мармеладе, зефире, пастиле и десертах.',
    en: 'Agar-agar (CAS 9002-18-0, E406) is extracted from red seaweed; it dissolves on heating and sets into a firm, heat-reversible gel on cooling. It is used in marmalade, marshmallow, pastila and desserts.',
  },
  'corn-starch': {
    uz: 'Makkajo‘xori kraxmali (CAS 9005-25-8) — quyultiruvchi va to‘ldiruvchi. Sous, puding, pishiriq va qandolat massalarida ishlatiladi.',
    ru: 'Кукурузный крахмал (CAS 9005-25-8) — загуститель и наполнитель. Применяется в соусах, пудингах, выпечке и кондитерских массах.',
    en: 'Corn starch (CAS 9005-25-8) is a thickener and bulking agent. It is used in sauces, puddings, bakery and confectionery masses.',
  },
  'potato-starch': {
    uz: 'Kartoshka kraxmali (CAS 9005-25-8) — quyultiruvchi va to‘ldiruvchi, neytral ta’mli. Sous, sho‘rva, pishiriq va go‘sht mahsulotlarida ishlatiladi.',
    ru: 'Картофельный крахмал (CAS 9005-25-8) — загуститель и наполнитель с нейтральным вкусом. Применяется в соусах, супах, выпечке и мясных изделиях.',
    en: 'Potato starch (CAS 9005-25-8) is a thickener and bulking agent with a neutral taste. It is used in sauces, soups, bakery and meat products.',
  },
  'tartrazine-e102': {
    uz: 'Tartrazin (CAS 1934-21-0, E102) — limon-sariq rangli sintetik oziq-ovqat bo‘yog‘i, suvda eriydigan kukun. Ichimliklar, qandolat, glazur va desertlarni bo‘yashda ishlatiladi; ruxsat etilgan dozalar texnik reglamentlar bilan belgilanadi — mahsulotingiz uchun aniqlang.',
    ru: 'Тартразин (CAS 1934-21-0, E102) — синтетический пищевой краситель лимонно-жёлтого цвета, водорастворимый порошок. Применяется для окрашивания напитков, кондитерских изделий, глазурей и десертов; допустимые дозировки определяются техническими регламентами — уточняйте для вашего продукта.',
    en: 'Tartrazine (CAS 1934-21-0, E102) is a synthetic food colour with a lemon-yellow shade, supplied as a water-soluble powder. It is used to colour drinks, confectionery, glazes and desserts; permitted levels are set by technical regulations, so check them for your product.',
  },
  'sunset-yellow-fcf-e110': {
    uz: 'Quyosh botishi sariq FCF (CAS 2783-94-0, E110) — to‘q sariq-zarg‘aldoq rangli sintetik oziq-ovqat bo‘yog‘i, suvda eriydigan kukun. Ichimliklar, qandolat, glazur va desertlarni bo‘yashda ishlatiladi; ruxsat etilgan dozalar texnik reglamentlar bilan belgilanadi — mahsulotingiz uchun aniqlang.',
    ru: 'Жёлтый солнечный закат FCF (CAS 2783-94-0, E110) — синтетический пищевой краситель оранжево-жёлтого цвета, водорастворимый порошок. Применяется для окрашивания напитков, кондитерских изделий, глазурей и десертов; допустимые дозировки определяются техническими регламентами — уточняйте для вашего продукта.',
    en: 'Sunset Yellow FCF (CAS 2783-94-0, E110) is a synthetic food colour with a orange-yellow shade, supplied as a water-soluble powder. It is used to colour drinks, confectionery, glazes and desserts; permitted levels are set by technical regulations, so check them for your product.',
  },
  'allura-red-ac-e129': {
    uz: 'Allura qizil AC (CAS 25956-17-6, E129) — qizil rangli sintetik oziq-ovqat bo‘yog‘i, suvda eriydigan kukun. Ichimliklar, qandolat, glazur va desertlarni bo‘yashda ishlatiladi; ruxsat etilgan dozalar texnik reglamentlar bilan belgilanadi — mahsulotingiz uchun aniqlang.',
    ru: 'Красный очаровательный AC (Allura Red) (CAS 25956-17-6, E129) — синтетический пищевой краситель красного цвета, водорастворимый порошок. Применяется для окрашивания напитков, кондитерских изделий, глазурей и десертов; допустимые дозировки определяются техническими регламентами — уточняйте для вашего продукта.',
    en: 'Allura Red AC (CAS 25956-17-6, E129) is a synthetic food colour with a red shade, supplied as a water-soluble powder. It is used to colour drinks, confectionery, glazes and desserts; permitted levels are set by technical regulations, so check them for your product.',
  },
  'brilliant-blue-fcf-e133': {
    uz: 'Yorqin ko‘k FCF (CAS 3844-45-9, E133) — ko‘k rangli sintetik oziq-ovqat bo‘yog‘i, suvda eriydigan kukun. Ichimliklar, qandolat, glazur va desertlarni bo‘yashda ishlatiladi; ruxsat etilgan dozalar texnik reglamentlar bilan belgilanadi — mahsulotingiz uchun aniqlang.',
    ru: 'Синий блестящий FCF (CAS 3844-45-9, E133) — синтетический пищевой краситель синего цвета, водорастворимый порошок. Применяется для окрашивания напитков, кондитерских изделий, глазурей и десертов; допустимые дозировки определяются техническими регламентами — уточняйте для вашего продукта.',
    en: 'Brilliant Blue FCF (CAS 3844-45-9, E133) is a synthetic food colour with a blue shade, supplied as a water-soluble powder. It is used to colour drinks, confectionery, glazes and desserts; permitted levels are set by technical regulations, so check them for your product.',
  },
  'carmoisine-e122': {
    uz: 'Karmuazin (CAS 3567-69-9, E122) — qizil rangli sintetik oziq-ovqat bo‘yog‘i, suvda eriydigan kukun. Ichimliklar, qandolat, glazur va desertlarni bo‘yashda ishlatiladi; ruxsat etilgan dozalar texnik reglamentlar bilan belgilanadi — mahsulotingiz uchun aniqlang.',
    ru: 'Кармуазин (CAS 3567-69-9, E122) — синтетический пищевой краситель красного цвета, водорастворимый порошок. Применяется для окрашивания напитков, кондитерских изделий, глазурей и десертов; допустимые дозировки определяются техническими регламентами — уточняйте для вашего продукта.',
    en: 'Carmoisine (CAS 3567-69-9, E122) is a synthetic food colour with a red shade, supplied as a water-soluble powder. It is used to colour drinks, confectionery, glazes and desserts; permitted levels are set by technical regulations, so check them for your product.',
  },
  'ponceau-4r-e124': {
    uz: 'Ponso 4R (CAS 2611-82-7, E124) — qizil rangli sintetik oziq-ovqat bo‘yog‘i, suvda eriydigan kukun. Ichimliklar, qandolat, glazur va desertlarni bo‘yashda ishlatiladi; ruxsat etilgan dozalar texnik reglamentlar bilan belgilanadi — mahsulotingiz uchun aniqlang.',
    ru: 'Понсо 4R (CAS 2611-82-7, E124) — синтетический пищевой краситель красного цвета, водорастворимый порошок. Применяется для окрашивания напитков, кондитерских изделий, глазурей и десертов; допустимые дозировки определяются техническими регламентами — уточняйте для вашего продукта.',
    en: 'Ponceau 4R (CAS 2611-82-7, E124) is a synthetic food colour with a red shade, supplied as a water-soluble powder. It is used to colour drinks, confectionery, glazes and desserts; permitted levels are set by technical regulations, so check them for your product.',
  },
  'beta-carotene-e160a': {
    uz: 'Beta-karotin (CAS 7235-40-7, E160a) — sariq-to‘q sariq rangli karotinoid bo‘yoq, provitamin A. Yog‘li va emulsiyali mahsulotlar, ichimliklar, qandolat va pishiriqni bo‘yashda ishlatiladi.',
    ru: 'Бета-каротин (CAS 7235-40-7, E160a) — каротиноидный краситель жёлто-оранжевого цвета, провитамин A. Применяется для окрашивания жировых и эмульсионных продуктов, напитков, кондитерских изделий и выпечки.',
    en: 'Beta-carotene (CAS 7235-40-7, E160a) is a yellow-orange carotenoid colour and a provitamin A. It is used to colour fat-based and emulsion products, beverages, confectionery and bakery.',
  },
  'curcumin-e100': {
    uz: 'Kurkumin (CAS 458-37-7, E100) — zarchavoldan olinadigan sariq tabiiy bo‘yoq. Souslar, sut mahsulotlari, qandolat va ziravor aralashmalarida ishlatiladi; yorug‘likka sezgir.',
    ru: 'Куркумин (CAS 458-37-7, E100) — жёлтый натуральный краситель из куркумы. Применяется в соусах, молочных продуктах, кондитерских изделиях и пряных смесях; чувствителен к свету.',
    en: 'Curcumin (CAS 458-37-7, E100) is a yellow natural colour extracted from turmeric. It is used in sauces, dairy products, confectionery and spice blends, and it is sensitive to light.',
  },
  'cocoa-butter-natural': {
    uz: 'Tabiiy kakao yog‘i (CAS 8002-31-1) — kakao dukkakchasidan olinadigan o‘simlik yog‘i; xona haroratida qattiq, tana haroratiga yaqin erishi bilan ajralib turadi. Shokolad, qandolat va kosmetikada ishlatiladi.',
    ru: 'Какао-масло натуральное (CAS 8002-31-1) — растительный жир из бобов какао; твёрдое при комнатной температуре, плавится близко к температуре тела. Применяется в шоколаде, кондитерских изделиях и косметике.',
    en: 'Natural cocoa butter (CAS 8002-31-1) is a vegetable fat from cocoa beans, solid at room temperature and melting close to body temperature. It is used in chocolate, confectionery and cosmetics.',
  },
  'mono-diglycerides-e471': {
    uz: 'Mono- va digliseridlar (E471) — yog‘ kislotalarining gliserin efirlari asosidagi emulgator. Non va pishiriq (yumshoqlikni saqlash), muzqaymoq, margarin va qandolatda ishlatiladi.',
    ru: 'Моно- и диглицериды жирных кислот (E471) — эмульгатор на основе глицериновых эфиров жирных кислот. Применяется в хлебе и выпечке (сохранение мягкости), мороженом, маргарине и кондитерских изделиях.',
    en: 'Mono- and diglycerides of fatty acids (E471) are emulsifiers based on glycerol esters of fatty acids. They are used in bread and bakery (softness retention), ice cream, margarine and confectionery.',
  },
  'polysorbate-80-e433': {
    uz: 'Polisorbat 80 (CAS 9005-65-6, E433) — yog‘ va suvni aralashtiruvchi emulgator. Muzqaymoq, souslar, ichimliklar va pishiriqda ishlatiladi.',
    ru: 'Полисорбат 80 (CAS 9005-65-6, E433) — эмульгатор, помогающий соединять жир и воду. Применяется в мороженом, соусах, напитках и выпечке.',
    en: 'Polysorbate 80 (CAS 9005-65-6, E433) is an emulsifier that helps combine fat and water. It is used in ice cream, sauces, beverages and bakery.',
  },
};

/**
 * Bir xil modda katalogda ikki joyda turadi (aroma kimyosi + komoditi/«навалом»).
 * Matn bitta manbadan olinadi — ikki nusxa bir-biridan uzoqlashmasligi uchun.
 */
const FACT_ALIASES: Record<string, string> = {
  'vanillin-crystalline': 'vanillin-pure',
  'ethyl-vanillin-2': 'ethyl-vanillin',
  'ethyl-maltol-2': 'ethyl-maltol',
  'maltodextrin-bulk': 'maltodextrin-de10-15',
  'sodium-tripolyphosphate': 'sodium-tripolyphosphate-bulk',
};

export function productFacts(slug: string, locale: Locale): string | null {
  const key = PRODUCT_FACTS[slug] ? slug : FACT_ALIASES[slug];
  return (key && PRODUCT_FACTS[key]?.[locale]) ?? null;
}
