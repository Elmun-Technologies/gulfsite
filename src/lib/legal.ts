/**
 * HUQUQIY MATNLAR (Privacy / Terms)
 * ----------------------------------------------------------------
 * Nega alohida modul:
 *   - /privacy va /terms sahifalari bir xil tuzilmani ishlatadi;
 *   - cookie banner va formadagi "rozilik" havolalari shu bo'limlarga
 *     ankor bilan (masalan /privacy#rozilik) yo'naltiradi;
 *   - matnlar uch tilda, shuning uchun ular komponentdan ajratilgan.
 *
 * Asos: O'zbekiston Respublikasining "Shaxsiy ma'lumotlar to'g'risida"gi
 * qonuni (ZRU-547, 02.07.2019) va Fuqarolik kodeksi.
 */

import type { Trilingual } from './taxonomy';
import { siteConfig } from './config';

export interface LegalSection {
  /** Ankor (URL fragment) — tilga bog'liq emas, barqaror */
  id: string;
  title: Trilingual;
  /** Paragraflar */
  body: Trilingual[];
  /** Ixtiyoriy ro'yxat */
  list?: Trilingual[];
  /** Ixtiyoriy jadval ko'rinishidagi qisqa bandlar (label → value) */
  pairs?: { label: Trilingual; value: Trilingual }[];
}

export interface LegalDoc {
  key: 'privacy' | 'terms';
  updated: string;
  intro: Trilingual;
  sections: LegalSection[];
}

/**
 * Yuridik shaxs nomi. `siteConfig.company` maydoni mavjud emas —
 * shuning uchun nom brand.distributor dan yig'iladi (uch tilda).
 */
const COMPANY = {
  nameUz: `${siteConfig.brand.distributor} MChJ`,
  nameRu: `ООО «${siteConfig.brand.distributor}»`,
  nameEn: `${siteConfig.brand.distributor} LLC`,
} as const;

/* ============================================================
   MAXFIYLİK SIYOSATI
   ============================================================ */

