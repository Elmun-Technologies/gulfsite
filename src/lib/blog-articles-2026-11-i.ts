/**
 * BLOG — 2026-noyabr, 9-to‘plam: sport ozuqasi va BAA uchun aromatizatorlar hamda
 * halol aromatizator tanlash (hujjatlar va tekshiruv).
 * Qoidalar `blog.ts` sarlavhasida: faqat UZ/RU, to‘qilgan raqam/da’vo yo‘q,
 * tibbiy/sog‘liq va’dasi yo‘q, diniy hukm berilmaydi (qaror — sertifikatlovchi tashkilotda).
 * Ma’lumot katalogdan: “BAA va sport ovqatlanishi” sohasi bilan belgilangan aromatizatorlar —
 * chakanda, buzina, asai, greyfurt, sabzi, babunagul, melissa, xibiskus, na’matak, ko‘k va
 * o‘tli choy (suyuq, kartochkadagi oraliq 0,05–0,3%); shu sohadagi shirinlashtirgichlar —
 * sukraloza, steviya, fruktoza, maltodekstrin; oqsillar — soya va no‘xat oqsili izolyati.
 * Kartochka belgilari: “Halol sertifikati”, “Spirtsiz” (katalog filtri); saqlash
 * sharti — `catalog-copy.ts` (STORAGE), yaroqlilik — kartochkadagi muddat.
 */

import type { BlogArticle } from './blog';

