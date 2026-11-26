/**
 * BLOG / MAQOLALAR (SEO kontent markazi)
 * ----------------------------------------------------------------
 * Maqsad: "pishiriq uchun aromatizator", "vanilin va vanil", "ta'm va hid" kabi
 * qidiruv so'rovlariga javob beruvchi sahifalar (katalog sahifalari B2B va
 * shablonli — bunday so'rovlarga mos kelmaydi).
 *
 * Qoidalar:
 *  - Faqat UZ va RU (asosiy qidiruv tillari). EN uchun blog yo'q — dublikat
 *    "zaxira" sahifa YARATILMAYDI; hreflang faqat mavjud tillarga beriladi.
 *  - Matnda to'qilgan raqam/da'vo yo'q: faqat umumiy soha bilimi. Aniq
 *    dozirovka, sertifikat va narx — katalog kartochkasi / so'rov bo'yicha.
 *  - Yangi maqola: `ARTICLES` ga qo'shing, `published` — haqiqiy sana
 *    (sitemap `lastmod` shundan olinadi). Slug kichik harf, lotin, defis.
 *  - Apostroflar: `o‘`/`g‘` = U+2018, tutuq belgisi `’` = U+2019.
 */

import type { Locale } from './taxonomy';
import { ARTICLES_2026_11 } from './blog-articles-2026-11';
import { ARTICLES_2026_11_B } from './blog-articles-2026-11-b';
import { ARTICLES_2026_11_C } from './blog-articles-2026-11-c';
import { ARTICLES_2026_11_D } from './blog-articles-2026-11-d';
import { ARTICLES_2026_11_E } from './blog-articles-2026-11-e';
import { ARTICLES_2026_11_F } from './blog-articles-2026-11-f';
import { ARTICLES_2026_11_G } from './blog-articles-2026-11-g';
import { ARTICLES_2026_11_H } from './blog-articles-2026-11-h';
import { ARTICLES_2026_11_I } from './blog-articles-2026-11-i';

export const BLOG_LOCALES = ['uz', 'ru'] as const;
export type BlogLocale = (typeof BLOG_LOCALES)[number];

export interface BlogFaqItem {
  q: string;
  a: string;
}

/** `faq` — savol-javob bloki (sahifada FAQPage JSON-LD ham beriladi) */
export type BlogBlock = { h2: string } | { p: string } | { ul: string[] } | { faq: BlogFaqItem[] };

export interface BlogLink {
  /** `/uz`-siz yo'l: `/industries/bakery`, `/category/flavours` … */
  path: string;
  label: string;
}

export interface BlogText {
  title: string;
  /** meta description (≤ 155) */
  description: string;
  /** sahifa boshidagi qisqa kirish */
  intro: string;
  blocks: BlogBlock[];
  links: BlogLink[];
}

export interface BlogArticle {
  slug: string;
  /** YYYY-MM-DD — haqiqiy nashr sanasi */
  published: string;
  text: Record<BlogLocale, BlogText>;
}

export function hasBlog(locale: string): locale is BlogLocale {
  return (BLOG_LOCALES as readonly string[]).includes(locale);
}

