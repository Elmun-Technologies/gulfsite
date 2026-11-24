/**
 * BLOG — 2026-noyabr, 7-to‘plam: aromatizator dozirovkasini hisoblash va
 * kosmetika (shampun, gel, krem) uchun atir kompozitsiyalari.
 * Qoidalar `blog.ts` sarlavhasida: faqat UZ/RU, to‘qilgan raqam/da’vo yo‘q.
 * Raqamlar — katalog ma’lumotidan: suyuq aromatizatorlar kartochkasida tavsiya etilgan
 * oraliq 0,05–0,3%, efir moylarida 0,01–0,2%, atir kompozitsiyalarida 0,3–3%;
 * kosmetika va shaxsiy parvarish sohasi bilan belgilangan 37 ta atir kompozitsiyasi
 * (hammasi moyda eruvchan). Hisob-kitob misollari — faqat arifmetika, tavsiya emas.
 */

import type { BlogArticle } from './blog';

export const ARTICLES_2026_11_G: BlogArticle[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'aromatizator-dozirovkasi-qanday-hisoblanadi',
    published: '2026-11-24',
    text: {
      uz: {
        title: 'Aromatizator dozirovkasi: qanday hisoblash',
        description:
          'Aromatizator dozirovkasini foizdan grammga o‘tkazish: 1 kg va partiya uchun hisob, sirop va konsentratlar, sinov tartibi va keng tarqalgan xatolar.',
        intro:
          'Aromatizator dozirovkasi tayyor mahsulot massasiga nisbatan foizda beriladi: 0,1% — bu 1 kg mahsulotga 1 g aromatizator. Gulf Flavours katalogida har bir mahsulot kartochkasida tavsiya etilgan oraliq ko‘rsatilgan (suyuq oziq-ovqat aromatizatorlari uchun 0,05–0,3%, efir moylari uchun 0,01–0,2%). Bu oraliq — boshlang‘ich yo‘nalish; sizning retseptingiz uchun aniq miqdor faqat sinovda aniqlanadi. Quyida hisoblash formulasi, misollar va sinovni qanday o‘tkazish tartibi.',
        blocks: [
          { h2: 'Dozirovka nimaga nisbatan hisoblanadi' },
          {
            p: 'Eng ko‘p chalkashlik shu yerda bo‘ladi. Dozirovka foizi odatda TAYYOR mahsulot massasiga nisbatan olinadi — xamir, sirop yoki aralashmaning bir qismiga emas. Masalan, pishiriqda hisob butun xamir massasidan, ichimlikda esa iste’molchi ichadigan tayyor ichimlikdan olinadi. Agar siz avval konsentrat (sirop, premiks, glazur asosi) tayyorlab, keyin uni suyultirsangiz yoki boshqa massaga qo‘shsangiz, foizni oxirgi mahsulotga qayta hisoblashingiz kerak.',
          },
          {
            ul: [
              'Foiz (%) — 100 birlik mahsulotga necha birlik aromatizator.',
              'g/kg — 1 kg mahsulotga necha gramm; 0,1% = 1 g/kg.',
              'Ichimliklarda ko‘pincha g/l yoki ml/l ishlatiladi; zichlik 1 ga teng bo‘lmagani uchun grammda tortish aniqroq.',
            ],
          },
          { h2: 'Formula va hisoblash misollari' },
          {
            p: 'Hisob uchun bitta oddiy formula yetarli: aromatizator miqdori (g) = partiya massasi (kg) × dozirovka (%) × 10. Quyidagi misollar faqat arifmetikani ko‘rsatadi — ular tavsiya emas, sizning mahsulotingiz uchun miqdorni sinov belgilaydi.',
          },
          {
            ul: [
              '1 kg mahsulot, 0,05% → 0,5 g.',
              '1 kg mahsulot, 0,1% → 1 g.',
              '1 kg mahsulot, 0,3% → 3 g.',
              '200 kg partiya, 0,15% → 200 × 0,15 × 10 = 300 g.',
              'Sirop 1 qism sirop + 4 qism suv nisbatida suyultirilsa (jami 5 qism), tayyor ichimlikda 0,1% bo‘lishi uchun siropdagi ulush 5 baravar ko‘p — 0,5% bo‘lishi kerak.',
            ],
          },
          {
            p: 'Hisob-kitobni jadvalda (Excel yoki Google Sheets) yuritsangiz, partiya hajmi o‘zgarganda miqdor avtomatik qayta hisoblanadi va qo‘lda xato qilish ehtimoli kamayadi.',
          },
          { h2: 'Katalogdagi oraliq nimani anglatadi' },
          {
            p: 'Mahsulot kartochkasidagi oraliq — ishlab chiqaruvchi ko‘pchilik qo‘llanishlar uchun tavsiya etgan chegara. Pastki chegara — yengil, sezilarli hid va ta’m; yuqori chegara — kuchli, yorqin profil yoki ta’mni ko‘p “yutadigan” matritsalar uchun. Mahsulot turlariga qarab oraliq farq qiladi:',
          },
          {
            ul: [
              'Suyuq oziq-ovqat aromatizatorlari — kartochkadagi oraliq odatda 0,05–0,3%.',
              'Efir moylari — ancha konsentrlangan, kartochkadagi oraliq 0,01–0,2%.',
              'Atir kompozitsiyalari (sovun, kosmetika, maishiy kimyo uchun) — oziq-ovqatga qo‘shilmaydi, ularning oralig‘i boshqa mantiqda beriladi.',
              'Oziq-ovqat ingredientlari (bo‘yoq, quyuqlashtirgich, shirinlashtirgich) — har birining kartochkasida o‘z oralig‘i bor; ularni aromatizator kabi hisoblamang.',
            ],
          },
          {
            p: 'Mahsulotingizga qo‘llaniladigan texnik reglament va standart talablarini texnologingiz bilan alohida tekshiring: tavsiya etilgan oraliq qonuniy talablar o‘rnini bosmaydi.',
          },
          { h2: 'Dozirovkaga nimalar ta’sir qiladi' },
          {
            p: 'Bir xil aromatizator ikki xil mahsulotda turlicha seziladi. Shuning uchun boshqa korxonaning retseptidagi miqdorni to‘g‘ridan-to‘g‘ri ko‘chirish ko‘pincha natija bermaydi. Asosiy omillar:',
          },
          {
            ul: [
              'Issiqlik ishlovi: pishirish, qaynatish, pasterizatsiyada uchuvchan komponentlarning bir qismi yo‘qoladi — issiqlikdan keyin qo‘shish imkoni bo‘lmasa, yuqoriroq nuqtani ham sinang.',
              'Yog‘ miqdori: yog‘li massa ko‘p hid moddalarini “ushlab qoladi”, ta’m sekinroq ochiladi.',
              'Oqsil va kraxmal: sut oqsillari va kraxmal ta’mni bog‘lab, uni sustroq qiladi.',
              'Shakar va kislota: shirinlik va nordonlik muvozanati mevali ta’mlarni kuchaytiradi yoki bosib qo‘yadi.',
              'Harorat iste’mol paytida: sovuq mahsulotda (muzqaymoq, sovuq ichimlik) ta’m iliq mahsulotga nisbatan kuchsizroq seziladi.',
              'Shakl: suyuq, emulsiya va kukun shakllari bir xil foizda turlicha natija berishi mumkin.',
              'Saqlash muddati: ba’zi ta’mlar vaqt o‘tishi bilan pasayadi — sinovni yangi va saqlangan namunada solishtiring.',
            ],
          },
          {
            p: 'Amaliy xulosa: retseptni o‘zgartirsangiz (yog‘, shakar yoki kislota miqdori, pishirish rejimi, qadoq turi), avval tasdiqlangan dozirovkani ham qayta tekshiring. Ko‘pincha ta’m “yo‘qolib qoldi” degan shikoyatning sababi aromatizatorda emas, retseptdagi kichik o‘zgarishda bo‘ladi.',
          },
          { h2: 'Laboratoriya sinovi: qadam-baqadam' },
          {
            p: 'Ishonchli dozirovka uch nuqtali sinovdan chiqadi. Kichik partiyada (masalan, 1 kg) bir vaqtning o‘zida uch xil miqdorni solishtirish bir nechta alohida urinishdan tezroq va aniqroq.',
          },
          {
            ul: [
              'Uch nuqta tanlang: katalog oralig‘ining pastki, o‘rta va yuqori qismi.',
              'Kamida 0,01 g aniqlikdagi tarozidan foydalaning; kichik miqdorlarni pipetka yoki tomchi bilan emas, tortib o‘lchang.',
              'Aromatizatorni avval “tashuvchi” qismga aralashtiring: yog‘, sirop, shakar yoki suvning bir qismiga, keyin umumiy massaga.',
              'Har bir namunani belgilang (kod bilan) va bir xil sharoitda tayyorlang.',
              'Tayyor mahsulotni jarayondan keyin va kamida bir kundan keyin tatib ko‘ring — ta’m odatda “o‘rnashadi”.',
              'Iloji bo‘lsa, 3–5 kishidan iborat guruhda namunalar nomini aytmasdan (ko‘r usulda) baholang.',
              'Natijani jurnalga yozing: miqdor, qo‘shilgan bosqich, harorat, baholash izohlari.',
            ],
          },
          { h2: 'Sinovdan sanoat partiyasiga' },
          {
            p: 'Laboratoriyada topilgan miqdor sexda o‘zgarishi mumkin: katta idishda qizdirish uzoqroq davom etadi, ochiq qozonlarda bug‘lanish ko‘proq, aralashtirish vaqti boshqacha. Shuning uchun birinchi sanoat partiyasini nazorat partiyasi sifatida ko‘ring.',
          },
          {
            ul: [
              'Qo‘shish bosqichi va haroratni laboratoriyadagidek saqlang.',
              'Birinchi partiyadan nazorat namunasini oling va laboratoriya namunasi bilan solishtiring.',
              'Tasdiqlangan miqdorni texnologik kartaga yozing va partiya raqami bilan bog‘lang.',
              'Yetkazib beruvchi partiyasi almashganda qisqa nazorat sinovini takrorlang.',
            ],
          },
          { h2: 'Keng tarqalgan xatolar' },
          {
            ul: [
              'Grammda tortish o‘rniga millilitrda o‘lchash — zichlik farqi sababli miqdor siljiydi.',
              'Foizni tayyor mahsulot o‘rniga sirop yoki xamirning bir qismiga nisbatan hisoblash.',
              'Ta’m sust chiqqanda darhol yuqori chegaradan oshirish — avval sababni (issiqlik, qo‘shish bosqichi) tekshiring.',
              'Ikki-uch aromatizatorni sinovsiz aralashtirish — asosiy ta’m yo‘qoladi.',
              'Faqat flakon hidiga qarab baholash: aromatizator mahsulot ichida boshqacha ochiladi.',
              'Natijalarni yozmaslik — keyingi partiyada takrorlash qiyin bo‘ladi.',
            ],
          },
          { h2: 'Ko‘p so‘raladigan savollar' },
          {
            faq: [
              {
                q: '1 kg mahsulotga necha gramm aromatizator kerak?',
                a: 'Hisob: 0,1% = 1 g/kg. Suyuq aromatizatorlar uchun katalog kartochkasidagi oraliq 0,05–0,3%, ya’ni 1 kg ga 0,5–3 g. Sizning retseptingiz uchun aniq miqdorni oraliqning past, o‘rta va yuqori nuqtalarini solishtirib aniqlang.',
              },
              {
                q: 'Ta’m sust chiqsa, dozirovkani oshirish kerakmi?',
                a: 'Avval sababini tekshiring: aromatizator issiqlik ishlovidan oldin qo‘shilganmi, yog‘ yoki oqsil ta’mni bog‘layaptimi. Keyin oraliq doirasida bosqichma-bosqich oshiring. Yuqori chegarada ham yetarli bo‘lmasa, boshqa shakl yoki issiqqa chidamliroq mahsulotni sinab ko‘rish to‘g‘riroq.',
              },
              {
                q: 'Ichimlik siropi uchun dozirovka qanday hisoblanadi?',
                a: 'Avval tayyor ichimlikdagi kerakli foizni belgilang, keyin uni suyultirish koeffitsientiga ko‘paytiring. Masalan, sirop 1:4 nisbatda suyultirilsa (jami 5 qism), siropdagi ulush tayyor ichimlikdagidan 5 baravar ko‘p bo‘ladi.',
              },
              {
                q: 'Sinov uchun aromatizatorni qanday olsa bo‘ladi?',
                a: 'Bepul namuna qutisiga 8 tagacha mahsulot qo‘shishingiz mumkin (25, 50 yoki 100 g). Katta hajm va narx bo‘yicha esa narx so‘rovi yuboring — menejer siz bilan bog‘lanadi.',
              },
            ],
          },
        ],
        links: [
          { path: '/category/flavours', label: 'Oziq-ovqat aromatizatorlari katalogi' },
          { path: '/category/essential-oils', label: 'Efir moylari' },
          { path: '/industries', label: 'Sohalar bo‘yicha tanlov' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Дозировка ароматизатора: расчёт и проба',
        description:
          'Как перевести дозировку ароматизатора из процентов в граммы, расчёт на 1 кг и на партию, сиропы и концентраты, порядок пробы и частые ошибки.',
        intro:
          'Дозировка ароматизатора указывается в процентах от массы готового продукта: 0,1% — это 1 г ароматизатора на 1 кг продукта. В каталоге Gulf Flavours в карточке каждого продукта указан рекомендуемый диапазон (для жидких пищевых ароматизаторов — 0,05–0,3%, для эфирных масел — 0,01–0,2%). Этот диапазон — отправная точка; точное количество для вашей рецептуры определяется только пробой. Ниже — формула расчёта, примеры и порядок проведения пробы.',
        blocks: [
          { h2: 'От чего считается дозировка' },
          {
            p: 'Больше всего путаницы возникает именно здесь. Процент дозировки обычно берётся от массы ГОТОВОГО продукта — а не от части теста, сиропа или смеси. Например, в выпечке расчёт ведётся от всей массы теста, в напитках — от готового напитка, который пьёт потребитель. Если вы сначала готовите концентрат (сироп, премикс, основу для глазури), а затем разбавляете его или вносите в другую массу, процент нужно пересчитать на конечный продукт.',
          },
          {
            ul: [
              'Процент (%) — сколько единиц ароматизатора на 100 единиц продукта.',
              'г/кг — сколько граммов на 1 кг продукта; 0,1% = 1 г/кг.',
              'В напитках часто используют г/л или мл/л; плотность не равна единице, поэтому взвешивание в граммах точнее.',
            ],
          },
          { h2: 'Формула и примеры расчёта' },
          {
            p: 'Для расчёта достаточно одной простой формулы: количество ароматизатора (г) = масса партии (кг) × дозировка (%) × 10. Примеры ниже показывают только арифметику — это не рекомендация; количество для вашего продукта определяет проба.',
          },
          {
            ul: [
              '1 кг продукта, 0,05% → 0,5 г.',
              '1 кг продукта, 0,1% → 1 г.',
              '1 кг продукта, 0,3% → 3 г.',
              'Партия 200 кг, 0,15% → 200 × 0,15 × 10 = 300 г.',
              'Если сироп разводят 1 часть сиропа + 4 части воды (всего 5 частей), то для 0,1% в готовом напитке доля в сиропе должна быть в 5 раз выше — 0,5%.',
            ],
          },
          {
            p: 'Если вести расчёт в таблице (Excel или Google Sheets), количество автоматически пересчитывается при изменении размера партии и снижается риск ручной ошибки.',
          },
          { h2: 'Что означает диапазон в каталоге' },
          {
            p: 'Диапазон в карточке продукта — граница, рекомендованная производителем для большинства применений. Нижняя граница — лёгкий, но заметный аромат и вкус; верхняя — насыщенный, яркий профиль или матрицы, которые сильно «поглощают» вкус. В зависимости от типа продукта диапазон различается:',
          },
          {
            ul: [
              'Жидкие пищевые ароматизаторы — диапазон в карточке обычно 0,05–0,3%.',
              'Эфирные масла — значительно концентрированнее, диапазон в карточке 0,01–0,2%.',
              'Парфюмерные композиции (для мыла, косметики, бытовой химии) — в пищевые продукты не вносятся, их диапазон задаётся по другой логике.',
              'Пищевые ингредиенты (красители, загустители, подсластители) — у каждого свой диапазон в карточке; не рассчитывайте их как ароматизатор.',
            ],
          },
          {
            p: 'Требования технических регламентов и стандартов, применимых к вашему продукту, проверьте отдельно с технологом: рекомендуемый диапазон не заменяет нормативные требования.',
          },
          { h2: 'Что влияет на дозировку' },
          {
            p: 'Один и тот же ароматизатор по-разному ощущается в двух разных продуктах. Поэтому прямой перенос дозировки из чужой рецептуры часто не срабатывает. Основные факторы:',
          },
          {
            ul: [
              'Термообработка: при выпечке, варке, пастеризации часть летучих компонентов теряется — если внести ароматизатор после нагрева нельзя, проверьте и более высокую точку.',
              'Жирность: жирная масса «удерживает» многие ароматические вещества, вкус раскрывается медленнее.',
              'Белок и крахмал: молочные белки и крахмал связывают вкус и делают его слабее.',
              'Сахар и кислота: баланс сладости и кислотности усиливает или заглушает фруктовые вкусы.',
              'Температура подачи: в холодном продукте (мороженое, холодные напитки) вкус ощущается слабее, чем в тёплом.',
              'Форма: жидкая, эмульсионная и порошковая формы при одинаковом проценте могут давать разный результат.',
              'Срок хранения: некоторые вкусы со временем ослабевают — сравнивайте пробу на свежем и выдержанном образце.',
            ],
          },
          {
            p: 'Практический вывод: если меняете рецептуру (количество жира, сахара или кислоты, режим выпечки, тип упаковки), перепроверьте и утверждённую дозировку. Часто причина жалобы «вкус пропал» не в ароматизаторе, а в небольшом изменении рецептуры.',
          },
          { h2: 'Лабораторная проба: пошагово' },
          {
            p: 'Надёжная дозировка получается из пробы в трёх точках. Сравнить три уровня одновременно на небольшой партии (например, 1 кг) быстрее и точнее, чем делать несколько отдельных попыток.',
          },
          {
            ul: [
              'Выберите три точки: нижнюю, среднюю и верхнюю часть диапазона из каталога.',
              'Используйте весы с точностью не ниже 0,01 г; малые количества взвешивайте, а не отмеряйте пипеткой или каплями.',
              'Сначала смешайте ароматизатор с «носителем»: жиром, сиропом, сахаром или частью воды, затем — с общей массой.',
              'Промаркируйте каждый образец (кодом) и готовьте в одинаковых условиях.',
              'Пробуйте готовый продукт сразу после процесса и минимум через сутки — вкус обычно «устаканивается».',
              'По возможности оценивайте образцы вслепую, группой из 3–5 человек.',
              'Записывайте результат в журнал: количество, этап внесения, температура, комментарии дегустации.',
            ],
          },
          { h2: 'От пробы к промышленной партии' },
          {
            p: 'Найденное в лаборатории количество в цехе может измениться: в большой ёмкости нагрев длится дольше, в открытых котлах больше испарение, другое время перемешивания. Поэтому первую промышленную партию рассматривайте как контрольную.',
          },
          {
            ul: [
              'Сохраняйте этап внесения и температуру такими же, как в лаборатории.',
              'Отберите контрольный образец первой партии и сравните с лабораторным.',
              'Утверждённое количество внесите в технологическую карту и свяжите с номером партии.',
              'При смене партии поставки повторяйте короткую контрольную пробу.',
            ],
          },
          { h2: 'Частые ошибки' },
          {
            ul: [
              'Отмерять в миллилитрах вместо взвешивания в граммах — из-за разницы плотности количество смещается.',
              'Считать процент от сиропа или части теста, а не от готового продукта.',
              'Сразу выходить за верхнюю границу, если вкус слабый, — сначала проверьте причину (нагрев, этап внесения).',
              'Смешивать два-три ароматизатора без пробы — основной вкус теряется.',
              'Оценивать только по запаху из флакона: в продукте ароматизатор раскрывается иначе.',
              'Не записывать результаты — следующую партию сложно повторить.',
            ],
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Сколько граммов ароматизатора нужно на 1 кг продукта?',
                a: 'Расчёт: 0,1% = 1 г/кг. Для жидких ароматизаторов диапазон в карточке каталога — 0,05–0,3%, то есть 0,5–3 г на 1 кг. Точное количество для вашей рецептуры определите, сравнив нижнюю, среднюю и верхнюю точки диапазона.',
              },
              {
                q: 'Если вкус слабый, нужно увеличить дозировку?',
                a: 'Сначала проверьте причину: не вносится ли ароматизатор до термообработки, не связывают ли вкус жир или белок. Затем повышайте пошагово в пределах диапазона. Если и на верхней границе недостаточно, правильнее попробовать другую форму или более термостойкий продукт.',
              },
              {
                q: 'Как рассчитать дозировку для сиропа напитка?',
                a: 'Сначала определите нужный процент в готовом напитке, затем умножьте его на коэффициент разведения. Например, если сироп разводят 1:4 (всего 5 частей), доля в сиропе будет в 5 раз выше, чем в готовом напитке.',
              },
              {
                q: 'Как получить ароматизатор для пробы?',
                a: 'В бесплатный набор образцов можно добавить до 8 продуктов (25, 50 или 100 г). По крупным объёмам и цене отправьте запрос — менеджер свяжется с вами.',
              },
            ],
          },
        ],
        links: [
          { path: '/category/flavours', label: 'Каталог пищевых ароматизаторов' },
          { path: '/category/essential-oils', label: 'Эфирные масла' },
          { path: '/industries', label: 'Подбор по отраслям' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'kosmetika-uchun-atir-kompozitsiyasi',
    published: '2026-11-24',
    text: {
      uz: {
        title: 'Kosmetika uchun atir: shampun, gel, krem',
        description:
          'Shampun, dush geli, krem va losyon uchun otdushka tanlash: asos turi, hid profili, kiritish bosqichi, barqarorlik sinovi va hujjatlar.',
        intro:
          'Kosmetika uchun atir kompozitsiyasi (otdushka) — shampun, dush geli, krem yoki losyonga hid beradigan tayyor aralashma. Uni tanlashda uch narsa hal qiladi: mahsulot asosi (yuvuvchi asos yoki emulsiya), hid profili va o‘z formulangizdagi barqarorlik sinovi. Gulf Flavours katalogida kosmetika va shaxsiy parvarish sohasi bilan belgilangan 37 ta atir kompozitsiyasi bor; hammasi moyda eruvchan, kartochkadagi tavsiya etilgan oraliq 0,3–3%. Quyida tanlash va sinash tartibi.',
        blocks: [
          { h2: 'Otdushka, efir moyi va oziq-ovqat aromatizatori' },
          {
            p: 'Bu uch mahsulot ko‘pincha chalkashtiriladi. Atir kompozitsiyasi — kosmetika, sovun va maishiy kimyo uchun yaratilgan hid aralashmasi; u ovqatga qo‘shilmaydi. Oziq-ovqat aromatizatori — ovqat va ichimlik uchun; uni kosmetikada ishlatish kutilgan natijani bermaydi, chunki u yuvuvchi asos va emulsiyada barqarorlik uchun mo‘ljallanmagan. Efir moylari ikkala sohada ham xomashyo bo‘lishi mumkin, lekin qo‘llanish sohasi har bir mahsulot uchun alohida belgilanadi. Har doim kartochkadagi qo‘llanish sohasini tekshiring.',
          },
          { h2: 'Mahsulot asosi tanlovga qanday ta’sir qiladi' },
          {
            p: 'Bir xil kompozitsiya shampunda va kremda turlicha o‘zini tutadi. Formula turiga qarab e’tibor beriladigan nuqtalar:',
          },
          {
            ul: [
              'Shampun va dush geli: sirt-faol moddalar asosida. Hid yuvish paytida “ochiladi”, shuning uchun flakondagi va ko‘pikdagi hidni alohida baholang. Kompozitsiya qo‘shilgach yopishqoqlik (qovushqoqlik) o‘zgarishi mumkin — tuz bilan quyuqlashtirishni otdushkadan keyin tekshiring.',
              'Shaffof gel va tonik: moyda eruvchan kompozitsiya suvli asosda loyqalanishi mumkin; odatda solubilizator bilan oldindan aralashma (premiks) qilinadi.',
              'Krem va losyon (emulsiya): kompozitsiya emulsiya barqarorligiga ta’sir qilishi mumkin; uni sovutish bosqichida, massa iliq bo‘lganda qo‘shish keng tarqalgan amaliyot.',
              'Soch balzami va konditsioner: kationik asos ba’zi hid komponentlari bilan boshqacha reaksiyaga kirishishi mumkin — alohida sinang.',
              'Suyuq va qattiq sovun: o‘z xususiyatlari bor — sovun uchun alohida maqolamizda batafsil.',
            ],
          },
          { h2: 'Hid profilini tanlash' },
          {
            p: 'Hid — mahsulotning birinchi taassuroti. Uni seriya auditoriyasi va qadoq dizayniga mos tanlang. Katalogdagi asosiy yo‘nalishlar:',
          },
          {
            ul: [
              'Parvarish hidlari: sut, asal, kokos suti, vanil va shea, mango butter, qulupnay-qaymoq — yumshoq, “kremli” seriyalar uchun.',
              'Mevali va yangi: shaftoli, kivi, papayya, qora gilos, ko‘k qarag‘at, bodring, ko‘k choy, aloe vera hidi — dush geli va shampun uchun.',
              'Pudrali: bolalar pudrasi, talk va iris, babunagul — yumshoq, toza hid kerak bo‘lgan seriyalar uchun.',
              'Atir uslubidagi: ekzotik ambar, oq mushk, sitrus nuar, baxmal atirgul, yasmin kechalari — premium dush geli va losyonlar uchun.',
              'Yog‘ochli va sharqona: sandal, kashmir yog‘ochi, charm va tamaki, qirol ud — erkaklar seriyasi va sharqona yo‘nalish uchun.',
            ],
          },
          {
            p: 'Muhim: “aloe vera”, “ko‘k choy” yoki “asal” kabi nomdagi atir kompozitsiyasi faqat HID beradi — u o‘simlik ekstrakti emas va teriga ta’sir qilmaydi. Yorliq va reklamada buni hisobga oling.',
          },
          {
            p: 'Seriya (shampun + balzam + dush geli) uchun bitta hid oilasini tanlash brendni taniqli qiladi. Bunda har bir mahsulot uchun bir xil kompozitsiyani alohida sinang: bir xil hid turli asoslarda biroz boshqacha eshitiladi va dozani mahsulot turiga qarab moslash kerak bo‘lishi mumkin. Tanlovni 3–5 ta nomzoddan boshlab, ko‘r usulda bir nechta kishi bilan solishtirish qulay.',
          },
          { h2: 'Kiritish texnologiyasi' },
          {
            p: 'Katalogdagi kosmetik kompozitsiyalar moyda eruvchan. Bu yog‘ fazasi bor mahsulotlarda (krem, losyon, moylar) ish oson, suvli shaffof mahsulotlarda esa qo‘shimcha qadam kerak bo‘ladi.',
          },
          {
            ul: [
              'Emulsiyada: kompozitsiyani yog‘ fazasiga yoki sovutish bosqichida qo‘shing; yuqori harorat uchuvchan komponentlarni yo‘qotadi.',
              'Shaffof suvli mahsulotda: kompozitsiyani avval solubilizator bilan aralashtiring, keyin asosga kiriting; nisbatni sinovda tanlang.',
              'Yuvuvchi asosda: kompozitsiyani sirt-faol moddaning bir qismiga oldindan aralashtirish bir xil taqsimlanishga yordam beradi.',
              'Har doim grammda torting va qo‘shish bosqichini texnologik kartaga yozing.',
            ],
          },
          {
            p: 'Rangga ham e’tibor bering: vanilli va ba’zi shirin, “gurmand” kompozitsiyalar vaqt o‘tishi bilan oq yoki shaffof mahsulotni biroz qoraytirishi mumkin. Oq krem yoki shaffof gel uchun bunday hidni tanlasangiz, rang barqarorligini alohida kuzating yoki qadoq va rang yechimini oldindan o‘ylang.',
          },
          { h2: 'Dozirovka va barqarorlik sinovi' },
          {
            p: 'Kartochkadagi oraliq — 0,3–3%. Umumiy amaliyotda yuviladigan mahsulotlarda (shampun, dush geli) miqdor yuqoriroq, teriga qoldiriladigan mahsulotlarda (krem, losyon) esa pastroq tanlanadi. Aniq miqdorni o‘z formulangizda sinov belgilaydi.',
          },
          {
            ul: [
              'Kichik partiyalarda 2–3 xil miqdorni solishtiring.',
              'Namunalarni turli sharoitda saqlang: xona harorati, iliq joy, salqin joy va yorug‘lik ostida.',
              'Bir necha hafta davomida kuzating: hid, rang, shaffoflik, yopishqoqlik, qatlamlarga ajralish.',
              'Hidni flakonda, qo‘lda va (shampun/gel uchun) ko‘pikda alohida baholang.',
              'Kompozitsiyani tayyor qadoqda ham sinang — qadoq materiali hid va rangga ta’sir qilishi mumkin.',
            ],
          },
          {
            p: 'Sinov natijalarini har bir namuna uchun jadvalda yuriting: kompozitsiya nomi va partiyasi, miqdor, qo‘shish bosqichi, saqlash sharoiti va har bir tekshiruv sanasidagi kuzatuv. Bu keyinchalik sanoat partiyasini takrorlash va yetkazib beruvchi partiyasi almashganda solishtirish uchun asos bo‘ladi.',
          },
          { h2: 'Hujjatlar va yorliq' },
          {
            p: 'Kosmetik mahsulot uchun kompozitsiyaning hujjatlari ham hid kabi muhim. Yetkazib beruvchidan har bir aniq mahsulot uchun quyidagilarni so‘rang:',
          },
          {
            ul: [
              'Xavfsizlik ma’lumotlari varaqasi (SDS).',
              'Kosmetikada qo‘llanish bo‘yicha muvofiqlik hujjati (masalan, IFRA muvofiqlik sertifikati — bor-yo‘qligini aniqlashtiring).',
              'Yorliqda ko‘rsatilishi talab qilinishi mumkin bo‘lgan allergen komponentlar ro‘yxati.',
            ],
          },
          {
            p: 'Yorliq talablari mahsulot sotiladigan bozorga bog‘liq (masalan, EAEO bozori uchun TR TS 009/2011). Ularni sertifikatlash bo‘yicha mutaxassisingiz bilan tekshiring.',
          },
          { h2: 'Keng tarqalgan xatolar' },
          {
            ul: [
              'Oziq-ovqat aromatizatorini kosmetikaga qo‘shish yoki aksincha.',
              'Shaffof gelga moyda eruvchan kompozitsiyani solubilizatorsiz qo‘shish — loyqalanish.',
              'Kompozitsiyani issiq massaga erta qo‘shish — hid susayadi yoki o‘zgaradi.',
              'Faqat flakon hidiga qarab tanlash, ko‘pikda va terida tekshirmaslik.',
              'Barqarorlik sinovisiz sanoat partiyasiga o‘tish.',
              'Hid nomini mahsulot xususiyati sifatida reklama qilish (“aloe hidi” — aloe ta’siri emas).',
            ],
          },
          { h2: 'Ko‘p so‘raladigan savollar' },
          {
            faq: [
              {
                q: 'Shampun uchun qancha otdushka qo‘shiladi?',
                a: 'Katalog kartochkasidagi oraliq — 0,3–3%. Yuviladigan mahsulotlarda odatda yuqoriroq, teriga qoldiriladiganlarda pastroq miqdor tanlanadi. Aniq miqdorni 2–3 nuqtali sinov va barqarorlik kuzatuvi belgilaydi.',
              },
              {
                q: 'Shaffof dush geli otdushkadan keyin loyqalandi — nima qilish kerak?',
                a: 'Kompozitsiya moyda eruvchan bo‘lsa, uni avval solubilizator bilan aralashtirib, keyin asosga qo‘shing. Solubilizator va kompozitsiya nisbatini kichik partiyalarda tanlang; kerak bo‘lsa, dozani oraliq doirasida kamaytiring.',
              },
              {
                q: 'Sovun uchun olingan kompozitsiyani shampunda ishlatsa bo‘ladimi?',
                a: 'Ko‘p kompozitsiyalar bir nechta qo‘llanish sohasi bilan belgilangan — kartochkadagi sohalarni tekshiring. Har bir asosda (sovun, shampun, krem) alohida sinov o‘tkazing: bir asosda barqaror hid boshqasida o‘zgarishi mumkin.',
              },
              {
                q: 'Namunalarni qanday olish mumkin?',
                a: 'Bepul namuna qutisiga 8 tagacha kompozitsiya qo‘shing (25, 50 yoki 100 g). Seriya uchun hajm va narxni narx so‘rovi orqali bilib oling.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/personal-care', label: 'Kosmetika va parvarish uchun hidlar' },
          { path: '/category/fragrances/personal-care', label: 'Shaxsiy parvarish atir kompozitsiyalari' },
          { path: '/category/fragrances/fine-fragrance', label: 'Nozik atirlar yo‘nalishi' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Отдушка для косметики: шампунь, гель, крем',
        description:
          'Как выбрать отдушку для шампуня, геля для душа, крема и лосьона: тип основы, аромат, этап внесения, тест стабильности и документы.',
        intro:
          'Отдушка для косметики (парфюмерная композиция) — готовая смесь, которая придаёт аромат шампуню, гелю для душа, крему или лосьону. При выборе решают три вещи: основа продукта (моющая основа или эмульсия), ароматический профиль и тест стабильности в вашей рецептуре. В каталоге Gulf Flavours 37 парфюмерных композиций отмечены для косметики и личной гигиены; все маслорастворимые, рекомендуемый диапазон в карточке — 0,3–3%. Ниже — порядок выбора и проверки.',
        blocks: [
          { h2: 'Отдушка, эфирное масло и пищевой ароматизатор' },
          {
            p: 'Эти три продукта часто путают. Парфюмерная композиция создаётся для косметики, мыла и бытовой химии; в пищу она не добавляется. Пищевой ароматизатор — для еды и напитков; в косметике он не даст ожидаемого результата, так как не рассчитан на стабильность в моющей основе и эмульсии. Эфирные масла могут быть сырьём в обеих областях, но область применения определяется для каждого продукта отдельно. Всегда проверяйте область применения в карточке.',
          },
          { h2: 'Как основа продукта влияет на выбор' },
          {
            p: 'Одна и та же композиция по-разному ведёт себя в шампуне и в креме. На что обращать внимание в зависимости от типа формулы:',
          },
          {
            ul: [
              'Шампунь и гель для душа: на основе ПАВ. Аромат «раскрывается» при мытье, поэтому оценивайте запах во флаконе и в пене отдельно. После внесения отдушки может измениться вязкость — загущение солью проверяйте уже после отдушки.',
              'Прозрачный гель и тоник: маслорастворимая композиция может мутнеть в водной основе; обычно делают предварительную смесь (премикс) с солюбилизатором.',
              'Крем и лосьон (эмульсия): композиция может влиять на стабильность эмульсии; распространённая практика — вносить её на этапе охлаждения, когда масса тёплая.',
              'Бальзам и кондиционер для волос: катионная основа может иначе взаимодействовать с отдельными компонентами аромата — тестируйте отдельно.',
              'Жидкое и твёрдое мыло: со своими особенностями — подробно в отдельной статье про мыло.',
            ],
          },
          { h2: 'Выбор аромата' },
          {
            p: 'Аромат — первое впечатление о продукте. Подбирайте его под аудиторию серии и дизайн упаковки. Основные направления каталога:',
          },
          {
            ul: [
              'Ухаживающие: молоко, мёд, кокосовое молоко, ваниль и ши, манго баттер, клубника со сливками — для мягких «кремовых» серий.',
              'Фруктовые и свежие: персик, киви, папайя, чёрная вишня, черника, огурец, зелёный чай, алоэ вера — для гелей и шампуней.',
              'Пудровые: детская пудра, тальк и ирис, ромашка — для серий с мягким, чистым ароматом.',
              'Парфюмерные: экзотический амбер, белый мускус, цитрус нуар, бархатная роза, жасминовые ночи — для премиальных гелей и лосьонов.',
              'Древесные и восточные: сандал, кашемировое дерево, кожа и табак, королевский уд — для мужских серий и восточного направления.',
            ],
          },
          {
            p: 'Важно: отдушка с названием «алоэ вера», «зелёный чай» или «мёд» даёт только ЗАПАХ — это не растительный экстракт и на кожу не действует. Учитывайте это в маркировке и рекламе.',
          },
          {
            p: 'Одно ароматическое семейство для всей серии (шампунь + бальзам + гель для душа) делает бренд узнаваемым. При этом одну и ту же композицию тестируйте в каждом продукте отдельно: в разных основах аромат звучит немного по-разному, и дозировку может понадобиться подстроить под тип продукта. Удобно начинать с 3–5 кандидатов и сравнивать их вслепую с несколькими людьми.',
          },
          { h2: 'Технология внесения' },
          {
            p: 'Косметические композиции каталога маслорастворимые. В продуктах с жировой фазой (кремы, лосьоны, масла) это упрощает работу, а в водных прозрачных продуктах нужен дополнительный шаг.',
          },
          {
            ul: [
              'В эмульсии: вносите композицию в жировую фазу или на этапе охлаждения; высокая температура уносит летучие компоненты.',
              'В прозрачном водном продукте: сначала смешайте композицию с солюбилизатором, затем вводите в основу; соотношение подберите на пробе.',
              'В моющей основе: предварительное смешивание композиции с частью ПАВ помогает равномерному распределению.',
              'Всегда взвешивайте в граммах и фиксируйте этап внесения в технологической карте.',
            ],
          },
          {
            p: 'Обращайте внимание и на цвет: ванильные и некоторые сладкие «гурманские» композиции со временем могут слегка затемнять белый или прозрачный продукт. Если выбираете такой аромат для белого крема или прозрачного геля, отдельно наблюдайте за стабильностью цвета или заранее продумайте упаковку и цветовое решение.',
          },
          { h2: 'Дозировка и тест стабильности' },
          {
            p: 'Диапазон в карточке — 0,3–3%. В общей практике в смываемых продуктах (шампунь, гель для душа) количество выбирают выше, в несмываемых (крем, лосьон) — ниже. Точное количество для вашей формулы определяет проба.',
          },
          {
            ul: [
              'Сравните 2–3 уровня на небольших партиях.',
              'Храните образцы в разных условиях: комнатная температура, тёплое место, прохладное место и на свету.',
              'Наблюдайте несколько недель: запах, цвет, прозрачность, вязкость, расслоение.',
              'Оценивайте запах отдельно во флаконе, на руке и (для шампуня/геля) в пене.',
              'Тестируйте и в готовой упаковке — материал упаковки может влиять на запах и цвет.',
            ],
          },
          {
            p: 'Ведите результаты по каждому образцу в таблице: название и партия композиции, количество, этап внесения, условия хранения и наблюдения на каждую дату проверки. Это основа для повторения промышленной партии и сравнения при смене партии поставки.',
          },
          { h2: 'Документы и маркировка' },
          {
            p: 'Для косметического продукта документы на композицию важны не меньше, чем аромат. Запросите у поставщика по каждому конкретному продукту:',
          },
          {
            ul: [
              'Паспорт безопасности (SDS).',
              'Документ о соответствии для применения в косметике (например, сертификат соответствия IFRA — уточните его наличие).',
              'Перечень аллергенных компонентов, указание которых может требоваться на этикетке.',
            ],
          },
          {
            p: 'Требования к маркировке зависят от рынка сбыта (например, для рынка ЕАЭС — ТР ТС 009/2011). Проверьте их со специалистом по сертификации.',
          },
          { h2: 'Частые ошибки' },
          {
            ul: [
              'Добавлять пищевой ароматизатор в косметику или наоборот.',
              'Вносить маслорастворимую композицию в прозрачный гель без солюбилизатора — помутнение.',
              'Вносить композицию в горячую массу слишком рано — аромат слабеет или меняется.',
              'Выбирать только по запаху из флакона, не проверяя в пене и на коже.',
              'Переходить к промышленной партии без теста стабильности.',
              'Рекламировать название аромата как свойство продукта («запах алоэ» — не действие алоэ).',
            ],
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Сколько отдушки добавлять в шампунь?',
                a: 'Диапазон в карточке каталога — 0,3–3%. В смываемых продуктах обычно выбирают более высокое количество, в несмываемых — более низкое. Точное количество определяют проба в 2–3 точках и наблюдение за стабильностью.',
              },
              {
                q: 'Прозрачный гель для душа помутнел после отдушки — что делать?',
                a: 'Если композиция маслорастворимая, сначала смешайте её с солюбилизатором, затем вносите в основу. Соотношение солюбилизатора и композиции подберите на небольших партиях; при необходимости снизьте дозировку в пределах диапазона.',
              },
              {
                q: 'Можно ли использовать отдушку для мыла в шампуне?',
                a: 'Многие композиции отмечены для нескольких областей применения — проверьте области в карточке. В каждой основе (мыло, шампунь, крем) проводите отдельную пробу: аромат, стабильный в одной основе, может измениться в другой.',
              },
              {
                q: 'Как получить образцы?',
                a: 'Добавьте до 8 композиций в бесплатный набор образцов (25, 50 или 100 г). Объём и цену для серии уточните через запрос цены.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/personal-care', label: 'Ароматы для косметики и ухода' },
          { path: '/category/fragrances/personal-care', label: 'Композиции для личной гигиены' },
          { path: '/category/fragrances/fine-fragrance', label: 'Парфюмерное направление' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },
];
