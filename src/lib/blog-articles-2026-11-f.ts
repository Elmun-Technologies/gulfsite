/**
 * BLOG — 2026-noyabr, 6-to‘plam: snack va souslar uchun aromatizatorlar.
 * Qoidalar `blog.ts` sarlavhasida: faqat UZ/RU, to‘qilgan raqam/da’vo yo‘q.
 * Raqamlar — katalog ma’lumotidan: snack sohasi bilan belgilangan 59 ta, souslar bilan 73 ta suyuq
 * aromatizator; ikkalasida tavsiya etilgan dozalash 0,05–0,3%. Narx, sertifikat, saqlash muddati — so‘rov bo‘yicha.
 */

import type { BlogArticle } from './blog';

export const ARTICLES_2026_11_F: BlogArticle[] = [
  {
    slug: 'snack-va-chips-uchun-aromatizator',
    published: '2026-11-23',
    text: {
      uz: {
        title: 'Snack va chips uchun aromatizator',
        description:
          'Snack, chips va popkorn uchun suyuq aromatizatorlar: pishloq, smetana, go‘sht, ziravor. Dozalash 0,05–0,3%, tanlash tartibi va bepul namuna.',
        intro:
          'Gulf Flavours katalogida snack va quruq nonushta sohasi uchun 59 ta suyuq aromatizator belgilangan. Ko‘pchiligi tuzli va go‘shtli (20 ta), ziravorli va o‘tli (12 ta), sabzavotli (10 ta) hamda sut-pishloqli (7 ta) guruhlarda. Hammasida tavsiya etilgan dozalash — 0,05–0,3%. Quyida snack ishlab chiqaruvchi uchun tanlash tartibi.',
        blocks: [
          { h2: 'Snack uchun qaysi ta’m guruhlari' },
          {
            ul: [
              'Pishloq, smetana, sariyog‘ — sut-pishloqli guruh: chips va kraker uchun eng keng tarqalgan yo‘nalish (katalogda pishloq, cheddar, gauda, to‘rt pishloq, smetana va boshqa pozitsiyalar bor).',
              'Go‘sht, bekon, tovuq — tuzli va go‘shtli guruh.',
              'Sarimsoq, qo‘ziqorin, ziravor aralashmalari — ziravorli va sabzavotli guruhlar.',
              'Yong‘oq, kunjut, popkorn — yong‘oqli va snack ta’mlari; ba’zilari shirin popkorn uchun ham mos.',
            ],
          },
          { h2: 'Chips, kraker, popkorn: qanday qo‘shiladi' },
          {
            p: 'Snack ta’mlari ko‘pincha yog‘ yoki tayyor ziravor-aralashma bilan sepiladi. Suyuq aromatizatorni to‘g‘ridan-to‘g‘ri quruq sepmaga qo‘shish yoki avval yog‘ asosida tarqatish mumkin — aniq usul uskuna va retseptga bog‘liq, shuning uchun sinov partiyasida aniqlanadi. Katalogdagi snack aromatizatorlarining hammasi suyuq shaklda.',
          },
          { h2: 'Tanlash mezonlari' },
          {
            ul: [
              'Dozalash — tavsiya 0,05–0,3%; yakuniy miqdor sepma ulushi va yog‘ miqdoriga qarab sinov bilan moslanadi.',
              'Ta’m barqarorligi — snackda mahsulot uzoq saqlanadi, shuning uchun bir necha kun o‘tgach ham ta’mni baholang.',
              'Ziravorlar bilan uyg‘unlik — pishloq yoki go‘sht ta’mini tuz va ziravor aralashmasi bilan birga sinab ko‘ring.',
              'Hujjatlar — texnik ma’lumot (TDS) va sifat sertifikati; so‘rovda oldindan belgilang.',
            ],
          },
          { h2: 'Sinovni qanday boshlash' },
          {
            p: '3–4 ta nomzod ta’mni tanlab, bepul namuna qutisiga soling: 8 tagacha pozitsiya, 25, 50 yoki 100 g hajmda. Bir xil asosda bir xil dozada solishtiring, keyin dozani 0,05–0,3% oralig‘ida moslang.',
          },
          { h2: 'Ko‘p so‘raladigan savollar' },
          {
            faq: [
              {
                q: 'Snack aromatizatorining dozasi qancha?',
                a: 'Katalogdagi snack aromatizatorlari uchun tavsiya etilgan dozalash 0,05–0,3%. Aniq miqdor retsept va sepma usuliga bog‘liq.',
              },
              {
                q: 'Pishloqli chips uchun qaysi pozitsiyalar bor?',
                a: 'Katalogda pishloq, cheddar, gauda, to‘rt pishloq, smetana va pishloq-o‘tlar aralashmalari kabi sut-pishloqli pozitsiyalar mavjud. Hozirgi ro‘yxat katalogda.',
              },
              {
                q: 'Namunani qanday olaman?',
                a: 'Namuna qutisiga 8 tagacha pozitsiya qo‘shib, so‘rov yuborasiz. Hajmlar — 25, 50 yoki 100 g.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/snacks', label: 'Snack sanoati uchun' },
          { path: '/category/flavours/savoury', label: 'Tuzli va go‘shtli ta’mlar' },
          { path: '/category/flavours/herb-spice', label: 'Ziravor va o‘tlar' },
          { path: '/category/flavours/dairy', label: 'Sut va pishloq ta’mlari' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Ароматизаторы для снеков и чипсов',
        description:
          'Жидкие ароматизаторы для снеков, чипсов и попкорна: сыр, сметана, мясо, специи. Дозировка 0,05–0,3%, как выбрать и получить бесплатный образец.',
        intro:
          'В каталоге Gulf Flavours для снеков и сухих завтраков отмечено 59 жидких ароматизаторов. Больше всего их в группах солёных и мясных (20), пряных и травяных (12), овощных (10) и молочно-сырных (7). Для всех рекомендуемая дозировка — 0,05–0,3%. Ниже — порядок выбора для производителя снеков.',
        blocks: [
          { h2: 'Какие группы вкусов для снеков' },
          {
            ul: [
              'Сыр, сметана, сливочное масло — молочно-сырная группа: самое распространённое направление для чипсов и крекеров (в каталоге есть сыр, чеддер, гауда, четыре сыра, сметана и другие позиции).',
              'Мясо, бекон, курица — солёные и мясные.',
              'Чеснок, грибы, пряные смеси — пряные и овощные группы.',
              'Орехи, кунжут, попкорн — ореховые и снековые вкусы; часть подходит и для сладкого попкорна.',
            ],
          },
          { h2: 'Чипсы, крекеры, попкорн: как вносится' },
          {
            p: 'Снековые вкусы чаще всего наносят вместе с маслом или готовой сухой приправой. Жидкий ароматизатор можно ввести напрямую в сухую приправу или сначала распределить в масляной основе — точный способ зависит от оборудования и рецептуры и подбирается на пробной партии. Все снековые ароматизаторы каталога — жидкие.',
          },
          { h2: 'На что смотреть при выборе' },
          {
            ul: [
              'Дозировка — рекомендуется 0,05–0,3%; итоговое количество подбирается пробой с учётом доли приправы и количества масла.',
              'Стабильность вкуса — снеки хранятся долго, поэтому оценивайте вкус и через несколько дней.',
              'Сочетание со специями — пробуйте сырный или мясной вкус сразу с солью и пряной смесью.',
              'Документы — технические данные (TDS) и сертификат качества; отметьте в запросе заранее.',
            ],
          },
          { h2: 'Как начать пробу' },
          {
            p: 'Выберите 3–4 вкуса-кандидата и добавьте их в коробку бесплатных образцов: до 8 позиций объёмом 25, 50 или 100 г. Сравните их на одной основе в одинаковой дозировке, затем подберите дозу в пределах 0,05–0,3%.',
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Какая дозировка ароматизатора для снеков?',
                a: 'Для снековых ароматизаторов каталога рекомендуется 0,05–0,3%. Точное количество зависит от рецептуры и способа нанесения приправы.',
              },
              {
                q: 'Какие позиции есть для чипсов со вкусом сыра?',
                a: 'В каталоге есть молочно-сырные позиции: сыр, чеддер, гауда, четыре сыра, сметана и смеси сыра с травами. Актуальный список — в каталоге.',
              },
              {
                q: 'Как получить образец?',
                a: 'Добавьте до 8 позиций в коробку образцов и отправьте запрос. Объёмы — 25, 50 или 100 г.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/snacks', label: 'Для производителей снеков' },
          { path: '/category/flavours/savoury', label: 'Солёные и мясные вкусы' },
          { path: '/category/flavours/herb-spice', label: 'Специи и травы' },
          { path: '/category/flavours/dairy', label: 'Молочные и сырные вкусы' },
          { path: '/samples', label: 'Бесплатные образцы' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },
  {
    slug: 'sous-va-mayonez-uchun-aromatizator',
    published: '2026-11-23',
    text: {
      uz: {
        title: 'Sous va mayonez uchun aromatizator',
        description:
          'Souslar, mayonez va dressinglar uchun suyuq aromatizatorlar: pishloq, sarimsoq, sitrus, ziravor. Dozalash 0,05–0,3%, tanlash va bepul namuna.',
        intro:
          'Katalogda souslar va dressinglar sohasi uchun 73 ta suyuq aromatizator belgilangan. Ular orasida tuzli va go‘shtli (22 ta), ziravorli va o‘tli (17 ta), sabzavotli (11 ta), sut-pishloqli (8 ta) va sitrus (6 ta) guruhlar bor. Hammasida tavsiya etilgan dozalash — 0,05–0,3%. Quyida sous ishlab chiqaruvchi uchun tanlash tartibi.',
        blocks: [
          { h2: 'Souslar uchun qaysi guruhlar' },
          {
            ul: [
              'Pishloqli va qaymoqli souslar — sut-pishloqli guruh: pishloq, cheddar, mozzarella, to‘rt pishloq, smetana, ghi.',
              'Go‘shtli va bulyon asosli souslar — tuzli va go‘shtli guruh.',
              'Sarimsoq, o‘t va ziravorli souslar, kechup va BBQ — ziravorli, o‘tli va sabzavotli guruhlar.',
              'Yangi, nordon ta’m kerak bo‘lgan dressinglar — sitrus (limon, laym, yuzu) va meva-rezavor (anor, brusnika, zirk) ta’mlari.',
            ],
          },
          { h2: 'Sous asosiga qarab nimaga e’tibor berish' },
          {
            ul: [
              'Yog‘li asos (mayonez, qaymoqli sous) — aromatizatorni emulsiya tayyor bo‘lgach, mayin aralashtirib qo‘shishni sinab ko‘ring; aniq usul texnologiyaga bog‘liq.',
              'Issiq ishlov beriladigan souslar — ta’m yo‘qolishi ehtimoli bor; sinov partiyasida baholang.',
              'Kislotali muhit (kechup, dressinglar) — ta’m kislotalilik bilan o‘zgarishi mumkin, shuning uchun yakuniy pH da baholang.',
              'Dozalash — katalogdagi sous aromatizatorlari uchun tavsiya 0,05–0,3%.',
            ],
          },
          { h2: 'Sinovni qanday boshlash' },
          {
            p: 'Retseptingizga mos 3–4 ta ta’mni tanlab, bepul namuna qutisiga soling: 8 tagacha pozitsiya, 25, 50 yoki 100 g hajmda. Bir xil sous asosida bir xil dozada solishtiring, so‘ng dozani 0,05–0,3% oralig‘ida moslang.',
          },
          { h2: 'Ko‘p so‘raladigan savollar' },
          {
            faq: [
              {
                q: 'Sous uchun aromatizator dozasi qancha?',
                a: 'Katalogdagi sous aromatizatorlari uchun tavsiya etilgan dozalash 0,05–0,3%. Aniq miqdor sous asosi va texnologiyaga bog‘liq.',
              },
              {
                q: 'Mayonez uchun qaysi ta’mlar mos?',
                a: 'Odatda sarimsoq, ziravor-o‘t aralashmalari, pishloq va sitrus yo‘nalishlari ishlatiladi. Mos pozitsiyalarni katalogda sous soha sahifasidan tanlang va namunada sinang.',
              },
              {
                q: 'Namunani qanday olaman?',
                a: 'Namuna qutisiga 8 tagacha pozitsiya qo‘shib, so‘rov yuborasiz. Hajmlar — 25, 50 yoki 100 g.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/sauces', label: 'Souslar sanoati uchun' },
          { path: '/category/flavours/savoury', label: 'Tuzli va go‘shtli ta’mlar' },
          { path: '/category/flavours/herb-spice', label: 'Ziravor va o‘tlar' },
          { path: '/category/flavours/vegetable', label: 'Sabzavotli ta’mlar' },
          { path: '/category/flavours/citrus', label: 'Sitrus ta’mlari' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Ароматизаторы для соусов и майонеза',
        description:
          'Жидкие ароматизаторы для соусов, майонеза и заправок: сыр, чеснок, цитрус, специи. Дозировка 0,05–0,3%, как выбрать и получить бесплатный образец.',
        intro:
          'В каталоге для соусов и заправок отмечено 73 жидких ароматизатора. Среди них солёные и мясные (22), пряные и травяные (17), овощные (11), молочно-сырные (8) и цитрусовые (6). Для всех рекомендуемая дозировка — 0,05–0,3%. Ниже — порядок выбора для производителя соусов.',
        blocks: [
          { h2: 'Какие группы для соусов' },
          {
            ul: [
              'Сырные и сливочные соусы — молочно-сырная группа: сыр, чеддер, моцарелла, четыре сыра, сметана, гхи.',
              'Мясные соусы и соусы на бульонной основе — солёные и мясные.',
              'Чесночные, пряные и травяные соусы, кетчуп и BBQ — пряные, травяные и овощные группы.',
              'Заправки со свежей, кислой нотой — цитрусовые (лимон, лайм, юдзу) и фруктово-ягодные (гранат, брусника, барбарис).',
            ],
          },
          { h2: 'На что смотреть в зависимости от основы' },
          {
            ul: [
              'Жировая основа (майонез, сливочные соусы) — попробуйте вносить ароматизатор в готовую эмульсию с бережным перемешиванием; точный способ зависит от технологии.',
              'Соусы с термообработкой — возможна потеря вкуса; оцените на пробной партии.',
              'Кислая среда (кетчуп, заправки) — вкус может меняться с кислотностью, поэтому оценивайте при итоговом pH.',
              'Дозировка — для соусовых ароматизаторов каталога рекомендуется 0,05–0,3%.',
            ],
          },
          { h2: 'Как начать пробу' },
          {
            p: 'Выберите 3–4 вкуса под вашу рецептуру и добавьте их в коробку бесплатных образцов: до 8 позиций объёмом 25, 50 или 100 г. Сравните на одной основе соуса в одинаковой дозировке, затем подберите дозу в пределах 0,05–0,3%.',
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Какая дозировка ароматизатора для соусов?',
                a: 'Для соусовых ароматизаторов каталога рекомендуется 0,05–0,3%. Точное количество зависит от основы соуса и технологии.',
              },
              {
                q: 'Какие вкусы подходят для майонеза?',
                a: 'Обычно используют чесночное, пряно-травяное, сырное и цитрусовое направления. Подходящие позиции выберите на странице отрасли «Соусы» и проверьте на образцах.',
              },
              {
                q: 'Как получить образец?',
                a: 'Добавьте до 8 позиций в коробку образцов и отправьте запрос. Объёмы — 25, 50 или 100 г.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/sauces', label: 'Для производителей соусов' },
          { path: '/category/flavours/savoury', label: 'Солёные и мясные вкусы' },
          { path: '/category/flavours/herb-spice', label: 'Специи и травы' },
          { path: '/category/flavours/vegetable', label: 'Овощные вкусы' },
          { path: '/category/flavours/citrus', label: 'Цитрусовые вкусы' },
          { path: '/samples', label: 'Бесплатные образцы' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },
];