const ARTICLES: BlogArticle[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'pishiriq-uchun-aromatizator-qanday-tanlanadi',
    published: '2026-11-18',
    text: {
      uz: {
        title: 'Pishiriq uchun aromatizator: qanday tanlash',
        description:
          'Pishiriq uchun aromatizator tanlashda nimaga e’tibor berish kerak: issiqqa chidamlilik, shakl, dozirovka va ta’m profili. Sinov uchun namuna olish yo‘li.',
        intro:
          'Xamir pishganda ta’m va hid o‘zgaradi: ba’zi aromatizatorlar pechdan chiqqach deyarli sezilmay qoladi. Quyida pishiriq uchun aromatizator tanlashda e’tibor beriladigan asosiy to‘rt narsa.',
        blocks: [
          { h2: '1. Issiqqa chidamlilik' },
          {
            p: 'Pishirish paytida aromatizatorning uchuvchan komponentlari bug‘lanib ketadi. Shuning uchun ishlab chiqaruvchi pishiriq yoki issiqlik bilan ishlov berish uchun mo‘ljallagan turlarni tanlang. Odatda suv-spirtli suyuq aromatizatorlar tez uchib ketadi, moy asosidagi, emulsiya yoki kapsulalangan (quruq) shakllar esa barqarorroq bo‘ladi. Aniq natijani o‘z retseptingizda sinab ko‘rish kerak.',
          },
          { h2: '2. Shakl: suyuq, emulsiya, pasta yoki kukun' },
          {
            ul: [
              'Suyuq: krem, glazur va sovuq massalar uchun qulay.',
              'Emulsiya va pasta: xamir va bisquit kabi issiqda pishadigan massalar uchun.',
              'Kukun: quruq aralashmalar (premiks), un va shakar asosidagi aralashmalar uchun.',
            ],
          },
          { h2: '3. Dozirovka' },
          {
            p: 'Eng ko‘p uchraydigan xato — ortiqcha miqdor. Ko‘p aromatizator kimyoviy yoki achchiq ta’m qoldiradi. Katalogdagi har bir mahsulot kartochkasida tavsiya etilgan dozirovka oralig‘i ko‘rsatilgan. Past chegaradan boshlang va bir xil retseptda 2–3 xil miqdorni solishtiring.',
          },
          { h2: '4. Ta’m profili' },
          {
            p: 'Vanil, sut-sariyog‘, shokolad, mevali va yong‘oqli yo‘nalishlar pishiriqda eng ko‘p ishlatiladi. Bir mahsulotda 2 ta yo‘nalishdan ortiq aralashtirmang: aks holda asosiy ta’m yo‘qoladi. Tayyor mahsulotni ishlab chiqarishdan oldin kichik partiyada sinab ko‘ring.',
          },
          { h2: 'Namuna bilan sinab ko‘ring' },
          {
            p: 'To‘g‘ri tanlovning yagona ishonchli yo‘li — o‘z retseptingizda sinov. Bepul namuna qutisida bir nechta aromatizatorni solishtirib ko‘rishingiz mumkin.',
          },
        ],
        links: [
          { path: '/industries/bakery', label: 'Nonvoyxona va pishiriq uchun aromatizatorlar' },
          { path: '/category/flavours', label: 'Oziq-ovqat aromatizatorlari katalogi' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
        ],
      },
      ru: {
        title: 'Ароматизатор для выпечки: как выбрать',
        description:
          'Как выбрать ароматизатор для выпечки: термостойкость, форма, дозировка и вкусовой профиль. Как проверить ароматизатор на своей рецептуре с образцом.',
        intro:
          'При выпечке вкус и аромат меняются: часть ароматизаторов после печи почти не ощущается. Ниже — четыре главных критерия выбора ароматизатора для выпечки.',
        blocks: [
          { h2: '1. Термостойкость' },
          {
            p: 'При выпечке летучие компоненты ароматизатора испаряются. Поэтому выбирайте позиции, которые производитель рекомендует для выпечки или термообработки. Обычно водно-спиртовые жидкие ароматизаторы улетучиваются быстрее, а масляные, эмульсионные или инкапсулированные (сухие) формы стабильнее. Точный результат нужно проверять на собственной рецептуре.',
          },
          { h2: '2. Форма: жидкость, эмульсия, паста или порошок' },
          {
            ul: [
              'Жидкие: удобны для кремов, глазурей и холодных масс.',
              'Эмульсии и пасты: для теста и бисквита, которые запекаются.',
              'Порошки: для сухих смесей (премиксов), муки и сахарных смесей.',
            ],
          },
          { h2: '3. Дозировка' },
          {
            p: 'Самая частая ошибка — избыток. Много ароматизатора оставляет химический или горький привкус. В карточке каждого продукта каталога указан рекомендуемый диапазон дозировки. Начните с нижней границы и сравните 2–3 уровня на одной рецептуре.',
          },
          { h2: '4. Вкусовой профиль' },
          {
            p: 'В выпечке чаще всего используют ваниль, сливочно-молочные, шоколадные, фруктовые и ореховые направления. Не смешивайте в одном изделии больше двух направлений: основной вкус теряется. Перед запуском в производство проверьте изделие на небольшой партии.',
          },
          { h2: 'Проверьте на образцах' },
          {
            p: 'Единственный надёжный способ выбора — тест на вашей рецептуре. В бесплатном наборе образцов можно сравнить несколько ароматизаторов.',
          },
        ],
        links: [
          { path: '/industries/bakery', label: 'Ароматизаторы для хлебобулочных изделий и выпечки' },
          { path: '/category/flavours', label: 'Каталог пищевых ароматизаторов' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'vanilin-va-vanil-ekstrakti-farqi',
    published: '2026-11-18',
    text: {
      uz: {
        title: 'Vanilin va vanil ekstrakti: farqi nimada',
        description:
          'Vanilin va vanil ekstrakti o‘rtasidagi farq, qaysi biri pishiriq, krem va muzqaymoq uchun mos kelishi hamda ularni o‘z retseptingizda qanday solishtirish.',
        intro:
          'Ikkalasi ham vanil ta’mini beradi, lekin kelib chiqishi, narxi va ta’mning chuqurligi farq qiladi. Qaysi biri sizning mahsulotingizga mos kelishini birga ko‘rib chiqamiz.',
        blocks: [
          { h2: 'Vanil ekstrakti nima' },
          {
            p: 'Vanil ekstrakti vanil loviyasidan olinadi va yuzlab hid komponentlarini o‘z ichiga oladi. Shuning uchun ta’mi murakkab va chuqur bo‘ladi. Tabiiy vanil xomashyosi qimmat, narxi esa yillar bo‘yicha o‘zgarib turadi.',
          },
          { h2: 'Vanilin nima' },
          {
            p: 'Vanilin — vanil ta’mining asosiy molekulasi. Uni vanil loviyasidan ham, kimyoviy sintez yo‘li bilan ham olish mumkin. Sintetik vanilin arzon, barqaror va dozalashga qulay, lekin ta’mi ekstraktga qaraganda sodda bo‘ladi.',
          },
          { h2: 'Qaysi birini tanlash kerak' },
          {
            ul: [
              'Ommabop pishiriq, bisquit, vafli: odatda vanilin yoki vanilli aromatizator iqtisodiy jihatdan qulay.',
              'Premium desert, krem, muzqaymoq: ekstrakt yoki tabiiy vanil aromatizatori chuqurroq ta’m beradi.',
              'Aralash yondashuv: ba’zan vanilin va tabiiy komponent birga ishlatiladi.',
            ],
          },
          { h2: 'Etiketkada nimaga qarash kerak' },
          {
            p: 'Yorliqdagi "tabiiy aromatizator", "tabiatga o‘xshash" va "sun’iy" ifodalari turli tasnifni bildiradi. Ularning farqi haqida alohida maqolada yozganmiz. Tasnif talablari mamlakatga qarab farq qiladi, shuning uchun yetkazib beruvchidan tegishli hujjat so‘rang.',
          },
          { h2: 'O‘z retseptingizda solishtiring' },
          {
            p: 'Bir xil retseptda uch variantni tayyorlang: vanilin, vanilli aromatizator va ekstrakt. Ularni bir xil sharoitda pishirib, ko‘r-ko‘rona tatib ko‘ring. Natijaga qarab narx va ta’m o‘rtasidagi muvozanatni tanlang.',
          },
        ],
        links: [
          { path: '/category/flavours', label: 'Oziq-ovqat aromatizatorlari katalogi' },
          { path: '/industries/confectionery', label: 'Konditer mahsulotlari uchun aromatizatorlar' },
          { path: '/samples', label: 'Bepul namuna qutisi' },
        ],
      },
      ru: {
        title: 'Ванилин и ванильный экстракт: разница',
        description:
          'Чем ванилин отличается от ванильного экстракта, что лучше подходит для выпечки, кремов и мороженого и как сравнить их на собственной рецептуре.',
        intro:
          'Оба дают ванильный вкус, но различаются происхождением, ценой и глубиной вкуса. Разберём, что подойдёт вашему продукту.',
        blocks: [
          { h2: 'Что такое ванильный экстракт' },
          {
            p: 'Ванильный экстракт получают из стручков ванили, он содержит сотни ароматических компонентов, поэтому вкус сложный и глубокий. Натуральное ванильное сырьё дорогое, а его цена заметно меняется по годам.',
          },
          { h2: 'Что такое ванилин' },
          {
            p: 'Ванилин — основная молекула ванильного вкуса. Его можно получать как из стручков ванили, так и химическим синтезом. Синтетический ванилин недорог, стабилен и удобен в дозировании, но вкус проще, чем у экстракта.',
          },
          { h2: 'Что выбрать' },
          {
            ul: [
              'Массовая выпечка, бисквит, вафли: обычно экономически удобен ванилин или ванильный ароматизатор.',
              'Премиальные десерты, кремы, мороженое: экстракт или натуральный ванильный ароматизатор даёт более глубокий вкус.',
              'Комбинированный подход: иногда используют ванилин вместе с натуральным компонентом.',
            ],
          },
          { h2: 'На что смотреть в маркировке' },
          {
            p: 'Формулировки «натуральный ароматизатор», «идентичный натуральному» и «искусственный» означают разные классы. Их различиям посвящена отдельная статья. Требования к классификации отличаются по странам, поэтому запросите у поставщика подтверждающие документы.',
          },
          { h2: 'Сравните на своей рецептуре' },
          {
            p: 'Приготовьте на одной рецептуре три варианта: ванилин, ванильный ароматизатор и экстракт. Выпеките в одинаковых условиях и проведите слепую дегустацию. По результату выберите баланс между ценой и вкусом.',
          },
        ],
        links: [
          { path: '/category/flavours', label: 'Каталог пищевых ароматизаторов' },
          { path: '/industries/confectionery', label: 'Ароматизаторы для кондитерских изделий' },
          { path: '/samples', label: 'Бесплатный набор образцов' },
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: 'aromatizator-turlari-tabiiy-va-sun-iy',
    published: '2026-11-18',
    text: {
      uz: {
        title: 'Aromatizator turlari: tabiiy va sun’iy',
        description:
          'Oziq-ovqat aromatizatorlarining turlari: tabiiy, tabiatga o‘xshash va sun’iy. Shakllari (suyuq, emulsiya, kukun) va qaysi mahsulot uchun qaysi biri mos.',
        intro:
          'Aromatizator yorlig‘ida turli ifodalar uchraydi. Ularning ma’nosini bilish to‘g‘ri xomashyo tanlash va mahsulot yorlig‘ini to‘g‘ri yozish uchun kerak.',
        blocks: [
          { h2: 'Kelib chiqishi bo‘yicha turlari' },
          {
            ul: [
              'Tabiiy: o‘simlik, hayvon yoki mikroorganizm manbasidan fizik yoki fermentativ usullar bilan olinadi.',
              'Tabiatga o‘xshash: kimyoviy sintez bilan olinadi, lekin molekulasi tabiatda uchraydigan bilan bir xil.',
              'Sun’iy: tabiatda uchramaydigan molekulalardan iborat.',
            ],
          },
          {
            p: 'Bu tasnifning rasmiy ta’riflari va yorliqqa qo‘yiladigan talablar mamlakat va me’yoriy hujjatga qarab farq qiladi. Aniq talablar uchun ishlab chiqaruvchi hujjatlarini so‘rang va amaldagi me’yorlar bilan solishtiring.',
          },
          { h2: 'Shakli bo‘yicha turlari' },
          {
            ul: [
              'Suyuq: ichimlik, krem va sovuq massalar uchun qulay.',
              'Emulsiya va pasta: issiqda pishadigan mahsulotlarda barqarorroq bo‘lishi mumkin.',
              'Kukun: quruq aralashmalar va premikslar uchun.',
            ],
          },
          { h2: 'Qaysi sohada nima ishlatiladi' },
          {
            p: 'Nonvoyxona va qandolatda issiqqa chidamli shakllar, sut mahsulotlari va muzqaymoqda sut-qaymoq yo‘nalishlari, ichimliklarda suvda yaxshi eriydigan turlar tanlanadi. Aniq tanlov mahsulot texnologiyasiga bog‘liq.',
          },
          { h2: 'Tanlashdan oldin' },
          {
            p: 'Retseptura, qo‘llanish usuli va yorliq talablarini yozib oling. Shu asosda bir nechta namunani solishtiring, so‘ng eng mosini tanlang.',
          },
        ],
        links: [
          { path: '/category/flavours', label: 'Oziq-ovqat aromatizatorlari katalogi' },
          { path: '/industries', label: 'Qo‘llanish sohalari' },
          { path: '/quote', label: 'Narx so‘rash' },
        ],
      },
      ru: {
        title: 'Виды пищевых ароматизаторов',
        description:
          'Виды пищевых ароматизаторов: натуральные, идентичные натуральным и искусственные. Формы (жидкие, эмульсии, порошки) и что подходит для какого продукта.',
        intro:
          'На этикетках ароматизаторов встречаются разные формулировки. Понимать их нужно для правильного выбора сырья и корректной маркировки вашего продукта.',
        blocks: [
          { h2: 'Виды по происхождению' },
          {
            ul: [
              'Натуральные: получают из растительного, животного или микробного источника физическими или ферментативными методами.',
              'Идентичные натуральным: получены химическим синтезом, но молекулы совпадают с существующими в природе.',
              'Искусственные: состоят из молекул, которых нет в природе.',
            ],
          },
          {
            p: 'Официальные определения и требования к маркировке зависят от страны и нормативного документа. Для точных требований запросите документы производителя и сверьтесь с действующими нормами.',
          },
          { h2: 'Виды по форме' },
          {
            ul: [
              'Жидкие: удобны для напитков, кремов и холодных масс.',
              'Эмульсии и пасты: могут быть стабильнее в изделиях, запекаемых при нагреве.',
              'Порошки: для сухих смесей и премиксов.',
            ],
          },
          { h2: 'Что где применяют' },
          {
            p: 'В хлебопечении и кондитерском деле выбирают термостойкие формы, в молочной продукции и мороженом — сливочно-молочные направления, в напитках — хорошо растворимые в воде виды. Точный выбор зависит от технологии продукта.',
          },
          { h2: 'Перед выбором' },
          {
            p: 'Запишите рецептуру, способ применения и требования к маркировке. На этой основе сравните несколько образцов и выберите наиболее подходящий.',
          },
        ],
        links: [
          { path: '/category/flavours', label: 'Каталог пищевых ароматизаторов' },
          { path: '/industries', label: 'Отрасли применения' },
          { path: '/quote', label: 'Запросить цену' },
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: 'tam-va-hid-aromatizator-va-atir-farqi',
    published: '2026-11-18',
    text: {
      uz: {
        title: 'Ta’m va hid: aromatizator va atir farqi',
        description:
          'Oziq-ovqat aromatizatori va atir kompozitsiyasi (hid) o‘rtasidagi farq: qayerda qo‘llanadi, nega ularni almashtirib bo‘lmaydi va qaysi birini tanlash kerak.',
        intro:
          '"Aromatizator" so‘zi ikki xil mahsulotni bildirishi mumkin: ovqatga ta’m beruvchi va buyum yoki xonaga hid beruvchi. Ular bir-biriga mos kelmaydi.',
        blocks: [
          { h2: 'Oziq-ovqat aromatizatori (ta’m)' },
          {
            p: 'Ovqatga ta’m va hid beradi: pishiriq, qandolat, sut mahsulotlari, ichimlik. Bunday aromatizator oziq-ovqat xavfsizligi talablariga muvofiq tayyorlangan bo‘lishi kerak. Uni tanlashda issiqqa chidamlilik, shakl va dozirovka muhim.',
          },
          { h2: 'Atir kompozitsiyasi (hid)' },
          {
            p: 'Atir kompozitsiyasi parfyumeriya, maishiy kimyo, sovun, shamlar va xona hidlari uchun ishlatiladi. U iste’mol qilish uchun mo‘ljallanmagan. Atir kompozitsiyasini ovqatga qo‘shish mumkin emas.',
          },
          { h2: 'Qanday adashmaslik kerak' },
          {
            ul: [
              'Ovqat yoki ichimlik uchun faqat oziq-ovqat aromatizatorini oling.',
              'Sovun, shamlar, xona hidi va parfyumeriya uchun atir kompozitsiyasini oling.',
              'Yetkazib beruvchidan mahsulotning aynan qaysi maqsadga mo‘ljallanganini yozma ravishda so‘rang.',
            ],
          },
          { h2: 'Efir moylari va aroma kimyosi' },
          {
            p: 'Efir moylari va aroma kimyoviy moddalari ikkala sohada ham xomashyo sifatida ishlatilishi mumkin, lekin har bir aniq mahsulot uchun qo‘llanish sohasi alohida belgilanadi. Ishlatishdan oldin mahsulot hujjatlarini tekshiring.',
          },
        ],
        links: [
          { path: '/category/flavours', label: 'Oziq-ovqat aromatizatorlari' },
          { path: '/category/fragrances', label: 'Atir kompozitsiyalari' },
          { path: '/contact', label: 'Mutaxassis bilan bog‘lanish' },
        ],
      },
      ru: {
        title: 'Вкус и запах: ароматизатор и отдушка',
        description:
          'Чем пищевой ароматизатор отличается от парфюмерной композиции (отдушки): где применяют, почему их нельзя заменять друг другом и что выбрать.',
        intro:
          'Слово «ароматизатор» может означать два разных продукта: придающий вкус пище и придающий запах изделию или помещению. Они не взаимозаменяемы.',
        blocks: [
          { h2: 'Пищевой ароматизатор (вкус)' },
          {
            p: 'Придаёт вкус и аромат пище: выпечке, кондитерским изделиям, молочным продуктам, напиткам. Такой ароматизатор должен быть изготовлен с соблюдением требований пищевой безопасности. При выборе важны термостойкость, форма и дозировка.',
          },
          { h2: 'Парфюмерная композиция (запах)' },
          {
            p: 'Парфюмерная композиция применяется в парфюмерии, бытовой химии, мыле, свечах и ароматизации помещений. Она не предназначена для употребления в пищу. Добавлять её в еду нельзя.',
          },
          { h2: 'Как не ошибиться' },
          {
            ul: [
              'Для еды и напитков берите только пищевой ароматизатор.',
              'Для мыла, свечей, ароматов для дома и парфюмерии берите парфюмерную композицию.',
              'Запросите у поставщика письменное подтверждение назначения конкретного продукта.',
            ],
          },
          { h2: 'Эфирные масла и аромахимия' },
          {
            p: 'Эфирные масла и ароматические вещества могут использоваться как сырьё в обеих областях, но область применения определяется для каждого конкретного продукта отдельно. Перед использованием проверьте документацию на продукт.',
          },
        ],
        links: [
          { path: '/category/flavours', label: 'Пищевые ароматизаторы' },
          { path: '/category/fragrances', label: 'Парфюмерные композиции' },
          { path: '/contact', label: 'Связаться со специалистом' },
        ],
      },
    },
  },

  /* 2026-noyabr — alohida fayl (blog-articles-2026-11.ts) */
  ...ARTICLES_2026_11,
  ...ARTICLES_2026_11_B,
  ...ARTICLES_2026_11_C,
  ...ARTICLES_2026_11_D,
  ...ARTICLES_2026_11_E,
  ...ARTICLES_2026_11_F,
  ...ARTICLES_2026_11_G,
  ...ARTICLES_2026_11_H,
  ...ARTICLES_2026_11_I,
];

export function blogArticles(locale: string): BlogArticle[] {
  return hasBlog(locale) ? ARTICLES : [];
}

export function getArticle(slug: string, locale: string): BlogArticle | undefined {
  return hasBlog(locale) ? ARTICLES.find((a) => a.slug === slug) : undefined;
}

export function allBlogSlugs(): string[] {
  return ARTICLES.map((a) => a.slug);
}

/**
 * Berilgan sahifaga (soha / kategoriya / guruh) havola beradigan maqolalar —
 * teskari ichki havola: maqola → sahifa bor, endi sahifa → maqola ham.
 * `prefix` — `/category/flavours` uchun `/category/flavours/<guruh>` ga
 * havola beruvchilar ham olinadi. Avval aniq mos, keyin yangilari.
 */
export function articlesLinkingTo(
  path: string,
  locale: string,
  { prefix = false, limit = 3 }: { prefix?: boolean; limit?: number } = {},
): BlogArticle[] {
  if (!hasBlog(locale)) return [];
  const score = (a: BlogArticle): number => {
    const paths = a.text[locale].links.map((l) => l.path);
    if (paths.includes(path)) return 2;
    if (prefix && paths.some((x) => x.startsWith(`${path}/`))) return 1;
    return 0;
  };
  return ARTICLES.map((a) => ({ a, s: score(a) }))
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s || y.a.published.localeCompare(x.a.published))
    .slice(0, limit)
    .map((x) => x.a);
}

/** Maqoladagi barcha FAQ savol-javoblari (FAQPage JSON-LD uchun) */
export function blogFaq(text: BlogText): BlogFaqItem[] {
  return text.blocks.flatMap((b) => ('faq' in b ? b.faq : []));
}

export function blogText(article: BlogArticle, locale: Locale): BlogText {
  return article.text[hasBlog(locale) ? locale : 'uz'];
}