export const PRIVACY: LegalDoc = {
  key: 'privacy',
  updated: '2026-01-15',
  intro: {
    uz: `Ushbu maxfiylik siyosati ${COMPANY.nameUz} ("Operator") tomonidan ushbu veb-sayt orqali yig'iladigan shaxsiy va biznes ma'lumotlarni qanday qayta ishlashini tushuntiradi. Saytdan foydalanish yoki ariza (zayvka) yuborish siz ushbu shartlarga roziligingizni bildiradi.`,
    ru: `Настоящая политика конфиденциальности объясняет, как ${COMPANY.nameRu} («Оператор») обрабатывает персональные и деловые данные, собираемые через данный сайт. Использование сайта или отправка заявки означает ваше согласие с этими условиями.`,
    en: `This privacy policy explains how ${COMPANY.nameEn} ("the Operator") processes personal and business data collected through this website. Using the site or submitting a request indicates your acceptance of these terms.`,
  },
  sections: [
    {
      id: 'operator',
      title: { uz: '1. Operator va aloqa', ru: '1. Оператор и контакты', en: '1. Operator and contacts' },
      body: [
        {
          uz: `Shaxsiy ma'lumotlarni qayta ishlovchi operator: ${COMPANY.nameUz}. Manzil: ${siteConfig.contact.address}. Aloqa: ${siteConfig.contact.salesEmail}, ${siteConfig.contact.phonePrimary}.`,
          ru: `Оператор обработки персональных данных: ${COMPANY.nameRu}. Адрес: ${siteConfig.contact.addressRu}. Связь: ${siteConfig.contact.salesEmail}, ${siteConfig.contact.phonePrimary}.`,
          en: `Data controller: ${COMPANY.nameEn}. Address: ${siteConfig.contact.addressEn}. Contact: ${siteConfig.contact.salesEmail}, ${siteConfig.contact.phonePrimary}.`,
        },
      ],
      pairs: [
        {
          label: { uz: 'Mas\'ul shaxs', ru: 'Ответственное лицо', en: 'Responsible person' },
          value: { uz: 'Bosh direktor', ru: 'Генеральный директор', en: 'General Director' },
        },
        {
          label: { uz: 'So\'rovlar uchun', ru: 'Для запросов', en: 'For requests' },
          value: { uz: siteConfig.contact.salesEmail, ru: siteConfig.contact.salesEmail, en: siteConfig.contact.salesEmail },
        },
      ],
    },
    {
      id: 'data',
      title: { uz: '2. Qanday ma\'lumotlar yig\'iladi', ru: '2. Какие данные собираются', en: '2. What data is collected' },
      body: [
        {
          uz: 'Biz faqat siz o\'zingiz taqdim etgan ma\'lumotlarni va texnik zarurat tufayli avtomatik yig\'iladigan minimal ma\'lumotlarni qayta ishlaymiz.',
          ru: 'Мы обрабатываем только данные, которые вы предоставили сами, и минимальный объём информации, собираемой автоматически по технической необходимости.',
          en: 'We process only the data you provide yourself and a minimal amount collected automatically out of technical necessity.',
        },
      ],
      list: [
        {
          uz: 'Aloqa ma\'lumotlari: ism-familiya, lavozim, telefon raqami, e-pochta, Telegram.',
          ru: 'Контактные данные: ФИО, должность, телефон, e-mail, Telegram.',
          en: 'Contact details: full name, position, phone number, e-mail, Telegram.',
        },
        {
          uz: 'Kompaniya ma\'lumotlari: nomi, STIR/INN, faoliyat turi, hudud, veb-sayt.',
          ru: 'Данные компании: название, ИНН, вид деятельности, регион, сайт.',
          en: 'Company data: name, tax ID (INN), business type, region, website.',
        },
        {
          uz: 'So\'rov mazmuni: qiziqtirgan mahsulotlar, hajm, chastota, izoh, SKU ro\'yxati (test box).',
          ru: 'Содержание запроса: интересующие продукты, объём, периодичность, комментарий, список SKU (тест-бокс).',
          en: 'Request content: products of interest, volume, frequency, notes, SKU list (sample box).',
        },
        {
          uz: 'Texnik ma\'lumotlar: IP-manzil, brauzer va qurilma turi, UTM belgilari, so\'rov vaqti.',
          ru: 'Технические данные: IP-адрес, тип браузера и устройства, UTM-метки, время запроса.',
          en: 'Technical data: IP address, browser and device type, UTM tags, request timestamp.',
        },
      ],
    },
    {
      id: 'purpose',
      title: { uz: '3. Maqsad va huquqiy asos', ru: '3. Цели и правовое основание', en: '3. Purposes and legal basis' },
      body: [
        {
          uz: 'Ma\'lumotlar faqat quyidagi maqsadlarda ishlatiladi:',
          ru: 'Данные используются исключительно в следующих целях:',
          en: 'Data is used solely for the following purposes:',
        },
      ],
      list: [
        {
          uz: 'Arizangizga javob berish, tijorat taklifi tayyorlash va bog\'lanish (rozilik asosida).',
          ru: 'Ответ на заявку, подготовка коммерческого предложения и связь с вами (на основании согласия).',
          en: 'Responding to your request, preparing a quotation and contacting you (based on consent).',
        },
        {
          uz: 'Shartnoma tuzish va bajarish: hisob-faktura, yetkazib berish, hujjatlar (shartnoma asosida).',
          ru: 'Заключение и исполнение договора: счета, доставка, документы (на основании договора).',
          en: 'Concluding and performing a contract: invoices, delivery, documents (based on the contract).',
        },
        {
          uz: 'Namuna (test box) yetkazib berishni tashkil etish.',
          ru: 'Организация доставки образцов (тест-бокса).',
          en: 'Arranging delivery of samples (test boxes).',
        },
        {
          uz: 'Qonunchilik talablarini bajarish (soliq, buxgalteriya, arxiv) — qonuniy majburiyat asosida.',
          ru: 'Исполнение требований законодательства (налоги, бухгалтерия, архив) — на основании законной обязанности.',
          en: 'Meeting legal requirements (tax, accounting, archiving) — based on a legal obligation.',
        },
        {
          uz: 'Sayt xavfsizligi va spamdan himoya (cheklangan miqdorda IP va so\'rov tahlili).',
          ru: 'Безопасность сайта и защита от спама (ограниченный анализ IP и запросов).',
          en: 'Site security and spam protection (limited analysis of IPs and requests).',
        },
      ],
    },
    {
      id: 'consent',
      title: { uz: '4. Rozilik va uni qaytarib olish', ru: '4. Согласие и его отзыв', en: '4. Consent and withdrawal' },
      body: [
        {
          uz: 'Formani yuborishdan oldin siz shaxsiy ma\'lumotlaringizni qayta ishlashga rozilik bildirasiz. Rozilik ixtiyoriy, lekin u berilmasa biz arizangizga javob bera olmaymiz.',
          ru: 'Перед отправкой формы вы даёте согласие на обработку персональных данных. Согласие добровольно, но без него мы не сможем ответить на заявку.',
          en: 'Before submitting the form you consent to the processing of your personal data. Consent is voluntary, but without it we cannot respond to your request.',
        },
        {
          uz: `Rozilikni istalgan vaqtda qaytarib olishingiz mumkin: ${siteConfig.contact.salesEmail} ga "rozilikni qaytarib olish" mavzusida xat yuboring yoki ${siteConfig.contact.phonePrimary} raqamiga qo'ng'iroq qiling. So'rov 15 ish kuni ichida bajariladi.`,
          ru: `Вы можете отозвать согласие в любое время: напишите на ${siteConfig.contact.salesEmail} с темой «отзыв согласия» или позвоните ${siteConfig.contact.phonePrimary}. Запрос исполняется в течение 15 рабочих дней.`,
          en: `You may withdraw consent at any time: e-mail ${siteConfig.contact.salesEmail} with the subject "consent withdrawal" or call ${siteConfig.contact.phonePrimary}. Requests are fulfilled within 15 business days.`,
        },
        {
          uz: 'Rozilik qaytarib olingani shartnoma yoki qonun talabi asosida saqlanadigan ma\'lumotlarga (masalan, hisob-fakturalar) ta\'sir qilmaydi.',
          ru: 'Отзыв согласия не влияет на данные, которые хранятся на основании договора или закона (например, счета-фактуры).',
          en: 'Withdrawing consent does not affect data retained under a contract or by law (for example, invoices).',
        },
      ],
    },
    {
      id: 'storage',
      title: { uz: '5. Saqlash muddati va joyi', ru: '5. Срок и место хранения', en: '5. Retention period and location' },
      body: [
        {
          uz: 'Arizalar (leadlar) serverimizdagi himoyalangan jurnallarda saqlanadi va faqat vakolatli xodimlarga mavjud.',
          ru: 'Заявки (лиды) хранятся в защищённых журналах на нашем сервере и доступны только уполномоченным сотрудникам.',
          en: 'Requests (leads) are stored in protected logs on our server and are accessible only to authorised staff.',
        },
      ],
      pairs: [
        {
          label: { uz: 'Arizalar (javob berilgan)', ru: 'Заявки (обработанные)', en: 'Requests (answered)' },
          value: { uz: '36 oy', ru: '36 месяцев', en: '36 months' },
        },
        {
          label: { uz: 'Arizalar (javob berilmagan)', ru: 'Заявки (без ответа)', en: 'Requests (unanswered)' },
          value: { uz: '12 oy', ru: '12 месяцев', en: '12 months' },
        },
        {
          label: { uz: 'Shartnoma va hisob hujjatlari', ru: 'Договоры и бухгалтерские документы', en: 'Contracts and accounting records' },
          value: { uz: '5 yil (qonun talabi)', ru: '5 лет (требование закона)', en: '5 years (legal requirement)' },
        },
        {
          label: { uz: 'Spam deb belgilangan yozuvlar', ru: 'Записи, помеченные как спам', en: 'Records flagged as spam' },
          value: { uz: '30 kun', ru: '30 дней', en: '30 days' },
        },
      ],
    },
    {
      id: 'sharing',
      title: { uz: '6. Ma\'lumotlar kimlarga beriladi', ru: '6. Кому передаются данные', en: '6. Who receives the data' },
      body: [
        {
          uz: 'Biz ma\'lumotlarni sotmaymiz va uchinchi shaxslarga reklama uchun bermaymiz. Cheklangan holatlarda quyidagilarga uzatilishi mumkin:',
          ru: 'Мы не продаём данные и не передаём их третьим лицам для рекламы. В ограниченных случаях они могут передаваться:',
          en: 'We do not sell data or share it with third parties for advertising. In limited cases it may be shared with:',
        },
      ],
      list: [
        {
          uz: 'Gulf Flavours & Fragrances FZE (Dubay, BAA) — ishlab chiqaruvchi, faqat sizning so\'rovingiz bo\'yicha texnik yoki narx masalalarida.',
          ru: 'Gulf Flavours & Fragrances FZE (Дубай, ОАЭ) — производитель, только по вашему запросу для технических или ценовых вопросов.',
          en: 'Gulf Flavours & Fragrances FZE (Dubai, UAE) — the manufacturer, only on your request for technical or pricing matters.',
        },
        {
          uz: 'Yetkazib berish xizmatlari — namuna yoki buyurtmani jo\'natish uchun zarur minimal ma\'lumot (ism, telefon, manzil).',
          ru: 'Службы доставки — минимально необходимые данные для отправки образца или заказа (имя, телефон, адрес).',
          en: 'Delivery services — the minimum data needed to ship a sample or order (name, phone, address).',
        },
        {
          uz: 'Buxgalteriya va huquqiy xizmatlar — shartnoma majburiyatlari doirasida.',
          ru: 'Бухгалтерские и юридические службы — в рамках договорных обязательств.',
          en: 'Accounting and legal services — within contractual obligations.',
        },
        {
          uz: 'Davlat organlari — faqat O\'zbekiston qonunchiligi talab qilgan hollarda.',
          ru: 'Государственные органы — только в случаях, требуемых законодательством Узбекистана.',
          en: 'State authorities — only where required by the legislation of Uzbekistan.',
        },
      ],
    },
    {
      id: 'security',
      title: { uz: '7. Xavfsizlik choralari', ru: '7. Меры безопасности', en: '7. Security measures' },
      body: [
        {
          uz: 'Ma\'lumotlarni himoya qilish uchun quyidagi texnik va tashkiliy choralar qo\'llanadi:',
          ru: 'Для защиты данных применяются следующие технические и организационные меры:',
          en: 'The following technical and organisational measures protect the data:',
        },
      ],
      list: [
        {
          uz: 'HTTPS (TLS) — barcha uzatishlar shifrlangan; xavfsizlik sarlavhalari (HSTS, CSP, X-Content-Type-Options).',
          ru: 'HTTPS (TLS) — все передачи зашифрованы; заголовки безопасности (HSTS, CSP, X-Content-Type-Options).',
          en: 'HTTPS (TLS) — all transfers encrypted; security headers (HSTS, CSP, X-Content-Type-Options).',
        },
        {
          uz: 'Formalarni avtomatik yuborishdan himoya: honeypot maydonlari, tezlik chegarasi (rate limit), spam ballari tizimi, ixtiyoriy Cloudflare Turnstile.',
          ru: 'Защита форм от автоматической отправки: honeypot-поля, ограничение частоты (rate limit), система спам-баллов, опциональный Cloudflare Turnstile.',
          en: 'Form protection against automated submissions: honeypot fields, rate limiting, a spam-scoring system and optional Cloudflare Turnstile.',
        },
        {
          uz: 'Admin panelga kirish — HMAC imzoli sessiya, parol va kirish urinishlari cheklovi orqali.',
          ru: 'Доступ в админ-панель — через сессию с HMAC-подписью, пароль и ограничение попыток входа.',
          en: 'Admin panel access — via an HMAC-signed session, a password and login attempt limits.',
        },
        {
          uz: 'Xodimlarga kirish huquqi faqat vazifasi bo\'yicha (need-to-know) beriladi.',
          ru: 'Доступ сотрудников предоставляется только по служебной необходимости (need-to-know).',
          en: 'Staff access is granted strictly on a need-to-know basis.',
        },
      ],
    },
    {
      id: 'cookies',
      title: { uz: '8. Cookie va mahalliy xotira', ru: '8. Cookie и локальное хранилище', en: '8. Cookies and local storage' },
      body: [
        {
          uz: 'Sayt faqat texnik zarur bo\'lgan cookie va brauzer xotirasidan foydalanadi. Reklama kuzatuvi (tracking) ishlatilmaydi.',
          ru: 'Сайт использует только технически необходимые cookie и хранилище браузера. Рекламное отслеживание (tracking) не применяется.',
          en: 'The site uses only technically necessary cookies and browser storage. Advertising tracking is not used.',
        },
      ],
      pairs: [
        {
          label: { uz: 'Til tanlovi', ru: 'Выбор языка', en: 'Language preference' },
          value: { uz: 'cookie — tanlangan tilni eslab qolish', ru: 'cookie — запоминает выбранный язык', en: 'cookie — remembers your chosen language' },
        },
        {
          label: { uz: 'Test box', ru: 'Тест-бокс', en: 'Sample box' },
          value: { uz: 'localStorage — tanlangan namunalar ro\'yxati', ru: 'localStorage — список выбранных образцов', en: 'localStorage — your list of selected samples' },
        },
        {
          label: { uz: 'Admin sessiyasi', ru: 'Сессия админа', en: 'Admin session' },
          value: { uz: 'httpOnly cookie — panelga kirish', ru: 'httpOnly cookie — вход в панель', en: 'httpOnly cookie — panel authentication' },
        },
        {
          label: { uz: 'Analitika', ru: 'Аналитика', en: 'Analytics' },
          value: { uz: 'faqat umumiy, shaxsiylashtirilmagan hodisalar', ru: 'только общие, неперсонализированные события', en: 'aggregate, non-personalised events only' },
        },
      ],
    },
    {
      id: 'rights',
      title: { uz: '9. Sizning huquqlaringiz', ru: '9. Ваши права', en: '9. Your rights' },
      body: [
        {
          uz: 'O\'zbekiston Respublikasining "Shaxsiy ma\'lumotlar to\'g\'risida"gi qonuniga (ZRU-547) muvofiq siz quyidagi huquqlarga egasiz:',
          ru: 'Согласно Закону РУз «О персональных данных» (ZRU-547) вы имеете следующие права:',
          en: 'Under the Law of the Republic of Uzbekistan "On Personal Data" (ZRU-547) you have the following rights:',
        },
      ],
      list: [
        {
          uz: 'O\'zingiz haqingizdagi qanday ma\'lumot saqlanayotganini bilish va uning nusxasini olish.',
          ru: 'Знать, какие данные о вас хранятся, и получить их копию.',
          en: 'To know what data about you is held and to receive a copy of it.',
        },
        {
          uz: 'Noto\'g\'ri yoki eskirgan ma\'lumotlarni tuzatishni talab qilish.',
          ru: 'Требовать исправления неверных или устаревших данных.',
          en: 'To request correction of inaccurate or outdated data.',
        },
        {
          uz: 'Ma\'lumotlarni o\'chirishni talab qilish ("unutish huquqi"), agar qonuniy asos saqlanmagan bo\'lsa.',
          ru: 'Требовать удаления данных («право на забвение»), если законное основание для хранения отсутствует.',
          en: 'To request erasure ("right to be forgotten") where no legal basis for retention remains.',
        },
        {
          uz: 'Qayta ishlashni cheklash yoki unga e\'tiroz bildirish.',
          ru: 'Ограничить обработку или возразить против неё.',
          en: 'To restrict or object to processing.',
        },
        {
          uz: 'Shikoyat bilan vakolatli davlat organiga murojaat qilish.',
          ru: 'Подать жалобу в уполномоченный государственный орган.',
          en: 'To lodge a complaint with the competent state authority.',
        },
      ],
    },
    {
      id: 'changes',
      title: { uz: '10. O\'zgarishlar', ru: '10. Изменения', en: '10. Changes' },
      body: [
        {
          uz: `Biz ushbu siyosatni qonunchilik yoki jarayonlar o'zgarganda yangilashimiz mumkin. Amaldagi tahrir har doim shu sahifada, "yangilangan" sanasi bilan joylashtiriladi. Joriy tahrir: 15.01.2026.`,
          ru: `Мы можем обновлять эту политику при изменении законодательства или процессов. Действующая редакция всегда публикуется на этой странице с датой обновления. Текущая редакция: 15.01.2026.`,
          en: `We may update this policy when legislation or processes change. The current version is always published on this page with an update date. Current version: 15.01.2026.`,
        },
      ],
    },
  ],
};

