/**
 * BLOG — 2026-noyabr maqolalari (blog.ts hajmi oshmasligi uchun alohida fayl).
 * Qoidalar `blog.ts` sarlavhasida: faqat UZ/RU, to‘qilgan raqam/da’vo yo‘q,
 * aniq dozirovka — faqat "katalog kartochkasidagi oraliq".
 */

import type { BlogArticle } from './blog';

export const ARTICLES_2026_11: BlogArticle[] = [
  /* ------------------------------------------------------------------ 5 */
  {
    slug: 'muzqaymoq-uchun-aromatizator-tanlash',
    published: '2026-11-20',
    text: {
      uz: {
        title: 'Muzqaymoq uchun aromatizator tanlash',
        description:
          'Muzqaymoq uchun aromatizator: sovuqda ta’m nega susayadi, qaysi shakl va yo‘nalish mos, qachon qo‘shiladi, dozirovkani qanday sinash va saqlash.',
        intro:
          'Muzqaymoq uchun aromatizator tanlashda uchta narsa hal qiluvchi: sovuqda ta’m kuchsizroq seziladi, yog‘ va shakar ta’mni yumshatadi, aromatizatorni qo‘shish bosqichi esa natijani o‘zgartiradi. Eng ishonchli yo‘l — 2–3 ta yo‘nalishni tanlab, katalog kartochkasidagi dozirovka oralig‘ida o‘z aralashmangizda sinash va natijani tayyor, muzlatilgan mahsulotda baholash.',
        blocks: [
          { h2: 'Nega muzqaymoqda ta’m boshqacha seziladi' },
          {
            p: 'Sovuq til va burunning ta’m hamda hidni sezishini pasaytiradi. Shu sababli xona haroratidagi suyuq aralashmada (miksda) yoqimli va yetarli tuyulgan ta’m muzlagandan keyin sezilarli darajada kuchsizroq bo‘lishi mumkin. Ikkinchi omil — yog‘. Sut yog‘i yoki o‘simlik yog‘i hid komponentlarining bir qismini o‘ziga bog‘laydi va ularni og‘izda sekinroq chiqaradi. Uchinchi omil — shakar va quruq moddalar: ular shirinlikni oshiradi va ba’zi nozik notalarni yopib qo‘yadi.',
          },
          {
            p: 'Bundan amaliy xulosa: ta’mni hech qachon faqat suyuq miksda baholamang. Retseptdagi yog‘ miqdori, shakar va stabilizatorlar o‘zgarsa, avval tanlangan aromatizator ham boshqacha "ochiladi". Shuning uchun past yog‘li sutli muzqaymoq, qaymoqli plombir va sorbet uchun bir xil aromatizatorni bir xil miqdorda ishlatish odatda kutilgan natijani bermaydi.',
          },
          { h2: 'Ta’m yo‘nalishini tanlash' },
          {
            ul: [
              'Vanil — klassik plombir va sundae asosi. Vanil, qaymoqli vanil, burbon yoki fransuz vanili kabi variantlar ta’m chuqurligi va "sutli" notasi bilan farq qiladi.',
              'Sut-qaymoq — qaymoq, quyultirilgan sut, pishirilgan sut. Ayniqsa yog‘i kam retseptlarda to‘yinganlik va "sutli" his berish uchun qo‘llanadi.',
              'Shokolad va kakao — kakao kukuni bilan birga ishlatilsa, ta’mni boyitadi va yumshoq qiladi.',
              'Mevali va rezavor — qulupnay, malina, mango, olcha. Sorbet va mevali muzqaymoqda kislotali muhit ta’mni yorqinroq qiladi, sutli asosda esa notalar yumshoqroq chiqadi.',
              'Desert va yong‘oqli — pista, karamel, toffi, cheesecake. Premium qatorlar va mavsumiy taklif uchun.',
            ],
          },
          {
            p: 'Bitta mahsulotda bitta asosiy yo‘nalish va ko‘pi bilan bitta qo‘shimcha nota yetarli: masalan, vanil + karamel yoki qulupnay + qaymoq. Yo‘nalishlar ko‘paysa, xaridor asosiy ta’mni aniq taniy olmaydi. Rangni ham ta’mga moslang: pista rangidagi muzqaymoqdan xaridor pista ta’mini kutadi.',
          },
          {
            p: 'Assortimentni rejalashtirishda doimiy va mavsumiy qatorlarni ajrating. Vanil, qaymoq va shokolad kabi asosiy ta’mlar yil bo‘yi barqaror bo‘lishi kerak — ular uchun bir marta yaxshi sinalgan pozitsiyani tanlab, uni o‘zgartirmaslik ma’qul. Mevali va desert ta’mlarida esa yangi variantlarni kichik partiyada sinab, xaridor fikriga qarab qaror qabul qilish mumkin.',
          },
          { h2: 'Shakl: suyuq, pasta yoki kukun' },
          {
            ul: [
              'Suyuq aromatizator — miksga tez va bir tekis aralashadi. Sanoat ishlab chiqarishida eng ko‘p ishlatiladigan shakl.',
              'Pasta — ta’m bilan birga ko‘pincha rang va tekstura ham beradi. Qatlam (ripple), sous va topping uchun qulay.',
              'Kukun — soft-serve uchun quruq aralashmalar va premikslarda, shuningdek, suyuqlik qo‘shish istalmagan retseptlarda.',
              'Moy asosidagi — yog‘li glazur va shokolad qoplamalari uchun, chunki ular suvli muhitda yaxshi tarqalmaydi.',
            ],
          },
          {
            p: 'Shaklni tanlashda uskunani ham hisobga oling: dozator turi, aralashtirgich va miks tayyorlash tartibi. Kichik sexda bir xil natijaga erishish uchun aniq o‘lchanadigan suyuq shakl odatda qulayroq, pasta esa qo‘lda qatlam qilinadigan mahsulotlarda o‘zini oqlaydi.',
          },
          { h2: 'Aromatizatorni qaysi bosqichda qo‘shish' },
          {
            p: 'Keng tarqalgan amaliyot — aromatizatorni pasterizatsiya va gomogenizatsiyadan keyin, miks sovigach qo‘shish: yetiltirish bosqichida yoki muzlatishdan oldin. Issiq aralashmaga qo‘shilganda uchuvchan komponentlarning bir qismi bug‘lanib ketadi va ta’m o‘zgaradi. Agar texnologiyangiz aromatizatorni issiq bosqichda qo‘shishni talab qilsa, katalogda "issiqqa chidamli" belgisi bor pozitsiyalarni tanlang va baribir sinab ko‘ring.',
          },
          {
            p: 'Qatlam va topping uchun pasta yoki sous odatda muzlatkichdan chiqqan muzqaymoqqa to‘ldirish paytida qo‘shiladi. Bu holda pasta ta’mi asosiy massadan kuchliroq bo‘lishi mumkin — ikkalasining muvozanatini birgalikda baholang.',
          },
          { h2: 'Dozirovkani qanday sinash kerak' },
          {
            p: 'Katalogdagi har bir mahsulot kartochkasida tavsiya etilgan dozirovka oralig‘i ko‘rsatilgan. Shu oraliq ichida quyidagi tartibda ishlang:',
          },
          {
            ul: [
              'Bitta asosiy miks tayyorlab, uni uchta partiyaga bo‘ling: oraliqning past, o‘rta va yuqori nuqtasi.',
              'Barcha partiyalarni bir xil sharoitda muzlating va kamida bir kecha saqlang.',
              'Namunalarni raqamlab, sotuvdagi haroratda ko‘r-ko‘rona tatib ko‘ring — kim qaysi miqdorni tatiyotganini bilmasin.',
              'Erish paytidagi ta’mni ham baholang: ba’zi notalar muzqaymoq erigan sari kuchayadi.',
              'Har bir sinovni yozib boring: miqdor, partiya, sana, izohlar. Keyingi partiyalar shu yozuvga tayanadi.',
            ],
          },
          {
            p: 'Asosiy retseptda yog‘, shakar yoki stabilizator o‘zgarsa, sinovni takrorlang. Bir xil aromatizator boshqa asosda boshqacha natija beradi.',
          },
          {
            p: 'Laboratoriya sinovidan sanoat partiyasiga o‘tganda birinchi ishlab chiqarish partiyasini ham alohida tatib ko‘ring. Katta hajmdagi aralashtirish, yetiltirish vaqti va muzlatish rejimi ta’mga ta’sir qilishi mumkin, shuning uchun kichik sinovda tanlangan miqdorni sanoat sharoitida bir marta tasdiqlab olish kerak.',
          },
          { h2: 'Tez-tez uchraydigan xatolar' },
          {
            ul: [
              'Ta’mni faqat suyuq miksda, xona haroratida baholash.',
              'Ortiqcha miqdor — kimyoviy yoki achchiq ta’m qoldiradi, ayniqsa vanil va yong‘oq notalarida.',
              'Bitta mahsulotda juda ko‘p ta’m yo‘nalishini aralashtirish.',
              'Rang va ta’m mos kelmasligi — xaridor ko‘rgan narsasining ta’mini kutadi.',
              'Aromatizatorni issiq miksga qo‘shib, keyin "ta’m yo‘qoldi" deb miqdorni oshirish.',
              'Ochiq idishda saqlash — aromatizator kuchsizlanadi va begona hid oladi.',
            ],
          },
          { h2: 'Saqlash va hujjatlar' },
          {
            p: 'Aromatizatorni zich yopilgan asl idishda, salqin va quyosh nuri tushmaydigan joyda saqlang. Ochilgan idishni imkon qadar tezroq ishlating va har safar qopqog‘ini mahkam yoping. Yaroqlilik muddati va saqlash shartlari mahsulot kartochkasi va hujjatlarida ko‘rsatiladi.',
          },
          {
            p: 'Halol, GMO-siz yoki spirtsiz kabi belgilar katalog kartochkasida ko‘rsatilgan. Yorliq tayyorlash va ichki nazorat uchun kerakli hujjatlarni (spetsifikatsiya, xavfsizlik ma’lumotlari) aniq pozitsiya bo‘yicha so‘rang — talablar mahsulot va bozorga qarab farq qiladi.',
          },
          {
            p: 'Yangi partiyani qabul qilganda uning hidi va tashqi ko‘rinishini oldingi partiya yoki tasdiqlangan namuna bilan solishtiring. Kichik nazorat namunasini saqlab qo‘yish keyingi partiyalardagi farqni tez aniqlashga yordam beradi.',
          },
          { h2: 'Ko‘p beriladigan savollar' },
          {
            faq: [
              {
                q: 'Muzqaymoq uchun qaysi biri yaxshi: suyuq aromatizatormi yoki pasta?',
                a: 'Sanoat miksi uchun odatda suyuq aromatizator qulay: tez va bir tekis aralashadi. Pasta qatlam, sous va topping uchun yoki ta’m bilan birga rang ham kerak bo‘lganda tanlanadi. Eng to‘g‘ri yo‘l — ikkalasini o‘z retseptingizda solishtirish.',
              },
              {
                q: 'Muzqaymoqqa qancha aromatizator qo‘shiladi?',
                a: 'Aniq miqdor retseptga, yog‘ va shakar miqdoriga bog‘liq. Katalog kartochkasidagi tavsiya etilgan oraliqdan foydalaning: past chegaradan boshlab, 2–3 darajani tayyor, muzlatilgan mahsulotda solishtiring.',
              },
              {
                q: 'Nega muzlagandan keyin ta’m kuchsizlanadi?',
                a: 'Sovuq ta’m va hid sezgisini pasaytiradi, yog‘ esa hid komponentlarini bog‘laydi. Shuning uchun ta’mni faqat tayyor, muzlatilgan mahsulotda va sotuvdagi haroratda baholang.',
              },
              {
                q: 'Sinov uchun namuna olsa bo‘ladimi?',
                a: 'Ha. Bepul namuna qutisiga 8 tagacha pozitsiya qo‘shib, har birini 25, 50 yoki 100 g hajmda so‘rashingiz mumkin.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/icecream', label: 'Muzqaymoq uchun aromatizatorlar' },
          { path: '/category/flavours/dairy', label: 'Sut va qaymoq aromatizatorlari' },
          { path: '/category/flavours/sweet', label: 'Vanil va desert aromatizatorlari' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Ароматизатор для мороженого: как выбрать',
        description:
          'Ароматизатор для мороженого: почему на холоде вкус слабее, какая форма и профиль подходят, когда вносить, как подобрать дозировку и хранить.',
        intro:
          'При выборе ароматизатора для мороженого решают три вещи: на холоде вкус ощущается слабее, жир и сахар смягчают аромат, а этап внесения меняет результат. Самый надёжный путь — выбрать 2–3 направления, проверить их в своей смеси в пределах диапазона дозировки из карточки каталога и оценивать результат только в готовом замороженном продукте.',
        blocks: [
          { h2: 'Почему в мороженом вкус ощущается иначе' },
          {
            p: 'Холод снижает чувствительность языка и обоняния. Поэтому вкус, который в жидкой смеси при комнатной температуре кажется приятным и достаточным, после заморозки может стать заметно слабее. Второй фактор — жир. Молочный или растительный жир связывает часть ароматических компонентов и медленнее отдаёт их во рту. Третий — сахар и сухие вещества: они усиливают сладость и перекрывают часть тонких нот.',
          },
          {
            p: 'Практический вывод: никогда не оценивайте вкус только по жидкой смеси. Если в рецептуре меняются жирность, сахар или стабилизаторы, тот же ароматизатор «раскрывается» иначе. Поэтому один и тот же ароматизатор в одной дозировке для нежирного молочного мороженого, сливочного пломбира и сорбета обычно не даёт ожидаемого результата.',
          },
          { h2: 'Выбор вкусового направления' },
          {
            ul: [
              'Ваниль — основа классического пломбира и сандея. Ваниль, сливочная ваниль, бурбонская или французская ваниль различаются глубиной и «молочной» нотой.',
              'Сливочно-молочные — сливки, сгущённое молоко, топлёное молоко. Особенно полезны в рецептурах с пониженной жирностью, чтобы добавить насыщенность.',
              'Шоколад и какао — вместе с какао-порошком делают вкус богаче и мягче.',
              'Фруктовые и ягодные — клубника, малина, манго, вишня. В сорбетах кислая среда делает вкус ярче, в молочной основе ноты звучат мягче.',
              'Десертные и ореховые — фисташка, карамель, ирис, чизкейк. Для премиальных линеек и сезонных позиций.',
            ],
          },
          {
            p: 'В одном продукте достаточно одного основного направления и максимум одной дополнительной ноты: например, ваниль + карамель или клубника + сливки. Если направлений больше, покупатель не узнаёт основной вкус. Согласуйте и цвет со вкусом: от мороженого фисташкового цвета покупатель ждёт вкуса фисташки.',
          },
          {
            p: 'При планировании ассортимента разделяйте постоянную и сезонную линейки. Базовые вкусы — ваниль, сливки, шоколад — должны быть стабильны круглый год: для них разумно один раз выбрать хорошо проверенную позицию и не менять её. Фруктовые и десертные вкусы можно тестировать небольшими партиями и принимать решение по отклику покупателей.',
          },
          { h2: 'Форма: жидкость, паста или порошок' },
          {
            ul: [
              'Жидкий ароматизатор — быстро и равномерно смешивается со смесью. Самая распространённая форма в промышленном производстве.',
              'Паста — вместе со вкусом часто даёт цвет и текстуру. Удобна для прослоек (риппл), соусов и топпингов.',
              'Порошок — для сухих смесей для софт-мороженого и премиксов, а также там, где нежелательно добавлять жидкость.',
              'Масляные — для жировых глазурей и шоколадных покрытий, где водные формы плохо распределяются.',
            ],
          },
          {
            p: 'При выборе формы учитывайте оборудование: тип дозатора, мешалку и порядок приготовления смеси. В небольшом цехе стабильный результат проще получить с точно отмеряемой жидкой формой, а паста оправдана в изделиях, где прослойку делают вручную.',
          },
          { h2: 'На каком этапе вносить ароматизатор' },
          {
            p: 'Распространённая практика — вносить ароматизатор после пастеризации и гомогенизации, когда смесь остыла: на этапе созревания или перед фризерованием. При внесении в горячую смесь часть летучих компонентов испаряется, и вкус меняется. Если ваша технология требует вносить ароматизатор на горячем этапе, выбирайте позиции с отметкой «термостабильный» в каталоге и всё равно проверяйте результат.',
          },
          {
            p: 'Пасты и соусы для прослоек и топпингов обычно вносят при наполнении, когда мороженое выходит из фризера. В этом случае вкус пасты может быть сильнее основной массы — оценивайте их баланс вместе.',
          },
          { h2: 'Как подобрать дозировку' },
          {
            p: 'В карточке каждого продукта каталога указан рекомендуемый диапазон дозировки. Работайте внутри него в таком порядке:',
          },
          {
            ul: [
              'Приготовьте одну базовую смесь и разделите её на три партии: нижняя, средняя и верхняя точка диапазона.',
              'Заморозьте все партии в одинаковых условиях и выдержите минимум ночь.',
              'Пронумеруйте образцы и проведите слепую дегустацию при температуре реализации.',
              'Оцените вкус и при таянии: некоторые ноты усиливаются по мере таяния.',
              'Записывайте каждый тест: дозировку, партию, дату, комментарии. На эти записи будут опираться следующие партии.',
            ],
          },
          {
            p: 'Если в базовой рецептуре меняются жир, сахар или стабилизатор, повторите тест. Один и тот же ароматизатор на другой основе даёт другой результат.',
          },
          {
            p: 'При переходе от лабораторного теста к промышленной партии отдельно продегустируйте первую производственную партию. Смешивание в большом объёме, время созревания и режим фризерования могут повлиять на вкус, поэтому подобранную на малом тесте дозировку нужно один раз подтвердить в условиях производства.',
          },
          { h2: 'Частые ошибки' },
          {
            ul: [
              'Оценивать вкус только в жидкой смеси при комнатной температуре.',
              'Передозировка — химический или горький привкус, особенно у ванили и орехов.',
              'Смешивать в одном продукте слишком много вкусовых направлений.',
              'Несоответствие цвета и вкуса — покупатель ждёт вкус того, что видит.',
              'Вносить ароматизатор в горячую смесь, а потом увеличивать дозировку, потому что «вкус пропал».',
              'Хранить в открытой таре — ароматизатор выдыхается и впитывает посторонние запахи.',
            ],
          },
          { h2: 'Хранение и документы' },
          {
            p: 'Храните ароматизатор в плотно закрытой оригинальной таре, в прохладном месте без прямого солнечного света. Вскрытую упаковку используйте как можно быстрее и каждый раз плотно закрывайте. Срок годности и условия хранения указаны в карточке продукта и в документации.',
          },
          {
            p: 'Отметки «халяль», «без ГМО» или «без спирта» указаны в карточке каталога. Документы для маркировки и внутреннего контроля (спецификацию, паспорт безопасности) запрашивайте по конкретной позиции — требования зависят от продукта и рынка.',
          },
          {
            p: 'При приёмке новой партии сравните её запах и внешний вид с предыдущей партией или утверждённым образцом. Небольшой контрольный образец, сохранённый для сравнения, помогает быстро заметить отличия в следующих поставках.',
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Что лучше для мороженого: жидкий ароматизатор или паста?',
                a: 'Для промышленной смеси обычно удобнее жидкий ароматизатор: он быстро и равномерно смешивается. Пасту выбирают для прослоек, соусов и топпингов или когда вместе со вкусом нужен цвет. Лучше всего сравнить оба варианта на своей рецептуре.',
              },
              {
                q: 'Сколько ароматизатора добавлять в мороженое?',
                a: 'Точная дозировка зависит от рецептуры, жирности и сахара. Используйте рекомендуемый диапазон из карточки каталога: начните с нижней границы и сравните 2–3 уровня в готовом замороженном продукте.',
              },
              {
                q: 'Почему после заморозки вкус слабеет?',
                a: 'Холод снижает восприятие вкуса и запаха, а жир связывает ароматические компоненты. Поэтому оценивайте вкус только в готовом замороженном продукте при температуре реализации.',
              },
              {
                q: 'Можно ли получить образцы для теста?',
                a: 'Да. В бесплатный набор образцов можно добавить до 8 позиций, каждую — объёмом 25, 50 или 100 г.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/icecream', label: 'Ароматизаторы для мороженого' },
          { path: '/category/flavours/dairy', label: 'Сливочные и молочные ароматизаторы' },
          { path: '/category/flavours/sweet', label: 'Ванильные и десертные ароматизаторы' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: 'sovun-uchun-atir-kompozitsiyasi',
    published: '2026-11-20',
    text: {
      uz: {
        title: 'Sovun uchun atir kompozitsiyasi tanlash',
        description:
          'Sovun uchun atir kompozitsiyasi (otdushka): ishqoriy muhitda barqarorlik, sovun turi, rang o‘zgarishi, dozirovkani sinash, hujjatlar va saqlash.',
        intro:
          'Sovun uchun atir kompozitsiyasini (otdushka) tanlashda asosiy mezon — ishqoriy muhitda barqarorlik: sovun asosi hidni o‘zgartirishi, rangni qoraytirishi yoki tayyorlash jarayoniga ta’sir qilishi mumkin. Shuning uchun sovun va yuviladigan kosmetika uchun mo‘ljallangan kompozitsiyani tanlang, uni katalog kartochkasidagi dozirovka oralig‘ida kichik partiyada sinang va hidni yetilish va saqlash davridan keyin baholang.',
        blocks: [
          { h2: 'Atir kompozitsiyasi, efir moyi va oziq-ovqat aromatizatori' },
          {
            p: 'Atir kompozitsiyasi — o‘nlab hid komponentlaridan tuzilgan tayyor hid. U parfyumeriya, kosmetika, sovun va maishiy kimyo uchun ishlab chiqiladi va har biri muayyan mahsulot turlari uchun mo‘ljallanadi. Oziq-ovqat aromatizatori esa ovqatga ta’m berish uchun yaratilgan: sovunning ishqoriy muhitiga moslashtirilmagan, shuning uchun unda hid tez yo‘qolishi yoki o‘zgarishi mumkin.',
          },
          {
            p: 'Efir moylari ham sovunda ishlatiladi, lekin ularning hid palitrasi cheklangan, xomashyo partiyasiga qarab hid farq qilishi mumkin, ba’zilari esa (ayniqsa sitrus moylari) sovunda tez so‘nadi. Ko‘pincha efir moyi va atir kompozitsiyasi birga ishlatiladi: tabiiy nota va barqaror hid birlashadi.',
          },
          { h2: 'Sovun turi tanlovga qanday ta’sir qiladi' },
          {
            ul: [
              'Sovuq usul — ishqor hali faol. Ba’zi kompozitsiyalar massani tez quyuqlashtirishi, ajralishga olib kelishi yoki rangni o‘zgartirishi mumkin. Shuning uchun aynan shu usulda sinalgan kompozitsiya kerak.',
              'Issiq usul — kompozitsiya odatda pishirishdan keyin qo‘shiladi. Harorat yuqori bo‘lsa, yengil boshlang‘ich notalar bir qismi bug‘lanadi.',
              'Tayyor asos (eritib quyiladigan, glitserinli) — ishqor reaksiyasi tugagan, lekin eritish harorati va shaffoflik muhim: ba’zi kompozitsiyalar shaffof asosni loyqa qiladi.',
              'Sanoat qattiq sovuni — kompozitsiya odatda massani maydalash va presslashdan oldin qo‘shiladi; aralashmaning bir tekisligi muhim.',
              'Suyuq sovun va dush geli — eruvchanlik, loyqalanish va quyuqlikning o‘zgarishi tekshiriladi.',
            ],
          },
          {
            p: 'Namuna so‘rashdan oldin yetkazib beruvchiga qaysi usulda ishlashingizni, sovun asosining turini va kompozitsiyani qaysi bosqichda qo‘shishingizni ayting. Shunda sizga aynan shu jarayon uchun mos pozitsiyalar taklif qilinadi va sinovlar soni kamayadi.',
          },
          { h2: 'Rang o‘zgarishi va hid barqarorligi' },
          {
            p: 'Sovundagi eng ko‘p uchraydigan muammo — vaqt o‘tib rangning o‘zgarishi. Vanilin va shunga o‘xshash shirin, "gurmand" notalar oq sovunni asta-sekin och jigarrang yoki qo‘ng‘ir rangga bo‘yashi mumkin. Agar mahsulotingiz oq yoki och rangli bo‘lsa, yetkazib beruvchidan aynan shu pozitsiyaning rangga ta’siri haqida so‘rang va sinov partiyasini bir necha hafta kuzating.',
          },
          {
            p: 'Ikkinchi masala — hid barqarorligi. Sitrus va yashil kabi yengil notalar tez uchadi, yog‘ochli, mushkli va sharqona notalar esa uzoqroq saqlanadi. Hid sovunda ham, ko‘pikda ham, qo‘lda qolgan izda ham yoqimli bo‘lishi kerak — buni faqat sinovda tekshirish mumkin.',
          },
          {
            p: 'Rangli sovun tayyorlasangiz, bo‘yoq va kompozitsiyani birga sinang: ba’zi hidlar bo‘yoq tusini o‘zgartirishi mumkin. Sinov partiyasining bir qismini yorug‘da, bir qismini qorong‘ida saqlab, rang va hidning o‘zgarishini solishtirish foydali.',
          },
          { h2: 'Hid profilini tanlash' },
          {
            ul: [
              'Mevali va shirin — bolalar va yoshlar seriyalari uchun.',
              'Gulli — klassik sovun va sovg‘a to‘plamlari uchun.',
              'Toza va dengiz notalari — gigiyena va kundalik foydalanish uchun.',
              'Sutli, kokos va shi yog‘i notalari — parvarish seriyalari uchun.',
              'Yog‘ochli va sharqona — erkaklar va premium seriyalar uchun.',
            ],
          },
          {
            p: 'Agar sovun bilan birga shampun, dush geli yoki krem chiqarsangiz, bitta hid oilasini butun seriyada ishlatish brendni taniqli qiladi. Faqat har bir asos uchun alohida sinov o‘tkazing: bitta kompozitsiya turli mahsulotlarda boshqacha ochiladi.',
          },
          {
            p: 'Hidni tanlashni bir kishining didiga qoldirmang. Bir nechta xodim yoki maqsadli xaridorlardan iborat kichik guruhga raqamlangan sinov namunalarini bering va ularning fikrini yozib oling. Hidni turli vaqtda baholash ham muhim: birinchi taassurot va bir necha daqiqadan keyingi hid ko‘pincha farq qiladi.',
          },
          { h2: 'Dozirovka va sinov tartibi' },
          {
            p: 'Katalogdagi har bir kompozitsiya kartochkasida tavsiya etilgan dozirovka oralig‘i ko‘rsatilgan. Sinovni shunday tashkil qiling:',
          },
          {
            ul: [
              'Kichik partiyalarda oraliq ichidagi 2–3 darajani solishtiring.',
              'Kompozitsiyani qaysi bosqichda va qaysi haroratda qo‘shganingizni yozib oling.',
              'Qotish tezligi, tekstura, rang va shaffoflikni kuzating.',
              'Hidni bir necha marta baholang: tayyorlangan kuni, yetilishdan keyin va bir necha hafta saqlangandan keyin.',
              'Sovunni yakuniy qadog‘ida saqlab ko‘ring: ba’zi qadoq materiallari hidni yutadi yoki o‘zgartiradi.',
            ],
          },
          {
            p: 'Kartochkadagi oraliqdan va hujjatlarda ko‘rsatilgan maksimal miqdordan oshirmang: ortiqcha miqdor xavfsizlik talablariga ham, mahsulot sifatiga ham salbiy ta’sir qiladi va xarajatni oshiradi.',
          },
          {
            p: 'Kompozitsiyani hajm bilan emas, og‘irlik bilan o‘lchang: turli kompozitsiyalarning zichligi har xil, shuning uchun bir xil hajm turli miqdorni beradi. Aniq tarozi va har bir partiya uchun yozilgan retsept natijani takrorlanuvchan qiladi.',
          },
          { h2: 'Xavfsizlik hujjatlari va yorliq' },
          {
            p: 'Kosmetika va yuviladigan mahsulotlarda atir kompozitsiyasidan foydalanish xalqaro IFRA standartlari va mahalliy me’yorlar bilan tartibga solinadi: har bir kompozitsiya uchun mahsulot turiga qarab ruxsat etilgan maksimal miqdor belgilanadi. Yetkazib beruvchidan aniq pozitsiya bo‘yicha xavfsizlik ma’lumotlari varaqasini (SDS), IFRA muvofiqlik hujjatini va allergenlar ro‘yxatini so‘rang — ular yorliq tayyorlash va mahsulotni ro‘yxatdan o‘tkazish uchun ham kerak bo‘ladi.',
          },
          {
            p: 'Hujjatlarda kompozitsiyaning qo‘llanish sohasi ham ko‘rsatiladi. Masalan, sovun uchun mos kompozitsiya teriga surtib qoldiriladigan krem yoki lab mahsulotlari uchun boshqa cheklovlarga ega bo‘lishi mumkin. Shuning uchun yangi mahsulot turiga o‘tishda hujjatlarni qayta tekshiring.',
          },
          {
            p: 'Saqlash: kompozitsiyani zich yopilgan asl idishda, salqin, qorong‘i va issiqlik manbalaridan uzoq joyda saqlang. Ochiq qolgan idishda yengil notalar uchib ketadi va hid profili o‘zgaradi.',
          },
          { h2: 'Tez-tez uchraydigan xatolar' },
          {
            ul: [
              'Sovun uchun oziq-ovqat aromatizatori yoki shamga mo‘ljallangan kompozitsiyani ishlatish.',
              'Hidni faqat flakondan hidlab tanlash — sovunda u boshqacha ochiladi.',
              'Sinovsiz katta partiya tayyorlash.',
              'Oq sovun uchun rangga ta’sir qiluvchi notalarni tekshirmasdan tanlash.',
              'Kompozitsiyani issiq va yorug‘ joyda, ochiq idishda saqlash.',
            ],
          },
          { h2: 'Ko‘p beriladigan savollar' },
          {
            faq: [
              {
                q: 'Sovun uchun oziq-ovqat aromatizatorini ishlatsa bo‘ladimi?',
                a: 'Tavsiya etilmaydi: u ishqoriy muhit va kosmetik qo‘llash uchun mo‘ljallanmagan, hid barqaror bo‘lmasligi mumkin. Sovun uchun aynan shu maqsadga mo‘ljallangan atir kompozitsiyasini tanlang.',
              },
              {
                q: 'Sovunga qancha atir kompozitsiyasi qo‘shiladi?',
                a: 'Miqdor sovun turi, asos va kompozitsiyaga bog‘liq. Katalog kartochkasidagi tavsiya etilgan oraliqdan foydalaning va hujjatlarda ko‘rsatilgan maksimal ruxsat etilgan miqdordan oshirmang.',
              },
              {
                q: 'Nega sovun vaqt o‘tib qo‘ng‘ir rangga kiradi?',
                a: 'Ko‘pincha sababi kompozitsiyadagi vanilin va shunga o‘xshash shirin notalar. Oq sovun uchun bunday notalarsiz kompozitsiya tanlang yoki rangni sinov partiyasida oldindan tekshiring.',
              },
              {
                q: 'Bitta hidni sovun va shampun uchun ishlatsa bo‘ladimi?',
                a: 'Ko‘p kompozitsiyalar bir nechta yuviladigan mahsulotga mos keladi, lekin har bir asosda alohida sinov kerak: shampun va gelda eruvchanlik va quyuqlik, sovunda esa ishqoriy muhitdagi barqarorlik tekshiriladi.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/personal-care', label: 'Kosmetika va parvarish uchun hidlar' },
          { path: '/category/fragrances/personal-care', label: 'Sovun va kosmetika uchun atir kompozitsiyalari' },
          { path: '/category/essential-oils', label: 'Efir moylari' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Отдушка для мыла: как выбрать и проверить',
        description:
          'Отдушка для мыла: стабильность в щелочной среде, тип мыла, изменение цвета, как подобрать дозировку, какие документы запросить и как хранить.',
        intro:
          'Главный критерий выбора отдушки (парфюмерной композиции) для мыла — стабильность в щелочной среде: мыльная основа может изменить запах, затемнить цвет или повлиять на процесс варки. Поэтому выбирайте композицию, предназначенную для мыла и смываемой косметики, проверяйте её на небольшой партии в пределах диапазона дозировки из карточки каталога и оценивайте запах после созревания и хранения.',
        blocks: [
          { h2: 'Отдушка, эфирное масло и пищевой ароматизатор' },
          {
            p: 'Парфюмерная композиция (отдушка) — готовый аромат из десятков душистых компонентов. Её разрабатывают для парфюмерии, косметики, мыла и бытовой химии, и каждая предназначена для определённых типов продуктов. Пищевой ароматизатор создан, чтобы придавать вкус еде: он не адаптирован к щелочной среде мыла, поэтому запах в нём может быстро исчезнуть или измениться.',
          },
          {
            p: 'Эфирные масла тоже используют в мыле, но их палитра ограничена, запах может отличаться от партии к партии сырья, а некоторые (особенно цитрусовые) быстро выветриваются в мыле. Часто эфирное масло и отдушку применяют вместе: натуральная нота сочетается со стабильным ароматом.',
          },
          { h2: 'Как тип мыла влияет на выбор' },
          {
            ul: [
              'Холодный способ — щёлочь ещё активна. Некоторые композиции быстро загущают массу, вызывают расслоение или меняют цвет. Нужна композиция, проверенная именно в этом способе.',
              'Горячий способ — отдушку обычно вводят после варки. При высокой температуре часть лёгких верхних нот испаряется.',
              'Готовая основа (плавкая, глицериновая) — реакция омыления завершена, но важны температура плавления и прозрачность: некоторые композиции мутят прозрачную основу.',
              'Промышленное твёрдое мыло — отдушку обычно вводят перед вальцеванием и прессованием; важна равномерность смешивания.',
              'Жидкое мыло и гель для душа — проверяют растворимость, помутнение и изменение вязкости.',
            ],
          },
          {
            p: 'Перед запросом образцов сообщите поставщику, каким способом вы работаете, какой тип мыльной основы используете и на каком этапе вводите отдушку. Тогда вам предложат позиции, подходящие именно для вашего процесса, и количество тестов сократится.',
          },
          { h2: 'Изменение цвета и стойкость аромата' },
          {
            p: 'Самая частая проблема в мыле — изменение цвета со временем. Ванилин и похожие сладкие «гурманские» ноты могут постепенно окрашивать белое мыло в светло-коричневый или бурый цвет. Если ваш продукт белый или светлый, запросите у поставщика данные о влиянии конкретной позиции на цвет и понаблюдайте за тестовой партией несколько недель.',
          },
          {
            p: 'Второй вопрос — стойкость. Лёгкие цитрусовые и зелёные ноты улетучиваются быстрее, древесные, мускусные и восточные держатся дольше. Аромат должен быть приятным и в бруске, и в пене, и в шлейфе на коже рук — проверить это можно только тестом.',
          },
          {
            p: 'Если вы делаете цветное мыло, тестируйте краситель и отдушку вместе: некоторые ароматы меняют оттенок красителя. Полезно хранить часть тестовой партии на свету, а часть — в темноте и сравнить изменение цвета и запаха.',
          },
          { h2: 'Выбор аромата' },
          {
            ul: [
              'Фруктовые и сладкие — для детских и молодёжных серий.',
              'Цветочные — для классического мыла и подарочных наборов.',
              'Свежие и морские — для гигиенических средств на каждый день.',
              'Молочные, кокосовые ноты и масло ши — для ухаживающих серий.',
              'Древесные и восточные — для мужских и премиальных серий.',
            ],
          },
          {
            p: 'Если вместе с мылом вы выпускаете шампунь, гель для душа или крем, одно семейство ароматов во всей серии делает бренд узнаваемым. Но проводите отдельный тест для каждой основы: одна и та же композиция раскрывается в разных продуктах по-разному.',
          },
          {
            p: 'Не оставляйте выбор аромата на вкус одного человека. Дайте пронумерованные тестовые образцы небольшой группе сотрудников или целевых покупателей и запишите их мнение. Важно оценивать аромат и во времени: первое впечатление и запах через несколько минут часто различаются.',
          },
          { h2: 'Дозировка и порядок теста' },
          {
            p: 'В карточке каждой композиции в каталоге указан рекомендуемый диапазон дозировки. Организуйте тест так:',
          },
          {
            ul: [
              'Сравните на небольших партиях 2–3 уровня внутри диапазона.',
              'Записывайте, на каком этапе и при какой температуре вводили отдушку.',
              'Наблюдайте за скоростью застывания, текстурой, цветом и прозрачностью.',
              'Оценивайте запах несколько раз: в день изготовления, после созревания и после нескольких недель хранения.',
              'Храните мыло в финальной упаковке: некоторые упаковочные материалы впитывают или искажают аромат.',
            ],
          },
          {
            p: 'Не превышайте диапазон из карточки и максимальную дозировку из документации: избыток отдушки плохо сказывается и на соответствии требованиям безопасности, и на качестве продукта, а также увеличивает затраты.',
          },
          {
            p: 'Отмеряйте отдушку по массе, а не по объёму: плотность у разных композиций разная, поэтому одинаковый объём даёт разное количество. Точные весы и записанная для каждой партии рецептура делают результат воспроизводимым.',
          },
          { h2: 'Документы по безопасности и маркировка' },
          {
            p: 'Применение парфюмерных композиций в косметике и смываемых продуктах регулируется международными стандартами IFRA и местными нормами: для каждой композиции в зависимости от типа продукта установлена максимально допустимая концентрация. Запросите у поставщика по конкретной позиции паспорт безопасности (SDS), сертификат соответствия IFRA и перечень аллергенов — они нужны и для маркировки, и для регистрации продукта.',
          },
          {
            p: 'В документации указывается и область применения композиции. Например, подходящая для мыла композиция может иметь другие ограничения для несмываемых кремов или средств для губ. Поэтому при переходе на новый тип продукта проверяйте документы заново.',
          },
          {
            p: 'Хранение: держите отдушку в плотно закрытой оригинальной таре, в прохладном тёмном месте вдали от источников тепла. В открытой таре лёгкие ноты улетучиваются, и профиль аромата меняется.',
          },
          { h2: 'Частые ошибки' },
          {
            ul: [
              'Использовать для мыла пищевой ароматизатор или отдушку для свечей.',
              'Выбирать аромат только по запаху из флакона — в мыле он раскрывается иначе.',
              'Сразу варить большую партию без теста.',
              'Брать для белого мыла ноты, влияющие на цвет, без проверки.',
              'Хранить отдушку в тепле, на свету и в открытой таре.',
            ],
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Можно ли использовать пищевой ароматизатор для мыла?',
                a: 'Не рекомендуется: он не предназначен для щелочной среды и косметического применения, запах может быть нестойким. Для мыла выбирайте парфюмерную композицию, предназначенную именно для этого.',
              },
              {
                q: 'Сколько отдушки добавлять в мыло?',
                a: 'Количество зависит от типа мыла, основы и композиции. Используйте рекомендуемый диапазон из карточки каталога и не превышайте максимально допустимую дозировку из документации.',
              },
              {
                q: 'Почему мыло со временем буреет?',
                a: 'Чаще всего причина — ванилин и похожие сладкие ноты в композиции. Для белого мыла выбирайте композицию без таких нот или заранее проверьте цвет на тестовой партии.',
              },
              {
                q: 'Можно ли использовать один аромат для мыла и шампуня?',
                a: 'Многие композиции подходят для нескольких смываемых продуктов, но для каждой основы нужен отдельный тест: в шампуне и геле проверяют растворимость и вязкость, в мыле — стабильность в щелочной среде.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/personal-care', label: 'Ароматы для косметики и ухода' },
          { path: '/category/fragrances/personal-care', label: 'Отдушки для мыла и косметики' },
          { path: '/category/essential-oils', label: 'Эфирные масла' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },
];
