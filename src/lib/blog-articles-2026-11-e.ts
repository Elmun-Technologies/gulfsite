/**
 * BLOG — 2026-noyabr, 5-to‘plam: qandolat (konditer) mahsulotlari uchun aromatizatorlar.
 * Qoidalar `blog.ts` sarlavhasida: faqat UZ/RU, to‘qilgan raqam/da’vo yo‘q.
 * Raqamlar — katalog ma’lumotidan: qandolat sohasi bilan belgilangan 178 ta suyuq aromatizator,
 * ularning hammasida tavsiya etilgan dozalash 0,05–0,3%. Narx, sertifikat va saqlash muddati — so‘rov bo‘yicha.
 */

import type { BlogArticle } from './blog';

export const ARTICLES_2026_11_E: BlogArticle[] = [
  {
    slug: 'qandolat-uchun-aromatizator-tanlash',
    published: '2026-11-23',
    text: {
      uz: {
        title: 'Qandolat uchun aromatizator tanlash',
        description:
          'Qandolat va konditer mahsulotlari uchun suyuq aromatizatorlar: mevali, rezavor, shokolad, yalpiz. Dozalash 0,05–0,3%, tanlash tartibi va bepul namuna.',
        intro:
          'Gulf Flavours katalogida qandolat sohasi uchun 178 ta suyuq aromatizator belgilangan: mevali, rezavor, shirin, yalpizli, shokoladli, yong‘oqli va boshqa guruhlar. Ularning barchasida tavsiya etilgan dozalash 0,05–0,3%. Quyida konditer ishlab chiqaruvchi uchun tanlash tartibi: qaysi guruh qaysi mahsulotga mos, nimalarga e’tibor berish va sinovni qanday boshlash.',
        blocks: [
          { h2: 'Qandolatda qaysi guruhlar ko‘p ishlatiladi' },
          {
            p: 'Katalogda qandolat bilan belgilangan aromatizatorlar eng ko‘p mevali (23 ta), rezavor (22 ta) va shirin (19 ta) guruhlarda. Keyingi o‘rinlarda yalpiz va sovutuvchi (14 ta), sitrus (13 ta), shokolad va kakao (13 ta), spirtli ta’mlar (13 ta), tropik (11 ta), yong‘oqli (10 ta) va pishiriq ta’mlari (10 ta) turadi.',
          },
          { h2: 'Mahsulot turiga qarab tanlash' },
          {
            ul: [
              'Karamel, konfet va jelatinli mahsulotlar (marmelad, jelli) — mevali, rezavor va sitrus guruhlari; ta’m yorqinligi va nordonlik muvozanatini sinab ko‘ring.',
              'Shokolad va glazur massalari — shokolad va kakao, yong‘oqli va shirin (vanil, karamel) guruhlari.',
              'Saqich va nafas fresherlari — yalpiz va sovutuvchi guruh.',
              'To‘ldirmalar va kremlar — shirin, sut-qaymoqli va yong‘oqli ta’mlar.',
              'Pishiriq va vafli — pishiriq ta’mlari (sariyog‘, vanil, bisqvit) va mevali guruhlar.',
            ],
          },
          { h2: 'Tanlashda nimalarga e’tibor berish' },
          {
            ul: [
              'Dozalash — katalogdagi qandolat aromatizatorlari uchun tavsiya 0,05–0,3%; aniq miqdor retsept, harorat va massa turiga qarab sinov bilan aniqlanadi.',
              'Termik barqarorlik — qaynatiladigan karamel va pishiriladigan massalarda ta’m yo‘qolishini sinovda tekshiring; aromatizatorni imkon qadar massa sovigach qo‘shing.',
              'Shakl — qandolat uchun ko‘rsatilgan pozitsiyalarning barchasi suyuq; quruq aralashmalar uchun alohida turlar kerak bo‘lsa, so‘rovda ayting.',
              'Hujjatlar — texnik ma’lumot (TDS) va sifat sertifikati; kerakli hujjatlarni so‘rovda oldindan belgilang.',
            ],
          },
          { h2: 'Sinovni qanday boshlash' },
          {
            p: 'Eng tez yo‘l — 3–4 ta nomzod ta’mni tanlab, bepul namuna qutisiga solish. Namuna qutisida 8 tagacha pozitsiya, 25, 50 yoki 100 g hajmda bo‘lishi mumkin. Sinov partiyasida bir xil asosda har bir ta’mni bir xil dozada solishtiring, so‘ng dozani 0,05–0,3% oralig‘ida moslang.',
          },
          { h2: 'Ko‘p so‘raladigan savollar' },
          {
            faq: [
              {
                q: 'Qandolat uchun aromatizator dozasi qancha?',
                a: 'Katalogdagi qandolat aromatizatorlari uchun tavsiya etilgan dozalash 0,05–0,3%. Aniq miqdor retsept va texnologiyaga bog‘liq, shuning uchun sinov partiyasida moslanadi.',
              },
              {
                q: 'Namunani qanday olaman?',
                a: 'Saytda namuna qutisiga 8 tagacha pozitsiya qo‘shib, so‘rov yuborasiz. Hajmlar — 25, 50 yoki 100 g.',
              },
              {
                q: 'Aromatizator qaynatiladigan massada ta’mini saqlaydimi?',
                a: 'Bu aniq ta’m va texnologiyaga bog‘liq. Qaynatiladigan massada sinov o‘tkazing va aromatizatorni imkon qadar sovigan massaga qo‘shing; kerak bo‘lsa, mutaxassisimiz mos pozitsiyani tavsiya qiladi.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/confectionery', label: 'Qandolat sanoati uchun' },
          { path: '/category/flavours/fruit', label: 'Mevali aromatizatorlar' },
          { path: '/category/flavours/berry', label: 'Rezavor aromatizatorlar' },
          { path: '/category/flavours/chocolate', label: 'Shokolad va kakao ta’mlari' },
          { path: '/category/flavours/mint-cool', label: 'Yalpiz va sovutuvchi' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Ароматизаторы для кондитерских изделий',
        description:
          'Жидкие ароматизаторы для кондитерских изделий: фруктовые, ягодные, шоколадные, мятные. Дозировка 0,05–0,3%, как выбрать и получить бесплатный образец.',
        intro:
          'В каталоге Gulf Flavours для кондитерских изделий отмечено 178 жидких ароматизаторов: фруктовые, ягодные, сладкие, мятные, шоколадные, ореховые и другие группы. Для всех них рекомендуемая дозировка — 0,05–0,3%. Ниже — порядок выбора для кондитерского производства: какая группа для какого продукта, на что смотреть и как начать пробу.',
        blocks: [
          { h2: 'Какие группы чаще всего используют в кондитерке' },
          {
            p: 'Среди ароматизаторов каталога, отмеченных для кондитерских изделий, больше всего фруктовых (23), ягодных (22) и сладких (19). Далее идут мятные и охлаждающие (14), цитрусовые (13), шоколадные и какао (13), алкогольные (13), тропические (11), ореховые (10) и выпечные (10).',
          },
          { h2: 'Выбор по типу продукта' },
          {
            ul: [
              'Карамель, конфеты и желейные изделия (мармелад, желе) — фруктовые, ягодные и цитрусовые группы; проверьте яркость вкуса и баланс кислотности.',
              'Шоколад и глазури — шоколадные и какао, ореховые и сладкие (ваниль, карамель) группы.',
              'Жевательная резинка и освежители дыхания — мятные и охлаждающие.',
              'Начинки и кремы — сладкие, сливочные и ореховые вкусы.',
              'Выпечка и вафли — выпечные вкусы (сливочное масло, ваниль, бисквит) и фруктовые группы.',
            ],
          },
          { h2: 'На что смотреть при выборе' },
          {
            ul: [
              'Дозировка — для кондитерских ароматизаторов каталога рекомендуется 0,05–0,3%; точное количество определяется пробой с учётом рецептуры, температуры и типа массы.',
              'Термостабильность — в вареной карамели и выпекаемых массах проверьте, не пропадает ли вкус; по возможности вносите ароматизатор в остывшую массу.',
              'Форма — все позиции, отмеченные для кондитерки, жидкие; если нужны сухие варианты для смесей, укажите это в запросе.',
              'Документы — технические данные (TDS) и сертификат качества; нужные документы отметьте в запросе заранее.',
            ],
          },
          { h2: 'Как начать пробу' },
          {
            p: 'Самый быстрый путь — выбрать 3–4 вкуса-кандидата и добавить их в коробку бесплатных образцов. В коробку помещается до 8 позиций объёмом 25, 50 или 100 г. В пробной партии сравните вкусы на одной основе в одинаковой дозировке, затем подберите дозу в пределах 0,05–0,3%.',
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Какая дозировка ароматизатора для кондитерских изделий?',
                a: 'Для кондитерских ароматизаторов каталога рекомендуется 0,05–0,3%. Точное количество зависит от рецептуры и технологии, поэтому подбирается на пробной партии.',
              },
              {
                q: 'Как получить образец?',
                a: 'Добавьте до 8 позиций в коробку образцов на сайте и отправьте запрос. Объёмы — 25, 50 или 100 г.',
              },
              {
                q: 'Сохраняет ли ароматизатор вкус в вареной массе?',
                a: 'Это зависит от конкретного вкуса и технологии. Проведите пробу в вареной массе и вносите ароматизатор в остывшую массу, если возможно; при необходимости наш специалист подскажет подходящую позицию.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/confectionery', label: 'Для кондитерской отрасли' },
          { path: '/category/flavours/fruit', label: 'Фруктовые ароматизаторы' },
          { path: '/category/flavours/berry', label: 'Ягодные ароматизаторы' },
          { path: '/category/flavours/chocolate', label: 'Шоколад и какао' },
          { path: '/category/flavours/mint-cool', label: 'Мятные и охлаждающие' },
          { path: '/samples', label: 'Бесплатные образцы' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },
];
