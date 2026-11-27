/**
 * BLOG — 2026-noyabr, 10-to‘plam: mevali va rezavor aromatizatorlar hamda
 * shokolad va kakao aromatizatori (ta’m profili bo‘yicha tanlash).
 * Qoidalar `blog.ts` sarlavhasida: faqat UZ/RU, to‘qilgan raqam/da’vo yo‘q,
 * tibbiy/sog‘liq va’dasi yo‘q, aniq dozirovka — faqat “kartochkadagi oraliq”.
 * Ma’lumot katalogdan: “Mevali” va “Rezavor” guruhlari (olma, nok, shaftoli, o‘rik,
 * behi, anor, qovun, tarvuz, qulupnay, malina, olcha, qora qarag‘at, chakanda, uzum …),
 * “Shokolad va kakao” guruhi (shokolad, qora/sutli/oq shokolad, kakao, shokolad-funduk,
 * shokolad-karamel, shokolad-kokos, brauni, chizkeyk); oziq-ovqat ingrediyentlaridan
 * kakao kukuni (tabiiy va alkalizatsiyalangan) va qandolat glazuri, kislotalar, bo‘yoqlar.
 * Kartochka belgilari: “Issiqqa chidamli”, “Spirtsiz”, “Halol sertifikati”, “GMO’siz”;
 * saqlash sharti — `catalog-copy.ts` (STORAGE), yaroqlilik — kartochkadagi muddat.
 */

import type { BlogArticle } from './blog';