export const ARTICLES_2026_11_I: BlogArticle[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'sport-ozuqasi-va-baa-uchun-aromatizator',
    published: '2026-11-26',
    text: {
      uz: {
        title: 'Sport ozuqasi va BAA uchun aromatizator',
        description:
          'Protein, geyner, vitaminli ichimlik va BAA uchun aromatizator: xomashyo ta’mini muvozanatlash, profil, kukun aralashmada ishlatish, dozirovka sinovi.',
        intro:
          'Sport ozuqasi (protein kokteyllari, geynerlar, aminokislotali kukunlar) va BAA (vitaminli ichimliklar, eriydigan tabletkalar, chaynaladigan shakllar, o‘simlik choylari) uchun aromatizator tanlashda asosiy vazifa — xomashyoning o‘z ta’mini muvozanatlash: oqsilning sutli yoki “dukkakli” notasini, vitamin va minerallarning achchiq yoki metall ta’mini. Buning uchun aromatizator mahsulot shakliga (quruq aralashma yoki suyuqlik), shirinlashtirgich va kislota tizimiga mos tanlanadi, dozirovka esa katalog kartochkasidagi oraliqdan boshlab o‘z retseptingizda sinaladi. Quyida tanlash tartibi, sinov rejasi va ko‘p uchraydigan xatolar.',
        blocks: [
          { h2: 'Avval mahsulot turini aniqlang' },
          {
            p: 'Sport ozuqasi va BAA — bitta toifa emas. Har bir mahsulotning asosi, tayyorlanish usuli va iste’molchi uni qanday ichishi yoki yeyishi turlicha, shuning uchun aromatizatorga qo‘yiladigan talab ham turlicha:',
          },
          {
            ul: [
              'Protein kokteyllari — zardob, soya yoki no‘xat oqsili asosidagi kukun; suvda yoki sutda shakerda aralashtiriladi.',
              'Geynerlar va uglevodli aralashmalar — oqsil bilan birga maltodekstrin, dekstroza kabi uglevodlar ko‘p; ta’m shirinroq va “to‘liqroq” bo‘ladi.',
              'Aminokislotali va izotonik kukunlar — odatda shaffof, kislotali ichimlik sifatida tayyorlanadi; asos ta’mi achchiqroq bo‘lishi mumkin.',
              'Vitaminli ichimliklar va eriydigan tabletkalar — vitamin va minerallar o‘ziga xos ta’m beradi, ichimlik esa ko‘pincha shaffof bo‘lishi kerak.',
              'Chaynaladigan va so‘riladigan shakllar — ta’m og‘izda uzoqroq turadi, shuning uchun “keyingi ta’m” ayniqsa sezilarli.',
              'O‘simlik choylari va damlamalar — aromatizator o‘simlik xomashyosining o‘z notasini to‘ldiradi.',
            ],
          },
          {
            p: 'Retsept hujjatida mahsulot turi, asos (oqsil, uglevod, vitamin aralashmasi), tayyorlash usuli (suv, sut, qaynoq suv) va qadoq turini yozib qo‘ying — aromatizator tanlovi va keyingi sinovlar shu ma’lumotga tayanadi.',
          },
          { h2: 'Asosiy muammo: xomashyoning o‘z ta’mi' },
          {
            p: 'Sport ozuqasi va BAA retseptlarida aromatizator “bo‘sh” asosga emas, o‘z ta’mi kuchli asosga qo‘shiladi. Eng ko‘p uchraydigan notalar:',
          },
          {
            ul: [
              'Zardob oqsili — sutli, ba’zan pishloqqa o‘xshash nota; issiq yoki uzoq saqlangan kukunda kuchayishi mumkin.',
              'O‘simlik oqsillari (soya, no‘xat) — dukkakli, “yerli”, ba’zan biroz achchiq nota; aromatizatorni tanlashda eng qiyin asoslardan biri.',
              'Vitamin va minerallar — achchiq, metall yoki sho‘rtak ta’m; ba’zilari ichimlikka rang ham beradi.',
              'Aminokislotalar — achchiqlik va qattiq keyingi ta’m.',
            ],
          },
          {
            p: 'Muhim: aromatizator achchiqlikni “yo‘q qilmaydi” — u diqqatni boshqa, yoqimli notaga o‘tkazadi va asos ta’mini kamroq seziladigan qiladi. Shuning uchun asos juda kuchli bo‘lsa, aromatizator miqdorini oshirish o‘rniga avval shirinlashtirgich va kislota muvozanatini o‘zgartirib ko‘rish, kerak bo‘lsa asosning o‘zini almashtirish samaraliroq bo‘ladi.',
          },
          { h2: 'Ta’m profilini tanlash' },
          {
            p: 'Profil asosning o‘z notasi bilan “kelishadigan” yo‘nalishdan tanlanadi. Amaliyotda ko‘p ishlatiladigan juftliklar:',
          },
          {
            ul: [
              'Zardob proteini — shokolad, kakao, vanil, karamel, sutli va qaymoqli yo‘nalishlar; sutli nota ular bilan tabiiy uyg‘unlashadi.',
              'O‘simlik oqsili — shokolad-funduk, kakao, kofe kabi to‘q va qovurilgan notalar dukkakli ta’mni yaxshiroq yopadi.',
              'Vitaminli va izotonik ichimliklar — sitrus (masalan, greyfurt), rezavor mevalar (chakanda, buzina, asai), tropik mevalar; kislotali profil metall notani kamroq seziladigan qiladi.',
              'O‘simlik choylari va damlamalar — babunagul, melissa, na’matak, xibiskus, ko‘k choy va o‘tli choy yo‘nalishlari.',
            ],
          },
          {
            p: 'Gulf Flavours katalogida “BAA va sport ovqatlanishi” sohasi bilan belgilangan aromatizatorlar — chakanda, buzina, asai rezavorlari, greyfurt, sabzi, babunagul, melissa, xibiskus, na’matak, ko‘k choy va o‘tli choy. Shokolad, vanil va karamel yo‘nalishlari “Shokolad va kakao”, “Sutli” hamda “Shirin va desert” guruhlarida joylashgan. Bitta mahsulotda ikki yo‘nalishdan ortiq aralashtirmang: masalan, “qulupnay-qaymoq” yaxshi ishlaydi, uchinchi nota qo‘shilsa asosiy ta’m yo‘qoladi.',
          },
          { h2: 'Shakl: suyuq aromatizator quruq aralashmada' },
          {
            p: 'Katalogdagi oziq-ovqat aromatizatorlarining aksariyati suyuq. Kukun mahsulotlarda (protein, geyner, aminokislotali aralashma) ular bilan ishlashning bir necha qoidasi bor:',
          },
          {
            ul: [
              'Suyuq aromatizatorni to‘g‘ridan-to‘g‘ri katta aralashmaga quymang — avval kichik miqdordagi quruq tashuvchiga (maltodekstrin, dekstroza yoki retseptdagi kukun asosning bir qismiga) bir tekis aralashtirib, keyin asosiy massaga qo‘shing.',
              'Katta partiyalarda bosqichma-bosqich suyultirish qo‘llanadi: premiks avval aralashmaning kichik qismi bilan, keyin qolgan qismi bilan aralashtiriladi — shunda ta’m qadoqdan qadoqqa farq qilmaydi.',
              'Aralashtirgandan keyin kukunda bo‘lak va namlangan joylar yo‘qligini tekshiring.',
              'Shaffof ichimliklar uchun suvda eruvchan aromatizator tanlang; moyda eruvchan shakl ichimlikda loyqalik yoki yuzada dog‘ berishi mumkin. Eruvchanlikni so‘rovda aniqlang va shaffoflikni o‘z ichimligingizda sinab ko‘ring.',
            ],
          },
          {
            p: 'Agar retseptingiz uchun kukun yoki kapsulalangan shakl zarur bo‘lsa, buni narx so‘rovida yozing — mavjud variantlar bo‘yicha mutaxassis javob beradi.',
          },
          { h2: 'Shirinlashtirgich va kislota bilan muvozanat' },
          {
            p: 'Sport ozuqasi va BAA ko‘pincha shakarsiz yoki kam shakarli bo‘ladi, shuning uchun aromatizator shakar bilan emas, sukraloza, steviya yoki boshqa shirinlashtirgichlar bilan ishlaydi. Bu ta’mni sezilarli o‘zgartiradi:',
          },
          {
            ul: [
              'Steviya o‘ziga xos keyingi ta’m beradi — u bilan mevali va rezavor profillar odatda yaxshiroq uyg‘unlashadi.',
              'Shirinlik darajasi aromatizatorning kuchini “ko‘rsatadi” yoki “yashiradi”: shirinlik kam bo‘lsa, vanil va karamel quruq, mevali profillar esa nordon tuyuladi.',
              'Limon yoki olma kislotasi mevali va sitrus notalarni yorqinroq qiladi, lekin shokolad va sutli profillarga mos kelmaydi.',
              'Maltodekstrin va fruktoza ta’mga “tana” beradi va aromatizatorni yumshoqroq ochadi.',
            ],
          },
          {
            p: 'Shuning uchun aromatizatorni doimo yakuniy shirinlashtirgich va kislota tizimi bilan sinang — shakarli suvdagi sinov natijasi tayyor mahsulotda takrorlanmaydi.',
          },
          { h2: 'Dozirovkani qanday sinash kerak' },
          {
            p: 'Har bir aromatizator uchun tavsiya etilgan oraliq katalog kartochkasida ko‘rsatilgan — bu boshlang‘ich yo‘nalish, aniq miqdorni esa faqat sinov belgilaydi. Amaliy tartib:',
          },
          {
            ul: [
              'Kartochkadagi oraliqning past chegarasidan boshlang va bitta retseptda 3 xil darajani tayyorlang (past, o‘rta, yuqori).',
              'Mahsulotni iste’molchi qanday tayyorlasa, shunday sinang: suvda va sutda, shakerda, tavsiya etilgan porsiyada.',
              'Ta’mni darhol va bir oz turgandan keyin baholang — oqsilli kokteyllarda nota vaqt o‘tishi bilan o‘zgaradi.',
              'Bir necha kishi bilan “ko‘r” degustatsiya o‘tkazing: namunalarni raqamlang, nomini aytmang.',
              'Tanlangan variantdan nazorat namunasini yoping va bir necha haftadan keyin qayta solishtiring.',
            ],
          },
          {
            p: 'Natijalarni jadvalga yozib boring: aromatizator nomi va partiyasi, miqdor, shirinlashtirgich, tayyorlash usuli va baholar. Bu keyingi partiyalarda va yangi ta’m qo‘shganda vaqtni tejaydi.',
          },
          { h2: 'Saqlash, yorliq va ko‘p uchraydigan xatolar' },
          {
            p: 'Kukun mahsulotlar namlikni yaxshi tortadi: namlangan kukun yopishib qoladi, aromat esa tezroq yo‘qoladi. Tayyor mahsulotni yaxshi yopiladigan, namlik o‘tkazmaydigan qadoqda saqlang. Aromatizatorning o‘zi — zich yopilgan original idishda, salqin va quruq joyda, +5…+25 °C da, quyosh nuridan uzoqda; yaroqlilik muddati kartochkada ko‘rsatilgan.',
          },
          {
            ul: [
              'Achchiq asosni aromatizator miqdorini oshirib yopishga urinish — natijada kimyoviy ta’m paydo bo‘ladi.',
              'Aromatizatorni shakar bilan sinab, keyin shirinlashtirgichga o‘tish.',
              'Suyuq aromatizatorni katta kukun massasiga to‘g‘ridan-to‘g‘ri qo‘shish — ta’m qadoqlar orasida notekis bo‘ladi.',
              'Shaffof ichimlikka moyda eruvchan aromatizator tanlash.',
              'Yorliqda aromatizator bilan bog‘liq sog‘liq va’dalarini yozish: aromatizator mahsulotga ta’m va hid beradi, foydali xususiyat qo‘shmaydi.',
            ],
          },
          {
            p: 'BAA va sport ozuqasini ro‘yxatdan o‘tkazish va yorliqlash talablari tayyor mahsulot ishlab chiqaruvchisi zimmasida. Aromatizator bo‘yicha spetsifikatsiya va kartochkadagi belgilar (masalan, “Halol sertifikati”, “GMO’siz”) uchun hujjat nusxalarini so‘rovda talab qiling.',
          },
          { h2: 'Ko‘p beriladigan savollar' },
          {
            faq: [
              {
                q: 'Protein kokteyli uchun qaysi aromatizator yaxshiroq?',
                a: 'Zardob proteinida shokolad, kakao, vanil, karamel va sutli yo‘nalishlar odatda yaxshi ishlaydi, chunki asosning sutli notasi bilan uyg‘unlashadi. O‘simlik oqsilida to‘qroq, qovurilgan notalar (shokolad-funduk, kakao, kofe) dukkakli ta’mni yaxshiroq yopadi. Yakuniy tanlov o‘z retseptingizdagi sinovda aniqlanadi.',
              },
              {
                q: 'Kukun aralashmaga suyuq aromatizator qo‘shsa bo‘ladimi?',
                a: 'Ha. Suyuq aromatizator avval kichik miqdordagi quruq tashuvchiga (masalan, maltodekstrin) bir tekis aralashtiriladi, keyin bosqichma-bosqich asosiy massaga qo‘shiladi. Aralashmadan keyin bo‘lak va namlangan joylar yo‘qligini tekshiring.',
              },
              {
                q: 'Aromatizator dozirovkasi qancha bo‘lishi kerak?',
                a: 'Har bir mahsulot kartochkasida tavsiya etilgan oraliq ko‘rsatilgan. Past chegaradan boshlang, 2–3 darajani yakuniy shirinlashtirgich bilan sinang va mahsulotni iste’molchi tayyorlaydigan usulda baholang.',
              },
              {
                q: 'Namunalarni qanday olish mumkin?',
                a: 'Saytdagi bepul namuna qutisiga 8 tagacha mahsulot qo‘shib, ariza qoldiring. Hajm va narx bo‘yicha savollar uchun narx so‘rash formasidan foydalaning.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/supplements', label: 'BAA va sport ovqatlari uchun aromatizatorlar' },
          { path: '/category/flavours/chocolate', label: 'Shokolad va kakao aromatizatorlari' },
          { path: '/category/food-ingredients/sweetener', label: 'Shirinlashtirgichlar' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Ароматизатор для протеина и БАД: выбор',
        description:
          'Ароматизатор для протеина, гейнера, витаминных напитков и БАД: маскировка вкуса сырья, выбор профиля, работа с сухими смесями, проверка дозировки.',
        intro:
          'При выборе ароматизатора для спортивного питания (протеиновые коктейли, гейнеры, аминокислотные смеси) и БАД (витаминные напитки, шипучие таблетки, жевательные формы, травяные чаи) главная задача — сбалансировать собственный вкус сырья: молочную или «бобовую» ноту белка, горечь и металлический привкус витаминов и минералов. Для этого ароматизатор подбирают под форму продукта (сухая смесь или жидкость), систему подсластителей и кислот, а дозировку проверяют на своей рецептуре, начиная с диапазона из карточки каталога. Ниже — порядок выбора, план испытаний и частые ошибки.',
        blocks: [
          { h2: 'Сначала определите тип продукта' },
          {
            p: 'Спортивное питание и БАД — не одна категория. У каждого продукта своя основа, способ приготовления и способ употребления, поэтому и требования к ароматизатору разные:',
          },
          {
            ul: [
              'Протеиновые коктейли — порошок на основе сывороточного, соевого или горохового белка; смешивается с водой или молоком в шейкере.',
              'Гейнеры и углеводные смеси — помимо белка много углеводов (мальтодекстрин, декстроза); вкус слаще и «плотнее».',
              'Аминокислотные и изотонические порошки — обычно прозрачный кисловатый напиток; основа может горчить.',
              'Витаминные напитки и шипучие таблетки — витамины и минералы дают собственный вкус, а напиток часто должен оставаться прозрачным.',
              'Жевательные и рассасываемые формы — вкус дольше держится во рту, поэтому послевкусие особенно заметно.',
              'Травяные чаи и настои — ароматизатор дополняет собственную ноту растительного сырья.',
            ],
          },
          {
            p: 'Зафиксируйте в рецептурном документе тип продукта, основу (белок, углеводы, витаминный премикс), способ приготовления (вода, молоко, кипяток) и упаковку — на эти данные опираются выбор ароматизатора и все дальнейшие испытания.',
          },
          { h2: 'Главная сложность — собственный вкус сырья' },
          {
            p: 'В рецептурах спортивного питания и БАД ароматизатор добавляют не в «пустую» основу, а в основу с выраженным собственным вкусом. Самые частые ноты:',
          },
          {
            ul: [
              'Сывороточный белок — молочная, иногда сырная нота; может усиливаться в порошке, хранившемся в тепле или долго.',
              'Растительные белки (соя, горох) — бобовая, «землистая», иногда горьковатая нота; одна из самых сложных основ для ароматизации.',
              'Витамины и минералы — горечь, металлический или солоноватый привкус; некоторые ещё и окрашивают напиток.',
              'Аминокислоты — горечь и жёсткое послевкусие.',
            ],
          },
          {
            p: 'Важно: ароматизатор не «убирает» горечь — он переключает внимание на другую, приятную ноту и делает вкус основы менее заметным. Поэтому при очень выраженной основе эффективнее сначала изменить баланс подсластителей и кислот, а при необходимости — саму основу, чем просто увеличивать дозировку ароматизатора.',
          },
          { h2: 'Выбор вкусового профиля' },
          {
            p: 'Профиль подбирают из направлений, которые «дружат» с собственной нотой основы. Сочетания, которые чаще всего используют на практике:',
          },
          {
            ul: [
              'Сывороточный протеин — шоколад, какао, ваниль, карамель, молочные и сливочные направления: молочная нота основы с ними естественно сочетается.',
              'Растительный белок — тёмные и обжаренные ноты (шоколад-фундук, какао, кофе) лучше перекрывают бобовый вкус.',
              'Витаминные и изотонические напитки — цитрус (например, грейпфрут), ягоды (облепиха, бузина, асаи), тропические фрукты; кислотный профиль делает металлическую ноту менее заметной.',
              'Травяные чаи и настои — ромашка, мелисса, шиповник, гибискус, зелёный и травяной чай.',
            ],
          },
          {
            p: 'В каталоге Gulf Flavours с областью «БАДы и спортпит» отмечены ароматизаторы облепихи, бузины, ягод асаи, грейпфрута, моркови, ромашки, мелиссы, гибискуса, шиповника, зелёного и травяного чая. Шоколадные, ванильные и карамельные направления — в группах «Шоколад и какао», «Молочные» и «Сладкие и десерты». Не смешивайте в одном продукте больше двух направлений: «клубника со сливками» работает хорошо, а третья нота размывает основной вкус.',
          },
          { h2: 'Форма: жидкий ароматизатор в сухой смеси' },
          {
            p: 'Большинство пищевых ароматизаторов в каталоге — жидкие. В порошковых продуктах (протеин, гейнер, аминокислотная смесь) с ними работают по нескольким правилам:',
          },
          {
            ul: [
              'Не вливайте жидкий ароматизатор сразу в большой объём смеси — сначала равномерно распределите его на небольшом количестве сухого носителя (мальтодекстрин, декстроза или часть порошковой основы рецептуры), затем внесите в основную массу.',
              'В больших партиях используют ступенчатое разведение: премикс смешивают сначала с небольшой частью смеси, затем с остальной — тогда вкус не отличается от упаковки к упаковке.',
              'После смешивания проверьте, нет ли в порошке комков и увлажнённых участков.',
              'Для прозрачных напитков выбирайте водорастворимый ароматизатор: жирорастворимая форма может дать мутность или плёнку на поверхности. Уточните растворимость в запросе и проверьте прозрачность в своём напитке.',
            ],
          },
          {
            p: 'Если для рецептуры нужна порошковая или инкапсулированная форма, укажите это в запросе цены — специалист ответит по доступным вариантам.',
          },
          { h2: 'Баланс с подсластителями и кислотами' },
          {
            p: 'Спортивное питание и БАД часто делают без сахара или с пониженным его содержанием, поэтому ароматизатор работает не с сахаром, а с сукралозой, стевией или другими подсластителями. Это заметно меняет вкус:',
          },
          {
            ul: [
              'Стевия даёт характерное послевкусие — с ней обычно лучше сочетаются фруктовые и ягодные профили.',
              'Уровень сладости «проявляет» или «прячет» ароматизатор: при недостатке сладости ваниль и карамель кажутся сухими, а фруктовые профили — кислыми.',
              'Лимонная или яблочная кислота делает фруктовые и цитрусовые ноты ярче, но не подходит шоколадным и молочным профилям.',
              'Мальтодекстрин и фруктоза добавляют вкусу «тело» и раскрывают ароматизатор мягче.',
            ],
          },
          {
            p: 'Поэтому всегда проверяйте ароматизатор с финальной системой подсластителей и кислот: результат теста в сладкой воде в готовом продукте не повторится.',
          },
          { h2: 'Как проверить дозировку' },
          {
            p: 'Рекомендуемый диапазон для каждого ароматизатора указан в карточке каталога — это отправная точка, точное количество определяет только испытание. Практический порядок:',
          },
          {
            ul: [
              'Начните с нижней границы диапазона из карточки и приготовьте 3 уровня на одной рецептуре (низкий, средний, высокий).',
              'Готовьте так, как это сделает потребитель: в воде и в молоке, в шейкере, в рекомендуемой порции.',
              'Оценивайте вкус сразу и спустя некоторое время — в белковых коктейлях нота со временем меняется.',
              'Проведите «слепую» дегустацию с несколькими людьми: пронумеруйте образцы, не называйте вкусы.',
              'Закройте контрольный образец выбранного варианта и сравните его повторно через несколько недель.',
            ],
          },
          {
            p: 'Записывайте результаты в таблицу: название и партия ароматизатора, дозировка, подсластитель, способ приготовления и оценки. Это экономит время на следующих партиях и при запуске новых вкусов.',
          },
          { h2: 'Хранение, маркировка и частые ошибки' },
          {
            p: 'Порошковые продукты хорошо впитывают влагу: увлажнённый порошок слёживается, а аромат уходит быстрее. Готовый продукт храните в плотно закрывающейся влагонепроницаемой упаковке. Сам ароматизатор — в плотно закрытой оригинальной таре, в прохладном сухом месте при +5…+25 °C, вдали от солнечных лучей; срок годности указан в карточке.',
          },
          {
            ul: [
              'Попытка перекрыть горькую основу увеличением дозировки ароматизатора — в итоге появляется химический привкус.',
              'Испытание ароматизатора с сахаром и последующий переход на подсластитель.',
              'Внесение жидкого ароматизатора напрямую в большую массу порошка — вкус распределяется по упаковкам неравномерно.',
              'Выбор жирорастворимого ароматизатора для прозрачного напитка.',
              'Обещания пользы для здоровья на этикетке в связи с ароматизатором: ароматизатор придаёт вкус и запах, но не полезные свойства.',
            ],
          },
          {
            p: 'Требования к регистрации и маркировке БАД и спортивного питания лежат на производителе готового продукта. По ароматизатору запросите спецификацию и копии документов на отметки в карточке (например, «Сертификат Халяль», «Без ГМО»).',
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Какой ароматизатор лучше для протеинового коктейля?',
                a: 'Для сывороточного протеина обычно хорошо работают шоколад, какао, ваниль, карамель и молочные направления — они сочетаются с молочной нотой основы. Для растительного белка тёмные обжаренные ноты (шоколад-фундук, какао, кофе) лучше перекрывают бобовый вкус. Окончательный выбор определяется испытанием на вашей рецептуре.',
              },
              {
                q: 'Можно ли добавлять жидкий ароматизатор в сухую смесь?',
                a: 'Да. Жидкий ароматизатор сначала равномерно распределяют на небольшом количестве сухого носителя (например, мальтодекстрина), затем ступенчато вносят в основную массу. После смешивания проверьте, нет ли комков и увлажнённых участков.',
              },
              {
                q: 'Какой должна быть дозировка ароматизатора?',
                a: 'Рекомендуемый диапазон указан в карточке каждого продукта. Начните с нижней границы, проверьте 2–3 уровня с финальным подсластителем и оценивайте продукт в том виде, в каком его приготовит потребитель.',
              },
              {
                q: 'Как получить образцы?',
                a: 'Добавьте до 8 позиций в бесплатный набор образцов на сайте и оставьте заявку. По объёмам и цене воспользуйтесь формой запроса цены.',
              },
            ],
          },
        ],
        links: [
          { path: '/industries/supplements', label: 'Ароматизаторы для БАД и спортивного питания' },
          { path: '/category/flavours/chocolate', label: 'Ароматизаторы «Шоколад и какао»' },
          { path: '/category/food-ingredients/sweetener', label: 'Подсластители' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'halol-aromatizator-tanlash',
    published: '2026-11-26',
    text: {
      uz: {
        title: 'Halol aromatizator: tanlash va hujjatlar',
        description:
          'Halol aromatizator tanlashda nimani tekshirish kerak: tarkib va erituvchi, spirt masalasi, sertifikat, spetsifikatsiya, partiya hujjatlari va ichki tartib.',
        intro:
          'Halol aromatizator tanlashda katalog kartochkasidagi belgi yaxshi boshlang‘ich nuqta, lekin ishlab chiqaruvchi uchun yetarli emas. Uchta narsani tekshirish kerak: aniq mahsulotga tegishli amaldagi halol sertifikati, aromatizator tarkibidagi tashuvchi (erituvchi) va yordamchi moddalarning kelib chiqishi hamda sertifikatni bergan tashkilotning sizning sertifikatlovchingiz va bozoringiz tomonidan tan olinishi. Gulf Flavours katalogida aromatizator va ingredient kartochkalarida “Halol sertifikati” va “Spirtsiz” belgilari ko‘rsatiladi, ularni katalog filtri orqali tanlash mumkin. Quyida xaridchi va texnolog uchun tekshiruv tartibi.',
        blocks: [
          { h2: 'Aromatizatorning halol holati nimaga bog‘liq' },
          {
            p: 'Aromatizator — bitta modda emas, murakkab aralashma. Uning tarkibida odatda quyidagilar bo‘ladi:',
          },
          {
            ul: [
              'Aromatik moddalar — ta’m va hidni beruvchi asosiy qism (tabiiy, tabiiyga o‘xshash yoki sintetik).',
              'Tashuvchi yoki erituvchi — suv, propilenglikol, triatsetin, glitserin, o‘simlik moyi yoki etil spirti.',
              'Yordamchi moddalar — emulgator, stabillashtirgich, ba’zan bo‘yoq yoki antioksidant.',
            ],
          },
          {
            p: 'Halol holati faqat ta’mga emas, barcha komponentlarga va ishlab chiqarish sharoitiga bog‘liq. Mahsulot nomi tarkibni bildirmaydi: “go‘sht” aromatizatori go‘shtsiz tayyorlanishi mumkin, “rom” aromatizatori esa spirtsiz bo‘lishi mumkin. Shuning uchun qaror nomga qarab emas, hujjatlarga qarab qabul qilinadi.',
          },
          { h2: 'Tarkibda nimalarga e’tibor berish kerak' },
          {
            p: 'Texnolog spetsifikatsiyani ko‘rib chiqayotganda quyidagi savollarga javob topishi kerak:',
          },
          {
            ul: [
              'Erituvchi qanday? Etil spirti bormi yoki tashuvchi suv, propilenglikol, glitserin yoki moymi?',
              'Hayvon kelib chiqishli komponentlar bormi — masalan, go‘sht yoki yog‘ asoslari, jelatin, ba’zi emulgatorlar? Glitserin kabi moddalar o‘simlik yoki hayvon manbasidan olinishi mumkin — manbani so‘rang.',
              'Hasharot kelib chiqishli bo‘yoqlar ishlatilganmi (masalan, karmin)?',
              'Fermentatsiya yo‘li bilan olingan komponentlar bo‘lsa, ozuqa muhiti qanday?',
              'Aromatizator boshqa mahsulotlar bilan umumiy liniyada ishlab chiqariladimi va aralashishning oldi qanday olinadi?',
            ],
          },
          {
            p: 'Bu savollarga javob spetsifikatsiya, ishlab chiqaruvchi deklaratsiyasi va sertifikatda bo‘lishi kerak. Javob noaniq bo‘lsa, yozma tasdiq so‘rang.',
          },
          {
            p: 'Xuddi shu yondashuv retseptdagi boshqa qo‘shimchalarga ham tegishli: emulgatorlar, glitserin, ba’zi bo‘yoqlar va oqsillar o‘simlik yoki hayvon manbasidan olinishi mumkin. Tayyor mahsulotning halol fayli to‘liq bo‘lishi uchun faqat aromatizatorni emas, har bir ingredientning manbasini bilish kerak.',
          },
          { h2: 'Hujjatlar: sertifikat, spetsifikatsiya, partiya' },
          {
            p: 'Halol aromatizator xaridida hujjatlar to‘plami mahsulotning o‘zidek muhim. Sertifikatni qabul qilishda tekshiring:',
          },
          {
            ul: [
              'Sertifikatni bergan tashkilot nomi va uning aloqa ma’lumotlari.',
              'Amal qilish muddati — sertifikat muddati tugamagan bo‘lishi kerak.',
              'Ishlab chiqaruvchi korxona nomi va ishlab chiqarish manzili.',
              'Mahsulot nomi yoki kodi (SKU) siz sotib olayotgan mahsulotga mos kelishi — umumiy “kompaniya sertifikati” va aniq mahsulot ro‘yxati farq qiladi.',
              'Mahsulot spetsifikatsiyasi: tarkib, erituvchi, saqlash sharti, yaroqlilik muddati.',
              'Har bir partiya uchun sifat sertifikati va partiya raqami.',
            ],
          },
          {
            p: 'Hujjat nusxalarini o‘z “halol papkangizda” saqlang va muddatlarni kuzatib boring: sertifikat yangilanganda yangi nusxani so‘rang.',
          },
          { h2: 'Sertifikatlovchi tashkilot tan olinishi' },
          {
            p: 'Agar tayyor mahsulotingiz halol sertifikatiga ega bo‘lsa yoki uni olmoqchi bo‘lsangiz, sizning sertifikatlovchi tashkilotingiz xomashyo sertifikatlarini qabul qilish bo‘yicha o‘z talablariga ega. Ba’zi tashkilotlar faqat ma’lum xorijiy sertifikatlovchilarni tan oladi, eksport bozorlarining ham o‘z talablari bor.',
          },
          {
            ul: [
              'Xariddan oldin aromatizator sertifikatining nusxasini o‘z sertifikatlovchingizga ko‘rsating.',
              'Eksportga mo‘ljallangan mahsulot uchun maqsadli bozor talablarini alohida aniqlang.',
              'Sertifikatlovchingiz qo‘shimcha hujjat (masalan, ishlab chiqaruvchi deklaratsiyasi) so‘rasa, uni yetkazib beruvchidan oldindan so‘rang.',
            ],
          },
          { h2: 'Spirt masalasi va mahsulot nomlari' },
          {
            p: 'Suyuq aromatizatorlarda etil spirti erituvchi sifatida keng ishlatiladi. Turli sertifikatlovchi tashkilotlar bu masalaga turlicha yondashadi: ba’zilari ma’lum shartlar bilan ruxsat beradi, boshqalari esa spirtsiz erituvchini talab qiladi. Bu bo‘yicha qarorni yetkazib beruvchi emas, sizning sertifikatlovchingiz yoki diniy mutaxassis beradi.',
          },
          {
            ul: [
              'Ikkilanish bo‘lsa — katalogdagi “Spirtsiz” belgili aromatizatorlarni tanlang va buni spetsifikatsiyada tasdiqlating.',
              'Nomi spirtli ichimlikni eslatuvchi ta’mlar (rom, konyak kabi) tarkibida spirt bo‘lmasa ham, ba’zi sertifikatlovchilar tayyor mahsulot nomi va yorlig‘iga alohida talab qo‘yishi mumkin — yangi mahsulot ishlab chiqishdan oldin aniqlang.',
              'Go‘shtli ta’mlar uchun go‘sht notasining manbasini (o‘simlik asosimi yoki hayvon komponentimi) spetsifikatsiyada so‘rang.',
            ],
          },
          {
            p: 'Spirtsiz aromatizatorga o‘tish ta’mni biroz o‘zgartirishi mumkin, chunki erituvchi aromatning ochilishiga ta’sir qiladi. Mavjud retseptda aromatizatorni almashtirsangiz, yangisini avvalgisi bilan yonma-yon sinang va dozirovkani kartochkadagi oraliq doirasida qayta tekshiring.',
          },
          { h2: 'O‘z ishlab chiqarishingizda halol talablari' },
          {
            p: 'Halol aromatizator sotib olish — ishning yarmi. Tayyor mahsulot halol bo‘lib qolishi uchun ichki tartib ham kerak:',
          },
          {
            ul: [
              'Halol va boshqa xomashyolarni alohida, aniq belgilangan joyda saqlang.',
              'Aromatizatorni belgisiz idishlarga quymang: original yorliq va partiya raqami saqlansin.',
              'Har bir ishlab chiqarish partiyasida qaysi aromatizator partiyasi ishlatilganini yozib boring — kuzatuvchanlik tekshiruvda birinchi so‘raladigan narsa.',
              'Uskunani yuvish tartibini hujjatlashtiring, ayniqsa liniyada turli mahsulotlar ishlab chiqarilsa.',
              'Xodimlarni halol talablari bo‘yicha o‘qiting va yangi xomashyo qabul qilishda hujjat tekshiruvini majburiy qiling.',
            ],
          },
          { h2: 'Xaridda amaliy tartib' },
          {
            p: 'Halol aromatizator xaridini besh qadamda tashkil qilish mumkin:',
          },
          {
            ul: [
              'Katalogda kerakli guruhni oching va “Halol sertifikati” (kerak bo‘lsa “Spirtsiz”) filtrini yoqing.',
              'Bepul namuna qutisiga 8 tagacha mahsulot qo‘shing va o‘z retseptingizda ta’m sinovini o‘tkazing.',
              'Tanlangan mahsulotlar uchun narx so‘rovida “halol sertifikati va spetsifikatsiya nusxasi kerak” deb yozing.',
              'Hujjatlarni o‘z sertifikatlovchingiz bilan kelishib oling.',
              'Birinchi partiya kelganda partiya raqami, yorliq va hujjatlarni solishtiring, nusxalarni arxivlang.',
            ],
          },
          {
            p: 'Ta’m sinovi va hujjat tekshiruvini parallel olib boring: ta’m bo‘yicha tanlangan aromatizator hujjatlar bo‘yicha mos kelmasa, uni almashtirishga to‘g‘ri keladi. Namuna bilan bir vaqtda hujjatlarni ham so‘rasangiz, ishlab chiqarishga o‘tish kechikmaydi.',
          },
          { h2: 'Ko‘p beriladigan savollar' },
          {
            faq: [
              {
                q: 'Kartochkadagi “Halol sertifikati” belgisi yetarlimi?',
                a: 'Belgi tanlov uchun qulay filtr, lekin ishlab chiqaruvchi uchun aniq mahsulotga tegishli amaldagi sertifikat nusxasi va spetsifikatsiya kerak. Ularni narx so‘rovida talab qiling va o‘z sertifikatlovchingiz bilan kelishib oling.',
              },
              {
                q: 'Tarkibida spirt bo‘lgan aromatizator halol bo‘ladimi?',
                a: 'Bu savolga sertifikatlovchi tashkilotlar turlicha javob beradi. Qaror sizning sertifikatlovchingiz yoki diniy mutaxassis tomonidan qabul qilinadi. Ikkilanish bo‘lsa, “Spirtsiz” belgili aromatizatorni tanlang va buni spetsifikatsiyada tasdiqlating.',
              },
              {
                q: '“Go‘sht” yoki “rom” aromatizatori tarkibida go‘sht yoki spirt bormi?',
                a: 'Mahsulot nomi tarkibni bildirmaydi: bunday ta’mlar go‘shtsiz va spirtsiz ham tayyorlanishi mumkin. Aniq tarkibni spetsifikatsiyadan bilib oling, yorliq va nom bo‘yicha talablarni sertifikatlovchingiz bilan aniqlang.',
              },
              {
                q: 'Sertifikat har bir partiya uchun alohida beriladimi?',
                a: 'Halol sertifikati odatda ishlab chiqaruvchi va mahsulotlar ro‘yxatiga ma’lum muddatga beriladi, har bir partiya esa o‘z partiya raqami va sifat hujjatiga ega. Ikkalasini ham saqlang va sertifikat muddatini kuzatib boring.',
              },
            ],
          },
        ],
        links: [
          { path: '/category/flavours', label: 'Oziq-ovqat aromatizatorlari katalogi' },
          { path: '/category/food-ingredients', label: 'Oziq-ovqat ingredientlari' },
          { path: '/category/essential-oils', label: 'Efir moylari' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Халяльный ароматизатор: что проверить',
        description:
          'Что проверить при выборе халяльного ароматизатора: состав и растворитель, вопрос спирта, сертификат и спецификация, документы на партию, производство.',
        intro:
          'Отметка в карточке каталога — хорошая отправная точка при выборе халяльного ароматизатора, но производителю её недостаточно. Нужно проверить три вещи: действующий сертификат халяль именно на этот продукт, происхождение носителя (растворителя) и вспомогательных веществ в составе ароматизатора, а также признание органа, выдавшего сертификат, вашим сертификатором и вашим рынком. В каталоге Gulf Flavours в карточках ароматизаторов и ингредиентов указываются отметки «Сертификат Халяль» и «Без спирта», по ним можно отфильтровать каталог. Ниже — порядок проверки для закупщика и технолога.',
        blocks: [
          { h2: 'От чего зависит халяльный статус ароматизатора' },
          {
            p: 'Ароматизатор — не одно вещество, а сложная смесь. Обычно в его состав входят:',
          },
          {
            ul: [
              'Ароматические вещества — основная часть, которая даёт вкус и запах (натуральные, идентичные натуральным или синтетические).',
              'Носитель или растворитель — вода, пропиленгликоль, триацетин, глицерин, растительное масло или этиловый спирт.',
              'Вспомогательные вещества — эмульгатор, стабилизатор, иногда краситель или антиоксидант.',
            ],
          },
          {
            p: 'Халяльный статус зависит не только от вкуса, а от всех компонентов и условий производства. Название продукта не говорит о составе: ароматизатор «мясо» может быть изготовлен без мяса, а ароматизатор «ром» — без спирта. Поэтому решение принимают не по названию, а по документам.',
          },
          { h2: 'На что смотреть в составе' },
          {
            p: 'Изучая спецификацию, технолог должен найти ответы на следующие вопросы:',
          },
          {
            ul: [
              'Какой растворитель? Есть ли этиловый спирт или носитель — вода, пропиленгликоль, глицерин, масло?',
              'Есть ли компоненты животного происхождения — например, мясные или жировые основы, желатин, некоторые эмульгаторы? Глицерин и подобные вещества бывают растительного или животного происхождения — уточните источник.',
              'Используются ли красители, полученные из насекомых (например, кармин)?',
              'Если есть компоненты, полученные ферментацией, — какая питательная среда?',
              'Производится ли ароматизатор на общей линии с другими продуктами и как исключается перекрёстный контакт?',
            ],
          },
          {
            p: 'Ответы должны быть в спецификации, декларации производителя и сертификате. Если ответ неоднозначен — запросите письменное подтверждение.',
          },
          {
            p: 'Тот же подход относится и к другим добавкам рецептуры: эмульгаторы, глицерин, некоторые красители и белки бывают растительного или животного происхождения. Чтобы халяльное досье готового продукта было полным, нужно знать источник каждого ингредиента, а не только ароматизатора.',
          },
          { h2: 'Документы: сертификат, спецификация, партия' },
          {
            p: 'При закупке халяльного ароматизатора пакет документов так же важен, как сам продукт. Принимая сертификат, проверьте:',
          },
          {
            ul: [
              'Название органа, выдавшего сертификат, и его контакты.',
              'Срок действия — сертификат не должен быть просрочен.',
              'Наименование предприятия-производителя и адрес производства.',
              'Соответствие названия или кода (SKU) продукта тому, что вы покупаете: общий «сертификат компании» и конкретный перечень продуктов — разные вещи.',
              'Спецификацию продукта: состав, растворитель, условия хранения, срок годности.',
              'Документ о качестве и номер партии для каждой поставки.',
            ],
          },
          {
            p: 'Храните копии документов в своей «халяльной папке» и отслеживайте сроки: при обновлении сертификата запрашивайте новую копию.',
          },
          { h2: 'Признание органа сертификации' },
          {
            p: 'Если ваш готовый продукт сертифицирован как халяль или вы планируете сертификацию, у вашего сертификатора есть собственные требования к сертификатам на сырьё. Некоторые органы признают только определённые зарубежные сертифицирующие организации, а у экспортных рынков свои требования.',
          },
          {
            ul: [
              'До закупки покажите копию сертификата на ароматизатор своему сертификатору.',
              'Для продукции на экспорт отдельно уточните требования целевого рынка.',
              'Если сертификатор запрашивает дополнительные документы (например, декларацию производителя), запросите их у поставщика заранее.',
            ],
          },
          { h2: 'Вопрос спирта и названия продуктов' },
          {
            p: 'В жидких ароматизаторах этиловый спирт широко используется как растворитель. Разные сертифицирующие организации подходят к этому по-разному: одни допускают его при определённых условиях, другие требуют растворитель без спирта. Решение здесь принимает не поставщик, а ваш сертификатор или религиозный специалист.',
          },
          {
            ul: [
              'При сомнениях выбирайте ароматизаторы с отметкой «Без спирта» в каталоге и подтверждайте это спецификацией.',
              'Вкусы, название которых напоминает алкогольные напитки (ром, коньяк и т. п.), даже без спирта в составе могут иметь отдельные требования сертификатора к названию и этикетке готового продукта — уточните до разработки нового продукта.',
              'Для мясных вкусов запросите в спецификации источник мясной ноты (растительная основа или компонент животного происхождения).',
            ],
          },
          {
            p: 'Переход на ароматизатор без спирта может немного изменить вкус, поскольку растворитель влияет на раскрытие аромата. Если заменяете ароматизатор в действующей рецептуре, сравните новый со старым параллельно и перепроверьте дозировку в пределах диапазона из карточки.',
          },
          { h2: 'Требования халяль на вашем производстве' },
          {
            p: 'Купить халяльный ароматизатор — половина дела. Чтобы готовый продукт остался халяльным, нужен и внутренний порядок:',
          },
          {
            ul: [
              'Храните халяльное и прочее сырьё раздельно, в чётко обозначенных местах.',
              'Не переливайте ароматизатор в немаркированную тару: оригинальная этикетка и номер партии должны сохраняться.',
              'Фиксируйте, какая партия ароматизатора использована в каждой производственной партии, — прослеживаемость проверяют в первую очередь.',
              'Документируйте порядок мойки оборудования, особенно если на линии выпускаются разные продукты.',
              'Обучите персонал требованиям халяль и сделайте проверку документов обязательной при приёмке нового сырья.',
            ],
          },
          { h2: 'Практический порядок закупки' },
          {
            p: 'Закупку халяльного ароматизатора можно организовать в пять шагов:',
          },
          {
            ul: [
              'Откройте нужную группу в каталоге и включите фильтр «Сертификат Халяль» (при необходимости — «Без спирта»).',
              'Добавьте до 8 позиций в бесплатный набор образцов и проведите вкусовые испытания на своей рецептуре.',
              'В запросе цены на выбранные позиции укажите: «нужны копии сертификата халяль и спецификации».',
              'Согласуйте документы со своим сертификатором.',
              'При поступлении первой партии сверьте номер партии, этикетку и документы, копии сохраните в архиве.',
            ],
          },
          {
            p: 'Ведите вкусовые испытания и проверку документов параллельно: если выбранный по вкусу ароматизатор не подойдёт по документам, его придётся менять. Запрашивая документы одновременно с образцами, вы не задерживаете запуск в производство.',
          },
          { h2: 'Частые вопросы' },
          {
            faq: [
              {
                q: 'Достаточно ли отметки «Сертификат Халяль» в карточке?',
                a: 'Отметка — удобный фильтр для выбора, но производителю нужны копия действующего сертификата на конкретный продукт и спецификация. Запросите их в запросе цены и согласуйте со своим сертификатором.',
              },
              {
                q: 'Может ли ароматизатор со спиртом быть халяльным?',
                a: 'Сертифицирующие организации отвечают на этот вопрос по-разному. Решение принимает ваш сертификатор или религиозный специалист. При сомнениях выбирайте ароматизатор с отметкой «Без спирта» и подтверждайте это спецификацией.',
              },
              {
                q: 'Есть ли мясо или спирт в ароматизаторах «мясо» или «ром»?',
                a: 'Название не говорит о составе: такие вкусы могут производиться без мяса и без спирта. Точный состав узнайте из спецификации, а требования к названию и этикетке уточните у своего сертификатора.',
              },
              {
                q: 'Выдаётся ли сертификат на каждую партию отдельно?',
                a: 'Сертификат халяль обычно выдаётся на производителя и перечень продуктов на определённый срок, а каждая партия имеет свой номер и документ о качестве. Храните и то и другое и следите за сроком действия сертификата.',
              },
            ],
          },
        ],
        links: [
          { path: '/category/flavours', label: 'Каталог пищевых ароматизаторов' },
          { path: '/category/food-ingredients', label: 'Пищевые ингредиенты' },
          { path: '/category/essential-oils', label: 'Эфирные масла' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },
];
