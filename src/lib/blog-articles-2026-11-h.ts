/**
 * BLOG — 2026-noyabr, 8-to‘plam: choy va kofe uchun aromatizatorlar hamda
 * aromatizatorlarni saqlash / yaroqlilik muddati.
 * Qoidalar `blog.ts` sarlavhasida: faqat UZ/RU, to‘qilgan raqam/da’vo yo‘q.
 * Raqamlar — katalog ma’lumotidan: “Choy va kofe” guruhida 11 ta suyuq aromatizator
 * (kartochkadagi oraliq 0,05–0,3%), bergamot va kardamon ham choy/kofe sohasi bilan
 * belgilangan; yaroqlilik muddati kartochkalarda: aromatizatorlar, efir moylari,
 * aroma kimyosi va ingredientlar — 24 oy, atir kompozitsiyalari — 36 oy, komoditi — 18 oy;
 * saqlash shartlari — `catalog-copy.ts` (STORAGE) dagi kartochka matni.
 */

import type { BlogArticle } from './blog';

export const ARTICLES_2026_11_H: BlogArticle[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'choy-va-kofe-uchun-aromatizator',
    published: '2026-11-25',
    text: {
      uz: {
        title: 'Choy va kofe uchun aromatizator tanlash',
        description:
          'Choy va kofe uchun aromatizator: quruq choy bargi, qovurilgan don, eriydigan kofe va tayyor ichimliklarga qo‘shish, dozirovka sinovi, qadoq va xatolar.',
        intro:
          'Choy va kofe uchun aromatizator tanlashda uchta savol hal qiluvchi: aromatizator qayerga qo‘shiladi (quruq barg, qovurilgan don, kukun aralashma yoki tayyor ichimlik), mahsulot qanday tayyorlanadi (qaynoq suvda damlanadimi, sovuq ichiladimi) va qanday qadoqlanadi. Gulf Flavours katalogidagi “Choy va kofe” guruhida 11 ta suyuq aromatizator bor — qora va yashil choy, o‘simlik choyi, Earl Grey, matcha, kofe, qovurilgan kofe, kofe konsentrati, kapuchino, latte va Irish coffee; kartochkadagi tavsiya etilgan oraliq 0,05–0,3%. Quyida tanlash, sinov va ishlab chiqarishga o‘tish tartibi.',
        blocks: [
          { h2: 'Aromatizator qayerda ishlatiladi' },
          {
            p: 'Bitta “kofe” aromatizatori turli mahsulotlarda turlicha ishlaydi. Shuning uchun avval qaysi mahsulot va qaysi bosqich haqida gap ketayotganini aniqlang:',
          },
          {
            ul: [
              'Aromatlangan quruq choy (qora, yashil, o‘simlik choyi aralashmalari) — aromatizator bargga purkaladi va damlashda ochiladi.',
              'Qovurilgan kofe donlari va maydalangan kofe — qovurishdan keyin, sovigan donga qo‘shiladi.',
              'Eriydigan kofe va “3 in 1” kabi kukun aralashmalar — suyuq aromatizator quruq tashuvchiga (masalan, shakar yoki kukun asosning bir qismiga) oldindan aralashtiriladi.',
              'Tayyor ichimliklar: sovuq choy, kofeli sut ichimliklari, latte va kapuchino tipidagi ichimliklar.',
              'HoReCa: qahvaxonalar uchun siroplar va asoslar.',
              'Shirinliklar: kofe ta’mli muzqaymoq, desertlar, krem va glazurlar, pishiriq.',
            ],
          },
          {
            p: 'Katalog kartochkasida har bir aromatizator uchun qo‘llash sohalari ko‘rsatilgan — masalan, kofe va kapuchino ichimliklar bilan birga sut mahsulotlari va muzqaymoq uchun ham belgilangan. Tanlovni shu ro‘yxatdan boshlang.',
          },
          {
            p: 'Agar mahsulotingiz bir nechta bosqichdan o‘tsa (masalan, choy aralashmasi avval aromatlanadi, keyin paketlarga qadoqlanadi), aromatizator har bir bosqichda qanday “yo‘qotilishini” ham hisobga oling va sinovni oxirgi, iste’molchi ochadigan qadoqda baholang.',
          },
          { h2: 'Ta’m profilini tanlash' },
          {
            p: 'Choy va kofeda aromatizator asosiy xomashyoning tabiiy ta’mini to‘ldirishi kerak, uni bosib qo‘ymasligi kerak. Profilni mahsulotning vazifasiga qarab tanlang:',
          },
          {
            ul: [
              'Choy “kuchliroq” sezilishi kerak bo‘lsa — qora yoki yashil choy aromatizatori; u damlama ta’mini to‘liqroq qiladi.',
              'Klassik aromatlangan choy — bergamot (Earl Grey yo‘nalishi), kardamon kabi ziravorlar, mevali va gulli notalar.',
              'Matcha — sutli ichimliklar, muzqaymoq va pishiriqda yashil choy yo‘nalishi uchun.',
              'Kofe ichimliklari — “qovurilgan kofe” chuqurroq, qovurilgan notani beradi; kapuchino va latte esa sut-qaymoq bilan uyg‘un, yumshoqroq profil.',
              'Kofe konsentrati — kofe ta’mini muzqaymoq, desert va sut ichimliklarida aniqroq qilish uchun.',
              'Irish coffee — desertlar va qahvaxona ichimliklari uchun alohida yo‘nalish (kartochkada HoReCa bilan belgilangan).',
            ],
          },
          {
            p: 'Bir mahsulotda ikkitadan ortiq yo‘nalishni aralashtirmang. Masalan, “kofe + yong‘oq” yoki “choy + limon” ishlaydi, lekin beshta notali aralashma odatda “parfyumli” va noaniq ta’m beradi.',
          },
          { h2: 'Quruq choy va kofe donini aromatlash' },
          {
            p: 'Quruq mahsulotni aromatlashning asosiy qiyinchiligi — bir tekislik. Agar aromatizator bir joyga to‘planib qolsa, bitta qadoqda ta’m kuchli, boshqasida sust bo‘ladi. Amaliy tartib:',
          },
          {
            ul: [
              'Aralashtirish barabani yoki mikserdan foydalaning; aromatizatorni bir joyga quymasdan, mayda tomchilar bilan purkang.',
              'Kofe donini qovurishdan keyin, harorat tushgach aromatlang — issiq donda uchuvchan komponentlar tez yo‘qoladi.',
              'Aromatlangandan keyin mahsulotni yopiq idishda “dam oldiring”, shunda hid barg yoki don bo‘ylab tekis tarqaladi; muddatini sinovda aniqlang.',
              'Dozirovka nimaga nisbatan hisoblanishini (quruq barg massasigami yoki tayyor damlamagami) yetkazib beruvchi bilan aniqlang — quruq mahsulot uchun hisob tayyor ichimlikdan farq qiladi.',
              'Aromatlangan va aromatlanmagan mahsulot uchun alohida liniya yoki puxta tozalash rejasini tuzing: hid uskunada qoladi va keyingi partiyaga o‘tadi.',
            ],
          },
          { h2: 'Tayyor ichimlik va kukun aralashmalar' },
          {
            p: 'Tayyor ichimlikda (sovuq choy, kofeli sut ichimligi) dozirovka tayyor mahsulot massasiga nisbatan hisoblanadi. Agar avval sirop yoki konsentrat tayyorlab, keyin suyultirsangiz, foizni oxirgi ichimlikka qayta hisoblang. Issiqlik ishlovi (pasterizatsiya, issiq quyish) bo‘lsa, aromatizatorni iloji boricha keyingi bosqichda qo‘shing va sinovni aynan shu rejimda o‘tkazing.',
          },
          {
            p: 'Kukun aralashmalarda suyuq aromatizatorni to‘g‘ridan-to‘g‘ri katta massaga qo‘shmang: u kesaklar hosil qiladi va notekis taqsimlanadi. Avval uni kichik miqdordagi quruq tashuvchiga yaxshilab aralashtiring, keyin bu oldindan tayyorlangan aralashmani umumiy massaga qo‘shing. Sut va qaymoqli asoslar kofe ta’mini biroz “yumshatadi” — latte tipidagi ichimlikda oraliqning yuqoriroq nuqtasini ham sinab ko‘ring.',
          },
          { h2: 'Dozirovkani qanday sinash kerak' },
          {
            p: 'Kartochkadagi 0,05–0,3% oralig‘i — boshlang‘ich yo‘nalish. Sizning retseptingiz uchun aniq miqdorni faqat sinov belgilaydi:',
          },
          {
            ul: [
              'Uch nuqta tanlang: oraliqning past, o‘rta va yuqori qismi.',
              'Grammda, aniq tarozida torting; millilitrda o‘lchash zichlik farqi sababli xato beradi.',
              'Choyni har doim bir xil tartibda damlang: bir xil suv harorati, bir xil damlash vaqti, bir xil nisbat.',
              'Quruq choy va donni aromatlangan kuni va bir necha kundan keyin solishtiring — hid vaqt o‘tishi bilan tekislanadi.',
              'Ichimlikni iste’mol haroratida baholang: sovuq ichimlikda ta’m issiqqa nisbatan sustroq seziladi.',
              'Namunalarni kod bilan belgilang va iloji bo‘lsa, 3–5 kishidan iborat guruhda ko‘r usulda baholang.',
            ],
          },
          { h2: 'Qadoq va saqlash' },
          {
            p: 'Aromatlangan choy va kofe uchun qadoq aromatizatorning o‘zidan kam ahamiyatga ega emas. Hid o‘tkazuvchan qadoqda aromat tez pasayadi, qo‘shni mahsulotlarga esa “ko‘chib” o‘tadi. To‘siq (barrier) xususiyatli qadoq, zich yopilish va kofe uchun bir tomonlama klapan kabi yechimlarni qadoq yetkazib beruvchingiz bilan tanlang. Aromatlangan va oddiy mahsulotni omborda alohida saqlang.',
          },
          {
            p: 'Aromatizatorning o‘zini kartochkadagi shartlarda saqlang: zich yopilgan original idishda, salqin va quruq joyda, +5…+25 °C, quyosh nuridan uzoqda. Kartochkada ko‘rsatilgan yaroqlilik muddati — 24 oy.',
          },
          { h2: 'Keng tarqalgan xatolar' },
          {
            ul: [
              'Faqat flakon hidiga qarab tanlash — aromatizator damlamada va sutli ichimlikda boshqacha ochiladi.',
              'Issiq, endigina qovurilgan donga aromatizator qo‘shish.',
              'Quruq mahsulotda dozirovkani tayyor ichimlik foizi bilan aralashtirib yuborish.',
              'Uskunani tozalamasdan aromatlanmagan partiyaga o‘tish.',
              'Hid o‘tkazuvchan qadoqdan foydalanish.',
              'Sinov natijalarini yozmaslik — keyingi partiyani takrorlash qiyin bo‘ladi.',
            ],
          },
          { h2: 'Ko‘p so‘raladigan savollar' },
          {
            faq: [
              {
                q: 'Choy uchun aromatizator qancha qo‘shiladi?',
                a: 'Katalog kartochkasidagi tavsiya etilgan oraliq — 0,05–0,3%. Quruq choy uchun hisob nimaga nisbatan olinishini (barg massasi yoki tayyor damlama) yetkazib beruvchi bilan aniqlang va oraliqning uch nuqtasini bir xil damlash sharoitida solishtiring.',
              },
              {
                q: 'Kofe doniga aromatizator qachon qo‘shiladi?',
                a: 'Qovurishdan keyin, don sovigach. Issiq donda uchuvchan komponentlar tez yo‘qoladi. Aromatlangandan keyin mahsulotni yopiq idishda ushlab turing, shunda hid tekis tarqaladi.',
              },
              {
                q: 'Bitta kofe aromatizatorini ichimlik va muzqaymoqda ishlatsa bo‘ladimi?',
                a: 'Ko‘p aromatizatorlar bir nechta soha uchun belgilangan — kartochkadagi qo‘llash sohalarini tekshiring. Lekin har bir mahsulotda alohida sinov o‘tkazing: sut, yog‘ va sovuq harorat ta’mni sezilarli o‘zgartiradi.',
              },
              {
                q: 'Namunalarni qanday olsa bo‘ladi?',
                a: 'Bepul namuna qutisiga 8 tagacha aromatizator qo‘shing (25, 50 yoki 100 g). Seriya uchun hajm va narxni narx so‘rovi orqali aniqlang.',
              },
            ],
          },
        ],
        links: [
          { path: '/category/flavours/tea-coffee', label: 'Choy va kofe aromatizatorlari' },
          { path: '/industries/beverages', label: 'Ichimliklar uchun aromatizatorlar' },
          { path: '/industries/horeca', label: 'HoReCa uchun yechimlar' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Ароматизатор для чая и кофе: как выбрать',
        description:
          'Ароматизаторы для чая и кофе: ароматизация чайного листа, обжаренного зерна, растворимого кофе и напитков, проба дозировки, упаковка и частые ошибки.',
        intro:
          'При выборе ароматизатора для чая и кофе решают три вопроса: куда он вносится (сухой лист, обжаренное зерно, порошковая смесь или готовый напиток), как продукт готовят (заваривают кипятком или пьют холодным) и как его упаковывают. В каталоге Gulf Flavours в группе «Чай и кофе» 11 жидких ароматизаторов — чёрный и зелёный чай, травяной чай, Эрл Грей, матча, кофе, обжаренный кофе, кофе-концентрат, капучино, латте и ирландский кофе; рекомендуемый диапазон в карточке — 0,05–0,3%. Ниже — порядок выбора, пробы и перехода к производству.',
        blocks: [
          { h2: 'Где используется ароматизатор' },
          {
            p: 'Один и тот же «кофейный» ароматизатор по-разному работает в разных продуктах. Поэтому сначала определите, о каком продукте и каком этапе идёт речь:',
          },
          {
            ul: [
              'Ароматизированный сухой чай (чёрный, зелёный, травяные смеси) — ароматизатор наносят на лист, он раскрывается при заваривании.',
              'Обжаренные кофейные зёрна и молотый кофе — ароматизатор вносят после обжарки, в остывшее зерно.',
              'Растворимый кофе и порошковые смеси типа «3 в 1» — жидкий ароматизатор предварительно смешивают с сухим носителем (например, частью сахара или порошковой основы).',
              'Готовые напитки: холодный чай, кофейно-молочные напитки, напитки типа латте и капучино.',
              'HoReCa: сиропы и основы для кофеен.',
              'Сладкие изделия: кофейное мороженое, десерты, кремы и глазури, выпечка.',
            ],
          },
          {
            p: 'В карточке каталога для каждого ароматизатора указаны области применения — например, «Кофе» и «Капучино» отмечены не только для напитков, но и для молочной продукции и мороженого. Начинайте выбор с этого списка.',
          },
          {
            p: 'Если продукт проходит несколько этапов (например, чайную смесь сначала ароматизируют, затем фасуют в пакетики), учитывайте, сколько аромата теряется на каждом этапе, и оценивайте пробу в конечной упаковке, которую откроет потребитель.',
          },
          { h2: 'Выбор вкусового профиля' },
          {
            p: 'В чае и кофе ароматизатор должен дополнять натуральный вкус сырья, а не перекрывать его. Профиль выбирайте по задаче продукта:',
          },
          {
            ul: [
              'Нужно, чтобы чай ощущался «крепче», — ароматизатор чёрного или зелёного чая делает вкус настоя полнее.',
              'Классический ароматизированный чай — бергамот (направление Эрл Грей), пряности вроде кардамона, фруктовые и цветочные ноты.',
              'Матча — направление зелёного чая для молочных напитков, мороженого и выпечки.',
              'Кофейные напитки — «обжаренный кофе» даёт более глубокую, обжарочную ноту; капучино и латте — мягкий профиль, гармоничный с молоком и сливками.',
              'Кофе-концентрат — чтобы кофейный вкус читался чётче в мороженом, десертах и молочных напитках.',
              'Ирландский кофе — отдельное направление для десертов и напитков кофеен (в карточке отмечен для HoReCa).',
            ],
          },
          {
            p: 'Не смешивайте в одном продукте больше двух направлений. Например, «кофе + орех» или «чай + лимон» работают, а смесь из пяти нот обычно даёт «парфюмерный» и размытый вкус.',
          },
          { h2: 'Ароматизация сухого чая и кофейного зерна' },
          {
            p: 'Главная сложность ароматизации сухого продукта — равномерность. Если ароматизатор собирается в одном месте, в одной упаковке вкус будет сильным, в другой — слабым. Практический порядок:',
          },
          {
            ul: [
              'Используйте барабан или смеситель; ароматизатор распыляйте мелкими каплями, а не выливайте в одну точку.',
              'Кофейное зерно ароматизируйте после обжарки, когда температура снизилась: в горячем зерне летучие компоненты быстро теряются.',
              'После ароматизации дайте продукту «отлежаться» в закрытой таре, чтобы аромат равномерно распределился по листу или зерну; срок определите пробой.',
              'Уточните у поставщика, к чему относится дозировка — к массе сухого листа или к готовому настою: расчёт для сухого продукта отличается от расчёта для напитка.',
              'Предусмотрите отдельную линию для ароматизированного продукта или тщательный план мойки: запах остаётся на оборудовании и переходит в следующую партию.',
            ],
          },
          { h2: 'Готовые напитки и порошковые смеси' },
          {
            p: 'В готовом напитке (холодный чай, кофейно-молочный напиток) дозировка считается от массы готового продукта. Если вы сначала готовите сироп или концентрат, а потом разбавляете, пересчитайте процент на конечный напиток. Если есть термообработка (пастеризация, горячий розлив), вносите ароматизатор как можно позже и проводите пробу именно в этом режиме.',
          },
          {
            p: 'В порошковых смесях не вносите жидкий ароматизатор сразу в большую массу: он образует комки и распределяется неравномерно. Сначала тщательно смешайте его с небольшим количеством сухого носителя, затем добавьте эту предварительную смесь в общую массу. Молочные и сливочные основы немного «смягчают» кофейный вкус — в напитке типа латте проверьте и более высокую точку диапазона.',
          },
          { h2: 'Как проверить дозировку' },
          {
            p: 'Диапазон 0,05–0,3% в карточке — ориентир для старта. Точное количество для вашей рецептуры определяет только проба:',
          },
          {
            ul: [
              'Выберите три точки: нижнюю, среднюю и верхнюю часть диапазона.',
              'Взвешивайте в граммах на точных весах; измерение в миллилитрах даёт ошибку из-за разницы плотности.',
              'Заваривайте чай всегда одинаково: та же температура воды, то же время заваривания, та же пропорция.',
              'Сравните сухой чай и зерно в день ароматизации и через несколько дней — аромат со временем выравнивается.',
              'Оценивайте напиток при температуре употребления: в холодном напитке вкус ощущается слабее, чем в горячем.',
              'Маркируйте образцы кодами и по возможности оценивайте вслепую группой из 3–5 человек.',
            ],
          },
          { h2: 'Упаковка и хранение' },
          {
            p: 'Для ароматизированного чая и кофе упаковка важна не меньше самого ароматизатора. В проницаемой для запахов упаковке аромат быстро слабеет и «переходит» на соседние продукты. Барьерную упаковку, плотное запечатывание и односторонний клапан для кофе подберите вместе с поставщиком упаковки. Ароматизированный и обычный продукт храните на складе раздельно.',
          },
          {
            p: 'Сам ароматизатор храните по условиям из карточки: в плотно закрытой оригинальной таре, в прохладном сухом месте, +5…+25 °C, вдали от солнечных лучей. Срок годности, указанный в карточке, — 24 месяца.',
          },
          { h2: 'Частые ошибки' },
          {
            ul: [
              'Выбирать только по запаху из флакона — в настое и молочном напитке ароматизатор раскрывается иначе.',
              'Вносить ароматизатор в горячее, только что обжаренное зерно.',
              'Путать дозировку для сухого продукта с процентом в готовом напитке.',
              'Переходить к неароматизированной партии без мойки оборудования.',
              'Использовать упаковку, пропускающую запахи.',
              'Не записывать результаты проб — следующую партию трудно повторить.',
            ],
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Сколько ароматизатора добавлять в чай?',
                a: 'Рекомендуемый диапазон в карточке каталога — 0,05–0,3%. Для сухого чая уточните у поставщика базу расчёта (масса листа или готовый настой) и сравните три точки диапазона при одинаковых условиях заваривания.',
              },
              {
                q: 'Когда ароматизировать кофейное зерно?',
                a: 'После обжарки, когда зерно остыло. В горячем зерне летучие компоненты быстро теряются. После ароматизации выдержите продукт в закрытой таре, чтобы аромат распределился равномерно.',
              },
              {
                q: 'Можно ли один кофейный ароматизатор использовать в напитке и в мороженом?',
                a: 'Многие ароматизаторы отмечены для нескольких областей — проверьте области применения в карточке. Но в каждом продукте проводите отдельную пробу: молоко, жир и низкая температура заметно меняют вкус.',
              },
              {
                q: 'Как получить образцы?',
                a: 'Добавьте до 8 ароматизаторов в бесплатный набор образцов (25, 50 или 100 г). Объём и цену для серии уточните через запрос цены.',
              },
            ],
          },
        ],
        links: [
          { path: '/category/flavours/tea-coffee', label: 'Ароматизаторы «Чай и кофе»' },
          { path: '/industries/beverages', label: 'Ароматизаторы для напитков' },
          { path: '/industries/horeca', label: 'Решения для HoReCa' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'aromatizatorlarni-saqlash-va-yaroqlilik-muddati',
    published: '2026-11-25',
    text: {
      uz: {
        title: 'Aromatizatorlarni saqlash va yaroqlilik muddati',
        description:
          'Aromatizator, efir moyi va atir kompozitsiyasini qanday saqlash: harorat, yorug‘lik, ochilgan idish, FEFO tartibi, yaroqlilik muddati va tekshiruv.',
        intro:
          'Aromatizatorni zich yopilgan original idishda, salqin, quruq va qorong‘i joyda saqlash kerak — Gulf Flavours katalogidagi oziq-ovqat aromatizatorlari kartochkasida +5…+25 °C ko‘rsatilgan. Yaroqlilik muddati ham kartochkada yozilgan: aromatizatorlar, efir moylari va aroma kimyosi uchun 24 oy, atir kompozitsiyalari uchun 36 oy. Lekin muddat faqat to‘g‘ri saqlanganda amal qiladi: issiqlik, yorug‘lik, havo va namlik aromatni muddatidan oldin buzadi. Quyida ombor va ishlab chiqarish uchun amaliy qoidalar.',
        blocks: [
          { h2: 'Aromatizatorni nima buzadi' },
          {
            p: 'Aromatizator — uchuvchan moddalar aralashmasi. Uning sifati to‘rt asosiy omil ta’sirida pasayadi:',
          },
          {
            ul: [
              'Issiqlik — uchuvchan komponentlar tezroq bug‘lanadi, kimyoviy o‘zgarishlar tezlashadi.',
              'Yorug‘lik — ayniqsa to‘g‘ridan-to‘g‘ri quyosh nuri ba’zi komponentlarni parchalaydi.',
              'Havo (kislorod) — oksidlanish ta’mni “eskirgan”, moysimon yoki o‘tkir qiladi; sitrus notalari bunga ayniqsa sezgir.',
              'Namlik — kukun va granulalangan mahsulotlarda kesaklanish va sifat yo‘qotilishiga olib keladi.',
            ],
          },
          {
            p: 'Bundan tashqari, aromatizator atrofdagi kuchli hidlarni o‘ziga olishi yoki o‘zi boshqa mahsulotlarga hid berishi mumkin. Shuning uchun saqlash joyi faqat harorat bilan emas, “qo‘shnilar” bilan ham tanlanadi.',
          },
          { h2: 'Kartochkadagi saqlash shartlari' },
          {
            p: 'Katalogdagi har bir mahsulot kartochkasida saqlash shartlari va yaroqlilik muddati ko‘rsatilgan. Kategoriyalar bo‘yicha qisqacha:',
          },
          {
            ul: [
              'Oziq-ovqat aromatizatorlari — zich yopilgan original idishda, salqin va quruq joyda, +5…+25 °C, quyosh nuridan himoyalangan; muddat 24 oy.',
              'Efir moylari — qorong‘i shisha yoki alyuminiy idishda, +5…+20 °C; ochilgandan keyin azot bilan himoya tavsiya etiladi; muddat 24 oy.',
              'Atir kompozitsiyalari — zich yopilgan holda, +10…+30 °C, quyoshdan himoyalangan joyda; muddat 36 oy.',
              'Aroma kimyosi — zich yopilgan holda, +10…+25 °C, yondiruvchi manbalardan uzoqda; muddat 24 oy.',
              'Oziq-ovqat ingredientlari — quruq omborda, nisbiy namlik ≤ 70%, +5…+25 °C, hidli moddalar va kuchli oksidlovchilardan alohida; muddat 24 oy.',
              'Komoditi (shakar, kislotalar, erituvchilar va boshqalar) — yopiq idishda, +5…+30 °C, yaxshi shamollatiladigan omborda; muddat 18 oy.',
            ],
          },
          {
            p: 'Aniq partiya uchun muddat va saqlash shartlarini sifat sertifikati (CoA) va mahsulot hujjatlari bo‘yicha tekshiring — ular kartochkadagi umumiy ma’lumotdan ustun turadi.',
          },
          { h2: 'Ombor qoidalari' },
          {
            ul: [
              'Harorat nazorat qilinadigan joy tanlang: quyosh tushadigan deraza, isitish quvurlari va tom ostidagi issiq zonalardan uzoqroq.',
              'Idishlarni poldan yuqorida, tokchada saqlang; namlik va kondensatdan himoya qiling.',
              'Oziq-ovqat aromatizatorlarini atir kompozitsiyalari, maishiy kimyo va kuchli hidli materiallardan alohida saqlang.',
              'Yonuvchan mahsulotlarni (spirtli erituvchilar, ba’zi aroma kimyosi) olov va uchqun manbalaridan uzoqda, xavfsizlik ma’lumotnomasi (SDS) talablari bo‘yicha joylashtiring.',
              'Har bir idishda nom, artikul, partiya raqami, qabul sanasi va yaroqlilik muddati o‘qiladigan bo‘lsin.',
              'FEFO tartibini qo‘llang: birinchi navbatda muddati oldinroq tugaydigan partiya ishlatiladi.',
            ],
          },
          {
            p: 'Omborda aromatizatorlar uchun mas’ul xodim belgilang va qoldiqlarni muntazam (masalan, oyiga bir marta) ko‘zdan kechirib turing: muddati yaqinlashayotgan partiyalarni oldinroq ishlatishni rejalashtirish, ortiqcha xarid va hisobdan chiqarishdan ko‘ra ancha arzon.',
          },
          { h2: 'Qabul qilish va tashish' },
          {
            p: 'Saqlash omborga kirishdan oldin boshlanadi. Yuk qabul qilinganda aromatizator yo‘lda qanday sharoitda bo‘lganini va idishlar butunligini tekshirish keyingi muammolarning ko‘pini oldini oladi. Yozda issiq mashinada uzoq turgan yoki qishda muzlagan yuk alohida e’tibor talab qiladi.',
          },
          {
            ul: [
              'Idishlar butunligini, qopqoq va plombalarni ko‘zdan kechiring; oqish yoki shikastlangan idishni alohida qayd qiling.',
              'Yorliqdagi nom, artikul va partiya raqamini hujjatlar (yuk xati, CoA) bilan solishtiring.',
              'Qabul sanasini yozing va yukni imkon qadar tezroq saqlash zonasiga o‘tkazing — rampada yoki quyosh ostida qoldirmang.',
              'Sex ichida tashishda idishni yopiq holda va qisqa vaqt ushlang; kunlik ehtiyojdan ortiq miqdorni sexga chiqarmang.',
            ],
          },
          { h2: 'Ochilgan idish bilan ishlash' },
          {
            p: 'Idish ochilgach, havo bilan aloqa boshlanadi va aromatizator tezroq o‘zgara boshlaydi. Asosiy qoidalar:',
          },
          {
            ul: [
              'Har gal ishlatgandan keyin idishni darhol zich yoping.',
              'Faqat toza va quruq asbob (cho‘mich, pipetka, nasos) ishlating; ishlatilgan qoldiqni idishga qaytarmang.',
              'Qisman ishlatilgan katta idishda havo ko‘payadi — qoldiqni kichikroq, to‘liq to‘ldiriladigan toza idishga o‘tkazish mumkin; yangi idishga ham yorliqni to‘liq ko‘chiring.',
              'Efir moylari uchun ochilgandan keyin azot bilan himoya tavsiya etiladi (kartochkadagi shart).',
              'Ochilish sanasini idishga yozing.',
            ],
          },
          {
            p: 'Qadoq hajmini iste’molingizga moslang. Katalogdagi aromatizatorlar 1, 5, 10 va 25 kg qadoqda keladi: agar sizga oyiga oz miqdor kerak bo‘lsa, katta kanistrni uzoq vaqt ochiq holda ishlatgandan ko‘ra kichikroq qadoqni tanlash to‘g‘riroq bo‘lishi mumkin.',
          },
          { h2: 'Sifatni qanday tekshirish' },
          {
            p: 'Uzoq saqlangan yoki shubhali sharoitda turgan aromatizatorni ishlab chiqarishga berishdan oldin oddiy tekshiruv qiling:',
          },
          {
            ul: [
              'Tashqi ko‘rinish: rang, tiniqlik, cho‘kma yoki qatlamlanish bormi.',
              'Hid: blotter (hidlash qog‘ozi) yoki suvdagi eritmada nazorat namunasi bilan solishtiring.',
              'Mahsulotda sinov: kichik partiyada tayyorlab, oldingi tasdiqlangan natija bilan solishtiring.',
              'Har bir qabul qilingan partiyadan kichik nazorat namunasini (arxiv namunasi) saqlab qo‘ying — keyingi solishtirishlar uchun asos bo‘ladi.',
            ],
          },
          {
            p: 'Sovuqda ba’zi suyuq aromatizatorlar loyqalanishi yoki cho‘kma berishi mumkin. Bunday holda mahsulotni xona haroratiga keltirib, yaxshilab aralashtiring; holat tiklanmasa, partiya raqami bilan yetkazib beruvchiga murojaat qiling. Muddati o‘tgan mahsulotni ishlab chiqarishda ishlatish masalasini korxonangiz sifat tizimi va amaldagi talablar bo‘yicha hal qiling.',
          },
          { h2: 'Keng tarqalgan xatolar' },
          {
            ul: [
              'Aromatizatorni sex ichida, pech yoki qozon yonida doimiy saqlash.',
              'Idishni ochiq qoldirish yoki qopqog‘ini yaxshi yopmaslik.',
              'Bir partiyaning qoldig‘ini yangi partiya idishiga quyib aralashtirish — kuzatuv yo‘qoladi.',
              'Aromatizatorni maishiy kimyo yoki kuchli hidli xomashyo yonida saqlash.',
              'Yorliqsiz idishlarga quyish.',
              'Faqat yaroqlilik sanasiga qarab, saqlash shartlarini e’tiborsiz qoldirish.',
            ],
          },
          { h2: 'Ko‘p so‘raladigan savollar' },
          {
            faq: [
              {
                q: 'Aromatizatorning yaroqlilik muddati qancha?',
                a: 'Katalog kartochkalarida: oziq-ovqat aromatizatorlari, efir moylari va aroma kimyosi — 24 oy, atir kompozitsiyalari — 36 oy, komoditi — 18 oy. Aniq partiya uchun sifat sertifikatini tekshiring; muddat to‘g‘ri saqlash sharoitida amal qiladi.',
              },
              {
                q: 'Aromatizatorni muzlatgichda saqlash kerakmi?',
                a: 'Shart emas. Oziq-ovqat aromatizatorlari uchun kartochkada +5…+25 °C ko‘rsatilgan. Juda past haroratda ba’zi suyuq mahsulotlar loyqalanishi mumkin, shuning uchun kartochkadagi oraliqqa amal qiling.',
              },
              {
                q: 'Ochilgan idishdagi aromatizator qancha vaqt yaroqli?',
                a: 'Bu mahsulotga va qanday saqlanishiga bog‘liq. Idishni zich yoping, toza asbob ishlating, ochilish sanasini yozing va uzoq ochiq turgan mahsulotni ishlatishdan oldin nazorat namunasi bilan solishtiring. Aniq tavsiyani yetkazib beruvchidan so‘rang.',
              },
              {
                q: 'Qaysi qadoqni tanlash kerak?',
                a: 'Aromatizatorlar 1, 5, 10 va 25 kg qadoqda mavjud. Ochilgan idishni ishlatish muddatini qisqartirish uchun qadoqni iste’mol hajmingizga qarab tanlang. Hajm va narxni narx so‘rovi orqali aniqlang.',
              },
            ],
          },
        ],
        links: [
          { path: '/category/flavours', label: 'Oziq-ovqat aromatizatorlari katalogi' },
          { path: '/category/essential-oils', label: 'Efir moylari' },
          { path: '/category/fragrances', label: 'Atir kompozitsiyalari' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Хранение ароматизаторов: срок годности и условия',
        description:
          'Как хранить ароматизаторы, эфирные масла и отдушки: температура, свет, вскрытая тара, порядок FEFO, срок годности и проверка качества перед запуском.',
        intro:
          'Ароматизатор хранят в плотно закрытой оригинальной таре, в прохладном, сухом и тёмном месте — в карточках пищевых ароматизаторов каталога Gulf Flavours указано +5…+25 °C. Срок годности тоже указан в карточке: для ароматизаторов, эфирных масел и аромахимии — 24 месяца, для парфюмерных композиций — 36 месяцев. Но срок действует только при правильном хранении: тепло, свет, воздух и влага портят аромат раньше времени. Ниже — практические правила для склада и производства.',
        blocks: [
          { h2: 'Что портит ароматизатор' },
          {
            p: 'Ароматизатор — смесь летучих веществ. Его качество снижается под действием четырёх основных факторов:',
          },
          {
            ul: [
              'Тепло — летучие компоненты испаряются быстрее, химические изменения ускоряются.',
              'Свет — особенно прямые солнечные лучи разрушают часть компонентов.',
              'Воздух (кислород) — окисление делает вкус «лежалым», маслянистым или резким; особенно чувствительны цитрусовые ноты.',
              'Влага — в порошковых и гранулированных продуктах приводит к комкованию и потере качества.',
            ],
          },
          {
            p: 'Кроме того, ароматизатор может впитывать сильные посторонние запахи или сам передавать запах другим продуктам. Поэтому место хранения выбирают не только по температуре, но и по «соседям».',
          },
          { h2: 'Условия хранения в карточке' },
          {
            p: 'В карточке каждого продукта каталога указаны условия хранения и срок годности. Кратко по категориям:',
          },
          {
            ul: [
              'Пищевые ароматизаторы — в плотно закрытой оригинальной таре, в прохладном сухом месте, +5…+25 °C, беречь от солнца; срок 24 месяца.',
              'Эфирные масла — в тёмной стеклянной или алюминиевой таре, +5…+20 °C; после вскрытия рекомендуется азотная подушка; срок 24 месяца.',
              'Парфюмерные композиции (отдушки) — в плотно закрытой таре, +10…+30 °C, в защищённом от солнца месте; срок 36 месяцев.',
              'Аромахимия — в плотно закрытой таре, +10…+25 °C, вдали от источников возгорания; срок 24 месяца.',
              'Пищевые ингредиенты — на сухом складе, относительная влажность ≤ 70%, +5…+25 °C, отдельно от пахнущих веществ и сильных окислителей; срок 24 месяца.',
              'Коммодити (сахар, кислоты, растворители и др.) — в закрытой таре, +5…+30 °C, на хорошо вентилируемом складе; срок 18 месяцев.',
            ],
          },
          {
            p: 'Для конкретной партии сверяйте срок и условия с сертификатом анализа (CoA) и документацией на продукт — они приоритетнее общих данных карточки.',
          },
          { h2: 'Правила для склада' },
          {
            ul: [
              'Выбирайте место с контролем температуры: подальше от солнечных окон, труб отопления и горячих зон под крышей.',
              'Храните тару на стеллажах, а не на полу; защищайте от влаги и конденсата.',
              'Храните пищевые ароматизаторы отдельно от парфюмерных композиций, бытовой химии и сильно пахнущих материалов.',
              'Легковоспламеняющиеся продукты (спиртовые растворители, часть аромахимии) размещайте вдали от огня и искр, по требованиям паспорта безопасности (SDS).',
              'На каждой таре должны читаться название, артикул, номер партии, дата приёмки и срок годности.',
              'Применяйте FEFO: первой используется партия, у которой раньше заканчивается срок.',
            ],
          },
          {
            p: 'Назначьте ответственного за хранение ароматизаторов и регулярно (например, раз в месяц) просматривайте остатки: запланировать использование партий с подходящим к концу сроком заранее гораздо дешевле, чем лишние закупки и списания.',
          },
          { h2: 'Приёмка и транспортировка' },
          {
            p: 'Хранение начинается ещё до склада. Если при приёмке проверить, в каких условиях ароматизатор был в пути и цела ли тара, большинство последующих проблем удаётся предотвратить. Особого внимания требует груз, который летом долго стоял в горячей машине или зимой подмёрз.',
          },
          {
            ul: [
              'Осмотрите целостность тары, крышек и пломб; протёкшую или повреждённую тару отметьте отдельно.',
              'Сверьте название, артикул и номер партии на этикетке с документами (накладная, CoA).',
              'Запишите дату приёмки и как можно быстрее переместите груз в зону хранения — не оставляйте на рампе или на солнце.',
              'При перемещении по цеху держите тару закрытой и недолго; не выносите в цех больше суточной потребности.',
            ],
          },
          { h2: 'Работа со вскрытой тарой' },
          {
            p: 'После вскрытия начинается контакт с воздухом, и ароматизатор меняется быстрее. Основные правила:',
          },
          {
            ul: [
              'После каждого использования сразу плотно закрывайте тару.',
              'Используйте только чистый и сухой инструмент (черпак, пипетку, насос); не возвращайте остатки обратно в тару.',
              'В частично использованной большой таре много воздуха — остаток можно перелить в меньшую чистую тару, заполненную полностью; перенесите на неё всю маркировку.',
              'Для эфирных масел после вскрытия рекомендуется азотная подушка (условие из карточки).',
              'Записывайте на таре дату вскрытия.',
            ],
          },
          {
            p: 'Подбирайте фасовку под расход. Ароматизаторы в каталоге поставляются в таре 1, 5, 10 и 25 кг: если в месяц вам нужно немного, меньшая фасовка может оказаться разумнее, чем долго работать из открытой большой канистры.',
          },
          { h2: 'Как проверить качество' },
          {
            p: 'Перед тем как отдать в производство ароматизатор, который долго хранился или стоял в сомнительных условиях, проведите простую проверку:',
          },
          {
            ul: [
              'Внешний вид: цвет, прозрачность, наличие осадка или расслоения.',
              'Запах: сравните с контрольным образцом на блоттере (полоске для нюхания) или в водном растворе.',
              'Проба в продукте: приготовьте небольшую партию и сравните с ранее утверждённым результатом.',
              'Сохраняйте небольшой контрольный (архивный) образец от каждой принятой партии — это основа для последующих сравнений.',
            ],
          },
          {
            p: 'На холоде некоторые жидкие ароматизаторы могут мутнеть или давать осадок. В этом случае доведите продукт до комнатной температуры и тщательно перемешайте; если состояние не восстанавливается, обратитесь к поставщику с номером партии. Вопрос использования продукта с истёкшим сроком решайте по системе качества вашего предприятия и действующим требованиям.',
          },
          { h2: 'Частые ошибки' },
          {
            ul: [
              'Постоянно хранить ароматизатор в цеху, рядом с печью или котлом.',
              'Оставлять тару открытой или неплотно закрывать крышку.',
              'Сливать остаток одной партии в тару новой партии — теряется прослеживаемость.',
              'Хранить ароматизатор рядом с бытовой химией или сильно пахнущим сырьём.',
              'Переливать в тару без маркировки.',
              'Смотреть только на дату годности и игнорировать условия хранения.',
            ],
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Какой срок годности у ароматизатора?',
                a: 'В карточках каталога: пищевые ароматизаторы, эфирные масла и аромахимия — 24 месяца, парфюмерные композиции — 36 месяцев, коммодити — 18 месяцев. Для конкретной партии проверьте сертификат анализа; срок действует при соблюдении условий хранения.',
              },
              {
                q: 'Нужно ли хранить ароматизатор в холодильнике?',
                a: 'Не обязательно. Для пищевых ароматизаторов в карточке указано +5…+25 °C. При слишком низкой температуре некоторые жидкие продукты могут мутнеть, поэтому соблюдайте диапазон из карточки.',
              },
              {
                q: 'Сколько хранится ароматизатор после вскрытия?',
                a: 'Это зависит от продукта и условий. Плотно закрывайте тару, используйте чистый инструмент, записывайте дату вскрытия и перед использованием долго открытого продукта сравнивайте его с контрольным образцом. Точную рекомендацию запросите у поставщика.',
              },
              {
                q: 'Какую фасовку выбрать?',
                a: 'Ароматизаторы доступны в таре 1, 5, 10 и 25 кг. Выбирайте фасовку по расходу, чтобы вскрытая тара расходовалась быстрее. Объём и цену уточните через запрос цены.',
              },
            ],
          },
        ],
        links: [
          { path: '/category/flavours', label: 'Каталог пищевых ароматизаторов' },
          { path: '/category/essential-oils', label: 'Эфирные масла' },
          { path: '/category/fragrances', label: 'Парфюмерные композиции' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },
];
