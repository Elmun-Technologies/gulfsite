/**
 * BLOG — 2026-noyabr, 4-to‘plam: quruq sut mahsulotlari.
 * Qoidalar `blog.ts` sarlavhasida: faqat UZ/RU, to‘qilgan raqam/da’vo yo‘q.
 * Yog‘ ulushi chegaralari — Codex Alimentarius (quruq sut standarti) bo‘yicha umumiy ta’riflar;
 * qadoqlar — katalog ma’lumoti (1, 5 va 25 kg). Narx, sertifikat va saqlash muddati — so‘rov bo‘yicha.
 */

import type { BlogArticle } from './blog';

export const ARTICLES_2026_11_D: BlogArticle[] = [
  {
    slug: 'quruq-sut-yogli-va-yogsiz-farqi',
    published: '2026-11-23',
    text: {
      uz: {
        title: 'Quruq sut: yog‘li va yog‘sizlantirilgan',
        description:
          'Yog‘sizlantirilgan va yog‘li (26%) quruq sut, shirin zardob kukuni: yog‘ ulushi, mos mahsulotlar, tanlash va saqlash. Ulgurji so‘rov va namuna.',
        intro:
          'Quruq sut tanlashda eng muhim farq — sut yog‘i ulushi. Codex Alimentarius bo‘yicha yog‘sizlantirilgan quruq sutda yog‘ 1,5% dan oshmaydi, yog‘li (butun) quruq sutda esa kamida 26%. Birinchisi qandolat, pishiriq va quruq aralashmalarda sut oqsili va laktoza manbai sifatida, ikkinchisi shokolad, sut ichimliklari va muzqaymoqda to‘liq sut ta’mi va yog‘ uchun ishlatiladi. Pozitsiyani tanlashdan oldin mahsulotingizga qanday yog‘ ulushi va qanday eruvchanlik kerakligini aniqlang.',
        blocks: [
          { h2: 'Yog‘sizlantirilgan va yog‘li quruq sut: asosiy farq' },
          {
            p: 'Quruq sut — pasterizatsiya qilingan sutni bug‘latib, so‘ng quritish yo‘li bilan olinadi. Qaysi sutdan boshlanganiga qarab ikki asosiy tur bo‘ladi: yog‘sizlantirilgan sutdan olingan va butun sutdan olingan.',
          },
          {
            ul: [
              'Yog‘sizlantirilgan quruq sut — sut yog‘i ulushi 1,5% dan oshmaydi. Tarkibida sut oqsili va laktoza qoladi, yog‘ deyarli yo‘q, shuning uchun u uzoqroq saqlanishga mos va ta’mi neytralroq.',
              'Yog‘li (butun) quruq sut, masalan 26% yog‘li — sut yog‘i ulushi kamida 26%. To‘liqroq, "qaymoqli" ta’m va mazali tuzilma beradi.',
              'Shirin zardob kukuni — pishloq tayyorlashda hosil bo‘ladigan zardobni quritib olinadi: laktozaga boy, zardob oqsillari va minerallar bor; sut yog‘i deyarli yo‘q. Sutning to‘liq o‘rnini bosmaydi, lekin retseptdagi sut kukunining bir qismi o‘rniga ishlatilishi mumkin.',
            ],
          },
          { h2: 'Qaysi mahsulotga qaysi tur mos' },
          {
            ul: [
              'Shokolad va qandolat massalari, karamel — yog‘li quruq sut: sut ta’mi va yumshoq tuzilma.',
              'Sut ichimliklari va tez eriydigan aralashmalar — odatda yog‘li quruq sut; eruvchanlik va yog‘ ulushini texnologingiz bilan kelishing.',
              'Muzqaymoq — sut qattiq moddalari manbai sifatida yog‘sizlantirilgan yoki yog‘li quruq sut; yog‘ ulushi retseptga qarab tanlanadi.',
              'Pishiriq va non — yog‘sizlantirilgan quruq sut yoki zardob kukuni: xamir tuzilmasi, qobiq rangi va ta’m uchun.',
              'Quruq aralashmalar va sous asoslari — yog‘sizlantirilgan quruq sut yoki zardob kukuni, narx va oqsil ulushi nuqtai nazaridan.',
            ],
          },
          { h2: 'Tanlash mezonlari' },
          {
            ul: [
              'Yog‘ ulushi — yuqoridagi ikki tur orasidagi asosiy farq; retseptingizga mos keladiganini oling.',
              'Eruvchanlik — tayyor ichimlik va aralashmalar uchun muhim; xomashyo spetsifikatsiyasida ko‘rsatiladi.',
              'Qadoq — katalogda 1, 5 va 25 kg qadoqlar bor; sinov uchun kichik, ishlab chiqarish uchun katta hajm.',
              'Hujjatlar — texnik ma’lumot (TDS) va sifat sertifikati; kerakli hujjatlarni so‘rovda oldindan belgilang.',
            ],
          },
          { h2: 'Saqlash' },
          {
            p: 'Quruq sutni quruq, salqin joyda, yopiq qadoqda va kuchli hidli mahsulotlardan uzoqda saqlang: kukun namlik va begona hidni tez o‘ziga tortadi. Ochilgan qadoqni mahkam yoping. Aniq saqlash sharoiti va muddati xomashyo spetsifikatsiyasida ko‘rsatiladi.',
          },
          { h2: 'Ko‘p so‘raladigan savollar' },
          {
            faq: [
              {
                q: 'Yog‘sizlantirilgan va yog‘li quruq sut o‘rtasida asosiy farq nima?',
                a: 'Sut yog‘i ulushi: Codex Alimentarius bo‘yicha yog‘sizlantirilgan quruq sutda 1,5% dan oshmaydi, yog‘li (butun) quruq sutda kamida 26%.',
              },
              {
                q: 'Zardob kukuni quruq sutni to‘liq almashtira oladimi?',
                a: 'Yo‘q. Zardob kukuni laktozaga boy va zardob oqsillarini beradi, lekin sut yog‘i va kazein deyarli yo‘q. Ko‘pincha retseptdagi sut kukunining bir qismi o‘rniga ishlatiladi.',
              },
              {
                q: 'Qaysi qadoqlar mavjud?',
                a: 'Katalogdagi quruq sut va zardob kukuni pozitsiyalari 1, 5 va 25 kg qadoqda ko‘rsatilgan. Aniq qadoq va narx so‘rov bo‘yicha.',
              },
            ],
          },
        ],
        links: [
          { path: '/catalog/skimmed-milk-powder', label: 'Yog‘sizlantirilgan quruq sut' },
          { path: '/catalog/whole-milk-powder-26', label: 'Yog‘li quruq sut (26%)' },
          { path: '/catalog/whey-powder-sweet', label: 'Shirin zardob kukuni' },
          { path: '/category/food-ingredients/dairy-base', label: 'Sut asosidagi xomashyo' },
          { path: '/industries/dairy', label: 'Sut mahsulotlari uchun' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Сухое молоко: цельное и обезжиренное',
        description:
          'Обезжиренное и цельное (26%) сухое молоко, сладкая сыворотка: жирность, для каких продуктов, выбор и хранение. Оптовый запрос и образцы.',
        intro:
          'При выборе сухого молока главное отличие — массовая доля молочного жира. По Codex Alimentarius в обезжиренном сухом молоке жира не более 1,5%, в цельном — не менее 26%. Первое используют в кондитерских изделиях, выпечке и сухих смесях как источник молочного белка и лактозы, второе — в шоколаде, молочных напитках и мороженом для полного молочного вкуса и жира. Перед выбором определите, какая жирность и растворимость нужны вашему продукту.',
        blocks: [
          { h2: 'Обезжиренное и цельное сухое молоко: главное отличие' },
          {
            p: 'Сухое молоко получают выпариванием и последующей сушкой пастеризованного молока. В зависимости от исходного сырья различают два основных вида: из обезжиренного молока и из цельного.',
          },
          {
            ul: [
              'Обезжиренное сухое молоко — массовая доля молочного жира не более 1,5%. Сохраняются молочный белок и лактоза, жира почти нет, поэтому вкус более нейтральный.',
              'Цельное сухое молоко, например жирностью 26% — молочного жира не менее 26%. Даёт более полный «сливочный» вкус и мягкую структуру.',
              'Сладкая сыворотка сухая — получается сушкой сыворотки от производства сыра: богата лактозой, содержит сывороточные белки и минеральные вещества, молочного жира почти нет. Не заменяет молоко полностью, но может заменять часть сухого молока в рецептуре.',
            ],
          },
          { h2: 'Какой вид для какого продукта' },
          {
            ul: [
              'Шоколад и кондитерские массы, карамель — цельное сухое молоко: молочный вкус и мягкая структура.',
              'Молочные напитки и растворимые смеси — обычно цельное сухое молоко; растворимость и жирность согласуйте с технологом.',
              'Мороженое — обезжиренное или цельное сухое молоко как источник сухих молочных веществ; жирность выбирают по рецептуре.',
              'Выпечка и хлеб — обезжиренное сухое молоко или сыворотка: структура теста, цвет корочки и вкус.',
              'Сухие смеси и основы соусов — обезжиренное молоко или сыворотка, исходя из стоимости и доли белка.',
            ],
          },
          { h2: 'Критерии выбора' },
          {
            ul: [
              'Массовая доля жира — главное различие между двумя видами; берите подходящую вашей рецептуре.',
              'Растворимость — важна для готовых напитков и смесей; указывается в спецификации сырья.',
              'Фасовка — в каталоге есть упаковки 1, 5 и 25 кг; малый объём для проб, крупный для производства.',
              'Документы — техническая информация (TDS) и сертификат качества; нужные документы укажите в запросе заранее.',
            ],
          },
          { h2: 'Хранение' },
          {
            p: 'Храните сухое молоко в сухом прохладном месте, в закрытой упаковке и вдали от продуктов с сильным запахом: порошок быстро впитывает влагу и посторонние запахи. Вскрытую упаковку плотно закрывайте. Точные условия и срок хранения указаны в спецификации сырья.',
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'В чём главное различие обезжиренного и цельного сухого молока?',
                a: 'В массовой доле молочного жира: по Codex Alimentarius в обезжиренном не более 1,5%, в цельном — не менее 26%.',
              },
              {
                q: 'Может ли сыворотка полностью заменить сухое молоко?',
                a: 'Нет. Сыворотка богата лактозой и даёт сывороточные белки, но в ней почти нет молочного жира и казеина. Чаще ею заменяют часть сухого молока в рецептуре.',
              },
              {
                q: 'Какая фасовка доступна?',
                a: 'Позиции сухого молока и сыворотки в каталоге указаны в упаковке 1, 5 и 25 кг. Точная фасовка и цена — по запросу.',
              },
            ],
          },
        ],
        links: [
          { path: '/catalog/skimmed-milk-powder', label: 'Обезжиренное сухое молоко' },
          { path: '/catalog/whole-milk-powder-26', label: 'Цельное сухое молоко (26%)' },
          { path: '/catalog/whey-powder-sweet', label: 'Сладкая сыворотка сухая' },
          { path: '/category/food-ingredients/dairy-base', label: 'Молочное сырьё' },
          { path: '/industries/dairy', label: 'Для молочной продукции' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },
];
