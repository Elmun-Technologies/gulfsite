/**
 * BLOG — 2026-noyabr, 2-to‘plam: ichimliklar, efir moylari, yuvish vositalari.
 * Qoidalar `blog.ts` sarlavhasida: faqat UZ/RU, to‘qilgan raqam/da’vo yo‘q,
 * aniq dozirovka — faqat "katalog kartochkasidagi oraliq". Mahsulot nomlari
 * katalogdagi haqiqiy pozitsiyalar (src/data/catalog.json).
 */

import type { BlogArticle } from './blog';

export const ARTICLES_2026_11_B: BlogArticle[] = [
  /* ------------------------------------------------------------------ 7 */
  {
    slug: 'ichimliklar-uchun-aromatizator',
    published: '2026-11-20',
    text: {
      uz: {
        title: 'Ichimliklar uchun aromatizator tanlash',
        description:
          'Gazli ichimlik, limonad, sharbat va energetik uchun aromatizator: suyuq yoki emulsiya, kislotalilik, loyqalantiruvchi emulsiya, dozirovka va saqlash.',
        intro:
          'Ichimlik — aromatizator eng ko‘p "ko‘rinadigan" mahsulot: ta’m suv bilan suyultiriladi, kislota va gaz uni o‘zgartiradi, shisha yoki PET idishda rang va tiniqlik ham baholanadi. Quyida ichimlik ishlab chiqaruvchilari, sharbat sexlari va HoReCa uchun aromatizator tanlashning asosiy qoidalari.',
        blocks: [
          { h2: 'Kimlar uchun bu maqola' },
          {
            ul: [
              'Gazli ichimlik va limonad ishlab chiqaruvchilari.',
              'Sharbat, nektar va mors sexlari.',
              'Energetik va sport ichimliklari ishlab chiqaruvchilari.',
              'Sirop, kokteyl asosi va bar uchun mahsulot tayyorlaydigan korxonalar.',
              'Kafe va restoranlar (HoReCa) — o‘z limonad va kokteyllarini tayyorlaydiganlar.',
            ],
          },
          { h2: 'Suyuq aromatizator yoki emulsiya' },
          {
            p: 'Tiniq ichimliklar (limonad, tonik, gazli suv) uchun odatda suvda yaxshi eriydigan suyuq aromatizator tanlanadi — u ichimlikni loyqalantirmaydi. Kola va sitrus kabi moyli komponentlari ko‘p bo‘lgan ta’mlar uchun esa emulsiya shakli qulay: moy tomchilari suvda bir tekis taqsimlanadi va saqlash paytida yuzaga qalqib chiqmaydi.',
          },
          {
            p: 'Sharbat ko‘rinishidagi ichimlik kerak bo‘lsa, loyqalantiruvchi (cloud) emulsiya ishlatiladi: u ichimlikka tabiiy sharbatdek xira ko‘rinish beradi. GFF katalogida bunday emulsiya alohida pozitsiya sifatida bor, kola uchun esa suyuq va emulsiya variantlari mavjud.',
          },
          { h2: 'Ta’m yo‘nalishlari' },
          {
            ul: [
              'Klassik: kola, limonad, krem-soda, tonik, imbirli el.',
              'An’anaviy: kvas va gulli-mevali siroplar (masalan, Ruh Afza).',
              'Kokteyl: mojito, grenadin va mevali kokteyl ta’mlari — alkogolsiz ichimlik va siroplar uchun.',
              'Energetik ichimliklar uchun maxsus ta’m profillari.',
              'Mevali va sitrus: apelsin, limon, laym, greypfrut — "Sitrus" va "Mevali" guruhlarida.',
            ],
          },
          {
            p: 'Ichimliklar uchun quruq (kukun) ichimlik kompaund-asosi ham bor — u quruq aralashmalar va eriydigan ichimliklar uchun mo‘ljallangan.',
          },
          { h2: 'Kislota, shakar va gaz ta’mni qanday o‘zgartiradi' },
          {
            p: 'Limon kislotasi sitrus va mevali notalarni yorqinroq qiladi, lekin ortiqcha kislota nozik gulli va shirin notalarni bosib ketadi. Shakar va shirinlashtirgichlar ta’mni yumshatadi: shakarsiz (diet) versiyada xuddi shu aromatizator boshqacha seziladi, shuning uchun uni alohida sinash kerak. Gaz (CO₂) esa hidni tezroq "ko‘taradi" — gazlangan va gazsiz namunani bir xil deb baholamang.',
          },
          { h2: 'Dozirovkani qanday sinash kerak' },
          {
            p: 'Har bir mahsulot kartochkasida tavsiya etilgan dozirovka oralig‘i ko‘rsatilgan. Sinovni tayyor ichimlik retseptida — shakar, kislota va gaz bilan birga o‘tkazing:',
          },
          {
            ul: [
              'Oraliqning past, o‘rta va yuqori nuqtasida uchta namuna tayyorlang.',
              'Namunalarni sotuvdagi haroratda (odatda sovutilgan holda) tatib ko‘ring.',
              'Gazli ichimlikni idishga quyib, kamida bir kun saqlab, keyin baholang.',
              'Shaffof idishda tiniqlik va cho‘kma bor-yo‘qligini kuzating.',
              'Har bir sinovni yozib boring: miqdor, sana, partiya, izoh.',
            ],
          },
          { h2: 'Tez-tez uchraydigan xatolar' },
          {
            ul: [
              'Ta’mni faqat konsentrat yoki siropda baholash — tayyor ichimlikda u boshqacha.',
              'Tiniq ichimlikka emulsiya qo‘shib, keyin loyqalikdan hayron qolish.',
              'Diet versiyada aromatizator miqdorini qayta sinamaslik.',
              'Quyosh nuri tushadigan joyda saqlangan tayyor mahsulotda ta’m o‘zgarishini hisobga olmaslik.',
              'Bitta ichimlikda juda ko‘p ta’m yo‘nalishini aralashtirish.',
            ],
          },
          { h2: 'Saqlash va hujjatlar' },
          {
            p: 'Aromatizatorni zich yopilgan asl idishda, salqin va quyosh nuri tushmaydigan joyda saqlang. Yaroqlilik muddati va saqlash shartlari mahsulot kartochkasida ko‘rsatilgan. Halol, GMO-siz, spirtsiz kabi belgilar ham kartochkada; spetsifikatsiya va xavfsizlik ma’lumotlari kabi hujjatlarni aniq pozitsiya bo‘yicha so‘rang.',
          },
          { h2: 'Ko‘p beriladigan savollar' },
          {
            faq: [
              {
                q: 'Limonad uchun qaysi aromatizator mos?',
                a: 'Tiniq limonad uchun suvda yaxshi eriydigan suyuq aromatizator tanlanadi. Katalogdagi "Ichimlik" va "Sitrus" guruhlaridan 2–3 ta pozitsiyani namuna sifatida olib, o‘z retseptingizda solishtiring.',
              },
              {
                q: 'Emulsiya va suyuq aromatizatorning farqi nimada?',
                a: 'Suyuq aromatizator suvda eriydi va ichimlikni tiniq qoldiradi. Emulsiya moyli komponentlarni suvda bir tekis ushlab turadi; loyqalantiruvchi emulsiya esa ichimlikka sharbatdek xira ko‘rinish beradi.',
              },
              {
                q: 'Ichimlikka qancha aromatizator qo‘shiladi?',
                a: 'Miqdor ta’mga, shakar va kislota miqdoriga bog‘liq. Mahsulot kartochkasidagi tavsiya etilgan oraliqdan foydalaning va tayyor, sovutilgan ichimlikda 2–3 darajani solishtiring.',
              },
              {
                q: 'Namunani qanday olish mumkin?',
                a: 'Saytdagi bepul namuna qutisiga 8 tagacha pozitsiya qo‘shing va ariza yuboring. Narx har bir so‘rov bo‘yicha hajm va qadoqqa qarab hisoblanadi.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/beverages', label: 'Ichimliklar uchun aromatizatorlar' },
          { path: '/category/flavours/beverage', label: 'Ichimlik aromatizatorlari' },
          { path: '/category/flavours/citrus', label: 'Sitrus aromatizatorlari' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Ароматизаторы для напитков: как выбрать',
        description:
          'Ароматизаторы для газировки, лимонада, сокосодержащих и энергетических напитков: жидкие или эмульсии, кислотность, замутнитель, дозировка, хранение.',
        intro:
          'Напиток — продукт, в котором ароматизатор «на виду»: вкус разбавлен водой, кислота и газ меняют его восприятие, а в прозрачной бутылке оценивают ещё цвет и прозрачность. Ниже — основные правила выбора ароматизатора для производителей напитков, соковых цехов и HoReCa.',
        blocks: [
          { h2: 'Для кого эта статья' },
          {
            ul: [
              'Производители газированных напитков и лимонадов.',
              'Цеха соков, нектаров и морсов.',
              'Производители энергетических и спортивных напитков.',
              'Производители сиропов и основ для коктейлей.',
              'Кафе и рестораны (HoReCa), которые готовят собственные лимонады и коктейли.',
            ],
          },
          { h2: 'Жидкий ароматизатор или эмульсия' },
          {
            p: 'Для прозрачных напитков (лимонад, тоник, газированная вода) обычно выбирают водорастворимый жидкий ароматизатор — он не мутит напиток. Для вкусов с большим количеством масляных компонентов, таких как кола и цитрусы, удобна эмульсия: капли масла равномерно распределяются в воде и не всплывают при хранении.',
          },
          {
            p: 'Если нужен напиток «как сок», используют замутнитель (облачную эмульсию): он придаёт напитку естественную мутность. В каталоге GFF такая эмульсия есть отдельной позицией, а для колы доступны жидкий вариант и эмульсия.',
          },
          { h2: 'Вкусовые направления' },
          {
            ul: [
              'Классика: кола, лимонад, крем-сода, тоник, имбирный эль.',
              'Традиционные: квас и цветочно-фруктовые сиропы (например, Рух Афза).',
              'Коктейльные: мохито, гренадин и фруктовые коктейли — для безалкогольных напитков и сиропов.',
              'Специальные вкусовые профили для энергетических напитков.',
              'Фруктовые и цитрусовые: апельсин, лимон, лайм, грейпфрут — в группах «Цитрусовые» и «Фруктовые».',
            ],
          },
          {
            p: 'Для сухих смесей и растворимых напитков есть порошковая напиточная база (компаунд).',
          },
          { h2: 'Как кислота, сахар и газ меняют вкус' },
          {
            p: 'Лимонная кислота делает цитрусовые и фруктовые ноты ярче, но избыток кислоты забивает нежные цветочные и сладкие ноты. Сахар и подсластители смягчают вкус: в версии без сахара (диет) тот же ароматизатор воспринимается иначе, поэтому её тестируют отдельно. Газ (CO₂) быстрее «поднимает» аромат — не оценивайте газированный и негазированный образец как одинаковые.',
          },
          { h2: 'Как подобрать дозировку' },
          {
            p: 'В карточке каждого товара указан рекомендуемый диапазон дозировки. Тестируйте в готовой рецептуре — с сахаром, кислотой и газом:',
          },
          {
            ul: [
              'Сделайте три образца: нижняя, средняя и верхняя точка диапазона.',
              'Пробуйте при температуре подачи (обычно охлаждённым).',
              'Газированный напиток разлейте и оцените хотя бы через сутки хранения.',
              'В прозрачной таре проверьте прозрачность и наличие осадка.',
              'Записывайте каждый тест: дозировка, дата, партия, комментарии.',
            ],
          },
          { h2: 'Частые ошибки' },
          {
            ul: [
              'Оценивать вкус только в концентрате или сиропе — в готовом напитке он другой.',
              'Добавить эмульсию в прозрачный напиток и удивляться мутности.',
              'Не перепроверить дозировку в диетической версии.',
              'Не учитывать изменение вкуса готового продукта на солнечном свету.',
              'Смешивать в одном напитке слишком много вкусовых направлений.',
            ],
          },
          { h2: 'Хранение и документы' },
          {
            p: 'Храните ароматизатор в плотно закрытой оригинальной таре, в прохладном месте без прямого солнца. Срок годности и условия хранения указаны в карточке товара. Отметки «Халяль», «Без ГМО», «Без спирта» — тоже в карточке; спецификацию и паспорт безопасности запрашивайте по конкретной позиции.',
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Какой ароматизатор подходит для лимонада?',
                a: 'Для прозрачного лимонада выбирают водорастворимый жидкий ароматизатор. Возьмите 2–3 позиции из групп «Напитки» и «Цитрусовые» как образцы и сравните в своей рецептуре.',
              },
              {
                q: 'Чем эмульсия отличается от жидкого ароматизатора?',
                a: 'Жидкий ароматизатор растворяется в воде и сохраняет прозрачность. Эмульсия равномерно удерживает масляные компоненты в воде, а замутнитель придаёт напитку мутность, как у сока.',
              },
              {
                q: 'Сколько ароматизатора добавлять в напиток?',
                a: 'Зависит от вкуса, количества сахара и кислоты. Используйте рекомендуемый диапазон из карточки и сравните 2–3 уровня в готовом охлаждённом напитке.',
              },
              {
                q: 'Как получить образцы?',
                a: 'Добавьте до 8 позиций в бесплатный набор образцов на сайте и отправьте заявку. Цена рассчитывается по каждому запросу в зависимости от объёма и упаковки.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/beverages', label: 'Ароматизаторы для напитков' },
          { path: '/category/flavours/beverage', label: 'Напиточные ароматизаторы' },
          { path: '/category/flavours/citrus', label: 'Цитрусовые ароматизаторы' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ 8 */
  {
    slug: 'efir-moylari-ishlab-chiqarish-uchun',
    published: '2026-11-20',
    text: {
      uz: {
        title: 'Ishlab chiqarish uchun efir moylari',
        description:
          'Efir moylarini ulgurji tanlash: oziq-ovqat, kosmetika va parfyumeriya uchun qaysi moy, terpenlar va absolyutning farqi, sinash, saqlash va hujjatlar.',
        intro:
          'Efir moylari oziq-ovqat, kosmetika, maishiy kimyo va parfyumeriyada ishlatiladi, lekin har bir soha uchun tanlash mezoni boshqa. Quyida ishlab chiqarish uchun efir moyini qanday tanlash, qanday sinash va nimaga e’tibor berish kerakligi haqida qisqa qo‘llanma.',
        blocks: [
          { h2: 'Kimlar uchun bu maqola' },
          {
            ul: [
              'Qandolat, ichimlik va ziravor aralashmalari ishlab chiqaruvchilari.',
              'Sovun, shampun, krem va boshqa kosmetika ishlab chiqaruvchilari.',
              'Parfyumerlar va atir kompozitsiyasi tayyorlaydigan ustaxonalar.',
              'Shamlar, aroma-diffuzorlar va uy uchun mahsulot ishlab chiqaruvchilari.',
            ],
          },
          { h2: 'Asosiy guruhlar' },
          {
            ul: [
              'Sitrus: bergamot, shirin apelsin, limon, mandarin, greypfrut, yuzu. Ichimlik, qandolat va yangi notali kosmetika uchun.',
              'Ziravor va o‘tlar: dolchin po‘stlog‘i, kassiya, chinnigul, kardamon, zanjabil, qora murch, muskat yong‘og‘i, kashnich urug‘i, zira, kurkuma, rayhon, oregano, timyan, rozmarin. Ziravor aralashmalari, go‘sht mahsulotlari, qandolat va choy uchun.',
              'Yalpiz: qalampir yalpizi va spearmint. Saqich, konfet, tish pastasi va sovutuvchi mahsulotlar uchun.',
              'Gulli: atirgul, geran, ilang-ilang, neroli, lavanda, yasmin absolyuti. Asosan parfyumeriya va kosmetika uchun.',
              'Yog‘ochli: sandal, kedr, pachuli, vetiver. Parfyumeriya, sovun va sharqona kompozitsiyalar uchun.',
            ],
          },
          { h2: 'Efir moyi, terpenlar va absolyut — farqi' },
          {
            p: 'Efir moyi — o‘simlikdan distillyatsiya yoki sovuq presslash usulida olinadigan uchuvchan moy. Terpenlar (masalan, apelsin yoki laym terpenlari) — sitrus moylarini qayta ishlashdagi fraksiya: hidi yengilroq, odatda texnik va maishiy mahsulotlarda hamda arzonroq retseptlarda ishlatiladi. Absolyut (masalan, yasmin absolyuti) — nozik gullardan erituvchi bilan olinadigan juda konsentrlangan mahsulot, asosan parfyumeriyada.',
          },
          { h2: 'Oziq-ovqat va kosmetika: farqli talablar' },
          {
            p: 'Oziq-ovqatda efir moyi juda kichik miqdorda ishlatiladi va ta’mni keskin o‘zgartiradi, shuning uchun aniq dozirovka va bir tekis aralashtirish muhim. Moyni avval yog‘, shakar yoki erituvchi bilan aralashtirib, keyin asosiy massaga qo‘shish odatiy usul. Kosmetikada esa teri bilan aloqa, mahsulot turi (yuviladigan yoki qoladigan) va ruxsat etilgan maksimal miqdor hisobga olinadi — bu ma’lumot mahsulot hujjatlarida bo‘ladi.',
          },
          {
            p: 'Har bir pozitsiyaning qaysi sohalar uchun mo‘ljallangani katalog kartochkasidagi "Qo‘llanilishi" bo‘limida ko‘rsatilgan. Oziq-ovqat uchun faqat shu sohaga mo‘ljallangan pozitsiyalarni tanlang.',
          },
          { h2: 'Qanday sinash kerak' },
          {
            ul: [
              'Kartochkadagi tavsiya etilgan dozirovka oralig‘idan foydalaning va past chegaradan boshlang.',
              'Kichik partiyada 2–3 darajani solishtiring, natijani tayyor mahsulotda baholang.',
              'Kosmetikada rang va hid barqarorligini bir necha hafta kuzating.',
              'Sitrus moylari yorug‘lik va havoda tezroq o‘zgaradi — sinov namunalarini ham to‘g‘ri saqlang.',
              'Har bir sinovni yozib boring: moy, partiya, miqdor, sana, natija.',
            ],
          },
          { h2: 'Saqlash' },
          {
            p: 'Efir moylarini zich yopilgan, imkon qadar to‘la idishda, salqin va qorong‘i joyda saqlang: havo, yorug‘lik va issiqlik oksidlanishni tezlashtiradi. Ochilgan idishni tezroq ishlating. Yaroqlilik muddati va saqlash shartlari mahsulot kartochkasida ko‘rsatilgan.',
          },
          { h2: 'Ko‘p beriladigan savollar' },
          {
            faq: [
              {
                q: 'Efir moylarini ulgurji qayerdan olsa bo‘ladi?',
                a: 'GFF Uzbekistan katalogida sitrus, ziravor, yalpiz, gulli va yog‘ochli efir moylari bor. Narx har bir so‘rov bo‘yicha hajm va qadoqqa qarab hisoblanadi; avval bepul namuna olib sinab ko‘rish mumkin.',
              },
              {
                q: 'Terpenlar efir moyidan arzonroqmi?',
                a: 'Odatda ha, lekin hidi yengilroq va boshqacha. Ular qayerda yetarli bo‘lishini o‘z retseptingizda sinab ko‘ring.',
              },
              {
                q: 'Oziq-ovqat uchun har qanday efir moyini ishlatsa bo‘ladimi?',
                a: 'Yo‘q. Faqat oziq-ovqat uchun mo‘ljallangan pozitsiyalarni tanlang — bu katalog kartochkasining "Qo‘llanilishi" bo‘limida ko‘rsatilgan. Hujjatlarni aniq pozitsiya bo‘yicha so‘rang.',
              },
              {
                q: 'Namunani qanday olaman?',
                a: 'Saytdagi bepul namuna qutisiga 8 tagacha pozitsiya qo‘shing va ariza yuboring.',
              },
            ],
          },
        ],
        links: [
          { path: '/category/essential-oils', label: 'Efir moylari katalogi' },
          { path: '/category/essential-oils/citrus', label: 'Sitrus efir moylari' },
          { path: '/category/essential-oils/herb-spice', label: 'Ziravor efir moylari' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Эфирные масла оптом для производства',
        description:
          'Эфирные масла оптом: какие масла для пищевой продукции, косметики и парфюмерии, чем отличаются терпены и абсолют, как тестировать и хранить.',
        intro:
          'Эфирные масла используют в пищевой продукции, косметике, бытовой химии и парфюмерии, но критерии выбора в каждой отрасли разные. Ниже — короткий гид: как выбрать эфирное масло для производства, как его протестировать и на что обратить внимание.',
        blocks: [
          { h2: 'Для кого эта статья' },
          {
            ul: [
              'Производители кондитерских изделий, напитков и смесей специй.',
              'Производители мыла, шампуней, кремов и другой косметики.',
              'Парфюмеры и мастерские, создающие парфюмерные композиции.',
              'Производители свечей, аромадиффузоров и товаров для дома.',
            ],
          },
          { h2: 'Основные группы' },
          {
            ul: [
              'Цитрусовые: бергамот, сладкий апельсин, лимон, мандарин, грейпфрут, юдзу. Для напитков, кондитерских изделий и косметики со свежими нотами.',
              'Пряные и травяные: кора корицы, кассия, гвоздика, кардамон, имбирь, чёрный перец, мускатный орех, семена кориандра, зира, куркума, базилик, орегано, тимьян, розмарин. Для смесей специй, мясной продукции, кондитерских изделий и чая.',
              'Мятные: перечная мята и мята колосковая. Для жевательной резинки, конфет, зубной пасты и охлаждающих продуктов.',
              'Цветочные: роза, герань, иланг-иланг, нероли, лаванда, абсолют жасмина. В основном для парфюмерии и косметики.',
              'Древесные: сандал, кедр, пачули, ветивер. Для парфюмерии, мыла и восточных композиций.',
            ],
          },
          { h2: 'Эфирное масло, терпены и абсолют — в чём разница' },
          {
            p: 'Эфирное масло — летучее масло, получаемое из растения перегонкой или холодным прессованием. Терпены (например, апельсиновые или лаймовые) — фракция, получаемая при переработке цитрусовых масел: запах легче, их обычно используют в технических и бытовых продуктах и в более бюджетных рецептурах. Абсолют (например, абсолют жасмина) — очень концентрированный продукт из нежных цветов, получаемый экстракцией растворителем, в основном для парфюмерии.',
          },
          { h2: 'Пищевая продукция и косметика: разные требования' },
          {
            p: 'В пищевой продукции эфирное масло используют в очень малых количествах, и оно резко меняет вкус, поэтому важны точная дозировка и равномерное смешивание. Обычная практика — сначала смешать масло с жиром, сахаром или растворителем, а затем ввести в основную массу. В косметике учитывают контакт с кожей, тип продукта (смываемый или несмываемый) и максимально допустимую концентрацию — эти данные есть в документации к продукту.',
          },
          {
            p: 'Для каких отраслей предназначена каждая позиция, указано в разделе «Применение» карточки каталога. Для пищевой продукции выбирайте только позиции, предназначенные для неё.',
          },
          { h2: 'Как тестировать' },
          {
            ul: [
              'Используйте рекомендуемый диапазон дозировки из карточки и начинайте с нижней границы.',
              'Сравните 2–3 уровня на небольшой партии и оцените результат в готовом продукте.',
              'В косметике наблюдайте за стабильностью цвета и запаха несколько недель.',
              'Цитрусовые масла быстрее меняются на свету и воздухе — правильно храните и тестовые образцы.',
              'Записывайте каждый тест: масло, партия, дозировка, дата, результат.',
            ],
          },
          { h2: 'Хранение' },
          {
            p: 'Храните эфирные масла в плотно закрытой, по возможности полной таре, в прохладном тёмном месте: воздух, свет и тепло ускоряют окисление. Вскрытую тару используйте быстрее. Срок годности и условия хранения указаны в карточке товара.',
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Где купить эфирные масла оптом в Ташкенте?',
                a: 'В каталоге GFF Uzbekistan есть цитрусовые, пряные, мятные, цветочные и древесные эфирные масла. Цена рассчитывается по каждому запросу в зависимости от объёма и упаковки; сначала можно бесплатно получить образцы.',
              },
              {
                q: 'Терпены дешевле эфирного масла?',
                a: 'Обычно да, но запах легче и отличается. Проверьте в своей рецептуре, где их достаточно.',
              },
              {
                q: 'Можно ли использовать любое эфирное масло в пищевой продукции?',
                a: 'Нет. Выбирайте только позиции, предназначенные для пищевой продукции, — это указано в разделе «Применение» карточки. Документы запрашивайте по конкретной позиции.',
              },
              {
                q: 'Как получить образцы?',
                a: 'Добавьте до 8 позиций в бесплатный набор образцов на сайте и отправьте заявку.',
              },
            ],
          },
        ],
        links: [
          { path: '/category/essential-oils', label: 'Каталог эфирных масел' },
          { path: '/category/essential-oils/citrus', label: 'Цитрусовые эфирные масла' },
          { path: '/category/essential-oils/herb-spice', label: 'Пряные эфирные масла' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ 9 */
  {
    slug: 'yuvish-vositalari-uchun-otdushka',
    published: '2026-11-20',
    text: {
      uz: {
        title: 'Yuvish vositalari uchun otdushka: tanlash',
        description:
          'Kir yuvish kukuni, gel, yumshatgich, idish yuvish va tozalash vositalari uchun atir kompozitsiyasi: hid yo‘nalishi, muhitga chidamlilik, sinash.',
        intro:
          'Maishiy kimyoda hid — xaridor birinchi seziladigan narsa: u idishni ochganda va kir quriganda baholanadi. Quyida kir yuvish, yumshatgich, idish yuvish va uyni tozalash vositalari ishlab chiqaruvchilari uchun otdushka (atir kompozitsiyasi) tanlash qoidalari.',
        blocks: [
          { h2: 'Kimlar uchun bu maqola' },
          {
            ul: [
              'Kir yuvish kukuni va suyuq gel ishlab chiqaruvchilari.',
              'Kir yumshatgich va konditsioner ishlab chiqaruvchilari.',
              'Idish yuvish va universal tozalash vositalari ishlab chiqaruvchilari.',
              'Pol yuvish, havo tozalagich va uy uchun aroma mahsulotlari ishlab chiqaruvchilari.',
            ],
          },
          { h2: 'Hid yo‘nalishlari' },
          {
            ul: [
              'Toza va yangi: "Toza paxta", "Yumshoq paxta", "Ertalabki shudring", "Alp havosi" — kir yuvish va yumshatgich uchun klassik.',
              'Dengiz va suvli: "Okean yangiligi", "Dengiz shamoli".',
              'Gulli: atirgul, lavanda, siren, babunagul, yovvoyi gullar, gul guldastalari.',
              'Sitrus va mevali: limon, apelsin, sitrus aralashmasi, yashil olma, qulupnay — idish yuvish va tozalash vositalari uchun.',
              'Yog‘ochli-yashil: qarag‘ay va evkalipt — pol yuvish va universal tozalagichlar uchun.',
            ],
          },
          {
            p: 'Bularning barchasi GFF katalogidagi "Uy uchun" va "Mato parvarishi" guruhlaridagi haqiqiy pozitsiyalar. Har birining qaysi mahsulotlar uchun mo‘ljallangani kartochkada ko‘rsatilgan.',
          },
          { h2: 'Muhitga chidamlilik' },
          {
            p: 'Yuvish vositalarining muhiti keskin farq qiladi: kir yuvish kukuni va ko‘plab tozalagichlar ishqoriy, ba’zi tozalash vositalari kislotali, yumshatgichlar esa o‘ziga xos asosga ega. Bir muhitda barqaror bo‘lgan kompozitsiya boshqasida hidini yo‘qotishi, rangni o‘zgartirishi yoki mahsulot qovushqoqligiga ta’sir qilishi mumkin. Shuning uchun otdushkani doim aynan o‘z asosingizda sinang.',
          },
          { h2: 'Hidning "ishlash" bosqichlari' },
          {
            ul: [
              'Idishni ochganda — mahsulot hidi (xaridor do‘konda shuni sezadi).',
              'Yuvish paytida — suvda ochilish.',
              'Ho‘l kirda — yuvishdan keyingi hid.',
              'Quruq kirda — eng qiyin bosqich: kompozitsiya qanchalik barqaror ekanini ko‘rsatadi.',
            ],
          },
          { h2: 'Qanday sinash kerak' },
          {
            ul: [
              'Kartochkadagi tavsiya etilgan dozirovka oralig‘idan foydalaning.',
              'Kichik partiya tayyorlab, bir necha hafta xona va iliq haroratda saqlang — rang, hid va qovushqoqlikni kuzating.',
              'Haqiqiy yuvish sinovini o‘tkazing va hidni ho‘l hamda quruq kirda baholang.',
              'Bir nechta kompozitsiyani raqamlangan namunalarda ko‘r-ko‘rona solishtiring.',
              'Har bir sinovni yozib boring.',
            ],
          },
          { h2: 'Tez-tez uchraydigan xatolar' },
          {
            ul: [
              'Otdushkani faqat idishdagi hid bo‘yicha tanlash — quruq kirda u sezilmasligi mumkin.',
              'Bir mahsulot uchun tanlangan kompozitsiyani boshqa asosga sinamasdan o‘tkazish.',
              'Oziq-ovqat aromatizatorini maishiy kimyoda ishlatish — u bunday muhit uchun mo‘ljallanmagan.',
              'Hujjatdagi maksimal ruxsat etilgan miqdorni hisobga olmaslik.',
            ],
          },
          { h2: 'Ko‘p beriladigan savollar' },
          {
            faq: [
              {
                q: 'Kir yuvish kukuni uchun qaysi otdushka mos?',
                a: 'Odatda "toza paxta", dengiz va gulli yo‘nalishlar tanlanadi. Katalogdagi "Mato parvarishi" guruhidan bir nechta pozitsiyani namuna sifatida olib, o‘z kukuningizda sinang.',
              },
              {
                q: 'Bitta otdushkani kukun va gel uchun ishlatsa bo‘ladimi?',
                a: 'Ko‘p kompozitsiyalar bir nechta mahsulotga mos keladi, lekin har bir asos uchun alohida sinov kerak: kukunda hid barqarorligi, gelda erish va qovushqoqlik tekshiriladi.',
              },
              {
                q: 'Otdushka qancha qo‘shiladi?',
                a: 'Miqdor mahsulot turi va kompozitsiyaga bog‘liq. Kartochkadagi tavsiya etilgan oraliqdan foydalaning va hujjatdagi maksimal miqdordan oshirmang.',
              },
              {
                q: 'Namunani qanday olaman?',
                a: 'Saytdagi bepul namuna qutisiga 8 tagacha pozitsiya qo‘shing va ariza yuboring. Narx har bir so‘rov bo‘yicha hisoblanadi.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/fabric-care', label: 'Kir yuvish vositalari uchun hidlar' },
          { path: '/industries/home-care', label: 'Maishiy kimyo uchun hidlar' },
          { path: '/category/fragrances/fabric-care', label: 'Mato parvarishi otdushkalari' },
          { path: '/category/fragrances/home-care', label: 'Uy uchun otdushkalar' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
        ],
      },
      ru: {
        title: 'Отдушки для моющих средств: как выбрать',
        description:
          'Отдушки для стирального порошка, геля, кондиционера, средств для посуды и уборки: направления запаха, стойкость в среде продукта, тестирование.',
        intro:
          'В бытовой химии запах — первое, что замечает покупатель: его оценивают при открытии упаковки и на высохшем белье. Ниже — правила выбора отдушки (парфюмерной композиции) для производителей средств для стирки, кондиционеров, средств для посуды и уборки.',
        blocks: [
          { h2: 'Для кого эта статья' },
          {
            ul: [
              'Производители стиральных порошков и жидких гелей.',
              'Производители кондиционеров и ополаскивателей для белья.',
              'Производители средств для мытья посуды и универсальных чистящих средств.',
              'Производители средств для пола, освежителей воздуха и ароматов для дома.',
            ],
          },
          { h2: 'Направления запаха' },
          {
            ul: [
              'Чистота и свежесть: «Чистый хлопок», «Мягкий хлопок», «Утренняя роса», «Альпийский воздух» — классика для стирки и кондиционеров.',
              'Морские и акватические: «Океанская свежесть», «Морской бриз».',
              'Цветочные: роза, лаванда, сирень, ромашка, дикие цветы, цветочные букеты.',
              'Цитрусовые и фруктовые: лимон, апельсин, цитрусовый микс, зелёное яблоко, клубника — для средств для посуды и уборки.',
              'Древесно-зелёные: сосна и эвкалипт — для средств для пола и универсальных очистителей.',
            ],
          },
          {
            p: 'Всё это — реальные позиции каталога GFF из групп «Для дома» и «Уход за текстилем». Для каких продуктов предназначена каждая, указано в карточке.',
          },
          { h2: 'Стойкость в среде продукта' },
          {
            p: 'Среда моющих средств сильно различается: стиральные порошки и многие чистящие средства щелочные, часть средств для уборки — кислотные, у кондиционеров своя основа. Композиция, стабильная в одной среде, в другой может потерять запах, изменить цвет или повлиять на вязкость продукта. Поэтому отдушку всегда тестируют именно в своей основе.',
          },
          { h2: 'Этапы «работы» запаха' },
          {
            ul: [
              'При открытии упаковки — запах продукта (его покупатель чувствует в магазине).',
              'Во время стирки — раскрытие в воде.',
              'На влажном белье — запах после стирки.',
              'На сухом белье — самый сложный этап, показывает стойкость композиции.',
            ],
          },
          { h2: 'Как тестировать' },
          {
            ul: [
              'Используйте рекомендуемый диапазон дозировки из карточки.',
              'Сделайте небольшую партию и храните несколько недель при комнатной и повышенной температуре — следите за цветом, запахом и вязкостью.',
              'Проведите реальную стирку и оцените запах на влажном и сухом белье.',
              'Сравнивайте несколько композиций вслепую, на пронумерованных образцах.',
              'Записывайте каждый тест.',
            ],
          },
          { h2: 'Частые ошибки' },
          {
            ul: [
              'Выбирать отдушку только по запаху в упаковке — на сухом белье она может не ощущаться.',
              'Переносить композицию на другую основу без теста.',
              'Использовать пищевой ароматизатор в бытовой химии — он не предназначен для такой среды.',
              'Не учитывать максимально допустимую дозировку из документации.',
            ],
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Какая отдушка подходит для стирального порошка?',
                a: 'Обычно выбирают направления «чистый хлопок», морские и цветочные. Возьмите несколько позиций из группы «Уход за текстилем» как образцы и протестируйте в своём порошке.',
              },
              {
                q: 'Можно ли одну отдушку использовать для порошка и геля?',
                a: 'Многие композиции подходят для нескольких продуктов, но для каждой основы нужен отдельный тест: в порошке проверяют стойкость запаха, в геле — растворимость и вязкость.',
              },
              {
                q: 'Сколько отдушки добавлять?',
                a: 'Зависит от типа продукта и композиции. Используйте рекомендуемый диапазон из карточки и не превышайте максимальную дозировку из документации.',
              },
              {
                q: 'Как получить образцы?',
                a: 'Добавьте до 8 позиций в бесплатный набор образцов на сайте и отправьте заявку. Цена рассчитывается по каждому запросу.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/fabric-care', label: 'Ароматы для средств для стирки' },
          { path: '/industries/home-care', label: 'Ароматы для бытовой химии' },
          { path: '/category/fragrances/fabric-care', label: 'Отдушки для ухода за текстилем' },
          { path: '/category/fragrances/home-care', label: 'Отдушки для дома' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
        ],
      },
    },
  },
];
