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
  // ── Efir moylari: botanik nomi, olinish usuli (umumiy), asosiy komponentlari ──
  'bergamot-essential-oil': {
    uz: 'Bergamot efir moyi (Citrus bergamia) bergamot mevasining po‘stini sovuq presslash orqali olinadi. Asosiy komponentlari — limonen, linalilatsetat va linalool; hidi yangi sitrus-gulli. Earl Grey choyi ta’mida, ichimliklarda, odekolon va kosmetika otdushkalarida ishlatiladi.',
    ru: 'Эфирное масло бергамота (Citrus bergamia) получают холодным прессованием кожуры плодов бергамота. Основные компоненты — лимонен, линалилацетат и линалоол; запах свежий цитрусово-цветочный. Используется во вкусе чая Earl Grey, напитках, одеколонах и отдушках для косметики.',
    en: 'Bergamot essential oil (Citrus bergamia) is obtained by cold-pressing the peel of bergamot fruit. Its main components are limonene, linalyl acetate and linalool, giving a fresh citrus-floral odour. It is used in Earl Grey tea flavour, beverages, colognes and cosmetic fragrances.',
  },
  'cinnamon-bark-essential-oil': {
    uz: 'Dolchin po‘stlog‘i efir moyi (Cinnamomum verum, seylon dolchini) daraxt po‘stlog‘idan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponenti — sinnamaldegid, unga issiq, shirin-achchiq ziravor hidi xos. Pishiriq, qandolat, ichimliklar va og‘iz bo‘shlig‘i gigiyenasi vositalarida qo‘llanadi.',
    ru: 'Эфирное масло коры корицы (Cinnamomum verum, цейлонская корица) получают перегонкой коры с водяным паром. Основной компонент — коричный альдегид, отсюда тёплый сладко-пряный запах. Применяется в выпечке, кондитерских изделиях, напитках и средствах для полости рта.',
    en: 'Cinnamon bark essential oil (Cinnamomum verum, Ceylon cinnamon) is obtained by steam distillation of the bark. Its main component is cinnamaldehyde, which gives the warm, sweet-spicy odour. It is used in bakery, confectionery, beverages and oral-care products.',
  },
  'clove-essential-oil': {
    uz: 'Qaranfil efir moyi (Syzygium aromaticum) qaranfil daraxtining gul kurtaklari, barglari yoki poyalaridan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponenti — evgenol; hidi issiq, ziravorli. Stomatologiya va og‘iz gigiyenasi vositalarida, farmatsevtikada, atirchilik va maishiy kimyo otdushkalarida ishlatiladi.',
    ru: 'Эфирное масло гвоздики (Syzygium aromaticum) получают перегонкой с водяным паром из бутонов, листьев или стеблей гвоздичного дерева. Основной компонент — эвгенол; запах тёплый, пряный. Применяется в стоматологических средствах и средствах для полости рта, фармацевтике, парфюмерии и отдушках для бытовой химии.',
    en: 'Clove essential oil (Syzygium aromaticum) is steam-distilled from the buds, leaves or stems of the clove tree. Its main component is eugenol, giving a warm, spicy odour. It is used in dental and oral-care products, pharmaceuticals, perfumery and household-product fragrances.',
  },
  'sweet-orange-essential-oil': {
    uz: 'Shirin apelsin efir moyi (Citrus sinensis) apelsin po‘stini sovuq presslash orqali olinadi. Tarkibining asosiy qismi — limonen; hidi shirin, mevali-sitrusli. Ichimliklar, qandolat, sitrus aromatizatorlari, tozalash vositalari va kosmetikada qo‘llanadi.',
    ru: 'Эфирное масло сладкого апельсина (Citrus sinensis) получают холодным прессованием апельсиновой кожуры. Основная часть состава — лимонен; запах сладкий, фруктово-цитрусовый. Применяется в напитках, кондитерских изделиях, цитрусовых ароматизаторах, чистящих средствах и косметике.',
    en: 'Sweet orange essential oil (Citrus sinensis) is obtained by cold-pressing orange peel. Limonene makes up most of its composition, giving a sweet, fruity citrus odour. It is used in beverages, confectionery, citrus flavours, cleaning products and cosmetics.',
  },
  'orange-terpenes': {
    uz: 'Apelsin terpenlari — apelsin moyini konsentratsiyalash (terpensizlantirish) va sharbat ishlab chiqarishda ajraladigan terpen fraksiyasi; asosan d-limonendan iborat. Tabiiy erituvchi va sitrus hid beruvchi sifatida tozalash, yog‘ ketkazuvchi vositalar va kir yuvish mahsulotlarida ishlatiladi.',
    ru: 'Терпены апельсина — терпеновая фракция, которая отделяется при концентрировании (детерпенизации) апельсинового масла и производстве сока; состоят в основном из d-лимонена. Используются как натуральный растворитель и цитрусовая отдушка в чистящих и обезжиривающих средствах и средствах для стирки.',
    en: 'Orange terpenes are the terpene fraction separated when orange oil is concentrated (deterpenated) and during juice production; they consist mainly of d-limonene. They are used as a natural solvent and citrus scent in cleaners, degreasers and laundry products.',
  },
  'garlic-essential-oil': {
    uz: 'Sarimsoq efir moyi (Allium sativum) sarimsoq boshlaridan bug‘ bilan distillyatsiya qilib olinadi. Tarkibida oltingugurtli birikmalar (diallil disulfid, diallil trisulfid) ustun, shu sababli juda kuchli va oz miqdorda qo‘llanadi. Souslar, go‘sht mahsulotlari, tuzli aromatizatorlar va biologik faol qo‘shimchalarda ishlatiladi.',
    ru: 'Эфирное масло чеснока (Allium sativum) получают перегонкой головок чеснока с водяным паром. В составе преобладают серосодержащие соединения (диаллилдисульфид, диаллилтрисульфид), поэтому масло очень сильное и вводится в малых количествах. Применяется в соусах, мясных продуктах, солёных ароматизаторах и БАД.',
    en: 'Garlic essential oil (Allium sativum) is obtained by steam distillation of garlic bulbs. It is dominated by sulphur compounds (diallyl disulphide, diallyl trisulphide), so it is very strong and used in small amounts. It is used in sauces, meat products, savoury flavours and dietary supplements.',
  },
  'grapefruit-essential-oil': {
    uz: 'Greyfurt efir moyi (Citrus paradisi) greyfurt po‘stini sovuq presslash orqali olinadi. Asosiy komponenti — limonen; greyfurtga xos achchiqroq notani oz miqdordagi nootkaton beradi. Ichimliklar, sitrus aromatizatorlari, atirchilik va kosmetikada qo‘llanadi.',
    ru: 'Эфирное масло грейпфрута (Citrus paradisi) получают холодным прессованием кожуры грейпфрута. Основной компонент — лимонен; характерную горьковатую грейпфрутовую ноту даёт нооткатон в небольшом количестве. Применяется в напитках, цитрусовых ароматизаторах, парфюмерии и косметике.',
    en: 'Grapefruit essential oil (Citrus paradisi) is obtained by cold-pressing grapefruit peel. Its main component is limonene, while small amounts of nootkatone give the characteristic slightly bitter grapefruit note. It is used in beverages, citrus flavours, perfumery and cosmetics.',
  },
  'lemon-essential-oil': {
    uz: 'Limon efir moyi (Citrus limon) limon po‘stini sovuq presslash orqali olinadi. Asosiy qismi — limonen, limonga xos notani esa sitral (geranial va neral) beradi. Ichimliklar, qandolat, limon aromatizatorlari, tozalash vositalari va kosmetikada ishlatiladi.',
    ru: 'Эфирное масло лимона (Citrus limon) получают холодным прессованием лимонной кожуры. Основная часть — лимонен, а характерную лимонную ноту даёт цитраль (гераниаль и нераль). Используется в напитках, кондитерских изделиях, лимонных ароматизаторах, чистящих средствах и косметике.',
    en: 'Lemon essential oil (Citrus limon) is obtained by cold-pressing lemon peel. Limonene is the main component, while citral (geranial and neral) provides the characteristic lemon note. It is used in beverages, confectionery, lemon flavours, cleaning products and cosmetics.',
  },
  'lime-terpenes': {
    uz: 'Laym terpenlari — laym moyini konsentratsiyalashda ajraladigan terpen fraksiyasi; asosan limonen va boshqa monoterpenlardan iborat. Ichimliklarda sitrus nota berish uchun, shuningdek tozalash vositalarida tabiiy erituvchi va hid beruvchi sifatida qo‘llanadi.',
    ru: 'Терпены лайма — терпеновая фракция, отделяемая при концентрировании масла лайма; состоят в основном из лимонена и других монотерпенов. Применяются для цитрусовой ноты в напитках, а также как натуральный растворитель и отдушка в чистящих средствах.',
    en: 'Lime terpenes are the terpene fraction separated when lime oil is concentrated; they consist mainly of limonene and other monoterpenes. They are used to add a citrus note to beverages and as a natural solvent and scent in cleaning products.',
  },
  'peppermint-essential-oil': {
    uz: 'Qalampir yalpiz (pipermint) efir moyi (Mentha × piperita) o‘simlikning yer usti qismidan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponentlari — mentol va menton, ular sovituvchi ta’sir beradi. Saqich, konfet, tish pastasi, og‘iz chayish vositalari va farmatsevtikada ishlatiladi.',
    ru: 'Эфирное масло перечной мяты (Mentha × piperita) получают перегонкой надземной части растения с водяным паром. Основные компоненты — ментол и ментон, которые дают холодящий эффект. Используется в жевательной резинке, конфетах, зубных пастах, ополаскивателях для рта и фармацевтике.',
    en: 'Peppermint essential oil (Mentha × piperita) is obtained by steam distillation of the aerial parts of the plant. Its main components are menthol and menthone, which give the cooling effect. It is used in chewing gum, sweets, toothpaste, mouthwash and pharmaceuticals.',
  },
  'spearmint-essential-oil': {
    uz: 'Yashil (boshoqli) yalpiz efir moyi (Mentha spicata) o‘simlikdan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponenti — L-karvon; mentoli kam bo‘lgani uchun qalampir yalpizdan yumshoqroq va shirinroq. Saqich, konfet, tish pastasi va ichimliklarda qo‘llanadi.',
    ru: 'Эфирное масло мяты колосковой (Mentha spicata) получают перегонкой растения с водяным паром. Основной компонент — L-карвон; ментола в нём мало, поэтому вкус мягче и слаще, чем у перечной мяты. Применяется в жевательной резинке, конфетах, зубных пастах и напитках.',
    en: 'Spearmint essential oil (Mentha spicata) is obtained by steam distillation of the plant. Its main component is L-carvone; it contains little menthol, so it is softer and sweeter than peppermint. It is used in chewing gum, sweets, toothpaste and beverages.',
  },
  'aniseed-essential-oil': {
    uz: 'Anis efir moyi (Pimpinella anisum) anis urug‘idan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponenti — trans-anetol, shirin qizilmiya-anis hidini beradi; salqin haroratda qotib qolishi mumkin (ishlatishdan oldin ozgina isitiladi). Pishiriq, qandolat, likyorlar va yo‘talga qarshi vositalarda ishlatiladi.',
    ru: 'Эфирное масло аниса (Pimpinella anisum) получают перегонкой семян аниса с водяным паром. Основной компонент — транс-анетол, дающий сладкий анисово-лакричный запах; при прохладной температуре масло может застывать (перед применением слегка подогревают). Используется в выпечке, кондитерских изделиях, ликёрах и средствах от кашля.',
    en: 'Aniseed essential oil (Pimpinella anisum) is obtained by steam distillation of anise seeds. Its main component is trans-anethole, giving a sweet anise-liquorice odour; the oil may solidify at cool temperatures and is gently warmed before use. It is used in bakery, confectionery, liqueurs and cough remedies.',
  },
  'geranium-essential-oil': {
    uz: 'Geran efir moyi (Pelargonium graveolens) o‘simlik barglari va poyalaridan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponentlari — sitronellol va geraniol, hidi atirgulsimon-yashil. Atirchilik, sovun, krem va maishiy kimyo otdushkalarida qo‘llanadi.',
    ru: 'Эфирное масло герани (Pelargonium graveolens) получают перегонкой листьев и стеблей растения с водяным паром. Основные компоненты — цитронеллол и гераниол; запах розово-зелёный. Применяется в парфюмерии, мыле, кремах и отдушках для бытовой химии.',
    en: 'Geranium essential oil (Pelargonium graveolens) is obtained by steam distillation of the leaves and stems. Its main components are citronellol and geraniol, giving a rosy-green odour. It is used in perfumery, soap, creams and household-product fragrances.',
  },
  'cardamom-essential-oil': {
    uz: 'Kardamon efir moyi (Elettaria cardamomum) kardamon urug‘idan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponentlari — 1,8-sineol va alfa-terpinilatsetat; hidi issiq, ziravorli-kamforali. Qahva va choy ichimliklari, pishiriq, qandolat va farmatsevtikada ishlatiladi.',
    ru: 'Эфирное масло кардамона (Elettaria cardamomum) получают перегонкой семян кардамона с водяным паром. Основные компоненты — 1,8-цинеол и альфа-терпинилацетат; запах тёплый, пряно-камфорный. Используется в кофейных и чайных напитках, выпечке, кондитерских изделиях и фармацевтике.',
    en: 'Cardamom essential oil (Elettaria cardamomum) is obtained by steam distillation of cardamom seeds. Its main components are 1,8-cineole and alpha-terpinyl acetate, giving a warm, spicy-camphoraceous odour. It is used in coffee and tea drinks, bakery, confectionery and pharmaceuticals.',
  },
  'sandalwood-essential-oil': {
    uz: 'Sandal efir moyi sandal daraxti (Santalum turkumi, masalan S. album) o‘zak yog‘ochidan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponentlari — alfa- va beta-santalol; hidi kremsimon, yumshoq-yog‘ochli va uzoq saqlanadi. Atirchilikda baza notasi va mustahkamlovchi sifatida, kosmetikada ishlatiladi.',
    ru: 'Эфирное масло сандала получают перегонкой с водяным паром сердцевинной древесины сандалового дерева (род Santalum, например S. album). Основные компоненты — альфа- и бета-санталол; запах сливочный, мягко-древесный и стойкий. В парфюмерии служит базовой нотой и фиксатором, применяется в косметике.',
    en: 'Sandalwood essential oil is steam-distilled from the heartwood of sandalwood trees (genus Santalum, for example S. album). Its main components are alpha- and beta-santalol, giving a creamy, soft-woody and long-lasting odour. It is used in perfumery as a base note and fixative, and in cosmetics.',
  },
  'cedarwood-essential-oil': {
    uz: 'Kedr efir moyi savdoda odatda archa turidagi (Juniperus) yoki atlas kedri (Cedrus atlantica) yog‘ochidan bug‘ bilan distillyatsiya qilib olinadi. Tarkibida seskviterpenlar (sedrol, sedren) ustun; hidi quruq-yog‘ochli. Atirchilik, sovun va maishiy kimyo otdushkalarida ishlatiladi. Kedr yong‘og‘idan olinadigan oziq-ovqat yog‘i bilan adashtirmang.',
    ru: 'Эфирное масло кедра в торговле обычно получают перегонкой с водяным паром древесины можжевельника (род Juniperus) или атласского кедра (Cedrus atlantica). В составе преобладают сесквитерпены (цедрол, цедрен); запах сухой древесный. Применяется в парфюмерии, мыле и отдушках для бытовой химии. Не путать с пищевым кедровым маслом из орехов.',
    en: 'Commercial cedarwood essential oil is usually steam-distilled from the wood of juniper species (genus Juniperus) or Atlas cedar (Cedrus atlantica). It is dominated by sesquiterpenes (cedrol, cedrene) and has a dry, woody odour. It is used in perfumery, soap and household-product fragrances.',
  },
  'lavender-essential-oil': {
    uz: 'Lavanda efir moyi (Lavandula angustifolia) gullagan uchki qismlaridan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponentlari — linalool va linalilatsetat; hidi gulli-o‘tli, tinchlantiruvchi. Sovun, krem, shampun, kir yuvish vositalari va maishiy kimyo otdushkalarida qo‘llanadi.',
    ru: 'Эфирное масло лаванды (Lavandula angustifolia) получают перегонкой цветущих верхушек с водяным паром. Основные компоненты — линалоол и линалилацетат; запах цветочно-травянистый. Применяется в мыле, кремах, шампунях, средствах для стирки и отдушках для бытовой химии.',
    en: 'Lavender essential oil (Lavandula angustifolia) is obtained by steam distillation of the flowering tops. Its main components are linalool and linalyl acetate, giving a floral-herbaceous odour. It is used in soap, creams, shampoos, laundry products and household-product fragrances.',
  },
  'betel-leaf-essential-oil': {
    uz: 'Betel bargi efir moyi (Piper betle) betel barglaridan bug‘ bilan distillyatsiya qilib olinadi. Tarkibida fenol birikmalari (xavibetol, evgenol) ustun; hidi ziravorli, qalampirsimon-yashil. Og‘iz gigiyenasi vositalari, farmatsevtika va atirchilikda ishlatiladi.',
    ru: 'Эфирное масло листа бетеля (Piper betle) получают перегонкой листьев бетеля с водяным паром. В составе преобладают фенольные соединения (хавибетол, эвгенол); запах пряный, перечно-зелёный. Применяется в средствах для полости рта, фармацевтике и парфюмерии.',
    en: 'Betel leaf essential oil (Piper betle) is obtained by steam distillation of betel leaves. It is dominated by phenolic compounds (chavibetol, eugenol) and has a spicy, peppery-green odour. It is used in oral-care products, pharmaceuticals and perfumery.',
  },
  'rose-essential-oil': {
    uz: 'Atirgul efir moyi (Rosa damascena, damask atirguli) gul barglaridan bug‘ bilan distillyatsiya qilib olinadi; bir kilogramm moy uchun tonnalab gul kerak bo‘ladi. Asosiy komponentlari — sitronellol, geraniol va nerol; tarkibidagi mumsimon moddalar tufayli salqinda qotishi mumkin. Nafis atirchilik va premium kosmetikada ishlatiladi.',
    ru: 'Эфирное масло розы (Rosa damascena, дамасская роза) получают перегонкой лепестков с водяным паром; на килограмм масла уходят тонны цветков. Основные компоненты — цитронеллол, гераниол и нерол; из-за восковых веществ в прохладе масло может застывать. Используется в селективной парфюмерии и премиальной косметике.',
    en: 'Rose essential oil (Rosa damascena, Damask rose) is obtained by steam distillation of the petals; tonnes of flowers are needed for one kilogram of oil. Its main components are citronellol, geraniol and nerol, and its waxy constituents can make it solidify when cool. It is used in fine perfumery and premium cosmetics.',
  },
  'eucalyptus-essential-oil': {
    uz: 'Evkalipt efir moyi (Eucalyptus globulus) barglardan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponenti — 1,8-sineol (evkaliptol); hidi yangi, kamforali. Ingalyatsiya va yo‘talga qarshi vositalar, og‘iz gigiyenasi, tozalash vositalari va kosmetikada qo‘llanadi.',
    ru: 'Эфирное масло эвкалипта (Eucalyptus globulus) получают перегонкой листьев с водяным паром. Основной компонент — 1,8-цинеол (эвкалиптол); запах свежий, камфорный. Применяется в средствах для ингаляций и от кашля, средствах для полости рта, чистящих средствах и косметике.',
    en: 'Eucalyptus essential oil (Eucalyptus globulus) is obtained by steam distillation of the leaves. Its main component is 1,8-cineole (eucalyptol), giving a fresh, camphoraceous odour. It is used in inhalation and cough products, oral care, cleaning products and cosmetics.',
  },
  'cassia-essential-oil': {
    uz: 'Kassiya efir moyi (Cinnamomum cassia, xitoy dolchini) barglar, novdalar va po‘stloqdan bug‘ bilan distillyatsiya qilib olinadi. Tarkibining katta qismi — sinnamaldegid; hidi seylon dolchinidan qattiqroq va issiqroq. Kola tipidagi ichimliklar, pishiriq, qandolat va maishiy kimyo otdushkalarida ishlatiladi.',
    ru: 'Эфирное масло кассии (Cinnamomum cassia, китайская корица) получают перегонкой листьев, веточек и коры с водяным паром. Большая часть состава — коричный альдегид; запах резче и теплее, чем у цейлонской корицы. Используется в напитках типа колы, выпечке, кондитерских изделиях и отдушках для бытовой химии.',
    en: 'Cassia essential oil (Cinnamomum cassia, Chinese cinnamon) is steam-distilled from the leaves, twigs and bark. Most of its composition is cinnamaldehyde, giving a harsher, warmer odour than Ceylon cinnamon. It is used in cola-type drinks, bakery, confectionery and household-product fragrances.',
  },
  'neroli-essential-oil': {
    uz: 'Neroli efir moyi achchiq apelsin (Citrus × aurantium) gullaridan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponentlari — linalool, limonen va linalilatsetat; hidi nafis gulli-sitrus. Odekolon, nafis atirchilik va premium kosmetikada qo‘llanadi.',
    ru: 'Эфирное масло нероли получают перегонкой цветков горького апельсина (Citrus × aurantium) с водяным паром. Основные компоненты — линалоол, лимонен и линалилацетат; запах изысканный цветочно-цитрусовый. Применяется в одеколонах, селективной парфюмерии и премиальной косметике.',
    en: 'Neroli essential oil is obtained by steam distillation of bitter orange blossoms (Citrus × aurantium). Its main components are linalool, limonene and linalyl acetate, giving a refined floral-citrus odour. It is used in colognes, fine perfumery and premium cosmetics.',
  },
  'lemongrass-essential-oil': {
    uz: 'Limon o‘ti (lemongrass) efir moyi (Cymbopogon flexuosus yoki C. citratus) o‘simlik barglaridan bug‘ bilan distillyatsiya qilib olinadi. Tarkibining asosiy qismi — sitral, shuning uchun kuchli limonsimon hidga ega. Sovun, kir yuvish va tozalash vositalari, kosmetika va ichimliklarda ishlatiladi.',
    ru: 'Эфирное масло лемонграсса (Cymbopogon flexuosus или C. citratus) получают перегонкой листьев растения с водяным паром. Основная часть состава — цитраль, поэтому запах интенсивно лимонный. Используется в мыле, средствах для стирки и уборки, косметике и напитках.',
    en: 'Lemongrass essential oil (Cymbopogon flexuosus or C. citratus) is obtained by steam distillation of the leaves. Most of its composition is citral, which gives the intense lemony odour. It is used in soap, laundry and cleaning products, cosmetics and beverages.',
  },
  'tea-tree-essential-oil': {
    uz: 'Choy daraxti efir moyi (Melaleuca alternifolia) barglardan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponenti — terpinen-4-ol; hidi yangi, dorivor-kamforali. Teri va soch parvarishi vositalari, shampunlar, gigiyena va tozalash vositalarida qo‘llanadi.',
    ru: 'Эфирное масло чайного дерева (Melaleuca alternifolia) получают перегонкой листьев с водяным паром. Основной компонент — терпинен-4-ол; запах свежий, лекарственно-камфорный. Применяется в средствах ухода за кожей и волосами, шампунях, гигиенических и чистящих средствах.',
    en: 'Tea tree essential oil (Melaleuca alternifolia) is obtained by steam distillation of the leaves. Its main component is terpinen-4-ol, giving a fresh, medicinal-camphoraceous odour. It is used in skin- and hair-care products, shampoos, hygiene and cleaning products.',
  },
  'ylang-ylang-essential-oil': {
    uz: 'Ilang-ilang efir moyi (Cananga odorata) gullardan bug‘ bilan bosqichma-bosqich distillyatsiya qilib olinadi (fraksiyalar: Extra, I, II, III, complete). Tarkibida linalool, germakren D va benzilatsetat bor; hidi shirin, ekzotik-gulli. Atirchilik, sovun va kosmetikada ishlatiladi.',
    ru: 'Эфирное масло иланг-иланга (Cananga odorata) получают фракционной перегонкой цветков с водяным паром (фракции Extra, I, II, III, complete). В составе — линалоол, гермакрен D и бензилацетат; запах сладкий, экзотически-цветочный. Используется в парфюмерии, мыле и косметике.',
    en: 'Ylang-ylang essential oil (Cananga odorata) is obtained by fractional steam distillation of the flowers (grades Extra, I, II, III and complete). It contains linalool, germacrene D and benzyl acetate, giving a sweet, exotic floral odour. It is used in perfumery, soap and cosmetics.',
  },
  'patchouli-essential-oil': {
    uz: 'Pachuli efir moyi (Pogostemon cablin) quritilgan barglardan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponenti — patchulol (pachuli spirti); hidi tuproqsimon-yog‘ochli, vaqt o‘tishi bilan yumshab boradi. Atirchilikda baza notasi va mustahkamlovchi sifatida, sovun va kosmetikada qo‘llanadi.',
    ru: 'Эфирное масло пачули (Pogostemon cablin) получают перегонкой высушенных листьев с водяным паром. Основной компонент — пачулол (пачулиевый спирт); запах землисто-древесный, со временем становится мягче. В парфюмерии служит базовой нотой и фиксатором, применяется в мыле и косметике.',
    en: 'Patchouli essential oil (Pogostemon cablin) is obtained by steam distillation of dried leaves. Its main component is patchoulol (patchouli alcohol), giving an earthy-woody odour that mellows with age. It is used in perfumery as a base note and fixative, and in soap and cosmetics.',
  },
  'vetiver-essential-oil': {
    uz: 'Vetiver efir moyi (Chrysopogon zizanioides) o‘simlik ildizlaridan bug‘ bilan distillyatsiya qilib olinadi. Tarkibida seskviterpen spirtlari va ketonlar (vetiverollar, xusimol, vetivonlar) bor; moy quyuq, hidi tutunsimon-tuproqli va juda uzoq saqlanadi. Atirchilikda baza notasi va mustahkamlovchi sifatida ishlatiladi.',
    ru: 'Эфирное масло ветивера (Chrysopogon zizanioides) получают перегонкой корней растения с водяным паром. В составе — сесквитерпеновые спирты и кетоны (ветиверолы, кузимол, ветивоны); масло густое, запах дымно-землистый и очень стойкий. В парфюмерии служит базовой нотой и фиксатором.',
    en: 'Vetiver essential oil (Chrysopogon zizanioides) is obtained by steam distillation of the roots. It contains sesquiterpene alcohols and ketones (vetiverols, khusimol, vetivones); the oil is viscous, with a smoky-earthy and very long-lasting odour. It is used in perfumery as a base note and fixative.',
  },
  'jasmine-absolute': {
    uz: 'Yasmin absolyuti (Jasminum grandiflorum yoki J. sambac) bug‘ distillyatsiyasi bilan emas, erituvchi ekstraksiyasi bilan olinadi: avval gullardan konkret, undan spirt yordamida absolyut ajratiladi. Tarkibida benzilatsetat, benzilbenzoat, linalool, indol va sis-jasmon bor. Nafis atirchilikda gulli kompozitsiyalarning yuragi sifatida ishlatiladi.',
    ru: 'Абсолют жасмина (Jasminum grandiflorum или J. sambac) получают не перегонкой, а экстракцией растворителем: сначала из цветков получают конкрет, затем из него спиртом — абсолют. В составе — бензилацетат, бензилбензоат, линалоол, индол и цис-жасмон. Используется в селективной парфюмерии как сердце цветочных композиций.',
    en: 'Jasmine absolute (Jasminum grandiflorum or J. sambac) is produced by solvent extraction rather than distillation: the flowers first yield a concrete, from which the absolute is extracted with alcohol. It contains benzyl acetate, benzyl benzoate, linalool, indole and cis-jasmone. It is used in fine perfumery as the heart of floral compositions.',
  },
  'ginger-essential-oil': {
    uz: 'Zanjabil efir moyi (Zingiber officinale) quritilgan ildizpoyadan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponenti — zingiberen; moy zanjabil hidini beradi, achchiqligini esa bermaydi (achchiq gingerollar oleorezinda qoladi). Ichimliklar, go‘sht mahsulotlari, ziravor aromatizatorlari va farmatsevtikada qo‘llanadi.',
    ru: 'Эфирное масло имбиря (Zingiber officinale) получают перегонкой высушенного корневища с водяным паром. Основной компонент — зингиберен; масло передаёт аромат имбиря, но не жгучесть (жгучие гингеролы остаются в олеорезине). Применяется в напитках, мясных продуктах, пряных ароматизаторах и фармацевтике.',
    en: 'Ginger essential oil (Zingiber officinale) is obtained by steam distillation of the dried rhizome. Its main component is zingiberene; the oil carries the aroma of ginger but not its pungency, as the pungent gingerols remain in the oleoresin. It is used in beverages, meat products, spice flavours and pharmaceuticals.',
  },
  'basil-essential-oil': {
    uz: 'Reyhon efir moyi (Ocimum basilicum) o‘simlikning yer usti qismidan bug‘ bilan distillyatsiya qilib olinadi. Xemotipiga qarab asosiy komponenti linalool yoki metilxavikol (estragol) bo‘ladi; hidi yashil, ziravorli-shirin. Souslar, italyan tipidagi ziravor aromatizatorlari va atirchilikda ishlatiladi.',
    ru: 'Эфирное масло базилика (Ocimum basilicum) получают перегонкой надземной части растения с водяным паром. В зависимости от хемотипа основной компонент — линалоол или метилхавикол (эстрагол); запах зелёный, пряно-сладкий. Используется в соусах, пряных ароматизаторах итальянского типа и парфюмерии.',
    en: 'Basil essential oil (Ocimum basilicum) is obtained by steam distillation of the aerial parts. Depending on the chemotype, its main component is linalool or methyl chavicol (estragole), giving a green, sweet-spicy odour. It is used in sauces, Italian-style spice flavours and perfumery.',
  },
  'oregano-essential-oil': {
    uz: 'Oregano efir moyi (Origanum turkumi, masalan O. vulgare) gullagan o‘tdan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponenti — karvakrol, oz miqdorda timol; hidi kuchli, issiq-ziravorli. Souslar, pitsa ziravorlari, go‘sht mahsulotlari va biologik faol qo‘shimchalarda qo‘llanadi.',
    ru: 'Эфирное масло орегано (род Origanum, например O. vulgare) получают перегонкой цветущей травы с водяным паром. Основной компонент — карвакрол, в меньшем количестве тимол; запах сильный, тёпло-пряный. Применяется в соусах, приправах для пиццы, мясных продуктах и БАД.',
    en: 'Oregano essential oil (genus Origanum, for example O. vulgare) is obtained by steam distillation of the flowering herb. Its main component is carvacrol, with smaller amounts of thymol, giving a strong, warm-spicy odour. It is used in sauces, pizza seasonings, meat products and dietary supplements.',
  },
  'thyme-essential-oil': {
    uz: 'Timyan (tog‘ jambili) efir moyi (Thymus vulgaris) gullagan o‘tdan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponenti — timol, shuningdek p-simen va karvakrol; hidi issiq, o‘tli-dorivor. Go‘sht mahsulotlari, souslar, og‘iz gigiyenasi vositalari va biologik faol qo‘shimchalarda ishlatiladi.',
    ru: 'Эфирное масло тимьяна (чабреца) (Thymus vulgaris) получают перегонкой цветущей травы с водяным паром. Основной компонент — тимол, также п-цимол и карвакрол; запах тёплый, травянисто-лекарственный. Используется в мясных продуктах, соусах, средствах для полости рта и БАД.',
    en: 'Thyme essential oil (Thymus vulgaris) is obtained by steam distillation of the flowering herb. Its main component is thymol, together with p-cymene and carvacrol, giving a warm, herbal-medicinal odour. It is used in meat products, sauces, oral-care products and dietary supplements.',
  },
  'rosemary-essential-oil': {
    uz: 'Rozmarin efir moyi (Salvia rosmarinus, avval Rosmarinus officinalis) barglar va gullagan uchki qismlardan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponentlari — 1,8-sineol, kamfora va alfa-pinen; hidi yangi, o‘tli-kamforali. Go‘sht mahsulotlari, souslar va soch parvarishi kosmetikasida qo‘llanadi. Go‘shtda antioksidant sifatida ishlatiladigan rozmarin ekstrakti (karnoz kislota) — boshqa mahsulot.',
    ru: 'Эфирное масло розмарина (Salvia rosmarinus, ранее Rosmarinus officinalis) получают перегонкой листьев и цветущих верхушек с водяным паром. Основные компоненты — 1,8-цинеол, камфора и альфа-пинен; запах свежий, травянисто-камфорный. Применяется в мясных продуктах, соусах и косметике для волос. Экстракт розмарина (карнозовая кислота), который используют в мясе как антиоксидант, — другой продукт.',
    en: 'Rosemary essential oil (Salvia rosmarinus, formerly Rosmarinus officinalis) is obtained by steam distillation of the leaves and flowering tops. Its main components are 1,8-cineole, camphor and alpha-pinene, giving a fresh, herbal-camphoraceous odour. It is used in meat products, sauces and hair-care cosmetics. Rosemary extract (carnosic acid), used in meat as an antioxidant, is a different product.',
  },
  'nutmeg-essential-oil': {
    uz: 'Muskat yong‘og‘i efir moyi (Myristica fragrans) urug‘lardan bug‘ bilan distillyatsiya qilib olinadi. Tarkibida sabinen, alfa- va beta-pinen hamda miristitsin bor; hidi issiq, shirin-ziravorli. Pishiriq, kolbasa va boshqa go‘sht mahsulotlari, kola tipidagi ichimliklar va farmatsevtikada ishlatiladi.',
    ru: 'Эфирное масло мускатного ореха (Myristica fragrans) получают перегонкой семян с водяным паром. В составе — сабинен, альфа- и бета-пинен и миристицин; запах тёплый, сладко-пряный. Используется в выпечке, колбасах и других мясных продуктах, напитках типа колы и фармацевтике.',
    en: 'Nutmeg essential oil (Myristica fragrans) is obtained by steam distillation of the seeds. It contains sabinene, alpha- and beta-pinene and myristicin, giving a warm, sweet-spicy odour. It is used in bakery, sausages and other meat products, cola-type drinks and pharmaceuticals.',
  },
  'coriander-seed-essential-oil': {
    uz: 'Koriandr urug‘i efir moyi (Coriandrum sativum) maydalangan urug‘lardan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponenti — linalool; hidi shirin, gulli-ziravorli (kashnich bargining hidi emas). Kolbasa va go‘sht mahsulotlari, souslar, pishiriq va atirchilikda qo‘llanadi.',
    ru: 'Эфирное масло семян кориандра (Coriandrum sativum) получают перегонкой измельчённых семян с водяным паром. Основной компонент — линалоол; запах сладкий, цветочно-пряный (не похож на запах зелени кинзы). Применяется в колбасах и мясных продуктах, соусах, выпечке и парфюмерии.',
    en: 'Coriander seed essential oil (Coriandrum sativum) is obtained by steam distillation of crushed seeds. Its main component is linalool, giving a sweet, floral-spicy odour unlike that of coriander leaf. It is used in sausages and meat products, sauces, bakery and perfumery.',
  },
  'black-pepper-essential-oil': {
    uz: 'Qora murch efir moyi (Piper nigrum) quritilgan mevalardan bug‘ bilan distillyatsiya qilib olinadi. Tarkibida beta-kariofillen, limonen, sabinen va pinenlar bor; moy murch hidini beradi, achchiqligini esa bermaydi (piperin oleorezinda qoladi). Go‘sht mahsulotlari, souslar, ziravor aromatizatorlari va atirchilikda ishlatiladi.',
    ru: 'Эфирное масло чёрного перца (Piper nigrum) получают перегонкой высушенных плодов с водяным паром. В составе — бета-кариофиллен, лимонен, сабинен и пинены; масло передаёт аромат перца, но не жгучесть (пиперин остаётся в олеорезине). Используется в мясных продуктах, соусах, пряных ароматизаторах и парфюмерии.',
    en: 'Black pepper essential oil (Piper nigrum) is obtained by steam distillation of the dried fruits. It contains beta-caryophyllene, limonene, sabinene and pinenes; the oil carries the aroma of pepper but not its pungency, as piperine remains in the oleoresin. It is used in meat products, sauces, spice flavours and perfumery.',
  },
  'turmeric-essential-oil': {
    uz: 'Zardachob efir moyi (Curcuma longa) ildizpoyadan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponentlari — ar-turmeron va turmeronlar; moy hid beradi, lekin sariq rang bermaydi (bo‘yovchi kurkumin uchmaydi va moyga o‘tmaydi). Souslar, go‘sht mahsulotlari, ziravor aromatizatorlari va biologik faol qo‘shimchalarda qo‘llanadi.',
    ru: 'Эфирное масло куркумы (Curcuma longa) получают перегонкой корневища с водяным паром. Основные компоненты — ар-турмерон и турмероны; масло даёт аромат, но не жёлтый цвет (красящий куркумин нелетуч и в масло не переходит). Применяется в соусах, мясных продуктах, пряных ароматизаторах и БАД.',
    en: 'Turmeric essential oil (Curcuma longa) is obtained by steam distillation of the rhizome. Its main components are ar-turmerone and turmerones; the oil gives aroma but not yellow colour, because the colouring curcumin is non-volatile and does not pass into the oil. It is used in sauces, meat products, spice flavours and dietary supplements.',
  },
  'cumin-essential-oil': {
    uz: 'Zira efir moyi (Cuminum cyminum) urug‘lardan bug‘ bilan distillyatsiya qilib olinadi. Asosiy komponenti — kuminaldegid, shuningdek gamma-terpinen va beta-pinen; hidi kuchli, issiq-ziravorli. Go‘sht mahsulotlari, souslar, ziravor aralashmalari va pishiriqda ishlatiladi.',
    ru: 'Эфирное масло зиры (кумина, Cuminum cyminum) получают перегонкой семян с водяным паром. Основной компонент — куминальдегид, также гамма-терпинен и бета-пинен; запах сильный, тёпло-пряный. Используется в мясных продуктах, соусах, пряных смесях и выпечке.',
    en: 'Cumin essential oil (Cuminum cyminum) is obtained by steam distillation of the seeds. Its main component is cuminaldehyde, together with gamma-terpinene and beta-pinene, giving a strong, warm-spicy odour. It is used in meat products, sauces, spice blends and bakery.',
  },
  'mandarin-essential-oil': {
    uz: 'Mandarin efir moyi (Citrus reticulata) mandarin po‘stini sovuq presslash orqali olinadi. Asosiy qismi — limonen va gamma-terpinen; mandaringa xos shirin notani oz miqdordagi metil-N-metilantranilat beradi. Ichimliklar, qandolat, sitrus aromatizatorlari va kosmetikada qo‘llanadi.',
    ru: 'Эфирное масло мандарина (Citrus reticulata) получают холодным прессованием кожуры мандарина. Основная часть — лимонен и гамма-терпинен; характерную сладкую мандариновую ноту даёт метил-N-метилантранилат в небольшом количестве. Применяется в напитках, кондитерских изделиях, цитрусовых ароматизаторах и косметике.',
    en: 'Mandarin essential oil (Citrus reticulata) is obtained by cold-pressing mandarin peel. It consists mainly of limonene and gamma-terpinene, while small amounts of methyl N-methylanthranilate give the characteristic sweet mandarin note. It is used in beverages, confectionery, citrus flavours and cosmetics.',
  },
  'yuzu-essential-oil': {
    uz: 'Yuzu efir moyi (Citrus junos) — yapon sitrusi yuzu po‘stidan presslash yoki distillyatsiya orqali olinadi. Asosiy komponentlari — limonen, gamma-terpinen va linalool; hidi greyfurt va mandarin oralig‘idagi nordon-gulli sitrus. Ichimliklar, sitrus aromatizatorlari va atirchilikda ishlatiladi.',
    ru: 'Эфирное масло юдзу (Citrus junos) — японского цитруса — получают прессованием или перегонкой кожуры. Основные компоненты — лимонен, гамма-терпинен и линалоол; запах кисловато-цветочный цитрусовый, между грейпфрутом и мандарином. Используется в напитках, цитрусовых ароматизаторах и парфюмерии.',
    en: 'Yuzu essential oil (Citrus junos), from the Japanese citrus fruit, is obtained by pressing or distilling the peel. Its main components are limonene, gamma-terpinene and linalool, giving a tart, floral citrus odour between grapefruit and mandarin. It is used in beverages, citrus flavours and perfumery.',
  },
  'linalyl-acetate': {
    uz: 'Linalilatsetat (CAS 115-95-7) — yangi, shirin gulli-mevali hidga ega aroma kimyoviy modda; lavanda va bergamot efir moylarining asosiy komponentlaridan biri. Atir kompozitsiyalarida lavanda, bergamot va «toza» notalarni qurishda, sovun, shampun va uy kimyosi otdushkalarida qo‘llanadi.',
    ru: 'Линалилацетат (CAS 115-95-7) — ароматическое вещество со свежим сладким цветочно-фруктовым запахом; один из основных компонентов лавандового и бергамотового эфирных масел. Используется в парфюмерных композициях для лавандовых, бергамотовых и «чистых» нот, в отдушках для мыла, шампуней и бытовой химии.',
    en: 'Linalyl acetate (CAS 115-95-7) is an aroma chemical with a fresh, sweet floral-fruity odour and one of the main constituents of lavender and bergamot oils. It is used to build lavender, bergamot and clean notes in fragrance compositions and in fragrances for soap, shampoo and household products.',
  },
  geraniol: {
    uz: 'Geraniol (CAS 106-24-1) — atirgulga xos gulli hidli terpen spirti; palmaroza, atirgul va geran efir moylarida uchraydi. Atirgul va gulli kompozitsiyalarda, sovun, kosmetika va uy kimyosi otdushkalarida ishlatiladi.',
    ru: 'Гераниол (CAS 106-24-1) — терпеновый спирт с цветочным запахом розы; содержится в эфирных маслах пальмарозы, розы и герани. Применяется в розовых и цветочных композициях, отдушках для мыла, косметики и бытовой химии.',
    en: 'Geraniol (CAS 106-24-1) is a terpene alcohol with a rosy floral odour, found in palmarosa, rose and geranium oils. It is used in rose and floral compositions and in fragrances for soap, cosmetics and household products.',
  },
  citronellol: {
    uz: 'Sitronellol (CAS 106-22-9) — yangi atirgul hidiga ega terpen spirti; atirgul va geran efir moylarining tarkibiy qismi. Atirgul notasini qurishda va kosmetika otdushkalarida qo‘llanadi; geraniol bilan birga ishlatilganda tabiiyroq atirgul hidi hosil bo‘ladi.',
    ru: 'Цитронеллол (CAS 106-22-9) — терпеновый спирт со свежим запахом розы; компонент розового и геранового эфирных масел. Используется для построения розовой ноты и в косметических отдушках; в паре с гераниолом даёт более натуральное звучание розы.',
    en: 'Citronellol (CAS 106-22-9) is a terpene alcohol with a fresh rose odour and a constituent of rose and geranium oils. It is used to build rose notes and in cosmetic fragrances; combined with geraniol it gives a more natural rose character.',
  },
  limonene: {
    uz: 'Limonen (d-limonen, CAS 5989-27-5) — sitrus mevalar po‘sti efir moylarining asosiy komponenti, hidi yangi apelsin-sitrus. Uy kimyosi va kosmetikada sitrus nota beruvchi sifatida, tozalash vositalarida esa tabiiy kelib chiqishli erituvchi sifatida ham ishlatiladi.',
    ru: 'Лимонен (d-лимонен, CAS 5989-27-5) — основной компонент эфирных масел цитрусовой кожуры со свежим апельсиново-цитрусовым запахом. В бытовой химии и косметике применяется как источник цитрусовой ноты, в чистящих средствах — также как растворитель природного происхождения.',
    en: 'Limonene (d-limonene, CAS 5989-27-5) is the main constituent of citrus peel oils, with a fresh orange-citrus odour. In household products and cosmetics it provides a citrus note, and in cleaning products it is also used as a solvent of natural origin.',
  },
  'musk-ketone': {
    uz: 'Mushk keton (CAS 81-14-1) — shirin, kukunsimon mushk hidiga ega nitromushk; hidni uzoq saqlovchi fiksator sifatida sharqona va gulli kompozitsiyalarda ishlatiladi. Kosmetikada qo‘llanishi IFRA standartlari va amaldagi reglamentlar bilan cheklangan.',
    ru: 'Мускус кетон (CAS 81-14-1) — нитромускус со сладким пудровым мускусным запахом; используется как фиксатор в восточных и цветочных композициях. Применение в косметике ограничено стандартами IFRA и действующими регламентами.',
    en: 'Musk ketone (CAS 81-14-1) is a nitro musk with a sweet, powdery musk odour, used as a fixative in oriental and floral compositions. Its use in cosmetics is restricted by IFRA standards and applicable regulations.',
  },
  galaxolide: {
    uz: 'Galaxolide (HHCB, CAS 1222-05-5) — toza, shirin gulli-yog‘ochsimon hidli politsiklik mushk. Kir yuvish vositalari, yumshatgichlar, sovun va kosmetika otdushkalarida «tozalik» hissini beruvchi va hidni matoda uzoq saqlovchi baza notasi sifatida keng qo‘llanadi.',
    ru: 'Галаксолид (HHCB, CAS 1222-05-5) — полициклический мускус с чистым сладким цветочно-древесным запахом. Широко применяется в отдушках для стиральных средств, кондиционеров для белья, мыла и косметики как базовая нота, дающая ощущение чистоты и стойкость запаха на ткани.',
    en: 'Galaxolide (HHCB, CAS 1222-05-5) is a polycyclic musk with a clean, sweet floral-woody odour. It is widely used in fragrances for detergents, fabric softeners, soap and cosmetics as a base note that gives a clean feel and long-lasting scent on fabric.',
  },
  'ethylene-brassylate': {
    uz: 'Etilenbrassilat (CAS 105-95-3) — shirin, kukunsimon mushk hidiga ega makrotsiklik mushk. Atir va kosmetika kompozitsiyalarida baza notasi va fiksator sifatida, gulli va sharqona hidlarni yumshatish uchun ishlatiladi.',
    ru: 'Этиленбрассилат (CAS 105-95-3) — макроциклический мускус со сладким пудровым запахом. Используется в парфюмерных и косметических композициях как базовая нота и фиксатор, смягчает цветочные и восточные аккорды.',
    en: 'Ethylene brassylate (CAS 105-95-3) is a macrocyclic musk with a sweet, powdery odour. It is used in fragrance and cosmetic compositions as a base note and fixative and to soften floral and oriental accords.',
  },
  'benzyl-acetate': {
    uz: 'Benzilatsetat (CAS 140-11-4) — shirin mevali-gulli, yasmin hidiga ega efir; yasmin absolyutining asosiy komponentlaridan biri. Yasmin va oq gullar kompozitsiyalarida, sovun va uy kimyosi otdushkalarida qo‘llanadi.',
    ru: 'Бензилацетат (CAS 140-11-4) — сложный эфир со сладким фруктово-цветочным запахом жасмина; один из основных компонентов абсолю жасмина. Применяется в жасминовых и белоцветочных композициях, отдушках для мыла и бытовой химии.',
    en: 'Benzyl acetate (CAS 140-11-4) is an ester with a sweet fruity-floral jasmine odour and one of the main constituents of jasmine absolute. It is used in jasmine and white-floral compositions and in fragrances for soap and household products.',
  },
  'benzyl-salicylate': {
    uz: 'Benzilsalitsilat (CAS 118-58-1) — kuchsiz, shirin balzamik-gulli hidli modda. Gulli kompozitsiyalarda aralashtiruvchi va fiksator sifatida, kosmetika va kir yuvish vositalari otdushkalarida ishlatiladi.',
    ru: 'Бензилсалицилат (CAS 118-58-1) — вещество со слабым сладким бальзамически-цветочным запахом. Используется как связующий компонент и фиксатор в цветочных композициях, в отдушках для косметики и стиральных средств.',
    en: 'Benzyl salicylate (CAS 118-58-1) has a faint, sweet balsamic-floral odour. It is used as a blender and fixative in floral compositions and in fragrances for cosmetics and laundry products.',
  },
  '1-4-cineole': {
    uz: '1,4-Sineol (CAS 470-67-7) — yangi, kamforasimon-yalpizli, laymga o‘xshash hidli modda; laym efir moyida uchraydi. Yangi va yalpizli kompozitsiyalarda, uy kimyosi otdushkalarida qo‘llanadi. Evkaliptdagi 1,8-sineol (evkaliptol) bilan adashtirmaslik kerak.',
    ru: '1,4-Цинеол (CAS 470-67-7) — вещество со свежим камфорно-мятным запахом с лаймовым оттенком; встречается в эфирном масле лайма. Применяется в свежих и мятных композициях, отдушках для бытовой химии. Не путать с 1,8-цинеолом (эвкалиптолом) из эвкалипта.',
    en: '1,4-Cineole (CAS 470-67-7) has a fresh, camphoraceous-minty odour with a lime-like nuance and occurs in lime oil. It is used in fresh and minty compositions and in household-product fragrances. It should not be confused with 1,8-cineole (eucalyptol) from eucalyptus.',
  },
  piperitone: {
    uz: 'Piperiton (CAS 89-81-6) — yangi yalpizli-kamforasimon hidli keton; Eucalyptus dives efir moyining asosiy komponenti. Yalpizli va salqinlashtiruvchi kompozitsiyalarda ishlatiladi.',
    ru: 'Пиперитон (CAS 89-81-6) — кетон со свежим мятно-камфорным запахом; основной компонент эфирного масла Eucalyptus dives. Используется в мятных и освежающих композициях.',
    en: 'Piperitone (CAS 89-81-6) is a ketone with a fresh minty-camphoraceous odour and the main constituent of Eucalyptus dives oil. It is used in minty and cooling compositions.',
  },
  '1-hexanol-natural': {
    uz: '1-Geksanol (CAS 111-27-3) — yashil, o‘tsimon-mevali hidli spirt; ko‘plab meva va ko‘katlarda tabiiy holda uchraydi. Olma, rezavor va boshqa meva aromatizatorlariga yangi «yashil» nota berish hamda atirchilikda qo‘llanadi.',
    ru: '1-Гексанол (CAS 111-27-3) — спирт с зелёным травянисто-фруктовым запахом; в природе содержится во многих фруктах и зелени. Применяется для свежей «зелёной» ноты в яблочных, ягодных и других фруктовых ароматизаторах, а также в парфюмерии.',
    en: '1-Hexanol (CAS 111-27-3) is an alcohol with a green, grassy-fruity odour that occurs naturally in many fruits and greens. It is used to add a fresh green note to apple, berry and other fruit flavours and in perfumery.',
  },
  '2-acetylfuran': {
    uz: '2-Atsetilfuran (CAS 1192-62-7) — shirin balzamik, bodom-karamel va qovurilgan notali modda; termik ishlov berishda (Mayyar reaksiyasi) hosil bo‘ladigan hid moddalaridan biri. Pishiriq, kofe, kakao va yong‘oq aromatizatorlarida juda kichik miqdorda ishlatiladi.',
    ru: '2-Ацетилфуран (CAS 1192-62-7) — вещество со сладким бальзамическим запахом с миндально-карамельными и обжаренными нотами; одно из соединений, образующихся при термообработке (реакция Майяра). Используется в очень малых количествах в ароматизаторах выпечки, кофе, какао и орехов.',
    en: '2-Acetylfuran (CAS 1192-62-7) has a sweet, balsamic odour with almond-caramel and roasted notes and is one of the compounds formed during heating (Maillard reaction). It is used at very low levels in bakery, coffee, cocoa and nut flavours.',
  },
  '2-pentyl-furan': {
    uz: '2-Pentilfuran (CAS 3777-69-3) — yashil, dukkakli-yerli va mevali notali modda; yog‘larning oksidlanishida va ko‘plab oziq-ovqat mahsulotlarida tabiiy hosil bo‘ladi. Meva, sabzavot va sho‘r ta’mli aromatizatorlarda juda kichik miqdorda qo‘llanadi.',
    ru: '2-Пентилфуран (CAS 3777-69-3) — вещество с зелёным бобово-землистым и фруктовым оттенком; естественно образуется при окислении жиров и присутствует во многих продуктах. Применяется в очень малых количествах во фруктовых, овощных и солёных ароматизаторах.',
    en: '2-Pentylfuran (CAS 3777-69-3) has a green, beany-earthy and fruity character and forms naturally during fat oxidation in many foods. It is used at very low levels in fruit, vegetable and savoury flavours.',
  },
  acetanisole: {
    uz: 'Atsetanizol (4-metoksiatsetofenon, CAS 100-06-1) — shirin, do‘lana guliga o‘xshash, anis-vanil notali hidli modda. Vanil, anis va yong‘oq aromatizatorlarida, pishiriq va qandolatda, shuningdek gulli atir kompozitsiyalarida ishlatiladi.',
    ru: 'Ацетанизол (4-метоксиацетофенон, CAS 100-06-1) — вещество со сладким запахом цветков боярышника с анисово-ванильным оттенком. Используется в ванильных, анисовых и ореховых ароматизаторах для выпечки и кондитерских изделий, а также в цветочных парфюмерных композициях.',
    en: 'Acetanisole (4-methoxyacetophenone, CAS 100-06-1) has a sweet, hawthorn-like odour with an anise-vanilla nuance. It is used in vanilla, anise and nut flavours for bakery and confectionery and in floral fragrance compositions.',
  },
  adoxal: {
    uz: 'Adoxal (CAS 141-13-9) — yangi aldegidli, dengiz-gulli, «suvli» notaga ega aroma kimyoviy modda. Yangi va dengiz yo‘nalishidagi kompozitsiyalarda, kir yuvish vositalari va uy kimyosi otdushkalarida kichik dozada ishlatiladi.',
    ru: 'Адоксаль (CAS 141-13-9) — ароматическое вещество со свежей альдегидной морской цветочной «водной» нотой. Используется в небольших дозировках в свежих и морских композициях, отдушках для стиральных средств и бытовой химии.',
    en: 'Adoxal (CAS 141-13-9) is an aroma chemical with a fresh aldehydic, marine-floral, watery note. It is used at low levels in fresh and marine compositions and in fragrances for laundry and household products.',
  },
  bacdanol: {
    uz: 'Bacdanol (CAS 28219-61-6) — sandal daraxtiga o‘xshash kremsimon-yog‘ochsimon hidli sintetik modda. Atir va kosmetika kompozitsiyalarida sandal notasini qurish uchun tabiiy sandal moyi o‘rnini bosuvchi sifatida qo‘llanadi.',
    ru: 'Бакданол (CAS 28219-61-6) — синтетическое вещество со сливочно-древесным запахом сандала. Применяется в парфюмерных и косметических композициях для построения сандаловой ноты как заменитель натурального сандалового масла.',
    en: 'Bacdanol (CAS 28219-61-6) is a synthetic material with a creamy, woody sandalwood odour. It is used in fragrance and cosmetic compositions to build sandalwood notes as a replacement for natural sandalwood oil.',
  },
  'damascone-beta': {
    uz: 'Beta-damaskon — kuchli mevali-atirgul hidli «atirgul ketonlari» guruhiga mansub modda; olxo‘ri, qora smorodina va tamaki notalari bilan. Juda kichik dozada atirgul va mevali-gulli kompozitsiyalarga hajm va iliqlik berish uchun ishlatiladi.',
    ru: 'Бета-дамаскон — вещество из группы «розовых кетонов» с мощным фруктово-розовым запахом с оттенками сливы, чёрной смородины и табака. В очень малых дозировках добавляет объём и теплоту розовым и фруктово-цветочным композициям.',
    en: 'Beta-damascone belongs to the rose ketones and has a powerful fruity-rose odour with plum, blackcurrant and tobacco nuances. At very low levels it adds volume and warmth to rose and fruity-floral compositions.',
  },
  'ionone-alpha': {
    uz: 'Alfa-ionon (CAS 127-41-3) — binafsha guliga xos gulli, yog‘ochsimon-mevali (malina) notali modda. Binafsha va gulli kompozitsiyalarda, kosmetika otdushkalarida qo‘llanadi; aromatizatorlarda malina notasini qurishda ham ishlatiladi.',
    ru: 'Альфа-ионон (CAS 127-41-3) — вещество с цветочным запахом фиалки и древесно-фруктовым (малиновым) оттенком. Используется в фиалковых и цветочных композициях, косметических отдушках, а в ароматизаторах — для построения малиновой ноты.',
    en: 'Alpha-ionone (CAS 127-41-3) has a floral violet odour with a woody-fruity, raspberry-like nuance. It is used in violet and floral compositions and cosmetic fragrances, and in flavours to build raspberry notes.',
  },
  dihydromyrcenol: {
    uz: 'Digidromirsenol (CAS 18479-58-8) — yangi sitrus-laym, biroz metallsimon-gulli hidli spirt. Erkaklar atirlari, kir yuvish vositalari, yumshatgichlar va uy kimyosi otdushkalarida «toza yangilik» notasi uchun keng qo‘llanadi.',
    ru: 'Дигидромирценол (CAS 18479-58-8) — спирт со свежим цитрусово-лаймовым, слегка металлически-цветочным запахом. Широко используется для ноты «чистой свежести» в мужской парфюмерии, отдушках для стиральных средств, кондиционеров и бытовой химии.',
    en: 'Dihydromyrcenol (CAS 18479-58-8) is an alcohol with a fresh citrus-lime, slightly metallic-floral odour. It is widely used for a clean, fresh note in masculine fragrances and in fragrances for detergents, fabric softeners and household products.',
  },
  calone: {
    uz: 'Calone (CAS 28940-11-6) — tarvuz va dengiz-ozon notali juda kuchli aroma kimyoviy modda; «dengiz» (akvatik) yo‘nalishidagi atirlarning asosiy komponenti. Juda kichik dozada yangi va dengiz kompozitsiyalarida ishlatiladi.',
    ru: 'Калон (CAS 28940-11-6) — очень мощное ароматическое вещество с нотами арбуза и морского озона; ключевой компонент «морских» (акватических) ароматов. Используется в очень малых дозировках в свежих и морских композициях.',
    en: 'Calone (CAS 28940-11-6) is a very powerful aroma chemical with watermelon and marine-ozonic notes and a key component of aquatic fragrances. It is used at very low levels in fresh and marine compositions.',
  },
  'cis-3-hexenol': {
    uz: 'Sis-3-geksenol («barg spirti», CAS 928-96-1) — yangi o‘rilgan o‘t hidiga ega spirt; barglar va ko‘plab mevalarda tabiiy uchraydi. Meva aromatizatorlariga yangi «yashil» nota berish va atirchilikda yashil notalar uchun qo‘llanadi.',
    ru: 'Цис-3-гексенол («листовой спирт», CAS 928-96-1) — спирт с запахом свежескошенной травы; естественно присутствует в листьях и многих фруктах. Применяется для свежей «зелёной» ноты во фруктовых ароматизаторах и для зелёных нот в парфюмерии.',
    en: 'Cis-3-hexenol (leaf alcohol, CAS 928-96-1) has the odour of freshly cut grass and occurs naturally in leaves and many fruits. It is used to add a fresh green note to fruit flavours and for green notes in perfumery.',
  },
  furfural: {
    uz: 'Furfurol (CAS 98-01-1) — shirin, bodom-nonsimon va karamel notali modda; qand va uglevodlarni qizdirishda tabiiy hosil bo‘ladi. Pishiriq, karamel va qovurilgan ta’mli aromatizatorlarda juda kichik miqdorda ishlatiladi.',
    ru: 'Фурфурол (CAS 98-01-1) — вещество со сладким миндально-хлебным и карамельным запахом; естественно образуется при нагревании сахаров и углеводов. Используется в очень малых количествах в ароматизаторах выпечки, карамели и обжаренных вкусов.',
    en: 'Furfural (CAS 98-01-1) has a sweet, almond-bready and caramel odour and forms naturally when sugars and carbohydrates are heated. It is used at very low levels in bakery, caramel and roasted flavours.',
  },
  nootkatone: {
    uz: 'Nutkaton (CAS 4674-50-4) — greyfurtning xarakterli hid moddasi: achchiqroq, yog‘ochsimon-sitrus nota. Greyfurt va sitrus aromatizatorlarida, ichimliklarda hamda atirchilikda qo‘llanadi.',
    ru: 'Нуткатон (CAS 4674-50-4) — ключевое ароматическое вещество грейпфрута с горьковатой древесно-цитрусовой нотой. Применяется в грейпфрутовых и цитрусовых ароматизаторах, напитках и парфюмерии.',
    en: 'Nootkatone (CAS 4674-50-4) is the character-impact compound of grapefruit, with a slightly bitter, woody-citrus note. It is used in grapefruit and citrus flavours, beverages and perfumery.',
  },
  sclareolide: {
    uz: 'Sklareolid (CAS 564-20-5) — muskat shalfeyidan olinadigan sklareoldan hosil qilinadigan modda; ambra-tamaki notali fiksator. Atir kompozitsiyalarida hidni mustahkamlash uchun ishlatiladi, ambrali moddalarni sintez qilishda ham boshlang‘ich xomashyo hisoblanadi.',
    ru: 'Склареолид (CAS 564-20-5) — вещество, получаемое из склареола шалфея мускатного; фиксатор с амброво-табачной нотой. Используется для закрепления запаха в парфюмерных композициях, а также служит исходным сырьём для синтеза амбровых веществ.',
    en: 'Sclareolide (CAS 564-20-5) is derived from sclareol obtained from clary sage and acts as a fixative with an ambery-tobacco note. It is used to anchor fragrance compositions and is also a starting material for the synthesis of amber odorants.',
  },
  'veramoss-evernyl': {
    uz: 'Veramoss / Evernyl (metil atrarat, CAS 4707-47-5) — yerli-moxli hidga ega sintetik modda. Atir va kir yuvish vositalari otdushkalarida tabiiy eman moxi (oakmoss) ekstrakti o‘rnini bosuvchi sifatida shipr va yog‘ochsimon kompozitsiyalarda qo‘llanadi.',
    ru: 'Верамосс / Эверниль (метилатрарат, CAS 4707-47-5) — синтетическое вещество с землисто-моховым запахом. Применяется в шипровых и древесных композициях, отдушках для парфюмерии и стиральных средств как заменитель натурального экстракта дубового мха.',
    en: 'Veramoss / Evernyl (methyl atrarate, CAS 4707-47-5) is a synthetic material with an earthy, mossy odour. It is used in chypre and woody compositions and in fragrances for perfumery and laundry products as a replacement for natural oakmoss extract.',
  },
  tonalide: {
    uz: 'Tonalide (AHTN, CAS 21145-77-7) — shirin mushk-yog‘ochsimon hidli politsiklik mushk. Kir yuvish vositalari, yumshatgichlar va sovun otdushkalarida baza notasi va fiksator sifatida ishlatiladi; kosmetikada qo‘llash me’yori amaldagi reglamentlar bilan cheklangan.',
    ru: 'Тоналид (AHTN, CAS 21145-77-7) — полициклический мускус со сладким мускусно-древесным запахом. Используется как базовая нота и фиксатор в отдушках для стиральных средств, кондиционеров и мыла; содержание в косметике ограничено действующими регламентами.',
    en: 'Tonalide (AHTN, CAS 21145-77-7) is a polycyclic musk with a sweet musky-woody odour. It is used as a base note and fixative in fragrances for detergents, fabric softeners and soap; its level in cosmetics is limited by applicable regulations.',
  },
  cashmeran: {
    uz: 'Cashmeran (CAS 33704-61-9) — mushk-yog‘ochsimon, biroz ziravorli, «baxmal» notali aroma kimyoviy modda. Atir, kosmetika va kir yuvish vositalari otdushkalarida iliqlik va yumshoqlik beruvchi komponent sifatida ishlatiladi.',
    ru: 'Кашмеран (CAS 33704-61-9) — ароматическое вещество с мускусно-древесной, слегка пряной «бархатной» нотой. Используется в парфюмерии, косметике и отдушках для стиральных средств как компонент, придающий теплоту и мягкость.',
    en: 'Cashmeran (CAS 33704-61-9) is an aroma chemical with a musky-woody, slightly spicy, velvety note. It is used in perfumery, cosmetics and laundry fragrances to add warmth and softness.',
  },
  ebanol: {
    uz: 'Ebanol (CAS 67801-20-1) — juda kuchli sandal daraxti notali sintetik modda. Atir va kosmetika kompozitsiyalarida kichik dozada sandal va yog‘ochsimon notalarni qurish uchun qo‘llanadi.',
    ru: 'Эбанол (CAS 67801-20-1) — синтетическое вещество с очень мощной сандаловой нотой. Применяется в небольших дозировках для построения сандаловых и древесных нот в парфюмерных и косметических композициях.',
    en: 'Ebanol (CAS 67801-20-1) is a synthetic material with a very powerful sandalwood note. It is used at low levels to build sandalwood and woody notes in fragrance and cosmetic compositions.',
  },
  'jasmone-cis': {
    uz: 'Sis-jasmon (CAS 488-10-8) — yasmin absolyutida uchraydigan, yasminga xos yangi gulli, biroz mevali-o‘tsimon hidli keton. Yasmin va oq gullar kompozitsiyalarida tabiiylik berish uchun ishlatiladi.',
    ru: 'Цис-жасмон (CAS 488-10-8) — кетон из абсолю жасмина со свежим цветочным, слегка фруктово-травянистым запахом, характерным для жасмина. Используется для придания натуральности жасминовым и белоцветочным композициям.',
    en: 'Cis-jasmone (CAS 488-10-8) is a ketone found in jasmine absolute, with a fresh floral, slightly fruity-herbal odour characteristic of jasmine. It is used to add naturalness to jasmine and white-floral compositions.',
  },

  // ── Oziq-ovqat qo‘shimchalari: bo‘yoqlar ─────────────────────────────────
  'black-pn-e151': {
    uz: 'Qora PN (Brilliant Black BN, CAS 2519-30-4, E151) — suvda eriydigan sintetik azo-bo‘yoq, qora-binafsha rang beradi. Qandolat, glazur va ichimliklarda qora va to‘q tuslarni olish uchun, ko‘pincha boshqa bo‘yoqlar bilan aralashmada ishlatiladi. Hamma mamlakatlarda ham ruxsat etilmagan (masalan, AQShda) — eksport mahsulotida va ruxsat etilgan dozalarni texnik reglament bo‘yicha tekshiring.',
    ru: 'Чёрный блестящий PN (Brilliant Black BN, CAS 2519-30-4, E151) — водорастворимый синтетический азокраситель чёрно-фиолетового цвета. Применяется в кондитерских изделиях, глазурях и напитках для получения чёрных и тёмных оттенков, часто в смеси с другими красителями. Разрешён не во всех странах (например, не разрешён в США) — для экспортной продукции и по допустимым дозировкам сверяйтесь с техническими регламентами.',
    en: 'Black PN (Brilliant Black BN, CAS 2519-30-4, E151) is a water-soluble synthetic azo colour giving a black-violet shade. It is used in confectionery, glazes and beverages to build black and dark shades, often blended with other colours. It is not permitted in every country (for example, not in the USA), so check export markets and permitted levels against the applicable regulations.',
  },
  'brown-ht-e155': {
    uz: 'Jigarrang HT (Chocolate Brown HT, CAS 4553-89-3, E155) — suvda eriydigan sintetik azo-bo‘yoq, shokolad-jigarrang tus beradi. Pishiriq, qandolat va ichimliklarda kakao yoki karamel rangini kuchaytirish uchun ishlatiladi. AQShda oziq-ovqat bo‘yog‘i sifatida ruxsat etilmagan — eksport va dozalarni texnik reglament bo‘yicha tekshiring.',
    ru: 'Коричневый HT (Chocolate Brown HT, CAS 4553-89-3, E155) — водорастворимый синтетический азокраситель шоколадно-коричневого цвета. Применяется в выпечке, кондитерских изделиях и напитках для усиления «какао» или карамельного оттенка. В США как пищевой краситель не разрешён — экспорт и дозировки сверяйте с техническими регламентами.',
    en: 'Brown HT (Chocolate Brown HT, CAS 4553-89-3, E155) is a water-soluble synthetic azo colour with a chocolate-brown shade. It is used in bakery, confectionery and beverages to reinforce a cocoa or caramel colour. It is not permitted as a food colour in the USA, so check export markets and permitted levels against the applicable regulations.',
  },
  'anthocyanin-powder-e163': {
    uz: 'Antotsianinlar (E163) — rezavorlar, uzum po‘sti, qora sabzi kabi o‘simliklardan olinadigan tabiiy bo‘yoqlar. Rangi muhit kislotaligiga bog‘liq: kislotali mahsulotda qizil, neytralga yaqinlashganda binafsha-ko‘k tusga o‘tadi. Shuning uchun asosan kislotali ichimliklar, yogurt, jele va qandolatda ishlatiladi; yorug‘lik va yuqori haroratga sezgir.',
    ru: 'Антоцианы (E163) — натуральные красители из ягод, кожицы винограда, чёрной моркови и других растений. Цвет зависит от кислотности: в кислой среде красный, ближе к нейтральной — фиолетово-синий. Поэтому применяются в основном в кислых напитках, йогуртах, желе и кондитерских изделиях; чувствительны к свету и высокой температуре.',
    en: 'Anthocyanins (E163) are natural colours obtained from berries, grape skins, black carrot and other plants. The shade depends on acidity: red in acidic products, shifting to violet-blue towards neutral pH. They are therefore used mainly in acidic beverages, yoghurt, jellies and confectionery, and are sensitive to light and high temperatures.',
  },
  'caramel-colour-class-iv-e150d': {
    uz: 'Karamel rangi IV klass (sulfit-ammiakli karamel, E150d) — shakarni ammoniy va sulfit birikmalari ishtirokida qizdirib olinadigan to‘q jigarrang suyuq bo‘yoq. Manfiy zaryadli va kislotali muhitda barqaror, shuning uchun kola tipidagi ichimliklar, souslar va pishiriqda ishlatiladi. Karamel ta’mi deyarli sezilmaydi — vazifasi faqat rang.',
    ru: 'Карамельный колер IV класса (аммиачно-сульфитная карамель, E150d) — тёмно-коричневый жидкий краситель, получаемый нагреванием сахаров в присутствии аммонийных и сульфитных соединений. Отрицательно заряжен и стабилен в кислой среде, поэтому применяется в напитках типа колы, соусах и выпечке. Карамельного вкуса практически не даёт — задача только цвет.',
    en: 'Caramel colour class IV (sulphite ammonia caramel, E150d) is a dark-brown liquid colour made by heating sugars in the presence of ammonium and sulphite compounds. It carries a negative charge and is stable in acidic conditions, so it is used in cola-type drinks, sauces and bakery. It contributes colour rather than a noticeable caramel taste.',
  },
  'chlorophyll-copper-complex-e141': {
    uz: 'Xlorofill-mis komplekslari (E141) — xlorofilldagi magniyni mis bilan almashtirib olinadigan yashil bo‘yoq; oddiy xlorofilldan (E140) ko‘ra yorug‘lik va issiqlikka barqarorroq. E141(i) — yog‘da eriydigan shakl, E141(ii) — suvda eriydigan xlorofillin tuzlari. Ichimliklar, sut mahsulotlari va qandolatda yashil va zaytun tuslar uchun ishlatiladi.',
    ru: 'Медные комплексы хлорофилла (E141) — зелёный краситель, получаемый заменой магния в хлорофилле на медь; устойчивее к свету и нагреву, чем обычный хлорофилл (E140). E141(i) — жирорастворимая форма, E141(ii) — водорастворимые соли хлорофиллина. Применяется в напитках, молочной продукции и кондитерских изделиях для зелёных и оливковых оттенков.',
    en: 'Copper complexes of chlorophyll (E141) are green colours made by replacing the magnesium in chlorophyll with copper, which makes them more stable to light and heat than plain chlorophyll (E140). E141(i) is the oil-soluble form; E141(ii) are the water-soluble chlorophyllin salts. They are used in beverages, dairy and confectionery for green and olive shades.',
  },
  'beetroot-red-e162': {
    uz: 'Lavlagi qizili (betanin, E162) — qizil lavlagidan olinadigan tabiiy pushti-qizil bo‘yoq. Uzoq qizdirish, yorug‘lik va kislorodga sezgir, shuning uchun kuchli termik ishlov berilmaydigan mahsulotlarda — muzqaymoq, yogurt, sut desertlari va sovuq ichimliklarda — eng yaxshi natija beradi.',
    ru: 'Свекольный красный (бетанин, E162) — натуральный розово-красный краситель из красной свёклы. Чувствителен к длительному нагреву, свету и кислороду, поэтому лучше всего работает в продуктах без жёсткой термообработки — мороженом, йогуртах, молочных десертах и холодных напитках.',
    en: 'Beetroot red (betanin, E162) is a natural pink-red colour extracted from red beet. It is sensitive to prolonged heating, light and oxygen, so it performs best in products without severe heat treatment, such as ice cream, yoghurt, dairy desserts and chilled drinks.',
  },

  // ── Kislotalar, konservantlar, antioksidantlar ──────────────────────────
  'acetic-acid-glacial': {
    uz: 'Muzdek sirka kislotasi (CAS 64-19-7, E260) — deyarli suvsiz sirka kislotasi; taxminan 16,6 °C da muzlaydi, nomi shundan. Sirka, marinad, sous va konservalarda kislotalilikni rostlovchi va konservalovchi sifatida suyultirib ishlatiladi. Konsentrlangan holda o‘yuvchi — himoya vositalari bilan ishlang.',
    ru: 'Уксусная кислота ледяная (CAS 64-19-7, E260) — практически безводная уксусная кислота; застывает примерно при 16,6 °C, отсюда название. В разбавленном виде используется как регулятор кислотности и консервант в уксусе, маринадах, соусах и консервах. В концентрированном виде едкая — работайте со средствами защиты.',
    en: 'Glacial acetic acid (CAS 64-19-7, E260) is essentially water-free acetic acid; it solidifies at about 16.6 °C, hence the name. Diluted, it is used as an acidity regulator and preservative in vinegar, marinades, sauces and canned foods. It is corrosive when concentrated, so handle it with protective equipment.',
  },
  'sodium-erythorbate': {
    uz: 'Natriy eritorbati (CAS 6381-77-7, E316) — natriy askorbatining stereoizomeri bo‘lgan antioksidant. Kolbasa va dudlangan go‘sht mahsulotlarida nitrit bilan birga tuzlash jarayonini tezlashtiradi, pushti rangni barqarorlashtiradi va nitrozaminlar hosil bo‘lishini kamaytiradi; konservalarda oksidlanishni sekinlashtiradi.',
    ru: 'Эриторбат натрия (CAS 6381-77-7, E316) — антиокислитель, стереоизомер аскорбата натрия. В колбасных изделиях и копчёностях вместе с нитритом ускоряет посол, стабилизирует розовый цвет и снижает образование нитрозаминов; в консервах замедляет окисление.',
    en: 'Sodium erythorbate (CAS 6381-77-7, E316) is an antioxidant and a stereoisomer of sodium ascorbate. In cured and smoked meats it is used with nitrite to speed up curing, stabilise the pink colour and reduce nitrosamine formation; in canned foods it slows oxidation.',
  },
  'sodium-nitrite': {
    uz: 'Natriy nitriti (CAS 7632-00-0, E250) — go‘sht mahsulotlarini tuzlash vositasi: pushti rang va «tuzlangan go‘sht» ta’mini beradi, Clostridium botulinum rivojlanishini to‘xtatadi. Sof holda zaharli, shuning uchun amalda odatda nitritli tuzlash aralashmasi tarkibida ishlatiladi; miqdori texnik reglamentlar bilan qat’iy cheklangan.',
    ru: 'Нитрит натрия (CAS 7632-00-0, E250) — посолочное вещество для мясной продукции: даёт розовый цвет и вкус «ветчинности», подавляет развитие Clostridium botulinum. В чистом виде токсичен, поэтому на практике обычно применяется в составе нитритной посолочной смеси; содержание строго ограничено техническими регламентами.',
    en: 'Sodium nitrite (CAS 7632-00-0, E250) is a curing agent for meat products: it gives the pink colour and cured flavour and inhibits Clostridium botulinum. It is toxic in pure form, so in practice it is normally used as part of a nitrite curing salt, and its content is strictly limited by regulations.',
  },
  'tbhq-antioxidant': {
    uz: 'TBHQ (tert-butilgidroxinon, CAS 1948-33-0, E319) — o‘simlik moylari va yog‘lar uchun sintetik antioksidant. Qovurish moylari, chips va snacklar, yog‘li souslarda achib qolishni sekinlashtiradi va yuqori haroratda ham samarali. Ruxsat etilgan miqdor yog‘ massasiga nisbatan reglamentlanadi.',
    ru: 'ТБГХ (трет-бутилгидрохинон, TBHQ, CAS 1948-33-0, E319) — синтетический антиокислитель для растительных масел и жиров. Замедляет прогоркание фритюрных масел, чипсов и снеков, жирных соусов и сохраняет эффективность при высоких температурах. Допустимое количество нормируется от массы жира.',
    en: 'TBHQ (tert-butylhydroquinone, CAS 1948-33-0, E319) is a synthetic antioxidant for vegetable oils and fats. It slows rancidity in frying oils, crisps and snacks and fatty sauces, and remains effective at high temperatures. Permitted levels are set relative to the fat content.',
  },
  'sodium-ascorbate': {
    uz: 'Natriy askorbati (CAS 134-03-2, E301) — askorbin kislotasining natriy tuzi: antioksidant va C vitamini manbai, kislotaga qaraganda ta’mi yumshoq. Go‘sht mahsulotlarida nitrit bilan tuzlashni tezlashtiradi va rangni barqarorlashtiradi, ichimliklar va biologik faol qo‘shimchalarda boyitish uchun ishlatiladi.',
    ru: 'Аскорбат натрия (CAS 134-03-2, E301) — натриевая соль аскорбиновой кислоты: антиокислитель и источник витамина C с более мягким вкусом, чем у кислоты. В мясной продукции вместе с нитритом ускоряет посол и стабилизирует цвет, в напитках и БАД применяется для обогащения.',
    en: 'Sodium ascorbate (CAS 134-03-2, E301) is the sodium salt of ascorbic acid: an antioxidant and vitamin C source with a milder taste than the acid. In meat products it speeds up nitrite curing and stabilises colour; in beverages and supplements it is used for fortification.',
  },

  // ── Vitamin va minerallar (boyitish) ────────────────────────────────────
  'niacinamide-vitamin-b3': {
    uz: 'Niatsinamid (nikotinamid, CAS 98-92-0) — B3 vitaminining suvda yaxshi eriydigan shakli. Un va yorma mahsulotlari, ichimliklar va biologik faol qo‘shimchalarni boyitishda ishlatiladi; nikotin kislotasidan farqli o‘laroq teri qizarishini chaqirmaydi.',
    ru: 'Ниацинамид (никотинамид, CAS 98-92-0) — хорошо растворимая в воде форма витамина B3. Применяется для обогащения муки и зерновых продуктов, напитков и БАД; в отличие от никотиновой кислоты не вызывает покраснения кожи.',
    en: 'Niacinamide (nicotinamide, CAS 98-92-0) is a readily water-soluble form of vitamin B3. It is used to fortify flour and cereal products, beverages and supplements and, unlike nicotinic acid, does not cause skin flushing.',
  },
  'calcium-pantothenate-b5': {
    uz: 'Kalsiy D-pantotenat (CAS 137-08-6) — B5 vitamini (pantoten kislotasi) ning barqaror tuz shakli, suvda eriydigan oq kukun. Vitamin premikslari, boyitilgan ichimliklar, yormalar va biologik faol qo‘shimchalarda ishlatiladi.',
    ru: 'D-пантотенат кальция (CAS 137-08-6) — стабильная солевая форма витамина B5 (пантотеновой кислоты), белый водорастворимый порошок. Используется в витаминных премиксах, обогащённых напитках, зерновых продуктах и БАД.',
    en: 'Calcium D-pantothenate (CAS 137-08-6) is the stable salt form of vitamin B5 (pantothenic acid), a white water-soluble powder. It is used in vitamin premixes, fortified beverages, cereal products and supplements.',
  },
  'vitamin-d3-cholecalciferol': {
    uz: 'D3 vitamini (xolekalsiferol, CAS 67-97-0) — yog‘da eriydigan vitamin. Oziq-ovqatda sof holda emas, balki suvda tarqaladigan kukun yoki moyli eritma ko‘rinishida ishlatiladi. Sut va sut mahsulotlari, ichimliklar va biologik faol qo‘shimchalarni boyitish uchun; yorug‘lik va kislorodga sezgir.',
    ru: 'Витамин D3 (холекальциферол, CAS 67-97-0) — жирорастворимый витамин. В пищевых продуктах применяется не в чистом виде, а в форме диспергируемого в воде порошка или масляного раствора. Для обогащения молока и молочной продукции, напитков и БАД; чувствителен к свету и кислороду.',
    en: 'Vitamin D3 (cholecalciferol, CAS 67-97-0) is a fat-soluble vitamin. In food it is used not in pure form but as a water-dispersible powder or an oil solution, to fortify milk and dairy products, beverages and supplements. It is sensitive to light and oxygen.',
  },
  'vitamin-a-palmitate': {
    uz: 'A vitamini palmitati (retinil palmitat, CAS 79-81-2) — A vitaminining yog‘da eriydigan efir shakli, moysimon suyuqlik. Margarin, o‘simlik moyi, sut va sut mahsulotlarini boyitishda ishlatiladi; yorug‘lik va kislorodda parchalanadi, shuning uchun odatda antioksidant bilan barqarorlashtiriladi.',
    ru: 'Пальмитат витамина A (ретинилпальмитат, CAS 79-81-2) — жирорастворимая эфирная форма витамина A, маслянистая жидкость. Применяется для обогащения маргарина, растительных масел, молока и молочной продукции; разрушается на свету и под действием кислорода, поэтому обычно стабилизирован антиоксидантом.',
    en: 'Vitamin A palmitate (retinyl palmitate, CAS 79-81-2) is the fat-soluble ester form of vitamin A, an oily liquid. It is used to fortify margarine, vegetable oils, milk and dairy products; it degrades in light and oxygen, so it is usually stabilised with an antioxidant.',
  },
  'folic-acid-vitamin-b9': {
    uz: 'Folat kislotasi (CAS 59-30-3) — B9 vitaminining sintetik shakli, sariq-to‘q sariq kukun. Unni boyitish (ko‘plab mamlakatlarda temir bilan birga), pishiriq, sut mahsulotlari va biologik faol qo‘shimchalarda ishlatiladi. Juda kichik dozalarda qo‘llanadi, shuning uchun odatda vitamin premiksi tarkibida kiritiladi.',
    ru: 'Фолиевая кислота (CAS 59-30-3) — синтетическая форма витамина B9, жёлто-оранжевый порошок. Применяется для обогащения муки (во многих странах вместе с железом), в выпечке, молочной продукции и БАД. Вносится в очень малых дозах, поэтому обычно в составе витаминного премикса.',
    en: 'Folic acid (CAS 59-30-3) is the synthetic form of vitamin B9, a yellow-orange powder. It is used to fortify flour (in many countries together with iron) and in bakery, dairy products and supplements. Because it is dosed at very low levels, it is usually added as part of a vitamin premix.',
  },
  'zinc-sulphate-monohydrate': {
    uz: 'Rux sulfat monogidrati (CAS 7446-19-7) — suvda eriydigan rux manbai. Unni va yorma mahsulotlarini boyitish, ichimliklar va biologik faol qo‘shimchalarda mikroelement sifatida, odatda mineral premiks tarkibida ishlatiladi.',
    ru: 'Сульфат цинка моногидрат (CAS 7446-19-7) — водорастворимый источник цинка. Используется как микроэлемент для обогащения муки и зерновых продуктов, в напитках и БАД, обычно в составе минерального премикса.',
    en: 'Zinc sulphate monohydrate (CAS 7446-19-7) is a water-soluble source of zinc. It is used as a trace mineral to fortify flour and cereal products and in beverages and supplements, usually as part of a mineral premix.',
  },
  'ferrous-sulphate': {
    uz: 'Temir (II) sulfat (FeSO₄) — yaxshi so‘riladigan temir manbai; unni boyitish, pishiriq, sut mahsulotlari va biologik faol qo‘shimchalarda ishlatiladi. Ayrim mahsulotlarda rang o‘zgarishi yoki yog‘ oksidlanishini tezlashtirishi mumkin, shuning uchun doza va shakl (gidrat, inkapsulyatsiya) mahsulotga qarab tanlanadi.',
    ru: 'Сульфат железа (II) (FeSO₄) — хорошо усваиваемый источник железа; применяется для обогащения муки, в выпечке, молочной продукции и БАД. В некоторых продуктах может вызывать изменение цвета или ускорять окисление жиров, поэтому дозировка и форма (гидрат, инкапсуляция) подбираются под продукт.',
    en: 'Ferrous sulphate (FeSO₄) is a well-absorbed source of iron used to fortify flour and in bakery, dairy products and supplements. In some foods it can cause colour changes or speed up fat oxidation, so the dose and form (hydrate, encapsulation) are chosen to suit the product.',
  },
  'calcium-carbonate': {
    uz: 'Kalsiy karbonat (CAS 471-34-1, E170) — oq kukun; kalsiy manbai (taxminan 40% kalsiy), shuningdek kislotalilikni rostlovchi va yopishib qolishga qarshi vosita. Unni va sut mahsulotlarini boyitish, pishiriq va biologik faol qo‘shimchalarda ishlatiladi.',
    ru: 'Карбонат кальция (CAS 471-34-1, E170) — белый порошок; источник кальция (около 40% кальция), а также регулятор кислотности и антислёживатель. Применяется для обогащения муки и молочной продукции, в выпечке и БАД.',
    en: 'Calcium carbonate (CAS 471-34-1, E170) is a white powder: a calcium source (about 40% calcium) as well as an acidity regulator and anti-caking agent. It is used to fortify flour and dairy products and in bakery and supplements.',
  },
  'tricalcium-phosphate': {
    uz: 'Trikalsiy fosfat (CAS 7758-87-4, E341(iii)) — kalsiy va fosfor manbai hamda kukunlar uchun yopishib qolishga qarshi vosita (sochiluvchanlikni yaxshilaydi). Quruq sut aralashmalari, sut mahsulotlari, pishiriq va biologik faol qo‘shimchalarda ishlatiladi.',
    ru: 'Трикальцийфосфат (CAS 7758-87-4, E341(iii)) — источник кальция и фосфора и антислёживатель для порошков (улучшает сыпучесть). Применяется в сухих молочных смесях, молочной продукции, выпечке и БАД.',
    en: 'Tricalcium phosphate (CAS 7758-87-4, E341(iii)) is a source of calcium and phosphorus and an anti-caking agent that keeps powders free-flowing. It is used in dry milk mixes, dairy products, bakery and supplements.',
  },

  // ── Jele hosil qiluvchilar, qabartuvchilar, emulgatorlar, stabilizatorlar ─
  'pectin-nh': {
    uz: 'Pektin NH (amidlangan past metoksilli pektin, E440(ii)) — kalsiy ishtirokida jele hosil qiladi va termoqaytar: qizdirilganda eriydi, sovuganda yana qotadi. Shu xususiyati uchun pishiriqdagi yaltiroq glazur (nappaj), mevali to‘ldirgichlar va sut desertlarida ishlatiladi; yuqori shakar talab qilmaydi.',
    ru: 'Пектин NH (амидированный низкоэтерифицированный пектин, E440(ii)) — образует гель в присутствии кальция и термообратим: при нагреве плавится, при охлаждении снова застывает. Поэтому применяется в зеркальных глазурях (nappage), фруктовых начинках и молочных десертах; не требует высокого содержания сахара.',
    en: 'Pectin NH (amidated low-methoxyl pectin, E440(ii)) forms gels with calcium and is thermo-reversible: it melts when heated and sets again on cooling. This makes it the usual choice for bakery glazes (nappage), fruit fillings and dairy desserts, and it does not require high sugar levels.',
  },
  'gelatin-bovine-200-bloom': {
    uz: 'Mol jelatini 200 Bloom — qoramol xom ashyosidan olinadigan oqsil jele hosil qiluvchi. Bloom — jele mustahkamligi ko‘rsatkichi; 200 Bloom o‘rta-yuqori kuchga to‘g‘ri keladi. Marmelad va jele konfetlar, zefir va marshmallow, sut desertlari va kapsulalarda ishlatiladi; ishlatishdan oldin suvda bo‘ktiriladi.',
    ru: 'Желатин говяжий 200 блюм — белковый гелеобразователь из сырья КРС. Блюм — показатель прочности геля; 200 блюм соответствует средне-высокой силе. Применяется в мармеладе и жевательных конфетах, зефире и маршмеллоу, молочных десертах и капсулах; перед использованием замачивается в воде.',
    en: 'Bovine gelatin 200 Bloom is a protein gelling agent made from bovine raw material. Bloom measures gel strength, and 200 Bloom is a medium-high strength. It is used in gummies and jelly sweets, marshmallow, dairy desserts and capsules, and is hydrated in water before use.',
  },
  'gelatin-fish': {
    uz: 'Baliq jelatini — baliq terisi va suyagidan olinadigan oqsil jele hosil qiluvchi; mol yoki cho‘chqa jelatini istalmagan retsepturalarga muqobil. Odatda pastroq haroratda eriydi va qotadi. Qandolat, sut desertlari va kapsulalarda ishlatiladi.',
    ru: 'Желатин рыбный — белковый гелеобразователь из кожи и костей рыбы; альтернатива для рецептур, где говяжий или свиной желатин нежелателен. Как правило, плавится и застывает при более низкой температуре. Применяется в кондитерских изделиях, молочных десертах и капсулах.',
    en: 'Fish gelatin is a protein gelling agent made from fish skin and bones, used as an alternative where bovine or porcine gelatin is not wanted. It typically melts and sets at lower temperatures. It is used in confectionery, dairy desserts and capsules.',
  },
  'ammonium-bicarbonate': {
    uz: 'Ammoniy bikarbonati (CAS 1066-33-7, E503(ii)) — qizdirilganda ammiak, karbonat angidrid va suvga to‘liq parchalanadigan qabartuvchi. Ammiak faqat yupqa, quruq mahsulotlardan to‘liq chiqib ketadi, shuning uchun kreker, pechenye va galetada ishlatiladi; qalin va nam pishiriqda ammiak hidi qolishi mumkin.',
    ru: 'Гидрокарбонат аммония (аммоний углекислый, CAS 1066-33-7, E503(ii)) — разрыхлитель, при нагреве полностью разлагающийся на аммиак, углекислый газ и воду. Аммиак полностью улетучивается только из тонких сухих изделий, поэтому применяется в крекерах, печенье и галетах; в толстых и влажных изделиях может остаться запах аммиака.',
    en: 'Ammonium bicarbonate (CAS 1066-33-7, E503(ii)) is a leavening agent that decomposes completely into ammonia, carbon dioxide and water on heating. Ammonia escapes fully only from thin, dry products, so it is used in crackers, biscuits and cookies; in thick or moist bakes an ammonia note can remain.',
  },
  'baking-powder-double-acting': {
    uz: 'Ikki bosqichli qabartma kukun — natriy bikarbonati, ikki xil kislotali komponent va tashuvchi (odatda kraxmal) aralashmasi. Gaz bir qismi xamir qorilganda, asosiy qismi pechda qizdirilganda ajraladi, shuning uchun xamir pishirishdan oldin turib qolsa ham hajm yo‘qolmaydi. Keks, biskvit, pechenye va qandolat xamirlarida ishlatiladi.',
    ru: 'Разрыхлитель двойного действия — смесь гидрокарбоната натрия, двух кислотных компонентов и наполнителя (обычно крахмала). Часть газа выделяется при замесе, основная — при нагреве в печи, поэтому тесто сохраняет объём, даже если постоит перед выпечкой. Применяется в кексах, бисквитах, печенье и кондитерском тесте.',
    en: 'Double-acting baking powder is a blend of sodium bicarbonate, two acid components and a carrier (usually starch). Some gas is released during mixing and most during heating in the oven, so the batter keeps its volume even if it stands before baking. It is used in cakes, sponges, cookies and confectionery doughs.',
  },
  'sodium-acid-pyrophosphate': {
    uz: 'Natriy atsid pirofosfati (SAPP, CAS 7758-16-9, E450(i)) — qabartma kukunlardagi sekin reaksiyaga kirishuvchi kislotali komponent: gazning asosiy qismi pishirish paytida ajraladi. Shuningdek kartoshka mahsulotlari va snacklarda pishirilgandan keyingi qorayishni oldini olish uchun ishlatiladi.',
    ru: 'Кислый пирофосфат натрия (SAPP, CAS 7758-16-9, E450(i)) — медленно реагирующий кислотный компонент разрыхлителей: основная часть газа выделяется при выпечке. Также используется в картофельных продуктах и снеках для предотвращения потемнения после варки и обжарки.',
    en: 'Sodium acid pyrophosphate (SAPP, CAS 7758-16-9, E450(i)) is a slow-reacting leavening acid, releasing most of its gas during baking. It is also used in potato products and snacks to prevent darkening after cooking.',
  },
  'sodium-stearoyl-lactylate': {
    uz: 'Natriy stearoil laktilati (SSL, CAS 25383-99-7, E481) — non va pishiriq uchun emulgator: xamirni mustahkamlaydi, hajm va mag‘iz yumshoqligini yaxshilaydi, nonning tez qotishini sekinlashtiradi. Sut mahsulotlari va qaymoq o‘rnini bosuvchilarda ham ishlatiladi.',
    ru: 'Стеароиллактилат натрия (SSL, CAS 25383-99-7, E481) — эмульгатор для хлеба и выпечки: укрепляет тесто, улучшает объём и мягкость мякиша, замедляет черствение. Также применяется в молочной продукции и заменителях сливок.',
    en: 'Sodium stearoyl lactylate (SSL, CAS 25383-99-7, E481) is an emulsifier for bread and bakery: it strengthens dough, improves volume and crumb softness and slows staling. It is also used in dairy products and cream substitutes.',
  },
  datem: {
    uz: 'DATEM (mono- va diglitseridlarning diatsetilvino kislotasi efirlari, E472e) — xamirni mustahkamlovchi emulgator. Kleykovina tarmog‘ini kuchaytiradi va gazni yaxshiroq ushlab turadi: non hajmi oshadi, mag‘iz tuzilishi bir tekis bo‘ladi; ayniqsa kleykovinasi kuchsiz un va muzlatilgan xamirda foydali.',
    ru: 'DATEM (эфиры диацетилвинной кислоты и моно- и диглицеридов, E472e) — эмульгатор-укрепитель теста. Усиливает клейковинный каркас и газоудерживающую способность: увеличивается объём хлеба, мякиш становится равномернее; особенно полезен для муки со слабой клейковиной и замороженного теста.',
    en: 'DATEM (diacetyl tartaric acid esters of mono- and diglycerides, E472e) is a dough-strengthening emulsifier. It reinforces the gluten network and improves gas retention, giving greater loaf volume and a more even crumb; it is particularly useful with weak flours and frozen dough.',
  },
  'sodium-hexametaphosphate': {
    uz: 'Natriy geksametafosfati (SHMP, CAS 10124-56-8, E452(i)) — kalsiy va magniy ionlarini bog‘lovchi sekvestrant. Go‘sht mahsulotlarida namlikni ushlab turishni yaxshilaydi, eritilgan pishloq va sut mahsulotlarida eritish tuzi va stabilizator, ichimliklarda esa suv qattiqligi ta’sirini kamaytiruvchi sifatida ishlatiladi.',
    ru: 'Гексаметафосфат натрия (SHMP, CAS 10124-56-8, E452(i)) — секвестрант, связывающий ионы кальция и магния. В мясной продукции улучшает влагоудержание, в плавленых сырах и молочной продукции работает как плавильная соль и стабилизатор, в напитках снижает влияние жёсткости воды.',
    en: 'Sodium hexametaphosphate (SHMP, CAS 10124-56-8, E452(i)) is a sequestrant that binds calcium and magnesium ions. In meat products it improves water retention, in processed cheese and dairy it acts as an emulsifying salt and stabiliser, and in beverages it reduces the effect of water hardness.',
  },

  // --- Oziq-ovqat qo‘shimchalari va komoditi: qolgan pozitsiyalar (2026-11-26) ---
  // Faqat umumiy texnologik faktlar; tarkib/yog‘lilik/oqsil ulushi kabi aniq
  // ko‘rsatkichlar uchun — "spetsifikatsiya bo‘yicha" (to‘qilgan raqam yo‘q).
  'glucose-powder': {
    uz: 'Glyukoza (D-glyukoza, dekstroza, CAS 50-99-7) kukuni — monosaxarid, saxarozadan kamroq shirin. Pishiriqda xamirturush uchun oziq bo‘lib, qobiqning qizarishini (Mayyar reaksiyasi) kuchaytiradi; qandolatda shirinlikni yumshatadi va kristallanishni boshqaradi; ichimliklarda tez o‘zlashtiriladigan uglevod manbai sifatida ishlatiladi.',
    ru: 'Глюкоза (D-глюкоза, декстроза, CAS 50-99-7) в порошке — моносахарид, менее сладкий, чем сахароза. В выпечке служит питанием для дрожжей и усиливает подрумянивание корки (реакция Майяра), в кондитерских изделиях снижает приторность и регулирует кристаллизацию, в напитках — источник быстроусвояемых углеводов.',
    en: 'Glucose powder (D-glucose, dextrose, CAS 50-99-7) is a monosaccharide that is less sweet than sucrose. In bakery it feeds the yeast and enhances crust browning (Maillard reaction), in confectionery it softens sweetness and helps control crystallisation, and in beverages it is a fast-absorbed carbohydrate source.',
  },
  fructose: {
    uz: 'Fruktoza (CAS 57-48-7) — meva shakari, saxarozadan shirinroq monosaxarid (shirinlik harorat va muhitga bog‘liq). Gigroskopik: pishiriqda namlikni ushlab turadi, ichimlik va sut mahsulotlarida meva ta’mini ochadi; sport ozuqasi va maxsus mahsulotlarda ham ishlatiladi.',
    ru: 'Фруктоза (CAS 57-48-7) — плодовый сахар, моносахарид слаще сахарозы (степень сладости зависит от температуры и среды). Гигроскопична: удерживает влагу в выпечке, подчёркивает фруктовый вкус в напитках и молочной продукции; применяется также в спортивном и специализированном питании.',
    en: 'Fructose (CAS 57-48-7) is fruit sugar, a monosaccharide sweeter than sucrose (relative sweetness depends on temperature and matrix). It is hygroscopic, keeping bakery goods moist, and lifts fruit notes in beverages and dairy; it is also used in sports and special-purpose nutrition.',
  },
  'stevia-extract-rebaudioside-a': {
    uz: 'Steviya ekstrakti — rebaudiozid A (CAS 58543-16-1; steviol glikozidlari, E960) — Stevia rebaudiana bargidan olinadigan intensiv shirinlashtirgich, saxarozadan yuzlab marta shirin. Issiqlik va kislotali muhitga chidamli; yuqori dozada qizilmiyaga o‘xshash yoki achchiqroq ta’m qoldirishi mumkin, shuning uchun ko‘pincha eritritol yoki aromatizatorlar bilan birga ishlatiladi. Ichimliklar, sut mahsulotlari va sport ozuqasida qo‘llanadi.',
    ru: 'Экстракт стевии — ребаудиозид A (CAS 58543-16-1; стевиол-гликозиды, E960) — интенсивный подсластитель из листьев Stevia rebaudiana, в сотни раз слаще сахарозы. Устойчив к нагреву и кислой среде; в высоких дозах может давать лакричное или горьковатое послевкусие, поэтому часто комбинируется с эритритолом или ароматизаторами. Применяется в напитках, молочной продукции и спортивном питании.',
    en: 'Stevia extract, rebaudioside A (CAS 58543-16-1; steviol glycosides, E960), is an intense sweetener from Stevia rebaudiana leaves, hundreds of times sweeter than sucrose. It is stable to heat and acidity; at high levels it can leave a liquorice-like or bitter aftertaste, so it is often combined with erythritol or flavours. It is used in beverages, dairy and sports nutrition.',
  },
  'glucose-syrup-80-de': {
    uz: 'Glyukoza siropi 80 DE — kraxmal gidrolizi mahsuloti; DE (dekstroza ekvivalenti) yuqori bo‘lgani uchun past DE siroplarga qaraganda shirinroq, kamroq yopishqoq va gigroskopikroq, qizarishni kuchliroq beradi. Qandolatda saxarozaning kristallanishini oldini oladi, pishiriqda namlikni saqlaydi, muzqaymoqda muzlash haroratini pasaytiradi.',
    ru: 'Глюкозный сироп 80 DE — продукт гидролиза крахмала; благодаря высокому DE (декстрозному эквиваленту) он слаще, менее вязкий и более гигроскопичный, чем сиропы с низким DE, и сильнее участвует в подрумянивании. В кондитерских изделиях предотвращает кристаллизацию сахарозы, в выпечке удерживает влагу, в мороженом снижает температуру замерзания.',
    en: 'Glucose syrup 80 DE is a starch hydrolysate; its high DE (dextrose equivalent) makes it sweeter, less viscous and more hygroscopic than low-DE syrups, with stronger browning. In confectionery it prevents sucrose crystallisation, in bakery it retains moisture and in ice cream it lowers the freezing point.',
  },
  'invert-sugar-syrup': {
    uz: 'Invert shakar siropi — saxarozani (kislota yoki invertaza fermenti bilan) glyukoza va fruktozaga parchalab olinadi. Oddiy shakar siropidan shirinroq, kristallanmaydi va namlikni yaxshi ushlaydi: pishiriq uzoqroq yumshoq qoladi, qandolat to‘ldirmalari va glazurlar silliq bo‘ladi; ichimliklarda ham ishlatiladi.',
    ru: 'Инвертный сироп получают расщеплением сахарозы (кислотой или ферментом инвертазой) на глюкозу и фруктозу. Слаще обычного сахарного сиропа, не кристаллизуется и хорошо удерживает влагу: выпечка дольше остаётся мягкой, кондитерские начинки и глазури — гладкими; применяется также в напитках.',
    en: 'Invert sugar syrup is made by splitting sucrose (with acid or the enzyme invertase) into glucose and fructose. It is sweeter than plain sugar syrup, does not crystallise and holds moisture well, so baked goods stay soft longer and confectionery fillings and glazes stay smooth; it is also used in beverages.',
  },
  'coconut-milk-powder': {
    uz: 'Quruq kokos suti — kokos suti yoki qaymog‘ini purkab quritish yo‘li bilan olinadi, odatda tashuvchi (masalan, maltodekstrin) bilan; aniq tarkib va yog‘lilik spetsifikatsiyada ko‘rsatiladi. Qandolat, ichimliklar, muzqaymoq va sut mahsulotlarida kokos ta’mi va qaymoqsimon tuzilish uchun ishlatiladi.',
    ru: 'Сухое кокосовое молоко получают распылительной сушкой кокосового молока или сливок, как правило с носителем (например, мальтодекстрином); точный состав и жирность указываются в спецификации. Применяется в кондитерских изделиях, напитках, мороженом и молочной продукции для кокосового вкуса и сливочной текстуры.',
    en: 'Coconut milk powder is made by spray-drying coconut milk or cream, usually with a carrier such as maltodextrin; exact composition and fat content are given in the specification. It is used in confectionery, beverages, ice cream and dairy for coconut flavour and a creamy texture.',
  },
  'buttermilk-powder': {
    uz: 'Quruq paxta (buttermilk) — sariyog‘ ishlab chiqarishda qoladigan suyuqlikni quritib olinadi. Sut yog‘i sharchalari membranasidan fosfolipidlarga boy, shuning uchun yaxshi emulgatsiyalovchi xususiyatga ega va sariyog‘-sutli ta’m beradi. Pishiriq (keks, pankeyk, biskvit), qandolat va sut mahsulotlarida ishlatiladi.',
    ru: 'Сухая пахта — высушенная жидкость, остающаяся при сбивании сливочного масла. Богата фосфолипидами мембран жировых шариков молока, поэтому обладает хорошими эмульгирующими свойствами и даёт сливочно-молочный вкус. Применяется в выпечке (кексы, панкейки, бисквиты), кондитерских изделиях и молочной продукции.',
    en: 'Buttermilk powder is the dried liquid left after churning butter. It is rich in phospholipids from the milk fat globule membrane, so it has good emulsifying properties and gives a buttery-milky taste. It is used in bakery (cakes, pancakes, sponges), confectionery and dairy.',
  },
  'cheese-powder-cheddar': {
    uz: 'Chedder pishloq kukuni — pishloqni (odatda eritish tuzlari bilan) eritib, purkab quritish yo‘li bilan olinadi; pishloq ulushi, tuz va boshqa komponentlar spetsifikatsiyada. Chips va sneklar uchun sepmalar, pishloqli souslar va pishiriq to‘ldirmalarida ishlatiladi.',
    ru: 'Сырный порошок чеддер получают расплавлением сыра (обычно с плавильными солями) и распылительной сушкой; доля сыра, соль и прочие компоненты указываются в спецификации. Применяется в посыпках для чипсов и снеков, сырных соусах и начинках для выпечки.',
    en: 'Cheddar cheese powder is made by melting cheese (usually with emulsifying salts) and spray-drying it; cheese content, salt and other components are given in the specification. It is used in seasonings for crisps and snacks, cheese sauces and bakery fillings.',
  },
  'yeast-extract': {
    uz: 'Xamirturush ekstrakti — xamirturush (Saccharomyces cerevisiae) hujayralarining avtolizi natijasida olinadi; glutamin kislotasi va nukleotidlarga boy, umami — go‘shtli-bulonli ta’m beradi. Souslar, sneklar, go‘sht mahsulotlari va HoReCa yarim tayyor mahsulotlarida ta’m kuchaytiruvchi sifatida, shuningdek tuz miqdorini kamaytirishda ishlatiladi.',
    ru: 'Дрожжевой экстракт получают автолизом клеток дрожжей (Saccharomyces cerevisiae); он богат глутаминовой кислотой и нуклеотидами и даёт вкус умами — мясной, бульонный. Используется как усилитель вкуса в соусах, снеках, мясной продукции и полуфабрикатах для HoReCa, а также при снижении содержания соли.',
    en: 'Yeast extract is made by autolysis of yeast cells (Saccharomyces cerevisiae); it is rich in glutamic acid and nucleotides and gives an umami, meaty-brothy taste. It is used as a flavour enhancer in sauces, snacks, meat products and HoReCa convenience foods, and to help reduce salt.',
  },
  'hydrolysed-vegetable-protein': {
    uz: 'Gidrolizlangan o‘simlik oqsili (HVP) — soya, bug‘doy yoki makkajo‘xori oqsilini gidrolizlab olinadi; aminokislotalarga boy, go‘shtli-bulonli ta’m beradi. Souslar, sho‘rvalar, sneklar, go‘sht mahsulotlari va konservalarda ishlatiladi. Oqsil manbai spetsifikatsiyada ko‘rsatiladi — allergen (soya, glyuten) markirovkasi uchun muhim.',
    ru: 'Гидролизованный растительный белок (HVP) получают гидролизом белка сои, пшеницы или кукурузы; он богат аминокислотами и даёт мясной, бульонный вкус. Применяется в соусах, супах, снеках, мясной продукции и консервах. Источник белка указывается в спецификации — это важно для маркировки аллергенов (соя, глютен).',
    en: 'Hydrolysed vegetable protein (HVP) is made by hydrolysing soy, wheat or maize protein; it is rich in amino acids and gives a meaty, brothy taste. It is used in sauces, soups, snacks, meat products and canned foods. The protein source is stated in the specification, which matters for allergen labelling (soy, gluten).',
  },
  'wheat-gluten': {
    uz: 'Bug‘doy kleykovinasi (quruq kleykovina, vital wheat gluten) — bug‘doy unidan kraxmalni yuvib ajratib, quritib olinadigan oqsil kukuni. Kuchsiz unni mustahkamlaydi, xamirning gaz ushlashini va non hajmini oshiradi; go‘sht va vegetarian mahsulotlarda bog‘lovchi sifatida ishlatiladi. Tarkibida glyuten bor — allergen sifatida markirovka qilinadi.',
    ru: 'Пшеничная клейковина (сухой глютен, vital wheat gluten) — белковый порошок, получаемый отмыванием крахмала из пшеничной муки и сушкой. Укрепляет слабую муку, повышает газоудерживающую способность теста и объём хлеба; в мясной и вегетарианской продукции работает как связующее. Содержит глютен — маркируется как аллерген.',
    en: 'Wheat gluten (vital wheat gluten) is a protein powder obtained by washing the starch out of wheat flour and drying it. It strengthens weak flour, improves gas retention and loaf volume, and acts as a binder in meat and vegetarian products. It contains gluten and is labelled as an allergen.',
  },
  'soya-protein-isolate': {
    uz: 'Soya oqsili izolyati — yog‘sizlantirilgan soyadan olinadigan eng toza soya oqsili shakli (quruq moddada oqsil kamida 90%). Suv va yog‘ni bog‘laydi, emulgatsiyalaydi va gel hosil qiladi: go‘sht mahsulotlari (kolbasa, in’eksiya), oqsilli ichimliklar, sport ozuqasi va pishiriqda ishlatiladi. Soya — allergen sifatida markirovka qilinadi.',
    ru: 'Изолят соевого белка — наиболее очищенная форма соевого белка из обезжиренной сои (не менее 90% белка в сухом веществе). Связывает воду и жир, эмульгирует и образует гель: применяется в мясной продукции (колбасы, инъецирование), белковых напитках, спортивном питании и выпечке. Соя маркируется как аллерген.',
    en: 'Soya protein isolate is the most refined form of soy protein, made from defatted soybeans (at least 90% protein on a dry basis). It binds water and fat, emulsifies and forms gels, and is used in meat products (sausages, injection brines), protein drinks, sports nutrition and bakery. Soy is labelled as an allergen.',
  },
  'pea-protein-isolate': {
    uz: 'No‘xat (sariq no‘xat, Pisum sativum) oqsili izolyati — o‘simlik oqsili, soya va glyutensiz mahsulotlar uchun muqobil. Sport ozuqasi, oqsilli ichimliklar va o‘simlik asosidagi go‘sht analoglarida ishlatiladi; neytralroq ta’m uchun ko‘pincha aromatizatorlar bilan birga qo‘llanadi. Oqsil ulushi spetsifikatsiyada.',
    ru: 'Изолят горохового белка (жёлтый горох, Pisum sativum) — растительный белок, альтернатива соевому для продуктов без сои и глютена. Применяется в спортивном питании, белковых напитках и растительных аналогах мяса; для более нейтрального вкуса часто используется вместе с ароматизаторами. Доля белка — по спецификации.',
    en: 'Pea protein isolate (yellow pea, Pisum sativum) is a plant protein and an alternative to soy for soy-free and gluten-free products. It is used in sports nutrition, protein drinks and plant-based meat analogues, often together with flavours to achieve a more neutral taste. Protein content is given in the specification.',
  },
  'cocoa-powder-alkalised-10-12': {
    uz: 'Alkalizatsiyalangan kakao kukuni 10–12% (tarkibida 10–12% kakao yog‘i) — kakao ishqoriy ishlov (“golland usuli”)dan o‘tgan: rangi to‘qroq, ta’mi yumshoqroq va kamroq nordon, suyuqlikda yaxshiroq tarqaladi. Kakao ichimliklari, sut mahsulotlari, to‘q rangli pishiriq va qandolatda ishlatiladi.',
    ru: 'Какао-порошок алкализованный 10–12% (содержание какао-масла 10–12%) прошёл щелочную обработку («голландский способ»): он темнее, с более мягким и менее кислым вкусом и лучше диспергируется в жидкости. Применяется в какао-напитках, молочной продукции, тёмной выпечке и кондитерских изделиях.',
    en: 'Alkalised cocoa powder 10–12% (10–12% cocoa butter) has undergone alkali treatment (“Dutch process”): it is darker, with a milder, less acidic taste, and disperses better in liquids. It is used in cocoa drinks, dairy, dark-coloured bakery and confectionery.',
  },
  'cocoa-powder-natural-10-12': {
    uz: 'Tabiiy kakao kukuni 10–12% (tarkibida 10–12% kakao yog‘i) — ishqoriy ishlovsiz: rangi ochroq jigarrang, kakao ta’mi o‘tkirroq va nordonroq. Tabiiy kislotaliligi tufayli pishiriqda soda bilan reaksiyaga kirishib, ko‘pchitishga yordam beradi. Pishiriq, sut mahsulotlari va qandolatda ishlatiladi.',
    ru: 'Какао-порошок натуральный 10–12% (содержание какао-масла 10–12%) — без щелочной обработки: светлее по цвету, с более ярким и кисловатым какао-вкусом. Благодаря природной кислотности реагирует с содой в выпечке и помогает разрыхлению. Применяется в выпечке, молочной продукции и кондитерских изделиях.',
    en: 'Natural cocoa powder 10–12% (10–12% cocoa butter) is not alkalised: it is lighter in colour with a sharper, slightly acidic cocoa taste. Its natural acidity reacts with baking soda and helps leavening in bakery. It is used in bakery, dairy and confectionery.',
  },
  'milk-chocolate-compound': {
    uz: 'Sutli qandolat glazuri (compound) — kakao yog‘i o‘rniga o‘simlik yog‘lari (kakao yog‘i ekvivalentlari yoki o‘rnini bosuvchilar) ishlatiladi, shuning uchun temperlash talab qilinmaydi va ishlash oson. Tarkibida shakar, quruq sut va kakao kukuni bor. Konfet, pechenye va vaflilarni qoplash, pishiriq bezagi va muzqaymoq uchun ishlatiladi; markirovkada shokolad emas, glazur deb ataladi.',
    ru: 'Молочная кондитерская глазурь (compound) — вместо какао-масла используются растительные жиры (эквиваленты или заменители какао-масла), поэтому темперирование не требуется и с глазурью проще работать. Содержит сахар, сухое молоко и какао-порошок. Применяется для глазирования конфет, печенья и вафель, декора выпечки и мороженого; в маркировке называется глазурью, а не шоколадом.',
    en: 'Milk chocolate compound coating uses vegetable fats (cocoa butter equivalents or substitutes) instead of cocoa butter, so it needs no tempering and is easy to work with. It contains sugar, milk powder and cocoa powder. It is used for enrobing sweets, biscuits and wafers, decorating bakery and ice cream; it is labelled as a compound coating, not chocolate.',
  },
  'dark-chocolate-compound': {
    uz: 'To‘q qandolat glazuri (compound) — kakao kukuni, shakar va o‘simlik yog‘lari asosida, sutsiz; kakao yog‘i o‘rniga o‘simlik yog‘lari ishlatilgani uchun temperlashsiz ishlatiladi va tez qotadi. Konfet, pechenye, keks va vaflilarni qoplash, pishiriq bezagi va muzqaymoq qoplamasi uchun; markirovkada shokolad emas, glazur deb ataladi.',
    ru: 'Тёмная кондитерская глазурь (compound) — на основе какао-порошка, сахара и растительных жиров, без молока; так как вместо какао-масла используются растительные жиры, работает без темперирования и быстро застывает. Применяется для глазирования конфет, печенья, кексов и вафель, декора выпечки и покрытия мороженого; в маркировке называется глазурью, а не шоколадом.',
    en: 'Dark chocolate compound coating is based on cocoa powder, sugar and vegetable fats, with no milk; because vegetable fats replace cocoa butter it works without tempering and sets quickly. It is used for enrobing sweets, biscuits, cakes and wafers, decorating bakery and coating ice cream; it is labelled as a compound coating, not chocolate.',
  },
  'refined-salt-extra-fine': {
    uz: 'Mayda tortilgan tozalangan tuz (natriy xlorid, CAS 7647-14-5), “Ekstra” — juda mayda va bir xil donadorligi tufayli tez eriydi va quruq aralashmalarda bir tekis taqsimlanadi. Sneklar uchun sepmalar, souslar, go‘sht mahsulotlari, konserva va pishiriqda ishlatiladi.',
    ru: 'Соль поваренная экстра мелкого помола (хлорид натрия, CAS 7647-14-5) — благодаря очень мелкому и равномерному зерну быстро растворяется и равномерно распределяется в сухих смесях. Применяется в посыпках для снеков, соусах, мясной продукции, консервах и выпечке.',
    en: 'Extra-fine refined salt (sodium chloride, CAS 7647-14-5) dissolves quickly and distributes evenly in dry blends thanks to its very fine, uniform grain. It is used in snack seasonings, sauces, meat products, canned foods and bakery.',
  },
  'iodised-salt': {
    uz: 'Yodlangan tuz — natriy xloridga (CAS 7647-14-5) yod birikmasi (odatda kaliy yodat) qo‘shilgan osh tuzi; yod yetishmovchiligining oldini olish uchun ishlab chiqariladi. Go‘sht mahsulotlari, souslar, konserva va sneklarda oddiy tuz o‘rnida ishlatiladi; yod miqdori spetsifikatsiyada ko‘rsatiladi.',
    ru: 'Йодированная соль — поваренная соль (хлорид натрия, CAS 7647-14-5) с добавлением соединения йода (как правило, йодата калия); выпускается для профилактики йододефицита. Используется вместо обычной соли в мясной продукции, соусах, консервах и снеках; содержание йода указывается в спецификации.',
    en: 'Iodised salt is table salt (sodium chloride, CAS 7647-14-5) with an added iodine compound, usually potassium iodate, produced to help prevent iodine deficiency. It replaces ordinary salt in meat products, sauces, canned foods and snacks; iodine content is given in the specification.',
  },
  'sunflower-oil-refined': {
    uz: 'Rafinatsiyalangan dezodoratsiyalangan kungaboqar yog‘i — neytral ta’m va hidga ega, linol kislotasiga boy suyuq o‘simlik yog‘i. Souslar va mayonez, pishiriq, sneklarni qovurish va konservalarda ishlatiladi; aromatizatorlar uchun neytral asos ham bo‘la oladi.',
    ru: 'Подсолнечное масло рафинированное дезодорированное — жидкое растительное масло с нейтральным вкусом и запахом, богатое линолевой кислотой. Применяется в соусах и майонезах, выпечке, обжарке снеков и консервах; подходит как нейтральная основа для масляных ароматизаторов.',
    en: 'Refined, deodorised sunflower oil is a liquid vegetable oil with neutral taste and odour, rich in linoleic acid. It is used in sauces and mayonnaise, bakery, snack frying and canned foods, and serves as a neutral base for oil-soluble flavours.',
  },
  'palm-oil-rbd': {
    uz: 'RBD palma yog‘i (Refined, Bleached, Deodorised — rafinatsiyalangan, oqartirilgan, dezodoratsiyalangan) — xona haroratida yarim qattiq, neytral ta’mli o‘simlik yog‘i; to‘yingan yog‘ kislotalari ulushi yuqori bo‘lgani uchun oksidlanishga suyuq yog‘lardan chidamliroq. Margarin va shortening, pishiriq, qandolat to‘ldirmalari va qovurishda ishlatiladi.',
    ru: 'Пальмовое масло RBD (Refined, Bleached, Deodorised — рафинированное, отбелённое, дезодорированное) — полутвёрдое при комнатной температуре растительное масло с нейтральным вкусом; за счёт высокой доли насыщенных жирных кислот устойчивее к окислению, чем жидкие масла. Применяется в маргаринах и шортенингах, выпечке, кондитерских начинках и для фритюра.',
    en: 'RBD palm oil (refined, bleached, deodorised) is a vegetable oil that is semi-solid at room temperature with a neutral taste; its high share of saturated fatty acids makes it more oxidation-stable than liquid oils. It is used in margarine and shortening, bakery, confectionery fillings and frying.',
  },
  'coconut-oil-fractionated': {
    uz: 'Fraksiyalangan kokos yog‘i (MCT; kaprilik/kaprik triglitseridlar, CAS 65381-09-1) — xona haroratida suyuq, rangsiz va deyarli hidsiz, oksidlanishga juda chidamli yog‘. Aromatizatorlar uchun erituvchi va tashuvchi, qandolatda yaltiratuvchi va qolipdan ajratuvchi vosita, kosmetikada tashuvchi yog‘ sifatida ishlatiladi.',
    ru: 'Фракционированное кокосовое масло (MCT; триглицериды каприловой/каприновой кислот, CAS 65381-09-1) — жидкое при комнатной температуре, бесцветное и практически без запаха, очень устойчивое к окислению. Применяется как растворитель и носитель ароматизаторов, глянцеватель и разделительное средство в кондитерском производстве, базовое масло в косметике.',
    en: 'Fractionated coconut oil (MCT; caprylic/capric triglyceride, CAS 65381-09-1) is liquid at room temperature, colourless, almost odourless and highly resistant to oxidation. It is used as a solvent and carrier for flavours, a glazing and release agent in confectionery, and a carrier oil in cosmetics.',
  },
  'salt-industrial-bulk': {
    uz: 'Natriy xlorid (CAS 7647-14-5) navalom — sanoat hajmlari uchun. Muhim: “texnik tuz” atamasi ko‘pincha ovqatga yaroqsiz tuzni (suv tayyorlash, muzga qarshi) bildiradi — oziq-ovqat ishlab chiqarishida ishlatishdan oldin nav va oziq-ovqat talablariga mosligini spetsifikatsiya bo‘yicha tekshiring.',
    ru: 'Хлорид натрия (CAS 7647-14-5) навалом — для промышленных объёмов. Важно: термином «техническая соль» часто называют непищевую соль (водоподготовка, противогололёдная обработка) — перед применением в пищевом производстве сверьте сорт и соответствие пищевым требованиям по спецификации.',
    en: 'Sodium chloride (CAS 7647-14-5) in bulk for industrial volumes. Note that “industrial salt” often means non-food salt (water treatment, de-icing), so check the grade and food-use compliance against the specification before using it in food production.',
  },
  'wheat-flour-premium': {
    uz: 'Oliy navli bug‘doy uni — asosan don endospermidan tortiladi: oq rangli, kul miqdori eng past nav. Shirin (sdoba) pishiriq, biskvit, pechenye va qandolat mahsulotlari uchun ishlatiladi; kleykovina miqdori va sifati spetsifikatsiyada ko‘rsatiladi.',
    ru: 'Мука пшеничная высшего сорта — мелется в основном из эндосперма зерна: белая, с наименьшей зольностью среди сортов. Применяется для сдобной выпечки, бисквитов, печенья и кондитерских изделий; количество и качество клейковины указываются в спецификации.',
    en: 'Premium-grade wheat flour is milled mainly from the grain endosperm: it is white and has the lowest ash content of the grades. It is used for enriched bakery, sponges, biscuits and confectionery; gluten content and quality are given in the specification.',
  },
  'cocoa-mass-liquor': {
    uz: 'Kakao massasi (maydalangan kakao, cocoa liquor) — qovurilgan kakao donalarini maydalab olinadi; taxminan yarmi kakao yog‘idan iborat, xona haroratida qattiq, qizdirilganda eriydi. Shokolad va shokoladli glazurlarning asosi: kakao yog‘i va shakar bilan birga ishlatiladi, qandolatda kakao ta’mini beradi.',
    ru: 'Какао тёртое (какао-масса, cocoa liquor) получают измельчением обжаренных какао-бобов; примерно половину массы составляет какао-масло, при комнатной температуре продукт твёрдый и плавится при нагреве. Основа шоколада и шоколадных глазурей: используется вместе с какао-маслом и сахаром, придаёт кондитерским изделиям какао-вкус.',
    en: 'Cocoa mass (cocoa liquor) is made by grinding roasted cocoa nibs; roughly half of it is cocoa butter, so it is solid at room temperature and melts when warmed. It is the base of chocolate and chocolate coatings, used together with cocoa butter and sugar to give confectionery its cocoa taste.',
  },
  'whole-milk-powder-bulk': {
    uz: 'Yog‘li quruq sut navalom — butun sutni quritib olinadi (Codex Alimentarius bo‘yicha sut yog‘i 26% dan 42% gacha); aniq yog‘lilik va oqsil spetsifikatsiyada. Sanoat hajmlarida shokolad, qandolat, sut mahsulotlari, pishiriq va muzqaymoq uchun ishlatiladi.',
    ru: 'Сухое цельное молоко навалом получают сушкой цельного молока (по Codex Alimentarius массовая доля молочного жира — от 26% до 42%); точная жирность и белок — по спецификации. В промышленных объёмах применяется в шоколаде, кондитерских изделиях, молочной продукции, выпечке и мороженом.',
    en: 'Whole milk powder in bulk is made by drying whole milk (under the Codex Alimentarius milk fat is 26% to under 42%); exact fat and protein are given in the specification. It is used in industrial volumes in chocolate, confectionery, dairy, bakery and ice cream.',
  },
  'whey-powder-bulk': {
    uz: 'Zardob kukuni navalom — pishloq yoki tvorog ishlab chiqarishda qoladigan zardobni quritib olinadi; laktozaga boy, zardob oqsillari va minerallar saqlaydi. Turi (shirin yoki nordon zardob) spetsifikatsiyada. Qandolat, pishiriq va muzqaymoqda quruq sutning bir qismi o‘rnida va qizarishni yaxshilash uchun ishlatiladi.',
    ru: 'Сухая сыворотка навалом — высушенная сыворотка, остающаяся при производстве сыра или творога; богата лактозой, содержит сывороточные белки и минеральные вещества. Тип (подсырная сладкая или кислая) указывается в спецификации. В кондитерских изделиях, выпечке и мороженом заменяет часть сухого молока и улучшает подрумянивание.',
    en: 'Whey powder in bulk is dried whey left over from cheese or curd production; it is rich in lactose and contains whey proteins and minerals. The type (sweet or acid whey) is given in the specification. In confectionery, bakery and ice cream it replaces part of the milk powder and improves browning.',
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
  'skimmed-milk-powder-bulk': 'skimmed-milk-powder',
};

export function productFacts(slug: string, locale: Locale): string | null {
  const key = PRODUCT_FACTS[slug] ? slug : FACT_ALIASES[slug];
  return (key && PRODUCT_FACTS[key]?.[locale]) ?? null;
}