/* ============================================================
   FOYDALANISH SHARTLARI
   ============================================================ */

export const TERMS: LegalDoc = {
  key: 'terms',
  updated: '2026-01-15',
  intro: {
    uz: `Ushbu shartlar ${COMPANY.nameUz} ("Yetkazib beruvchi") ga tegishli bo'lgan gff.uz saytidan foydalanish tartibini belgilaydi. Saytdan foydalanish yoki buyurtma berish ushbu shartlarni qabul qilishni anglatadi.`,
    ru: `Настоящие условия определяют порядок использования сайта gff.uz, принадлежащего ${COMPANY.nameRu} («Поставщик»). Использование сайта или размещение заказа означает принятие этих условий.`,
    en: `These terms govern the use of gff.uz, owned by ${COMPANY.nameEn} ("the Supplier"). Using the site or placing an order means accepting these terms.`,
  },
  sections: [
    {
      id: 'subject',
      title: { uz: '1. Saytning maqomi', ru: '1. Статус сайта', en: '1. Status of the site' },
      body: [
        {
          uz: `Sayt — B2B katalog va ariza (zayvka) yig'ish vositasi. Saytdagi ma'lumotlar ommaviy oferta (public offer) hisoblanmaydi. Narx va mavjudlik har bir so'rov bo'yicha alohida tasdiqlanadi.`,
          ru: `Сайт — B2B-каталог и инструмент сбора заявок. Информация на сайте не является публичной офертой. Цена и наличие подтверждаются индивидуально по каждому запросу.`,
          en: `The site is a B2B catalogue and request-collection tool. The information on it does not constitute a public offer. Prices and availability are confirmed individually for each request.`,
        },
        {
          uz: `Yetkazib beruvchi — Gulf Flavours & Fragrances FZE (Dubay, BAA) mahsulotlarining O'zbekistondagi rasmiy distribyutori. Ishlab chiqaruvchi haqidagi ma'lumot: gulfflavours.ae.`,
          ru: `Поставщик — официальный дистрибьютор продукции Gulf Flavours & Fragrances FZE (Дубай, ОАЭ) в Узбекистане. Информация о производителе: gulfflavours.ae.`,
          en: `The Supplier is the official distributor in Uzbekistan for Gulf Flavours & Fragrances FZE (Dubai, UAE). Manufacturer information: gulfflavours.ae.`,
        },
      ],
    },
    {
      id: 'catalog',
      title: { uz: '2. Katalog va mahsulot ma\'lumotlari', ru: '2. Каталог и данные о продукции', en: '2. Catalogue and product data' },
      body: [
        {
          uz: 'Katalogdagi barcha ma\'lumotlar (doza, qadoq, xususiyatlar, qo\'llash sohalari) ma\'lumot xarakteriga ega. Yakuniy texnik parametrlar partiyaga oid hujjatlar (CoA, TDS, MSDS) bilan tasdiqlanadi.',
          ru: 'Все данные каталога (дозировка, упаковка, свойства, области применения) носят справочный характер. Окончательные технические параметры подтверждаются документами на партию (CoA, TDS, MSDS).',
          en: 'All catalogue data (dosage, packaging, properties, applications) is for reference. Final technical parameters are confirmed by batch documents (CoA, TDS, MSDS).',
        },
        {
          uz: 'Doza tavsiyalari o\'rtacha qiymatlar. Har bir ishlab chiqaruvchi o\'z retsepturasi va jarayonida dozani mustaqil sinov orqali aniqlashi shart.',
          ru: 'Рекомендации по дозировке являются усреднёнными. Каждый производитель обязан определить дозировку самостоятельно, через испытания на своей рецептуре и процессе.',
          en: 'Dosage recommendations are averages. Every manufacturer must determine the dosage independently by testing in its own formulation and process.',
        },
        {
          uz: 'Mahsulot nomlari va tavsiflari ishlab chiqaruvchi katalogidan olingan; texnik xato yoki nomuvofiqlik aniqlansa, biz uni tuzatamiz, lekin bu shartnomaning bekor qilinishiga asos bo\'lmaydi.',
          ru: 'Наименования и описания взяты из каталога производителя; при обнаружении технической ошибки или несоответствия мы её исправляем, но это не является основанием для расторжения договора.',
          en: 'Product names and descriptions come from the manufacturer catalogue; if a technical error or mismatch is found we correct it, but this does not constitute grounds for cancelling a contract.',
        },
      ],
    },
    {
      id: 'requests',
      title: { uz: '3. Arizalar (zayvkalar)', ru: '3. Заявки', en: '3. Requests' },
      body: [
        {
          uz: `Sayt orqali yuborilgan ariza — bu bog'lanish so'rovi, buyurtma emas. Biz ish vaqtlarida ${siteConfig.business.responseMinutes} daqiqa ichida javob berishga intilamiz; ish vaqtidan tashqari yuborilgan arizalar keyingi ish kunida ko'rib chiqiladi.`,
          ru: `Заявка, отправленная через сайт, — это запрос на связь, а не заказ. Мы стремимся отвечать в рабочее время в течение ${siteConfig.business.responseMinutes} минут; заявки, отправленные вне рабочего времени, рассматриваются в следующий рабочий день.`,
          en: `A request submitted through the site is an enquiry, not an order. We aim to respond within ${siteConfig.business.responseMinutes} minutes during business hours; requests sent outside those hours are handled the next business day.`,
        },
        {
          uz: 'Shartnoma faqat ikki tomonlama imzolangan hujjat (shartnoma, hisob-faktura yoki buyurtma tasdiqnomasi) asosida yuzaga keladi.',
          ru: 'Договорные отношения возникают только на основании двусторонне подписанного документа (договор, счёт-фактура или подтверждение заказа).',
          en: 'A contractual relationship arises only on the basis of a mutually signed document (contract, invoice or order confirmation).',
        },
        {
          uz: 'Biz soxta, takroriy yoki avtomatlashtirilgan arizalarni rad etish huquqiga egamiz.',
          ru: 'Мы вправе отклонять ложные, дублирующие или автоматизированные заявки.',
          en: 'We may reject false, duplicate or automated requests.',
        },
      ],
    },
    {
      id: 'samples',
      title: { uz: '4. Test box (namunalar)', ru: '4. Тест-бокс (образцы)', en: '4. Sample boxes' },
      body: [
        {
          uz: `Bepul test box — tijorat maqsadidagi namunalar to'plami. Bir arizada ko'pi bilan ${siteConfig.business.sampleBoxMaxItems} ta pozitsiya so'ralishi mumkin.`,
          ru: `Бесплатный тест-бокс — набор образцов для коммерческого тестирования. В одной заявке можно запросить не более ${siteConfig.business.sampleBoxMaxItems} позиций.`,
          en: `A free sample box is a set of samples for commercial testing. A single request may include up to ${siteConfig.business.sampleBoxMaxItems} items.`,
        },
        {
          uz: 'Namunalar faqat yuridik shaxslar va yakka tartibdagi tadbirkorlarga, ishlab chiqarish sinovi uchun beriladi. Yetkazib berish muddati — ombordagi mavjudlikka qarab.',
          ru: 'Образцы предоставляются только юридическим лицам и индивидуальным предпринимателям для производственных испытаний. Срок доставки — в зависимости от наличия на складе.',
          en: 'Samples are provided only to legal entities and sole proprietors, for production trials. Delivery time depends on stock availability.',
        },
        {
          uz: 'Namunalar qayta sotish uchun mo\'ljallanmagan va sertifikatlangan partiya hujjatlari bilan birga kelmaydi (so\'rov bo\'yicha beriladi). Sifat talablari asosiy yetkazib berishda qo\'llaniladigan hujjatlar bilan belgilanadi.',
          ru: 'Образцы не предназначены для перепродажи и не поставляются с документами на сертифицированную партию (предоставляются по запросу). Требования по качеству определяются документами основной поставки.',
          en: 'Samples are not for resale and are not supplied with certified batch documents (available on request). Quality requirements are defined by the documents of the main supply.',
        },
      ],
    },
    {
      id: 'orders',
      title: { uz: '5. Buyurtma, narx va to\'lov', ru: '5. Заказ, цена и оплата', en: '5. Orders, pricing and payment' },
      body: [
        {
          uz: `Minimal buyurtma hajmi — ${siteConfig.business.minOrderKg} kg. ${siteConfig.business.discountThresholdKg} kg dan yuqori hajmlarda chegirma qo'llaniladi (har bir pozitsiya bo'yicha alohida kelishiladi).`,
          ru: `Минимальный объём заказа — ${siteConfig.business.minOrderKg} кг. Для объёмов свыше ${siteConfig.business.discountThresholdKg} кг применяется скидка (согласуется по каждой позиции отдельно).`,
          en: `Minimum order quantity is ${siteConfig.business.minOrderKg} kg. Volumes above ${siteConfig.business.discountThresholdKg} kg qualify for a discount (agreed individually per item).`,
        },
        {
          uz: "Narxlar so'rov bo'yicha belgilanadi va quyidagilarga bog'liq: hajm, qadoq turi, valyuta kursi, logistika va bojxona xarajatlari. Ko'rsatilgan narx taklifi hisob-faktura to'languncha amal qiladi.",
          ru: 'Цены определяются по запросу и зависят от: объёма, типа упаковки, валютного курса, логистики и таможенных расходов. Предложение по цене действует до оплаты счёта.',
          en: 'Prices are set on request and depend on: volume, packaging type, exchange rate, logistics and customs costs. A quotation remains valid until the invoice is paid.',
        },
        {
          uz: "To'lov — bank o'tkazmasi orqali, O'zbekiston so'mida yoki kelishilgan valyutada. Shartnoma bo'yicha oldindan to'lov yoki bo'lib to'lash shartlari belgilanishi mumkin.",
          ru: 'Оплата — банковским переводом, в узбекских сумах или согласованной валюте. По договору могут устанавливаться условия предоплаты или рассрочки.',
          en: 'Payment is by bank transfer, in Uzbek som or an agreed currency. Prepayment or instalment terms may be set out in the contract.',
        },
      ],
    },
    {
      id: 'delivery',
      title: { uz: '6. Yetkazib berish', ru: '6. Delivery', en: '6. Delivery' },
      body: [
        {
          uz: `Yetkazib berish O'zbekistonning barcha hududlariga amalga oshiriladi. Toshkent bo'yicha — odatda 1 ish kuni, hududlarga — 2–4 ish kuni. Aniq muddat buyurtma tasdiqlanganda ko'rsatiladi.`,
          ru: `Доставка осуществляется по всем регионам Узбекистана. По Ташкенту — обычно 1 рабочий день, в регионы — 2–4 рабочих дня. Точный срок указывается при подтверждении заказа.`,
          en: `Delivery covers all regions of Uzbekistan. Within Tashkent — usually 1 business day, to the regions — 2–4 business days. The exact lead time is stated at order confirmation.`,
        },
        {
          uz: 'Xavf-xatar va mulk huquqi mahsulotni qabul qiluvchiga topshirish momentida o\'tadi (aksini shartnoma belgilamagan bo\'lsa).',
          ru: 'Риск и право собственности переходят в момент передачи товара получателю (если договор не предусматривает иное).',
          en: 'Risk and title pass on delivery of the goods to the recipient (unless the contract provides otherwise).',
        },
        {
          uz: 'Qabul qilishda qadoq yaxlitligini tekshirish xaridorning majburiyati. Shikast yetgan yoki yetishmayotgan mahsulot darhol (qabul qilish paytida) qayd etilishi kerak.',
          ru: 'Проверка целостности упаковки при приёмке — обязанность покупателя. Повреждённый или недостающий товар должен быть зафиксирован немедленно (в момент приёмки).',
          en: 'Checking packaging integrity on receipt is the buyer\'s responsibility. Damaged or missing goods must be recorded immediately (at the time of receipt).',
        },
      ],
    },
    {
      id: 'ip',
      title: { uz: '7. Intellektual mulk', ru: '7. Интеллектуальная собственность', en: '7. Intellectual property' },
      body: [
        {
          uz: 'Sayt mazmuni (matn, dizayn, tuzilma, logotiplar) va "Gulf Flavours & Fragrances" belgisi mualliflik huquqi hamda tovar belgilari bilan himoyalangan. Ruxsatsiz nusxalash, tarqatish yoki qayta ishlash taqiqlanadi.',
          ru: 'Содержимое сайта (тексты, дизайн, структура, логотипы) и обозначение «Gulf Flavours & Fragrances» защищены авторским правом и товарными знаками. Копирование, распространение или переработка без разрешения запрещены.',
          en: 'The site content (texts, design, structure, logos) and the "Gulf Flavours & Fragrances" mark are protected by copyright and trademarks. Copying, distribution or processing without permission is prohibited.',
        },
        {
          uz: 'Mahsulot nomlari va texnik tavsiflari faqat tanish maqsadida keltirilgan va tegishli egalarining mulki hisoblanadi.',
          ru: 'Наименования продуктов и технические описания приведены исключительно в ознакомительных целях и являются собственностью соответствующих правообладателей.',
          en: 'Product names and technical descriptions are provided for reference only and remain the property of their respective owners.',
        },
      ],
    },
    {
      id: 'liability',
      title: { uz: '8. Javobgarlik', ru: '8. Ответственность', en: '8. Liability' },
      body: [
        {
          uz: 'Yetkazib beruvchi sayt mazmunining to\'liq va uzluksiz ishlashi uchun javob beradi, lekin quyidagilar uchun javobgar emas:',
          ru: 'Поставщик отвечает за полноту и бесперебойность содержимого сайта, однако не несёт ответственности за:',
          en: 'The Supplier is responsible for the completeness and continuity of the site content, but is not liable for:',
        },
      ],
      list: [
        {
          uz: 'Xaridor tomonidan mahsulotni noto\'g\'ri qo\'llash (doza, texnologiya, saqlash sharoitlarini buzish).',
          ru: 'Неправильное применение продукта покупателем (нарушение дозировки, технологии, условий хранения).',
          en: 'Incorrect use of the product by the buyer (violating dosage, technology or storage conditions).',
        },
        {
          uz: 'Mahsulotni sinovsiz ishlab chiqarishga joriy etish natijalari — har bir partiya oldindan sinab ko\'rilishi shart.',
          ru: 'Результаты внедрения продукта в производство без испытаний — каждая партия должна быть предварительно протестирована.',
          en: 'Results of introducing a product into production without trials — every batch must be tested beforehand.',
        },
        {
          uz: 'Uchinchi tomon saytlari va havolalari mazmuni.',
          ru: 'Содержимое сторонних сайтов и ссылок.',
          en: 'The content of third-party sites and links.',
        },
        {
          uz: 'Foydalanuvchi tomonidan ma\'lumotni noto\'g\'ri kiritishi oqibatlari.',
          ru: 'Последствия некорректного ввода данных пользователем.',
          en: 'Consequences of incorrect data entry by the user.',
        },
      ],
    },
    {
      id: 'law',
      title: { uz: '9. Qo\'llaniladigan huquq va nizolar', ru: '9. Применимое право и споры', en: '9. Governing law and disputes' },
      body: [
        {
          uz: 'Ushbu shartlarga O\'zbekiston Respublikasi qonunchiligi qo\'llaniladi. Nizolar muzokara yo\'li bilan, kelishuv bo\'lmasa Toshkent shahridagi iqtisodiy sudda hal etiladi.',
          ru: 'К настоящим условиям применяется законодательство Республики Узбекистан. Споры решаются путём переговоров, а при недостижении согласия — в экономическом суде города Ташкента.',
          en: 'These terms are governed by the legislation of the Republic of Uzbekistan. Disputes are settled by negotiation, and failing agreement, in the economic court of the city of Tashkent.',
        },
        {
          uz: 'Agar biror band haqiqiy emas deb topilsa, bu qolgan bandlarning kuchiga ta\'sir qilmaydi.',
          ru: 'Если какое-либо положение признано недействительным, это не влияет на силу остальных положений.',
          en: 'If any provision is found invalid, this does not affect the validity of the remaining provisions.',
        },
      ],
    },
    {
      id: 'contacts',
      title: { uz: '10. Aloqa', ru: '10. Контакты', en: '10. Contacts' },
      body: [
        {
          uz: `Savollar bo'yicha: ${siteConfig.contact.salesEmail} yoki ${siteConfig.contact.phonePrimary}. Ish vaqti: ${siteConfig.contact.hours}.`,
          ru: `По вопросам: ${siteConfig.contact.salesEmail} или ${siteConfig.contact.phonePrimary}. Часы работы: ${siteConfig.contact.hours}.`,
          en: `For questions: ${siteConfig.contact.salesEmail} or ${siteConfig.contact.phonePrimary}. Business hours: ${siteConfig.contact.hours}.`,
        },
      ],
    },
  ],
};

/** Ikkala hujjat (sitemap va havolalar uchun) */
export const LEGAL_DOCS = [PRIVACY, TERMS];
