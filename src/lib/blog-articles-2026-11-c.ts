/**
 * BLOG — 2026-noyabr, 3-to‘plam: go‘sht mahsulotlari, sut mahsulotlari.
 * Qoidalar `blog.ts` sarlavhasida: faqat UZ/RU, to‘qilgan raqam/da’vo yo‘q,
 * aniq dozirovka — faqat "katalog kartochkasidagi oraliq". Ta’m nomlari
 * katalogdagi haqiqiy pozitsiyalar (src/data/catalog.json: savoury, herb-spice,
 * dairy guruhlari; ta’m asoslari — food-ingredients/savoury-base).
 */

import type { BlogArticle } from './blog';

export const ARTICLES_2026_11_C: BlogArticle[] = [
  /* ------------------------------------------------------------------ 10 */
  {
    slug: 'gosht-va-kolbasa-uchun-aromatizator',
    published: '2026-11-23',
    text: {
      uz: {
        title: 'Go‘sht va kolbasa uchun aromatizator',
        description:
          'Kolbasa, sosiska, yarim tayyor go‘sht va marinadlar uchun aromatizator: ta’m yo‘nalishi, issiqlik ishlovi, qo‘shish bosqichi, dozirovka va halol belgisi.',
        intro:
          'Go‘sht mahsulotlari uchun aromatizator tanlashda uchta savolga javob kerak: mahsulot qanday ishlov ko‘radi (qaynatish, dudlash, qovurish yoki sterilizatsiya), aromatizator qaysi bosqichda qo‘shiladi (qiyma, rassol yoki marinad) va qaysi ta’m yo‘nalishi kerak (go‘sht, tutun yoki ziravor). Issiqqa chidamli pozitsiyani tanlang, uni katalog kartochkasidagi dozirovka oralig‘ida kichik partiyada sinang va ta’mni tayyor mahsulotda — pishirilgandan va saqlangandan keyin baholang.',
        blocks: [
          { h2: 'Aromatizator go‘sht mahsulotida nima uchun kerak' },
          {
            p: 'Go‘sht mahsulotining ta’mi xomashyo, tuz, ziravorlar va ishlov berish usulidan shakllanadi. Aromatizator bu ta’mni kuchaytiradi, unga aniq yo‘nalish beradi (masalan, dudlangan yoki grilda pishirilgan ta’m) va partiyadan partiyaga barqarorlikni saqlashga yordam beradi. Tabiiy ziravorlarning ta’mi hosil va saqlash sharoitiga qarab o‘zgarib turadi, aromatizator esa standartlashtirilgan profil beradi.',
          },
          {
            p: 'Muhim: aromatizator xomashyo sifatining o‘rnini bosmaydi. U yaxshi retseptni yanada aniq va takrorlanuvchan qiladi, lekin texnologik xatolarni tuzatmaydi. Shuning uchun sinovni har doim ishlab chiqarishdagi odatiy xomashyo va odatiy retsept bilan o‘tkazing.',
          },
          { h2: 'Mahsulot turi va ishlov berish usuli' },
          {
            p: 'Bir xil aromatizator turli mahsulotlarda turlicha ochiladi. Namuna so‘rashdan oldin mahsulotingiz qaysi guruhga kirishini va qanday ishlov ko‘rishini aniqlang:',
          },
          {
            ul: [
              'Qaynatilgan kolbasa, sosiska va sardelka — qiyma kutterda tayyorlanadi, mahsulot pishiriladi va ko‘pincha sovuq holda iste’mol qilinadi; nozik, bir tekis ta’m kerak.',
              'Yarim dudlangan va dudlangan kolbasa — dudlash va quritish bosqichlari ta’mni o‘zgartiradi; tutun notasi bilan muvozanat muhim.',
              'Yarim tayyor mahsulotlar (kotlet, pelmen va manti qiymasi, naggetslar) — iste’molchi o‘zi qovuradi yoki qaynatadi, shuning uchun ta’m uy sharoitidagi pishirishdan keyin ham saqlanishi kerak.',
              'Marinadlangan go‘sht va shashlik — aromatizator marinad orqali sirtga va qisman ichkariga o‘tadi.',
              'Go‘sht konservalari — sterilizatsiya eng og‘ir issiqlik ishlovi; uchuvchan notalar ko‘proq yo‘qoladi.',
              'Tovuq va kurka mahsulotlari (vetchina, rulet) — go‘shtning o‘zi neytralroq, shuning uchun ta’m yo‘nalishi aniqroq seziladi.',
            ],
          },
          { h2: 'Ta’m yo‘nalishini tanlash' },
          {
            p: 'GFF katalogidagi tuzli va go‘shtli guruhda mol, tovuq va qo‘y go‘shti, tutun, barbekyu, bekon va kurka vetchinasi, qo‘ziqorin, sarimsoq va piyoz (shu jumladan qovurilgan), xantal kabi yo‘nalishlar bor. Ziravor va o‘tlar guruhida qora murch, muskat yong‘og‘i, koriandr, zira, rozmarin, provans o‘tlari va archa mevasi kabi pozitsiyalar mavjud. Tanlashda quyidagilarga tayaning:',
          },
          {
            ul: [
              'Asosiy go‘sht notasi mahsulot turiga mos bo‘lsin: mol go‘shti kolbasalari uchun mol, tovuq mahsulotlari uchun tovuq, qo‘y go‘shti retseptlari uchun qo‘y go‘shti.',
              'Tutun — dudlangan ta’m uchun yoki dudlash bosqichini to‘ldirish uchun; ozgina miqdorda ham kuchli seziladi.',
              'Barbekyu va grill — marinadlar, qanotlar va kolbasachalar uchun.',
              'Ziravorlar — qora murch, muskat yong‘og‘i va koriandr klassik kolbasa retseptlarida ko‘p uchraydi; zira va koriandr mahalliy ta’mga yaqin.',
              'Sarimsoq va piyoz — qiyma mahsulotlari va marinadlar uchun; qovurilgan variantlari chuqurroq ta’m beradi.',
            ],
          },
          {
            p: 'Bekon yoki vetchina kabi nomlar — ta’m profilining nomi. Har bir pozitsiyaning belgilari (masalan, "Halol sertifikati") katalog kartochkasida ko‘rsatiladi; halol mahsulot ishlab chiqarsangiz, aniq pozitsiya bo‘yicha hujjatni oldindan so‘rang.',
          },
          {
            p: 'Bir mahsulotda ikki-uchta yo‘nalishdan ko‘prog‘ini aralashtirmang: masalan, go‘sht asosi va ziravor yoki go‘sht va tutun. Ko‘p komponentli aralashmada ta’m "loyqa" bo‘lib qoladi va iste’molchi uni eslab qololmaydi.',
          },
          { h2: 'Qaysi bosqichda va qanday qo‘shish kerak' },
          {
            ul: [
              'Qiymaga — kutterlash yoki aralashtirish bosqichida, ziravorlar bilan birga yoki suv va muz bilan. Aromatizatorni bir joyga quymang: u qiyma bo‘ylab bir tekis tarqalishi kerak.',
              'Rassolga (in’eksiya uchun) — aromatizator rassolda bir tekis tarqalishi, cho‘kma yoki qatlam hosil qilmasligi kerak; buni avval kichik hajmda tekshiring.',
              'Marinadga — moy asosli marinadda moyda yaxshi tarqaladigan, suv asosidagisida suvda tarqaladigan shakl qulayroq.',
              'Quruq aralashmaga (ziravor premiksi, panirovka) — kukun shakli yoki suyuq aromatizatorni tuz yoki dekstroza kabi tashuvchiga oldindan aralashtirish.',
            ],
          },
          {
            p: 'Go‘sht mahsulotlariga faqat oziq-ovqatda ishlatishga ruxsat etilgan va hujjatlari bor efir moylarini tanlang: atir va kosmetika uchun mo‘ljallangan moylar ovqatga qo‘shilmaydi — qo‘llanish sohasini kartochka va spetsifikatsiyadan tekshiring. Efir moylari (sarimsoq, qora murch, koriandr urug‘i va boshqalar) juda konsentrlangan. Ularni oldindan moy, tuz yoki ziravor aralashmasiga qo‘shib kiriting — aks holda mahsulotda ta’mi juda kuchli alohida joylar paydo bo‘lishi mumkin.',
          },
          {
            p: 'Tuzli ta’mni chuqurlashtirish uchun aromatizator bilan birga ta’m asoslari — achitqi ekstrakti va gidrolizlangan o‘simlik oqsili ishlatiladi. Ular katalogning oziq-ovqat ingrediyentlari bo‘limida alohida pozitsiya sifatida bor.',
          },
          { h2: 'Issiqlik ishlovi va saqlash davrida ta’m' },
          {
            p: 'Pishirish, dudlash va ayniqsa sterilizatsiya paytida aromatizatorning eng uchuvchan komponentlari yo‘qoladi. Shuning uchun katalog kartochkasidagi "Issiqqa chidamli" belgisiga qarang va ta’mni faqat tayyor mahsulotda baholang — xom qiymani hidlab yoki tatib xulosa chiqarmang.',
          },
          {
            p: 'Yog‘ miqdori ham ta’mni o‘zgartiradi: yog‘li mahsulotda ta’m sekinroq va yumshoqroq ochiladi, yog‘i kam tovuq mahsulotida esa o‘tkirroq seziladi. Tuz va boshqa ta’m beruvchi ingrediyentlar bilan muvozanat ham hisobga olinadi.',
          },
          {
            p: 'Saqlash davrida ta’m yana o‘zgaradi. Vakuum yoki modifikatsiyalangan muhitdagi qadoqda, sovutgichda saqlangan namunalarni yaroqlilik muddatining boshida, o‘rtasida va oxirida tatib ko‘ring. Tutun va sarimsoq notalari vaqt o‘tishi bilan kuchayishi yoki so‘nishi mumkin.',
          },
          { h2: 'Dozirovkani sinash tartibi' },
          {
            p: 'Katalogdagi har bir pozitsiya kartochkasida tavsiya etilgan dozirovka oralig‘i ko‘rsatilgan. Sinovni quyidagicha tashkil qiling:',
          },
          {
            ul: [
              'Aromatizatorsiz nazorat namunasini tayyorlang — farqni faqat u bilan solishtirib ko‘rish mumkin.',
              'Oraliq ichidan 2–3 darajani tanlab, bir xil xomashyo va retseptda kichik partiyalar tayyorlang.',
              'Aromatizatorni hajm bilan emas, og‘irlik bilan o‘lchang va har bir partiyaning retseptini yozib boring.',
              'Ta’mni mahsulot qanday iste’mol qilinsa, shunday baholang: kolbasani sovuq, sosiskani qaynatilgan, yarim tayyor mahsulotni qovurilgan holda.',
              'Ko‘r-ko‘rona tatib ko‘ring: namunalarni raqamlang va bir nechta xodimning fikrini yozib oling.',
              'Tanlangan variantni katta partiyaga o‘tkazishdan oldin ishlab chiqarish uskunasida yana bir marta sinang.',
            ],
          },
          {
            p: 'Eng ko‘p uchraydigan xato — ortiqcha miqdor: u "kimyoviy" yoki achchiq ta’m beradi va xarajatni oshiradi. Past chegaradan boshlang va faqat kerak bo‘lsa oshiring.',
          },
          { h2: 'Tez-tez uchraydigan xatolar' },
          {
            ul: [
              'Ta’mni xom qiymada baholash — pishirilgandan keyin u boshqacha bo‘ladi.',
              'Sterilizatsiya qilinadigan konserva uchun issiqqa chidamliligini tekshirmasdan tanlash.',
              'Efir moyini suyultirmasdan to‘g‘ridan-to‘g‘ri qiymaga quyish.',
              'Tutun notasini ortiqcha qo‘shish — u boshqa ta’mlarni bosib ketadi.',
              'Halol mahsulot uchun pozitsiya hujjatini oldindan so‘ramaslik.',
              'Aromatizatorni issiq sexda, ochiq idishda saqlash.',
            ],
          },
          { h2: 'Hujjatlar va saqlash' },
          {
            p: 'Ishlab chiqarishga kiritishdan oldin yetkazib beruvchidan aniq pozitsiya bo‘yicha spetsifikatsiya, xavfsizlik ma’lumotlari varaqasi (SDS) va mavjud sertifikatlar nusxasini so‘rang. Katalog kartochkasida halol, GMO’siz, issiqqa chidamli kabi belgilar va yaroqlilik muddati ko‘rsatiladi. Hujjatlar mahsulot yorlig‘ini tayyorlash va ichki sifat nazorati uchun ham kerak bo‘ladi.',
          },
          {
            p: 'Aromatizatorni zich yopilgan asl idishda, salqin, quruq va qorong‘i joyda, issiqlik manbalaridan uzoqda saqlang. Ochilgan idishni tez yoping: uchuvchan notalar havoda yo‘qoladi. Katta qadoqni tez ishlatib bo‘lmasa, kichikroq qadoq tanlang.',
          },
          { h2: 'Ko‘p beriladigan savollar' },
          {
            faq: [
              {
                q: 'Kolbasaga qancha aromatizator qo‘shiladi?',
                a: 'Miqdor mahsulot turi, retsept va pozitsiyaga bog‘liq. Katalog kartochkasida ko‘rsatilgan tavsiya etilgan oraliqning pastki chegarasidan boshlang va 2–3 darajani tayyor mahsulotda solishtiring.',
              },
              {
                q: 'Tutun aromatizatori dudlashning o‘rnini bosadimi?',
                a: 'U dudlangan ta’m beradi yoki dudlash bosqichini to‘ldiradi, lekin dudlash mahsulot rangi, qobig‘i va teksturasiga ham ta’sir qiladi. Qaysi variant mosligini texnologiyangiz va yorliqqa qo‘yiladigan talablar asosida hal qiling.',
              },
              {
                q: 'Aromatizator konserva sterilizatsiyasiga chidaydimi?',
                a: 'Kartochkada "Issiqqa chidamli" belgisi bor pozitsiyalarni tanlang. Sterilizatsiya rejimlari har xil bo‘lgani uchun natijani o‘z rejimingizda sinang va ta’mni sterilizatsiyadan keyin baholang.',
              },
              {
                q: 'Halol mahsulot uchun aromatizatorni qanday tekshirish mumkin?',
                a: 'Katalog kartochkasidagi belgilarni ko‘ring va aniq pozitsiya bo‘yicha hujjatni so‘rang. Hujjatdagi mahsulot nomi va kodi siz buyurtma qilayotgan pozitsiyaga mos kelishini tekshiring.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/meat', label: 'Go‘sht va kolbasa uchun aromatizatorlar' },
          { path: '/category/flavours/savoury', label: 'Tuzli va go‘shtli aromatizatorlar' },
          { path: '/category/flavours/herb-spice', label: 'Ziravor va o‘tlar aromatizatorlari' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Ароматизатор для колбасы и мяса: выбор',
        description:
          'Ароматизаторы для колбас, сосисок, полуфабрикатов и маринадов: вкусовое направление, термообработка, этап внесения, дозировка и отметка «халяль».',
        intro:
          'При выборе ароматизатора для мясной продукции нужно ответить на три вопроса: какую обработку проходит продукт (варка, копчение, жарка или стерилизация), на каком этапе вносится ароматизатор (фарш, рассол или маринад) и какое вкусовое направление нужно (мясо, дым или специи). Выбирайте термостабильную позицию, проверяйте её в диапазоне дозировки из карточки каталога на небольшой партии и оценивайте вкус в готовом продукте — после термообработки и хранения.',
        blocks: [
          { h2: 'Зачем ароматизатор в мясной продукции' },
          {
            p: 'Вкус мясного изделия складывается из сырья, соли, специй и способа обработки. Ароматизатор усиливает этот вкус, задаёт ему чёткое направление (например, копчёный вкус или вкус гриля) и помогает удерживать стабильность от партии к партии. Вкус натуральных специй меняется в зависимости от урожая и условий хранения, а ароматизатор даёт стандартизированный профиль.',
          },
          {
            p: 'Важно: ароматизатор не заменяет качество сырья. Он делает хорошую рецептуру точнее и воспроизводимее, но не исправляет технологические ошибки. Поэтому всегда проводите испытания на том сырье и той рецептуре, с которыми работает ваше производство.',
          },
          { h2: 'Вид продукта и способ обработки' },
          {
            p: 'Один и тот же ароматизатор раскрывается в разных продуктах по-разному. Перед запросом образцов определите, к какой группе относится ваш продукт и какую обработку он проходит:',
          },
          {
            ul: [
              'Варёные колбасы, сосиски и сардельки — фарш готовится в куттере, продукт проходит варку и часто употребляется холодным; нужен деликатный, равномерный вкус.',
              'Полукопчёные и копчёные колбасы — копчение и сушка меняют вкус; важен баланс с нотой дыма.',
              'Полуфабрикаты (котлеты, фарш для пельменей и мантов, наггетсы) — потребитель сам жарит или варит их, поэтому вкус должен сохраняться после домашнего приготовления.',
              'Маринованное мясо и шашлык — ароматизатор переходит через маринад на поверхность и частично внутрь.',
              'Мясные консервы — стерилизация является самой жёсткой термообработкой; летучие ноты теряются сильнее.',
              'Продукты из курицы и индейки (ветчина, рулеты) — само мясо более нейтральное, поэтому вкусовое направление ощущается отчётливее.',
            ],
          },
          { h2: 'Выбор вкусового направления' },
          {
            p: 'В группе солёных и мясных ароматизаторов каталога GFF есть говядина, курица и ягнёнок, дым, барбекю, бекон и ветчина из индейки, грибы, чеснок и лук (в том числе жареные), горчица. В группе трав и специй — чёрный перец, мускатный орех, кориандр, зира, розмарин, прованские травы, можжевельник и другие позиции. При выборе опирайтесь на следующее:',
          },
          {
            ul: [
              'Основная мясная нота должна соответствовать продукту: говядина — для колбас из говядины, курица — для продуктов из птицы, ягнёнок — для рецептур с бараниной.',
              'Дым — для копчёного вкуса или как дополнение к этапу копчения; ощущается сильно даже в малом количестве.',
              'Барбекю и гриль — для маринадов, крылышек и колбасок.',
              'Специи — чёрный перец, мускатный орех и кориандр часто встречаются в классических колбасных рецептурах; зира и кориандр близки к местному вкусу.',
              'Чеснок и лук — для фаршевых изделий и маринадов; жареные варианты дают более глубокий вкус.',
            ],
          },
          {
            p: 'Названия вроде «бекон» или «ветчина» — это название вкусового профиля. Отметки по каждой позиции (например, «Сертификат Халяль») указаны в карточке каталога; если вы выпускаете халяльную продукцию, заранее запросите документ по конкретной позиции.',
          },
          {
            p: 'Не смешивайте в одном продукте больше двух-трёх направлений: например, мясная основа и специи или мясо и дым. В многокомпонентной смеси вкус становится «размытым», и потребитель его не запоминает.',
          },
          { h2: 'На каком этапе и как вносить' },
          {
            ul: [
              'В фарш — на этапе куттерования или перемешивания, вместе со специями или с водой и льдом. Не вливайте ароматизатор в одну точку: он должен равномерно распределиться по фаршу.',
              'В рассол (для шприцевания) — ароматизатор должен равномерно распределяться в рассоле, не образуя осадка или слоя; сначала проверьте это на небольшом объёме.',
              'В маринад — для масляного маринада удобнее форма, хорошо распределяющаяся в масле, для водного — в воде.',
              'В сухую смесь (премикс специй, панировка) — порошковая форма или предварительное нанесение жидкого ароматизатора на носитель, например соль или декстрозу.',
            ],
          },
          {
            p: 'Для мясной продукции выбирайте только эфирные масла, допущенные для пищевого применения и имеющие документы: масла для парфюмерии и косметики в пищу не добавляют — проверяйте область применения по карточке и спецификации. Эфирные масла (чеснока, чёрного перца, семян кориандра и другие) сильно концентрированы. Вносите их предварительно смешанными с маслом, солью или смесью специй — иначе в продукте могут появиться отдельные участки со слишком резким вкусом.',
          },
          {
            p: 'Для усиления солёного вкуса вместе с ароматизатором используют вкусовые основы — дрожжевой экстракт и гидролизованный растительный белок. Они есть в разделе пищевых ингредиентов каталога как отдельные позиции.',
          },
          { h2: 'Вкус при термообработке и хранении' },
          {
            p: 'При варке, копчении и особенно стерилизации теряются самые летучие компоненты ароматизатора. Поэтому обращайте внимание на отметку «Термостабильный» в карточке каталога и оценивайте вкус только в готовом продукте — не делайте выводов по сырому фаршу.',
          },
          {
            p: 'Жирность тоже меняет восприятие: в жирном продукте вкус раскрывается медленнее и мягче, а в нежирном продукте из птицы ощущается резче. Учитывайте и баланс с солью и другими вкусовыми ингредиентами.',
          },
          {
            p: 'Во время хранения вкус продолжает меняться. Пробуйте образцы в вакуумной упаковке или упаковке с модифицированной атмосферой, хранящиеся в холодильнике, в начале, середине и конце срока годности. Ноты дыма и чеснока со временем могут усиливаться или ослабевать.',
          },
          { h2: 'Как проверить дозировку' },
          {
            p: 'В карточке каждой позиции каталога указан рекомендуемый диапазон дозировки. Организуйте испытания так:',
          },
          {
            ul: [
              'Приготовьте контрольный образец без ароматизатора — разницу можно увидеть только в сравнении с ним.',
              'Выберите 2–3 уровня внутри диапазона и сделайте небольшие партии на одном и том же сырье и рецептуре.',
              'Дозируйте ароматизатор по массе, а не по объёму, и записывайте рецептуру каждой партии.',
              'Оценивайте вкус так, как продукт будут есть: колбасу — холодной, сосиски — сваренными, полуфабрикат — обжаренным.',
              'Проведите слепую дегустацию: пронумеруйте образцы и запишите мнения нескольких сотрудников.',
              'Перед переходом на крупную партию ещё раз проверьте выбранный вариант на производственном оборудовании.',
            ],
          },
          {
            p: 'Самая частая ошибка — избыток: он даёт «химический» или горький привкус и увеличивает затраты. Начинайте с нижней границы и повышайте только при необходимости.',
          },
          { h2: 'Типичные ошибки' },
          {
            ul: [
              'Оценивать вкус по сырому фаршу — после термообработки он другой.',
              'Выбирать ароматизатор для стерилизуемых консервов без проверки термостабильности.',
              'Вливать эфирное масло в фарш без предварительного разбавления.',
              'Перебарщивать с дымом — он перекрывает остальные вкусы.',
              'Не запрашивать заранее документ по позиции для халяльной продукции.',
              'Хранить ароматизатор в горячем цехе в открытой таре.',
            ],
          },
          { h2: 'Документы и хранение' },
          {
            p: 'Перед запуском в производство запросите у поставщика спецификацию по конкретной позиции, паспорт безопасности (SDS) и копии имеющихся сертификатов. В карточке каталога указаны отметки — халяль, без ГМО, термостабильный — и срок годности. Документы понадобятся и для этикетки, и для внутреннего контроля качества.',
          },
          {
            p: 'Храните ароматизатор в плотно закрытой оригинальной таре, в прохладном, сухом и тёмном месте, вдали от источников тепла. Быстро закрывайте открытую тару: летучие ноты теряются на воздухе. Если большую фасовку не получается быстро израсходовать, выбирайте меньшую.',
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Сколько ароматизатора добавлять в колбасу?',
                a: 'Количество зависит от вида продукта, рецептуры и позиции. Начните с нижней границы рекомендуемого диапазона из карточки каталога и сравните 2–3 уровня в готовом продукте.',
              },
              {
                q: 'Заменяет ли ароматизатор дыма копчение?',
                a: 'Он придаёт копчёный вкус или дополняет этап копчения, но копчение влияет ещё на цвет, корочку и текстуру продукта. Подходящий вариант выбирайте исходя из вашей технологии и требований к маркировке.',
              },
              {
                q: 'Выдерживает ли ароматизатор стерилизацию консервов?',
                a: 'Выбирайте позиции с отметкой «Термостабильный» в карточке. Режимы стерилизации различаются, поэтому проверьте результат на своём режиме и оценивайте вкус после стерилизации.',
              },
              {
                q: 'Как проверить ароматизатор для халяльной продукции?',
                a: 'Посмотрите отметки в карточке каталога и запросите документ по конкретной позиции. Проверьте, что наименование и код продукта в документе совпадают с заказываемой позицией.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/meat', label: 'Ароматизаторы для мяса и колбас' },
          { path: '/category/flavours/savoury', label: 'Солёные и мясные ароматизаторы' },
          { path: '/category/flavours/herb-spice', label: 'Ароматизаторы трав и специй' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ 11 */
  {
    slug: 'sut-mahsulotlari-uchun-aromatizator',
    published: '2026-11-23',
    text: {
      uz: {
        title: 'Sut mahsulotlari uchun aromatizator',
        description:
          'Yogurt, tvorog, sut ichimliklari, sariyog‘ va pishloq mahsulotlari uchun aromatizator: sutli va qaymoqli ta’m, fermentatsiya, shakl, dozirovka.',
        intro:
          'Sut mahsulotlari uchun aromatizator tanlashda avval vazifani aniqlang: sutli-qaymoqli ta’mni kuchaytirish kerakmi yoki mahsulotga mevali yoki desert ta’m berish kerakmi. Keyin mahsulot muhitini hisobga oling — kislotalilik (yogurt, kefir), yog‘lilik (sariyog‘, spred), issiqlik ishlovi va aromatizator qo‘shiladigan bosqich. Tanlangan pozitsiyani katalog kartochkasidagi dozirovka oralig‘ida kichik partiyada sinang va ta’mni yaroqlilik muddati davomida tekshiring.',
        blocks: [
          { h2: 'Qaysi sut mahsulotlarida aromatizator ishlatiladi' },
          {
            ul: [
              'Yogurt va ichimlik yogurti — mevali, rezavor va desert ta’mlari.',
              'Tvorog massalari, tvorog desertlari va glazurlangan sirok — vanil, quyultirilgan sut, qaymoq.',
              'Ta’mli sut, sut kokteyllari va kakaoli sut ichimliklari.',
              'Smetana va qaymoq asosidagi soslar va dressinglar.',
              'Sariyog‘, spredlar va margarin — sariyog‘ va qaymoq ta’mi.',
              'Pishloq mahsulotlari va pishloq soslari — cheddar, gouda, motsarella, qaymoqli pishloq.',
            ],
          },
          {
            p: 'Muzqaymoq ham sut asosida tayyorlanadi, lekin muzlatish ta’m sezilishini kuchli o‘zgartiradi, shuning uchun u alohida mavzu. Bu maqola sovutilgan va xona haroratidagi sut mahsulotlari haqida.',
          },
          { h2: 'Sutli va qaymoqli ta’m: qaysi profil nima beradi' },
          {
            p: 'GFF katalogidagi sutli aromatizatorlar guruhida bir nechta nuanslar bor. Ularni mahsulot turiga qarab tanlang:',
          },
          {
            ul: [
              'Sut va yangi sut — toza, yengil sutli fon; ta’mli sut va ichimliklar uchun.',
              'Qaynatilgan va pishirilgan sut — issiqroq, karamelga yaqin nota; desert va kokteyllar uchun.',
              'Quyultirilgan sut va qaynatilgan quyultirilgan sut — shirin, karamelli ta’m; tvorog desertlari va to‘ldirgichlar uchun.',
              'Qaymoq va yangi qaymoq — boy, yumshoq ta’m; yogurt, desert va ichimliklar uchun.',
              'Smetana — nordon-qaymoqli; soslar va dressinglar uchun.',
              'Sariyog‘, sariyog‘-vanil va ghi sariyog‘i — yog‘li mahsulotlar, spred va pishiriqlarga qo‘shiladigan massalar uchun.',
              'Pishloq profillari — pishloq soslari, to‘ldirgichlar va tuzli mahsulotlar uchun.',
              'Yogurt va shaftoli yogurti — yogurt ta’mini kuchaytirish, yogurtli ichimlik va desertlar uchun.',
            ],
          },
          {
            p: 'Namuna so‘rashdan oldin mahsulotingiz haqida qisqa ma’lumot tayyorlang: mahsulot turi va yog‘liligi, kislotali yoki neytral muhit, issiqlik ishlovi, aromatizator qo‘shiladigan bosqich va kerakli ta’m yo‘nalishi. Shunda mutaxassis sizga aynan shu jarayon uchun mos bir nechta pozitsiyani taklif qiladi va sinovlar soni kamayadi.',
          },
          {
            p: 'Mevali yogurt uchun asosiy ta’m odatda mevali yoki rezavor guruhdan tanlanadi, sutli aromatizator esa fon sifatida qo‘shiladi. Masalan, qulupnay va qaymoq yoki shaftoli va yogurt juftligi mevali ta’mni "sutli" va yaxlit qiladi. Bir mahsulotda ikki-uch yo‘nalishdan ko‘prog‘ini aralashtirmang.',
          },
          { h2: 'Kislotalilik, fermentatsiya va issiqlik ishlovi' },
          {
            p: 'Fermentlangan mahsulotlarning (yogurt, kefir, ayron) nordonligi ta’m sezilishini o‘zgartiradi: shirin va mevali notalar sustroq, ba’zi notalar esa o‘tkirroq seziladi. Shuning uchun aromatizatorni suvda yoki oddiy sutda emas, aynan tayyor mahsulotda baholang.',
          },
          {
            p: 'Aromatizator ko‘pincha fermentatsiyadan keyin — mevali to‘ldirgich yoki sirop bilan birga yoki aralashtirish bosqichida qo‘shiladi. Agar uni fermentatsiyadan oldin kiritmoqchi bo‘lsangiz, sinovda ivish vaqti, kislotalilik va konsistensiyani nazorat qiling.',
          },
          {
            p: 'Pasterizatsiya va boshqa issiqlik ishlovlari uchuvchan notalarning bir qismini yo‘qotadi. Issiq ishlov beriladigan ichimlik va desertlar uchun kartochkadagi "Issiqqa chidamli" belgisiga qarang va ta’mni ishlovdan keyin tekshiring.',
          },
          { h2: 'Shaklni tanlash: suv, yog‘ yoki quruq aralashma' },
          {
            ul: [
              'Suv asosidagi mahsulotlar (ichimlik yogurti, ta’mli sut, kokteyl) — aromatizator suv fazasida bir tekis tarqalishi, yuzada yog‘ dog‘lari yoki qatlam hosil qilmasligi kerak.',
              'Yog‘li mahsulotlar (sariyog‘, spred, margarin) — moyda yaxshi tarqaladigan shakl qulayroq; aromatizatorni eritilgan yog‘ fazasiga qo‘shish ta’mni bir tekis qiladi.',
              'Quruq aralashmalar (kokteyl kukuni, sut desertlari premiksi) — kukun shakli yoki suyuq aromatizatorni quruq tashuvchiga oldindan aralashtirish.',
            ],
          },
          {
            p: 'Pozitsiyaning eruvchanligi va qaysi fazaga mo‘ljallangani haqida spetsifikatsiyani so‘rang: bir xil nomli ta’m turli asosda tayyorlanishi mumkin. Shakl noto‘g‘ri tanlansa, ichimlikda qatlam yoki spredda notekis ta’m paydo bo‘ladi.',
          },
          { h2: 'Yog‘lilik va shirinlik ta’mga qanday ta’sir qiladi' },
          {
            p: 'Yog‘ ta’mni "ushlab turadi" va uni sekinroq, uzoqroq ochadi. Yog‘liligi past mahsulotda xuddi shu aromatizator tezroq va o‘tkirroq seziladi, lekin tez so‘nadi. Shuning uchun bir seriyadagi turli yog‘lilikdagi mahsulotlar uchun dozirovkani alohida sinang.',
          },
          {
            p: 'Shakar miqdori ham muhim: shakari kamaytirilgan retseptda vanil, quyultirilgan sut va qaymoq notalari shirinlik hissini qo‘llab-quvvatlashi mumkin. Bu faqat sezgiga oid ta’sir — tarkib va yorliqdagi ma’lumotlar haqiqiy retseptga mos bo‘lishi kerak.',
          },
          { h2: 'Dozirovkani sinash tartibi' },
          {
            p: 'Katalogdagi har bir pozitsiya kartochkasida tavsiya etilgan dozirovka oralig‘i ko‘rsatilgan. Sinovni quyidagicha o‘tkazing:',
          },
          {
            ul: [
              'Aromatizatorsiz nazorat namunasini tayyorlang.',
              'Oraliq ichidan 2–3 darajani tanlab, bir xil asos va retseptda kichik partiyalar qiling.',
              'Aromatizatorni hajm bilan emas, og‘irlik bilan o‘lchang va har bir partiyani yozib boring.',
              'Mahsulotni iste’mol haroratida — sovutilgan holda baholang: sovuqda ta’m kuchsizroq seziladi.',
              'Namunalarni yaroqlilik muddatining boshida, o‘rtasida va oxirida tatib ko‘ring.',
              'Ko‘r-ko‘rona tatib ko‘ring: namunalarni raqamlang va bir nechta kishining fikrini yozib oling.',
            ],
          },
          {
            p: 'Sut mahsulotlarida ortiqcha aromatizator ayniqsa sezilarli: sutli ta’m "sun’iy" va og‘ir bo‘lib qoladi. Past chegaradan boshlang va faqat kerak bo‘lsa oshiring.',
          },
          { h2: 'Tez-tez uchraydigan xatolar' },
          {
            ul: [
              'Ta’mni fermentatsiyadan oldingi sutda baholash — tayyor yogurtda u boshqacha bo‘ladi.',
              'Spred yoki sariyog‘ uchun yog‘ fazasida tarqalishini tekshirmasdan tanlash.',
              'Mevali ta’mni sutli fonsiz ishlatish — mahsulot "sharbat"ga o‘xshab qoladi.',
              'Bitta dozirovkani turli yog‘lilikdagi mahsulotlarga qo‘llash.',
              'Ta’mni faqat ishlab chiqarilgan kuni tekshirish va saqlash davrini kuzatmaslik.',
            ],
          },
          { h2: 'Saqlash va hujjatlar' },
          {
            p: 'Aromatizatorni zich yopilgan asl idishda, salqin va qorong‘i joyda, issiqlik manbalaridan uzoqda saqlang. Sut sexidagi namlik va harorat o‘zgarishi ochiq idishdagi aromatizatorga salbiy ta’sir qiladi, shuning uchun idishni ishlatgandan keyin darhol yoping.',
          },
          {
            p: 'Ishlab chiqarishga kiritishdan oldin aniq pozitsiya bo‘yicha spetsifikatsiya, xavfsizlik ma’lumotlari varaqasi (SDS) va mavjud sertifikatlar nusxasini so‘rang. Katalog kartochkasida halol, GMO’siz, spirtsiz kabi belgilar va yaroqlilik muddati ko‘rsatiladi.',
          },
          { h2: 'Ko‘p beriladigan savollar' },
          {
            faq: [
              {
                q: 'Yogurtga aromatizator qachon qo‘shiladi?',
                a: 'Ko‘pincha fermentatsiyadan keyin — to‘ldirgich yoki sirop bilan birga yoki aralashtirish bosqichida. Fermentatsiyadan oldin qo‘shmoqchi bo‘lsangiz, sinovda ivish vaqti va konsistensiyani nazorat qiling.',
              },
              {
                q: 'Sariyog‘ va spred uchun qanday aromatizator kerak?',
                a: 'Sariyog‘, qaymoq yoki ghi profilidagi, yog‘ fazasida yaxshi tarqaladigan pozitsiya. Eruvchanlik haqida spetsifikatsiyani so‘rang va ta’mni tayyor mahsulotda baholang.',
              },
              {
                q: 'Sutli va mevali aromatizatorni birga ishlatsa bo‘ladimi?',
                a: 'Ha, bu keng tarqalgan usul: mevali ta’m asosiy, sutli yoki qaymoqli ta’m esa fon bo‘ladi. Ikkalasining nisbatini kichik partiyalarda sinab tanlang.',
              },
              {
                q: 'Aromatizator miqdorini qanday aniqlash kerak?',
                a: 'Katalog kartochkasidagi tavsiya etilgan oraliqning pastki chegarasidan boshlang, 2–3 darajani sovutilgan tayyor mahsulotda solishtiring va saqlash davrida qayta tekshiring.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/dairy', label: 'Sut mahsulotlari uchun aromatizatorlar' },
          { path: '/category/flavours/dairy', label: 'Sut va qaymoq aromatizatorlari' },
          { path: '/category/flavours/fruit', label: 'Mevali aromatizatorlar' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Ароматизаторы для молочной продукции',
        description:
          'Ароматизаторы для йогурта, творога, молочных напитков, масла и сыра: молочный и сливочный вкус, ферментация, форма, дозировка и хранение.',
        intro:
          'При выборе ароматизатора для молочной продукции сначала определите задачу: усилить молочно-сливочный вкус или придать продукту фруктовый либо десертный вкус. Затем учтите среду продукта — кислотность (йогурт, кефир), жирность (сливочное масло, спред), термообработку и этап внесения ароматизатора. Проверьте выбранную позицию в диапазоне дозировки из карточки каталога на небольшой партии и контролируйте вкус в течение срока годности.',
        blocks: [
          { h2: 'В каких молочных продуктах используют ароматизаторы' },
          {
            ul: [
              'Йогурт и питьевой йогурт — фруктовые, ягодные и десертные вкусы.',
              'Творожные массы, творожные десерты и глазированные сырки — ваниль, сгущённое молоко, сливки.',
              'Ароматизированное молоко, молочные коктейли и молочные напитки с какао.',
              'Соусы и дрессинги на основе сметаны и сливок.',
              'Сливочное масло, спреды и маргарин — вкус сливочного масла и сливок.',
              'Сырные продукты и сырные соусы — чеддер, гауда, моцарелла, сливочный сыр.',
            ],
          },
          {
            p: 'Мороженое тоже делают на молочной основе, но заморозка сильно меняет восприятие вкуса, поэтому это отдельная тема. Эта статья — об охлаждённых молочных продуктах и продуктах комнатной температуры.',
          },
          { h2: 'Молочный и сливочный вкус: какой профиль что даёт' },
          {
            p: 'В группе молочных ароматизаторов каталога GFF есть несколько оттенков. Выбирайте их по типу продукта:',
          },
          {
            ul: [
              'Молоко и свежее молоко — чистый, лёгкий молочный фон; для ароматизированного молока и напитков.',
              'Топлёное и варёное молоко — более тёплая нота, близкая к карамели; для десертов и коктейлей.',
              'Сгущённое молоко и варёная сгущёнка — сладкий карамельный вкус; для творожных десертов и начинок.',
              'Сливки и свежие сливки — насыщенный мягкий вкус; для йогуртов, десертов и напитков.',
              'Сметана — кисломолочно-сливочный; для соусов и дрессингов.',
              'Сливочное масло, сливочно-ванильный и топлёное масло (гхи) — для жировых продуктов, спредов и масс для выпечки.',
              'Сырные профили — для сырных соусов, начинок и солёных продуктов.',
              'Йогурт и персиковый йогурт — для усиления йогуртового вкуса, йогуртовых напитков и десертов.',
            ],
          },
          {
            p: 'Перед запросом образцов подготовьте краткое описание продукта: вид и жирность, кислая или нейтральная среда, термообработка, этап внесения ароматизатора и нужное вкусовое направление. Тогда специалист предложит несколько позиций именно под ваш процесс, и испытаний понадобится меньше.',
          },
          {
            p: 'Для фруктового йогурта основной вкус обычно берут из фруктовой или ягодной группы, а молочный ароматизатор добавляют как фон. Например, пара «клубника и сливки» или «персик и йогурт» делает фруктовый вкус «молочным» и цельным. Не смешивайте в одном продукте больше двух-трёх направлений.',
          },
          { h2: 'Кислотность, ферментация и термообработка' },
          {
            p: 'Кислотность ферментированных продуктов (йогурт, кефир, айран) меняет восприятие вкуса: сладкие и фруктовые ноты ощущаются слабее, а некоторые — резче. Поэтому оценивайте ароматизатор не в воде и не в обычном молоке, а именно в готовом продукте.',
          },
          {
            p: 'Ароматизатор чаще вносят после ферментации — вместе с фруктовым наполнителем или сиропом либо на этапе перемешивания. Если вы планируете вносить его до ферментации, контролируйте при испытаниях время сквашивания, кислотность и консистенцию.',
          },
          {
            p: 'Пастеризация и другие виды термообработки уносят часть летучих нот. Для напитков и десертов с горячей обработкой обращайте внимание на отметку «Термостабильный» в карточке и проверяйте вкус после обработки.',
          },
          { h2: 'Выбор формы: вода, жир или сухая смесь' },
          {
            ul: [
              'Продукты на водной основе (питьевой йогурт, ароматизированное молоко, коктейль) — ароматизатор должен равномерно распределяться в водной фазе, не образуя жирных пятен или слоя на поверхности.',
              'Жировые продукты (сливочное масло, спред, маргарин) — удобнее форма, хорошо распределяющаяся в жире; внесение в расплавленную жировую фазу делает вкус равномерным.',
              'Сухие смеси (порошок для коктейлей, премиксы молочных десертов) — порошковая форма или предварительное смешивание жидкого ароматизатора с сухим носителем.',
            ],
          },
          {
            p: 'Запросите спецификацию: растворимость позиции и для какой фазы она предназначена. Вкус с одинаковым названием может выпускаться на разной основе. При неверно выбранной форме в напитке появляется слой, а в спреде — неравномерный вкус.',
          },
          { h2: 'Как жирность и сладость влияют на вкус' },
          {
            p: 'Жир «удерживает» вкус и раскрывает его медленнее и дольше. В продукте с низкой жирностью тот же ароматизатор ощущается быстрее и резче, но быстрее исчезает. Поэтому для продуктов одной линейки с разной жирностью подбирайте дозировку отдельно.',
          },
          {
            p: 'Важно и количество сахара: в рецептуре со сниженным сахаром ноты ванили, сгущённого молока и сливок могут поддержать ощущение сладости. Это только сенсорный эффект — состав и данные на этикетке должны соответствовать фактической рецептуре.',
          },
          { h2: 'Как проверить дозировку' },
          {
            p: 'В карточке каждой позиции каталога указан рекомендуемый диапазон дозировки. Проводите испытания так:',
          },
          {
            ul: [
              'Приготовьте контрольный образец без ароматизатора.',
              'Выберите 2–3 уровня внутри диапазона и сделайте небольшие партии на одной основе и рецептуре.',
              'Дозируйте ароматизатор по массе, а не по объёму, и записывайте каждую партию.',
              'Оценивайте продукт при температуре употребления — охлаждённым: в холоде вкус ощущается слабее.',
              'Пробуйте образцы в начале, середине и конце срока годности.',
              'Проведите слепую дегустацию: пронумеруйте образцы и запишите мнения нескольких человек.',
            ],
          },
          {
            p: 'В молочных продуктах избыток ароматизатора особенно заметен: молочный вкус становится «искусственным» и тяжёлым. Начинайте с нижней границы и повышайте только при необходимости.',
          },
          { h2: 'Типичные ошибки' },
          {
            ul: [
              'Оценивать вкус в молоке до ферментации — в готовом йогурте он другой.',
              'Выбирать ароматизатор для спреда или масла без проверки распределения в жировой фазе.',
              'Использовать фруктовый вкус без молочного фона — продукт становится похож на сок.',
              'Применять одну дозировку к продуктам разной жирности.',
              'Проверять вкус только в день выработки и не отслеживать его при хранении.',
            ],
          },
          { h2: 'Хранение и документы' },
          {
            p: 'Храните ароматизатор в плотно закрытой оригинальной таре, в прохладном и тёмном месте, вдали от источников тепла. Влажность и перепады температуры в молочном цехе плохо влияют на ароматизатор в открытой таре, поэтому закрывайте её сразу после использования.',
          },
          {
            p: 'Перед запуском в производство запросите спецификацию по конкретной позиции, паспорт безопасности (SDS) и копии имеющихся сертификатов. В карточке каталога указаны отметки — халяль, без ГМО, без спирта — и срок годности.',
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Когда добавлять ароматизатор в йогурт?',
                a: 'Чаще после ферментации — вместе с наполнителем или сиропом либо на этапе перемешивания. Если вносите до ферментации, контролируйте при испытаниях время сквашивания и консистенцию.',
              },
              {
                q: 'Какой ароматизатор нужен для сливочного масла и спреда?',
                a: 'Позиция с профилем сливочного масла, сливок или гхи, которая хорошо распределяется в жировой фазе. Запросите спецификацию по растворимости и оценивайте вкус в готовом продукте.',
              },
              {
                q: 'Можно ли сочетать молочный и фруктовый ароматизатор?',
                a: 'Да, это распространённый приём: фруктовый вкус основной, а молочный или сливочный — фон. Соотношение подбирайте на небольших партиях.',
              },
              {
                q: 'Как определить дозировку ароматизатора?',
                a: 'Начните с нижней границы рекомендуемого диапазона из карточки каталога, сравните 2–3 уровня в охлаждённом готовом продукте и перепроверьте вкус в процессе хранения.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/dairy', label: 'Ароматизаторы для молочной продукции' },
          { path: '/category/flavours/dairy', label: 'Молочные и сливочные ароматизаторы' },
          { path: '/category/flavours/fruit', label: 'Фруктовые ароматизаторы' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },
];