export const ARTICLES_2026_11_J: BlogArticle[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'mevali-va-rezavor-aromatizatorlar',
    published: '2026-11-27',
    text: {
      uz: {
        title: 'Mevali va rezavor aromatizatorlar: tanlash',
        description:
          'Qulupnay, olcha, malina, shaftoli, qovun aromatizatori: profil tanlash, kislota va rang bilan muvozanat, ichimlik, qandolat va sut mahsulotida sinash.',
        intro:
          'Mevali va rezavor aromatizator (qulupnay, malina, olcha, qora qarag‘at, shaftoli, o‘rik, qovun, olma va boshqalar) tanlashda uch narsa hal qiluvchi: mevaning qaysi “talqini” kerakligi (pishgan, yangi uzilgan, murabboli yoki konfetli), mahsulotdagi kislota va shakar darajasi hamda texnologiya (issiqlik, muzlatish, saqlash muddati). Aromatizator shu uchtasiga qarab tanlanadi, dozirovka esa katalog kartochkasidagi oraliqdan boshlab o‘z retseptingizda sinaladi. Quyida profil tanlash, sinov tartibi va ko‘p uchraydigan xatolar.',
        blocks: [
          { h2: 'Bitta meva — bir nechta talqin' },
          {
            p: 'Iste’molchi “qulupnay ta’mi” deganda turli narsani kutadi: bolalar uchun yogurtda — shirin, qaymoqli qulupnay; limonadda — yangi, biroz nordon va “yashil” qulupnay; konfetda — yorqin, konfetga xos qulupnay. Shuning uchun katalogda bitta meva bir nechta variantda keladi. Masalan, Gulf Flavours katalogida:',
          },
          {
            ul: [
              'Qulupnay — oddiy, pishgan, yovvoyi, oq, shirin hamda “qulupnay va qaymoq” va “qulupnay-banan” kombinatsiyalari.',
              'Olcha va gilos — shirin gilos, nordon olcha va yorqin konfetli talqinlar.',
              'Olma — yashil, qizil olma va “olma kompoti” (pishirilgan meva notasi).',
              'Qovun — kantalupa, asalli, mushk va shirin qovun; tarvuz alohida.',
              'Shaftoli — oq shaftoli, “Melba” desert talqini va shaftoli-o‘rik.',
              'Rezavorlar — malina, qora va ko‘k qarag‘at, klyukva, brusnika, chakanda, zirk, tut, anor, uzum turlari va tayyor rezavor mikslari.',
            ],
          },
          {
            p: 'Tanlovni “qaysi meva?” savolidan emas, “mahsulotim qanday tuyulishi kerak?” savolidan boshlang. Ta’mni so‘z bilan tasvirlab yozing (masalan, “yangi uzilgan, nordonroq, pishirilgan emas”) — bu namunalarni solishtirishda mezon bo‘ladi.',
          },
          { h2: 'Mahsulot turiga qarab profil' },
          {
            p: 'Bir xil aromatizator turli asosda turlicha ochiladi. Amaliyotda ko‘p ishlatiladigan yo‘nalishlar:',
          },
          {
            ul: [
              'Ichimliklar va limonadlar — yorqin, “yangi” talqinlar: olma, nok, qora qarag‘at, olcha, tarvuz, sitrus-rezavor. Kislotali muhitda mevali nota yaxshi ochiladi.',
              'Sut mahsulotlari (yogurt, ichimlik yogurt, tvorog desertlari) — yumshoq, shirin va qaymoqli talqinlar: qulupnay, shaftoli, malina, “qulupnay va qaymoq”. Sutning o‘z notasi o‘tkir “yashil” notalarni yumshatadi.',
              'Muzqaymoq — sovuqda ta’m kamroq seziladi, shuning uchun to‘liq, pishgan talqinlar va rezavor mikslar yaxshi natija beradi.',
              'Qandolat (karamel, marmelad, jele, konfet) — yorqin, konfetli talqinlar; issiq massaga qo‘shiladigan bosqichni hisobga oling.',
              'Pishiriq va to‘ldirgichlar — murabbo va “pishirilgan meva” notalari (olma kompoti, o‘rik, olcha) pechdan keyin tabiiyroq tuyuladi.',
            ],
          },
          { h2: 'Kislota va shakar: mevali ta’mning “kaliti”' },
          {
            p: 'Tabiiy mevada xushbo‘y moddalar shakar va kislota bilan birga keladi. Agar retseptda kislota bo‘lmasa, eng yaxshi mevali aromatizator ham “bo‘sh” yoki parfyumga o‘xshash tuyuladi. Shuning uchun:',
          },
          {
            ul: [
              'Limon kislotasi sitrus, rezavor va olcha notalarini yorqinroq qiladi.',
              'Olma kislotasi olma, nok, o‘rik va ko‘pchilik danakli mevalarga tabiiyroq nordonlik beradi.',
              'Kislota miqdorini o‘zgartirsangiz, aromatizatorni qayta baholang: nordonlik oshganda mevali nota kuchliroq tuyulishi mumkin.',
              'Shakar yoki shirinlashtirgich kam bo‘lsa, shirin talqinlar (pishgan qulupnay, qovun) ham quruq tuyuladi.',
            ],
          },
          {
            p: 'Amaliy maslahat: aromatizator miqdorini oshirishdan oldin kislota va shirinlik muvozanatini sozlab ko‘ring. Ko‘pincha mevali ta’m “sust” bo‘lishiga aromatizator emas, aynan shu muvozanat sabab bo‘ladi.',
          },
          { h2: 'Rang bilan moslik' },
          {
            p: 'Iste’molchi ta’mni avval ko‘zi bilan “eshitadi”: qizil rangdagi ichimlik qulupnay yoki olcha sifatida qabul qilinadi, sariq — shaftoli yoki banan, yashil — olma yoki kivi. Rang va ta’m mos kelmasa, eng sifatli aromatizator ham “noto‘g‘ri” tuyuladi. Rang tanlashda quyidagilarni hisobga oling:',
          },
          {
            ul: [
              'Rangni ta’m bilan birga sinang — bir xil aromatizator boshqa rangda boshqacha baholanishi mumkin.',
              'Tabiiy bo‘yoqlar (lavlagi qizili, antotsianin, beta-karotin, kurkumin) kislotalilik, issiqlik va yorug‘likka sezgir bo‘lishi mumkin — saqlash davomida rang o‘zgarishini tekshiring.',
              'Sintetik bo‘yoqlardan foydalanilsa, yorliqlash talablarini mahsulot chiqariladigan bozor qoidalari bo‘yicha aniqlang.',
            ],
          },
          { h2: 'Texnologiya: issiqlik, muzlatish va saqlash' },
          {
            p: 'Katalogdagi mevali va rezavor aromatizatorlar suyuq shaklda, kartochkalarida “Issiqqa chidamli” va “Spirtsiz” belgilari bor. Shunga qaramay, har bir texnologik bosqich ta’mga ta’sir qiladi:',
          },
          {
            ul: [
              'Issiq jarayonlar (pasterizatsiya, karamel qaynatish, pishirish) — aromatizatorni iloji boricha kechroq, massa biroz sovigandan keyin qo‘shing.',
              'Muzlatish — sovuq mahsulotda ta’m sustroq seziladi; muzqaymoqni muzlatilgan holatda, iste’mol haroratida baholang.',
              'Uzoq saqlash — mevali notalar vaqt o‘tishi bilan o‘zgarishi mumkin; yangi tayyorlangan va bir necha hafta turgan namunani solishtiring.',
              'Shaffof ichimlik — aromatizatorning suvda yaxshi aralashishini va loyqalik bermasligini o‘z ichimligingizda tekshiring.',
            ],
          },
          { h2: 'Dozirovkani sinash tartibi' },
          {
            p: 'Har bir mahsulot kartochkasida tavsiya etilgan dozirovka oralig‘i ko‘rsatilgan — bu boshlang‘ich nuqta, yakuniy miqdorni faqat o‘z retseptingizdagi sinov belgilaydi:',
          },
          {
            ul: [
              'Kartochkadagi oraliqning past chegarasidan boshlang va 3 ta daraja tayyorlang (past, o‘rta, yuqori).',
              'Bir vaqtda 2–3 xil talqinni solishtiring (masalan, oddiy, pishgan va yovvoyi qulupnay) — farq faqat yonma-yon sinovda ko‘rinadi.',
              'Mahsulotni iste’mol haroratida baholang: ichimlik — sovutilgan, muzqaymoq — muzlatilgan, pishiriq — sovigandan keyin.',
              'Namunalarni raqamlab, “ko‘r” degustatsiya qiling; natijani jadvalga yozing (aromatizator, partiya, miqdor, kislota, baho).',
              'Ikkita meva birlashtirilsa (qulupnay-banan, sitrus-rezavor), uchinchisini qo‘shmang — asosiy ta’m yo‘qoladi.',
            ],
          },
          { h2: 'Ko‘p uchraydigan xatolar' },
          {
            p: 'Sinovdan oldin hujjatlarni ham tayyorlab qo‘ying: tanlangan aromatizator bo‘yicha spetsifikatsiya va kartochkadagi belgilar (“Halol sertifikati”, “GMO’siz”) uchun hujjat nusxalarini so‘rovda talab qiling. Tayyor mahsulot yorlig‘ida aromatizator haqidagi yozuv mahsulot chiqariladigan bozor talablariga mos bo‘lishi kerak — bu tayyor mahsulot ishlab chiqaruvchisining zimmasida. Amaliyotda eng ko‘p uchraydigan xatolar:',
          },
          {
            ul: [
              'Kislotasiz retseptda mevali ta’mni aromatizator miqdorini oshirib “kuchaytirish” — natijada kimyoviy, parfyumga o‘xshash ta’m.',
              'Aromatizatorni suvda yoki shakarli eritmada sinab, natijani sut mahsulotiga ko‘chirish.',
              'Ta’m va rangni alohida tanlash.',
              'Issiq massaga aromatizatorni jarayonning eng boshida qo‘shish.',
              'Aromatizatorni ochiq idishda yoki issiq joyda saqlash. To‘g‘ri sharoit — zich yopilgan original idish, salqin va quruq joy, +5…+25 °C, quyosh nuridan uzoqda; yaroqlilik muddati kartochkada.',
            ],
          },
          { h2: 'Ko‘p beriladigan savollar' },
          {
            faq: [
              {
                q: 'Qulupnay aromatizatorining qaysi turi yogurt uchun mos?',
                a: 'Sut mahsulotlarida odatda yumshoq, shirin va qaymoqli talqinlar (pishgan qulupnay, “qulupnay va qaymoq”) yaxshi ishlaydi. Limonad kabi kislotali ichimliklar uchun esa yangi, nordonroq talqinlar mos. Bir nechta variantni o‘z retseptingizda yonma-yon sinab tanlang.',
              },
              {
                q: 'Mevali ta’m nima uchun “sust” chiqadi?',
                a: 'Ko‘pincha sabab — kislota yoki shirinlik yetishmasligi, aromatizatorning issiq jarayon boshida qo‘shilgani yoki rang ta’mga mos emasligi. Aromatizator miqdorini oshirishdan oldin shu omillarni tekshiring.',
              },
              {
                q: 'Mevali aromatizator dozirovkasi qancha?',
                a: 'Har bir mahsulot kartochkasida tavsiya etilgan oraliq ko‘rsatilgan. Past chegaradan boshlang va 2–3 darajani yakuniy retseptda, iste’mol haroratida sinang.',
              },
              {
                q: 'Bir nechta mevali aromatizatorni sinab ko‘rish mumkinmi?',
                a: 'Ha. Bepul namuna qutisiga 8 tagacha mahsulot qo‘shib, ariza qoldiring. Hajm va narx bo‘yicha savollar uchun narx so‘rash formasidan foydalaning.',
              },
            ],
          },
        ],
        links: [
          { path: '/category/flavours/berry', label: 'Rezavor aromatizatorlar' },
          { path: '/category/flavours/fruit', label: 'Mevali aromatizatorlar' },
          { path: '/industries/beverages', label: 'Ichimliklar uchun aromatizatorlar' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Фруктовые и ягодные ароматизаторы: выбор',
        description:
          'Ароматизатор клубники, вишни, малины, персика, дыни: выбор профиля, баланс с кислотой и цветом, проверка в напитках, кондитерских и молочных продуктах.',
        intro:
          'При выборе фруктового или ягодного ароматизатора (клубника, малина, вишня, чёрная смородина, персик, абрикос, дыня, яблоко и другие) решают три вещи: какая «интерпретация» фрукта нужна (спелый, свежесобранный, варенье или конфетный), уровень кислоты и сахара в продукте и технология (нагрев, заморозка, срок хранения). Ароматизатор подбирают под эти три параметра, а дозировку проверяют на своей рецептуре, начиная с диапазона из карточки каталога. Ниже — выбор профиля, порядок испытаний и частые ошибки.',
        blocks: [
          { h2: 'Один фрукт — несколько интерпретаций' },
          {
            p: 'Под «вкусом клубники» потребитель ожидает разное: в детском йогурте — сладкую сливочную клубнику; в лимонаде — свежую, чуть кисловатую и «зелёную»; в конфете — яркую конфетную. Поэтому в каталоге один фрукт представлен в нескольких вариантах. Например, в каталоге Gulf Flavours:',
          },
          {
            ul: [
              'Клубника — обычная, спелая, земляника, белая, сладкая, а также сочетания «клубника со сливками» и «клубника-банан».',
              'Вишня и черешня — сладкая вишня, кислая вишня и яркие конфетные интерпретации.',
              'Яблоко — зелёное, красное и «яблочный компот» (нота варёного фрукта).',
              'Дыня — канталупа, медовая, мускусная и сладкая; арбуз отдельно.',
              'Персик — белый персик, десертная интерпретация «Мельба» и персик-абрикос.',
              'Ягоды — малина, чёрная смородина, черника, клюква, брусника, облепиха, барбарис, шелковица, гранат, виды винограда и готовые ягодные миксы.',
            ],
          },
          {
            p: 'Начинайте выбор не с вопроса «какой фрукт?», а с вопроса «каким должен ощущаться мой продукт?». Опишите вкус словами (например, «свежесобранный, кисловатый, не варёный») — это станет критерием при сравнении образцов.',
          },
          { h2: 'Профиль в зависимости от продукта' },
          {
            p: 'Один и тот же ароматизатор раскрывается по-разному в разной основе. Направления, которые чаще всего используют на практике:',
          },
          {
            ul: [
              'Напитки и лимонады — яркие, «свежие» интерпретации: яблоко, груша, чёрная смородина, вишня, арбуз, цитрусово-ягодный. В кислой среде фруктовая нота раскрывается хорошо.',
              'Молочная продукция (йогурты, питьевые йогурты, творожные десерты) — мягкие, сладкие и сливочные интерпретации: клубника, персик, малина, «клубника со сливками». Собственная нота молока смягчает резкие «зелёные» оттенки.',
              'Мороженое — на холоде вкус ощущается слабее, поэтому хорошо работают полные, спелые интерпретации и ягодные миксы.',
              'Кондитерские изделия (карамель, мармелад, желе, конфеты) — яркие конфетные интерпретации; учитывайте стадию внесения в горячую массу.',
              'Выпечка и начинки — ноты варенья и «варёного фрукта» (яблочный компот, абрикос, вишня) после печи воспринимаются естественнее.',
            ],
          },
          { h2: 'Кислота и сахар — «ключ» к фруктовому вкусу' },
          {
            p: 'В натуральном фрукте ароматические вещества идут вместе с сахаром и кислотой. Если в рецептуре нет кислоты, даже лучший фруктовый ароматизатор кажется «пустым» или парфюмерным. Поэтому:',
          },
          {
            ul: [
              'Лимонная кислота делает цитрусовые, ягодные и вишнёвые ноты ярче.',
              'Яблочная кислота даёт более естественную кислинку яблоку, груше, абрикосу и большинству косточковых фруктов.',
              'Меняя количество кислоты, заново оценивайте ароматизатор: при росте кислотности фруктовая нота может казаться сильнее.',
              'Если сахара или подсластителя мало, даже сладкие интерпретации (спелая клубника, дыня) кажутся сухими.',
            ],
          },
          {
            p: 'Практический совет: прежде чем увеличивать дозировку ароматизатора, настройте баланс кислоты и сладости. Часто «вялый» фруктовый вкус объясняется именно этим балансом, а не ароматизатором.',
          },
          { h2: 'Совместимость с цветом' },
          {
            p: 'Потребитель сначала «слышит» вкус глазами: красный напиток воспринимается как клубника или вишня, жёлтый — как персик или банан, зелёный — как яблоко или киви. Если цвет и вкус не совпадают, даже качественный ароматизатор кажется «неправильным». При выборе красителя учитывайте:',
          },
          {
            ul: [
              'Проверяйте цвет вместе со вкусом — один и тот же ароматизатор в другом цвете оценивают иначе.',
              'Натуральные красители (свекольный красный, антоцианы, бета-каротин, куркумин) могут быть чувствительны к кислотности, нагреву и свету — проверьте изменение цвета при хранении.',
              'При использовании синтетических красителей уточните требования к маркировке по правилам рынка, на который выпускается продукт.',
            ],
          },
          { h2: 'Технология: нагрев, заморозка и хранение' },
          {
            p: 'Фруктовые и ягодные ароматизаторы в каталоге — жидкие, в карточках отмечены «Термостабильный» и «Без спирта». Тем не менее каждый технологический этап влияет на вкус:',
          },
          {
            ul: [
              'Горячие процессы (пастеризация, уваривание карамели, выпечка) — вносите ароматизатор как можно позже, после небольшого остывания массы.',
              'Заморозка — в холодном продукте вкус ощущается слабее; оценивайте мороженое в замороженном виде, при температуре употребления.',
              'Длительное хранение — фруктовые ноты со временем могут меняться; сравните свежий образец и образец, простоявший несколько недель.',
              'Прозрачный напиток — проверьте на своём напитке, что ароматизатор хорошо распределяется в воде и не даёт мутности.',
            ],
          },
          { h2: 'Порядок проверки дозировки' },
          {
            p: 'В карточке каждого продукта указан рекомендуемый диапазон дозировки — это отправная точка, а итоговое количество определяет только испытание на вашей рецептуре:',
          },
          {
            ul: [
              'Начните с нижней границы диапазона из карточки и приготовьте 3 уровня (низкий, средний, высокий).',
              'Сравнивайте одновременно 2–3 интерпретации (например, обычную, спелую клубнику и землянику) — разница видна только при параллельной дегустации.',
              'Оценивайте продукт при температуре употребления: напиток — охлаждённым, мороженое — замороженным, выпечку — после остывания.',
              'Пронумеруйте образцы и проведите «слепую» дегустацию; записывайте результаты в таблицу (ароматизатор, партия, дозировка, кислота, оценка).',
              'Если сочетаете два фрукта (клубника-банан, цитрусово-ягодный), не добавляйте третий — основной вкус потеряется.',
            ],
          },
          { h2: 'Частые ошибки' },
          {
            p: 'До испытаний подготовьте и документы: запросите спецификацию на выбранный ароматизатор и копии документов по отметкам в карточке («Сертификат Халяль», «Без ГМО»). Указание ароматизатора на этикетке готового продукта должно соответствовать требованиям рынка, на который он выпускается, — это зона ответственности производителя готового продукта. Самые частые ошибки на практике:',
          },
          {
            ul: [
              '«Усиливать» фруктовый вкус в рецептуре без кислоты за счёт дозировки ароматизатора — получается химический, парфюмерный привкус.',
              'Проверять ароматизатор в воде или сахарном сиропе и переносить результат на молочный продукт.',
              'Подбирать вкус и цвет по отдельности.',
              'Вносить ароматизатор в горячую массу в самом начале процесса.',
              'Хранить ароматизатор в открытой таре или в тепле. Правильно — в плотно закрытой оригинальной таре, в прохладном сухом месте, +5…+25 °C, вдали от солнечных лучей; срок годности указан в карточке.',
            ],
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Какой клубничный ароматизатор подходит для йогурта?',
                a: 'В молочных продуктах обычно хорошо работают мягкие, сладкие и сливочные интерпретации (спелая клубника, «клубника со сливками»). Для кислых напитков вроде лимонада подходят свежие, более кисловатые варианты. Выбирайте, сравнив несколько вариантов параллельно на своей рецептуре.',
              },
              {
                q: 'Почему фруктовый вкус получается «вялым»?',
                a: 'Чаще всего причина — недостаток кислоты или сладости, внесение ароматизатора в начале горячего процесса или несоответствие цвета вкусу. Проверьте эти факторы, прежде чем увеличивать дозировку.',
              },
              {
                q: 'Какая дозировка у фруктового ароматизатора?',
                a: 'В карточке каждого продукта указан рекомендуемый диапазон. Начните с нижней границы и проверьте 2–3 уровня на итоговой рецептуре при температуре употребления.',
              },
              {
                q: 'Можно ли попробовать несколько фруктовых ароматизаторов?',
                a: 'Да. Добавьте до 8 позиций в бесплатный набор образцов и оставьте заявку. По объёмам и цене воспользуйтесь формой запроса цены.',
              },
            ],
          },
        ],
        links: [
          { path: '/category/flavours/berry', label: 'Ягодные ароматизаторы' },
          { path: '/category/flavours/fruit', label: 'Фруктовые ароматизаторы' },
          { path: '/industries/beverages', label: 'Ароматизаторы для напитков' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'shokolad-va-kakao-aromatizatori',
    published: '2026-11-27',
    text: {
      uz: {
        title: 'Shokolad aromatizatori: qanday tanlash',
        description:
          'Shokolad va kakao aromatizatori: kakao kukuni bilan farqi, qora, sutli va oq shokolad profili, pishiriq, muzqaymoq va kremda sinash, xatolar.',
        intro:
          'Shokolad aromatizatori kakao kukunining o‘rnini bosmaydi — u shokolad ta’mini kuchaytiradi, unga yo‘nalish beradi (qora, sutli, oq, funduk yoki karamel bilan) va kakao kam yoki umuman bo‘lmagan mahsulotlarda (oq massa, krem, ichimlik) shokolad notasini yaratadi. To‘g‘ri tanlov uchun avval aromatizator qanday vazifani bajarishini aniqlang, so‘ng profilni mahsulot asosiga mos tanlang va dozirovkani katalog kartochkasidagi oraliqdan boshlab o‘z retseptingizda sinang. Quyida tanlash tartibi, sinov rejasi va ko‘p uchraydigan xatolar.',
        blocks: [
          { h2: 'Aromatizator va kakao kukuni: vazifalar farqi' },
          {
            p: 'Shokoladli mahsulotda ikki xil komponent ishlaydi va ularni chalkashtirmaslik kerak:',
          },
          {
            ul: [
              'Kakao kukuni — rang, “tana”, achchiqroq va quruq kakao ta’mi beradi. Tabiiy kukun ochroq va nordonroq, alkalizatsiyalangan kukun to‘qroq rangli va yumshoqroq ta’mli bo‘ladi.',
              'Qandolat glazuri (sutli yoki qora) — tayyor shokoladli qoplama yoki qatlam.',
              'Shokolad aromatizatori — hid va ta’mning “uchuvchan” qismini beradi: yangi sindirilgan shokoladga xos xushbo‘ylik, sutli yoki karamelli nota.',
            ],
          },
          {
            p: 'Odatda eng yaxshi natija ikkalasini birga ishlatganda olinadi: kakao kukuni yoki glazur asos va rangni beradi, aromatizator esa xushbo‘ylikni to‘ldiradi va pishirish yoki saqlash paytida yo‘qolgan notalarni qaytaradi.',
          },
          { h2: 'Kakao kukuni: tabiiy yoki alkalizatsiyalangan' },
          {
            p: 'Aromatizatordan oldin kakao asosini tanlab olish kerak, chunki u yakuniy ta’mga eng katta ta’sir qiladi. Katalogda kakao kukunining ikki turi bor — tabiiy va alkalizatsiyalangan. Ularni tanlashda quyidagilarga e’tibor bering:',
          },
          {
            ul: [
              'Rang — alkalizatsiyalangan kukun mahsulotga to‘qroq, jigarrang-qora tus beradi; tabiiy kukun ochroq, qizg‘ishroq rang beradi.',
              'Ta’m — tabiiy kukun nordonroq va o‘tkirroq, alkalizatsiyalangan kukun yumshoqroq va “dumaloq” ta’mli.',
              'Retsept kimyosi — tabiiy kukunning nordonligi qabartiruvchi tizim bilan o‘zaro ta’sirlashishi mumkin; kukun turini almashtirsangiz, pishiriqning ko‘tarilishi va rangini qayta tekshiring.',
              'Suyuq mahsulotlar — sutli ichimlik va desertlarda kukunning aralashuvi va cho‘kishini o‘z retseptingizda sinang.',
            ],
          },
          {
            p: 'Kakao asosi tanlab bo‘lingach, aromatizator uning yetishmagan tomonini to‘ldiradi: tabiiy kukunli mahsulotga sutli yoki karamelli yumshoqlik, alkalizatsiyalangan kukunli mahsulotga esa yangi shokoladga xos xushbo‘ylik.',
          },
          { h2: 'Profil tanlash: qora, sutli, oq va kombinatsiyalar' },
          {
            p: 'Gulf Flavours katalogidagi “Shokolad va kakao” guruhida bir nechta yo‘nalish bor. Har birining o‘z joyi:',
          },
          {
            ul: [
              'Kakao va qora shokolad — to‘q, achchiqroq, qovurilgan notalar; brauni, kakaoli bisquit, to‘q kremlar uchun.',
              'Sutli shokolad — yumshoq, shirin, sutli; muzqaymoq, sutli ichimlik, glazur va konfet to‘ldirgichlari uchun.',
              'Oq shokolad — kakao yog‘i va sut notasiga yaqin, kakao kukunisiz; oq kremlar, glazurlar va desertlar uchun.',
              'Kombinatsiyalar — shokolad-funduk, shokolad-karamel, shokolad-kokos, “shokoladli chizkeyk”, “brauni” kabi desert talqinlari.',
            ],
          },
          {
            p: 'Tanlovni mahsulot nomi va iste’molchi kutishidan boshlang: “shokoladli” deb atalgan mahsulot bilan “shokolad-funduk” mahsuloti turli profil talab qiladi. Ikkitadan ortiq yo‘nalishni birlashtirmang — masalan, shokolad-funduk yaxshi, unga karamel ham qo‘shilsa, asosiy ta’m xiralashadi.',
          },
          { h2: 'Mahsulot turiga qarab nimani hisobga olish kerak' },
          {
            ul: [
              'Pishiriq (bisquit, keks, pechenye, brauni) — pishirish paytida uchuvchan notalar kamayadi. Katalogdagi shokolad aromatizatorlari kartochkasida “Issiqqa chidamli” belgisi bor, ammo natijani pechdan chiqqan va sovigan mahsulotda baholang.',
              'Kremlar va to‘ldirgichlar — issiqlik kam, shuning uchun ta’m to‘liq saqlanadi; ortiqcha miqdor tez seziladi, past chegaradan boshlang.',
              'Muzqaymoq — sovuqda ta’m sustroq seziladi; profilni to‘liqroq (sutli shokolad, brauni) tanlang va muzlatilgan holatda baholang.',
              'Sut mahsulotlari va ichimliklar — kakao kukuni cho‘kishi mumkin; aromatizator kakao miqdorini kamaytirib ham shokolad notasini saqlashga yordam beradi. Barqarorlikni o‘z retseptingizda tekshiring.',
              'Glazur va konfetlar — yog‘li asosda aromatizator boshqacha ochiladi; uni yakuniy massada sinang.',
            ],
          },
          { h2: 'Asos bilan muvozanat: shakar, sut, tuz' },
          {
            p: 'Shokolad notasi retseptning boshqa komponentlariga juda sezgir:',
          },
          {
            ul: [
              'Shirinlik kam bo‘lsa, qora shokolad va kakao profillari haddan tashqari achchiq tuyuladi; shirinlik ko‘p bo‘lsa — shokolad “yo‘qoladi”.',
              'Sut va qaymoq shokolad notasini yumshatadi — sutli asosda qora shokolad profili sutli shokoladga yaqinroq tuyulishi mumkin.',
              'Juda oz miqdordagi tuz kakao ta’mini “ochadi”; uni retsept boshqa talablariga mos ravishda sinab ko‘ring.',
              'Vanil va karamel shokoladni yaxshi to‘ldiradi, lekin ular asosiy ta’mni bosib ketmasligi kerak.',
            ],
          },
          { h2: 'Dozirovkani sinash tartibi' },
          {
            p: 'Har bir mahsulot kartochkasida tavsiya etilgan dozirovka oralig‘i ko‘rsatilgan — bu sinov uchun boshlang‘ich nuqta. Amaliy tartib:',
          },
          {
            ul: [
              'Avval kakao kukuni yoki glazur miqdorini belgilang, keyin aromatizatorni sinang — aks holda ikkala o‘zgaruvchini bir vaqtda solishtirib, xulosa chiqara olmaysiz.',
              'Kartochkadagi oraliqning past chegarasidan boshlang va 3 xil daraja tayyorlang.',
              'Bir vaqtda 2–3 profilni yonma-yon solishtiring (masalan, shokolad, sutli va premium shokolad).',
              'Mahsulotni iste’mol holatida baholang: pishiriq — sovigandan keyin, muzqaymoq — muzlatilgan, ichimlik — sovutilgan.',
              'Natijalarni jadvalga yozing va tanlangan variantdan nazorat namunasini bir necha haftadan keyin qayta solishtiring.',
            ],
          },
          { h2: 'Saqlash va ko‘p uchraydigan xatolar' },
          {
            p: 'Aromatizatorni zich yopilgan original idishda, salqin va quruq joyda, +5…+25 °C da, quyosh nuridan uzoqda saqlang; yaroqlilik muddati kartochkada ko‘rsatilgan. Kakao kukunini ham namlik va begona hidlardan himoyalang — u hidlarni yaxshi tortadi.',
          },
          {
            p: 'Aromatizator bo‘yicha spetsifikatsiya va kartochkadagi belgilar (“Halol sertifikati”, “GMO’siz”) uchun hujjat nusxalarini so‘rovda talab qiling. Ko‘p uchraydigan xatolar:',
          },
          {
            ul: [
              'Kakao kukunini to‘liq aromatizator bilan almashtirishga urinish — rang va “tana” yo‘qoladi.',
              'Shokolad ta’mi sustligini faqat aromatizator miqdorini oshirib tuzatish — natijada sun’iy, kimyoviy ta’m.',
              'Uchta va undan ortiq yo‘nalishni bitta mahsulotda aralashtirish.',
              'Aromatizatorni suvda yoki shakarli eritmada sinab, natijani yog‘li krem yoki glazurga ko‘chirish.',
              'Pishiriqni pechdan chiqqan zahoti baholash — issiq mahsulotda ta’m boshqacha seziladi.',
            ],
          },
          { h2: 'Ko‘p beriladigan savollar' },
          {
            faq: [
              {
                q: 'Shokolad aromatizatori kakao kukunini almashtira oladimi?',
                a: 'To‘liq emas. Kakao kukuni rang, tana va asosiy kakao ta’mini beradi, aromatizator esa xushbo‘ylikni kuchaytiradi va yo‘nalish beradi. Aromatizator kakao kam yoki umuman bo‘lmagan mahsulotlarda (oq krem, ichimlik) shokolad notasini yaratishi mumkin, ammo rangni bermaydi.',
              },
              {
                q: 'Muzqaymoq uchun qaysi shokolad profili mos?',
                a: 'Sovuqda ta’m sustroq seziladi, shuning uchun to‘liqroq profillar — sutli shokolad, brauni, shokolad-funduk — odatda yaxshi natija beradi. Tanlovni muzlatilgan mahsulotda, yonma-yon degustatsiyada qiling.',
              },
              {
                q: 'Shokolad aromatizatori dozirovkasi qancha?',
                a: 'Har bir mahsulot kartochkasida tavsiya etilgan oraliq ko‘rsatilgan. Avval kakao kukuni yoki glazur miqdorini belgilang, keyin aromatizatorni past chegaradan boshlab 2–3 darajada sinang.',
              },
              {
                q: 'Namunalarni qanday olish mumkin?',
                a: 'Bepul namuna qutisiga 8 tagacha mahsulot qo‘shing va ariza qoldiring — shokolad profillari bilan birga kakao kukunini ham so‘rash mumkin. Hajm va narx bo‘yicha narx so‘rash formasidan foydalaning.',
              },
            ],
          },
        ],
        links: [
          { path: '/category/flavours/chocolate', label: 'Shokolad va kakao aromatizatorlari' },
          { path: '/category/food-ingredients/chocolate-base', label: 'Kakao kukuni va qandolat glazuri' },
          { path: '/industries/confectionery', label: 'Konditer mahsulotlari uchun aromatizatorlar' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Шоколадный ароматизатор: как выбрать',
        description:
          'Шоколадный ароматизатор и какао: разница с какао-порошком, профили тёмного, молочного и белого шоколада, проверка в выпечке, мороженом и креме.',
        intro:
          'Шоколадный ароматизатор не заменяет какао-порошок — он усиливает шоколадный вкус, задаёт ему направление (тёмный, молочный, белый, с фундуком или карамелью) и создаёт шоколадную ноту там, где какао мало или нет совсем (белые массы, кремы, напитки). Для правильного выбора сначала определите, какую задачу решает ароматизатор, затем подберите профиль под основу продукта и проверьте дозировку на своей рецептуре, начиная с диапазона из карточки каталога. Ниже — порядок выбора, план испытаний и частые ошибки.',
        blocks: [
          { h2: 'Ароматизатор и какао-порошок: разные задачи' },
          {
            p: 'В шоколадном продукте работают разные компоненты, и их важно не путать:',
          },
          {
            ul: [
              'Какао-порошок — даёт цвет, «тело», более горький и сухой вкус какао. Натуральный порошок светлее и кислее, алкализованный — темнее и мягче на вкус.',
              'Кондитерская глазурь (молочная или тёмная) — готовое шоколадное покрытие или слой.',
              'Шоколадный ароматизатор — даёт «летучую» часть аромата и вкуса: запах свежеразломанного шоколада, молочную или карамельную ноту.',
            ],
          },
          {
            p: 'Обычно лучший результат получается при их совместном использовании: какао-порошок или глазурь дают основу и цвет, а ароматизатор дополняет аромат и возвращает ноты, потерянные при выпечке или хранении.',
          },
          { h2: 'Какао-порошок: натуральный или алкализованный' },
          {
            p: 'Прежде чем выбирать ароматизатор, определитесь с какао-основой — она сильнее всего влияет на итоговый вкус. В каталоге два вида какао-порошка — натуральный и алкализованный. При выборе обратите внимание на:',
          },
          {
            ul: [
              'Цвет — алкализованный порошок даёт продукту более тёмный, коричнево-чёрный оттенок; натуральный — более светлый, красноватый.',
              'Вкус — натуральный порошок кислее и резче, алкализованный мягче и «округлее».',
              'Химию рецептуры — кислотность натурального порошка может взаимодействовать с разрыхлителем; при смене вида порошка заново проверьте подъём и цвет выпечки.',
              'Жидкие продукты — в молочных напитках и десертах проверьте на своей рецептуре, как порошок распределяется и не оседает ли он.',
            ],
          },
          {
            p: 'Когда какао-основа выбрана, ароматизатор дополняет то, чего ей не хватает: продукту с натуральным порошком — молочную или карамельную мягкость, продукту с алкализованным — аромат свежего шоколада.',
          },
          { h2: 'Выбор профиля: тёмный, молочный, белый и сочетания' },
          {
            p: 'В группе «Шоколад и какао» каталога Gulf Flavours несколько направлений. У каждого своя область применения:',
          },
          {
            ul: [
              'Какао и тёмный шоколад — насыщенные, горьковатые, обжаренные ноты; для брауни, какао-бисквита, тёмных кремов.',
              'Молочный шоколад — мягкий, сладкий, молочный; для мороженого, молочных напитков, глазури и конфетных начинок.',
              'Белый шоколад — близок к ноте какао-масла и молока, без какао-порошка; для белых кремов, глазурей и десертов.',
              'Сочетания — шоколад-фундук, шоколад-карамель, шоколад-кокос, десертные интерпретации «шоколадный чизкейк» и «брауни».',
            ],
          },
          {
            p: 'Начинайте выбор с названия продукта и ожиданий потребителя: «шоколадный» продукт и продукт «шоколад-фундук» требуют разного профиля. Не объединяйте больше двух направлений: шоколад-фундук — хорошо, если добавить ещё и карамель, основной вкус размоется.',
          },
          { h2: 'Что учитывать в зависимости от продукта' },
          {
            ul: [
              'Выпечка (бисквит, кексы, печенье, брауни) — при выпечке летучие ноты уменьшаются. В карточках шоколадных ароматизаторов каталога отмечено «Термостабильный», но результат оценивайте на остывшем изделии после печи.',
              'Кремы и начинки — нагрева мало, вкус сохраняется полностью; избыток быстро заметен, начинайте с нижней границы.',
              'Мороженое — на холоде вкус ощущается слабее; выбирайте более полные профили (молочный шоколад, брауни) и оценивайте в замороженном виде.',
              'Молочные продукты и напитки — какао-порошок может оседать; ароматизатор помогает сохранить шоколадную ноту и при меньшем количестве какао. Стабильность проверьте на своей рецептуре.',
              'Глазури и конфеты — в жировой основе ароматизатор раскрывается иначе; проверяйте его в итоговой массе.',
            ],
          },
          { h2: 'Баланс с основой: сахар, молоко, соль' },
          {
            p: 'Шоколадная нота очень чувствительна к другим компонентам рецептуры:',
          },
          {
            ul: [
              'При недостатке сладости профили тёмного шоколада и какао кажутся чрезмерно горькими; при избытке — шоколад «теряется».',
              'Молоко и сливки смягчают шоколадную ноту — в молочной основе профиль тёмного шоколада может восприниматься ближе к молочному.',
              'Очень небольшое количество соли «раскрывает» вкус какао; проверяйте это с учётом остальных требований рецептуры.',
              'Ваниль и карамель хорошо дополняют шоколад, но не должны перекрывать основной вкус.',
            ],
          },
          { h2: 'Порядок проверки дозировки' },
          {
            p: 'В карточке каждого продукта указан рекомендуемый диапазон дозировки — это отправная точка для испытаний. Практический порядок:',
          },
          {
            ul: [
              'Сначала зафиксируйте количество какао-порошка или глазури, затем проверяйте ароматизатор — иначе вы меняете две переменные сразу и не сможете сделать вывод.',
              'Начните с нижней границы диапазона из карточки и приготовьте 3 уровня.',
              'Сравнивайте одновременно 2–3 профиля (например, шоколад, молочный и шоколад премиум-класса).',
              'Оценивайте продукт в состоянии употребления: выпечку — после остывания, мороженое — замороженным, напиток — охлаждённым.',
              'Записывайте результаты в таблицу и через несколько недель повторно сравните контрольный образец выбранного варианта.',
            ],
          },
          { h2: 'Хранение и частые ошибки' },
          {
            p: 'Храните ароматизатор в плотно закрытой оригинальной таре, в прохладном сухом месте, +5…+25 °C, вдали от солнечных лучей; срок годности указан в карточке. Какао-порошок также защищайте от влаги и посторонних запахов — он хорошо их впитывает.',
          },
          {
            p: 'Запросите спецификацию на ароматизатор и копии документов по отметкам в карточке («Сертификат Халяль», «Без ГМО»). Частые ошибки:',
          },
          {
            ul: [
              'Пытаться полностью заменить какао-порошок ароматизатором — теряются цвет и «тело».',
              'Исправлять слабый шоколадный вкус только увеличением дозировки ароматизатора — появляется искусственный, химический привкус.',
              'Смешивать в одном продукте три и более направления.',
              'Проверять ароматизатор в воде или сахарном сиропе и переносить результат на жирный крем или глазурь.',
              'Оценивать выпечку сразу после печи — в горячем изделии вкус воспринимается иначе.',
            ],
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Может ли шоколадный ароматизатор заменить какао-порошок?',
                a: 'Не полностью. Какао-порошок даёт цвет, тело и основной вкус какао, а ароматизатор усиливает аромат и задаёт направление. Ароматизатор может создать шоколадную ноту в продуктах, где какао мало или нет (белый крем, напиток), но цвет не даёт.',
              },
              {
                q: 'Какой шоколадный профиль подходит для мороженого?',
                a: 'На холоде вкус ощущается слабее, поэтому обычно хорошо работают более полные профили — молочный шоколад, брауни, шоколад-фундук. Выбирайте на замороженном продукте при параллельной дегустации.',
              },
              {
                q: 'Какая дозировка шоколадного ароматизатора?',
                a: 'В карточке каждого продукта указан рекомендуемый диапазон. Сначала зафиксируйте количество какао-порошка или глазури, затем проверьте ароматизатор на 2–3 уровнях, начиная с нижней границы.',
              },
              {
                q: 'Как получить образцы?',
                a: 'Добавьте до 8 позиций в бесплатный набор образцов и оставьте заявку — вместе с шоколадными профилями можно запросить и какао-порошок. По объёмам и цене воспользуйтесь формой запроса цены.',
              },
            ],
          },
        ],
        links: [
          { path: '/category/flavours/chocolate', label: 'Ароматизаторы шоколада и какао' },
          { path: '/category/food-ingredients/chocolate-base', label: 'Какао-порошок и кондитерская глазурь' },
          { path: '/industries/confectionery', label: 'Ароматизаторы для кондитерских изделий' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },
];
