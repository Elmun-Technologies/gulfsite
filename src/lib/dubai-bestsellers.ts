/**
 * DUBAY BOSH OFISIDA ENG KO'P SOTILADIGAN TA'MLAR (gulfflavours.ae/flavours)
 * ----------------------------------------------------------------
 * Mijoz talabi (2026-10-17): Dubay bozori bizga Rossiyadan ko'ra yaqinroq —
 * shu sababli soha sahifalarida ota-kompaniyaning "Top Selling" va
 * "New creations" ro'yxatlari ko'rsatiladi. FAQAT saytda ko'rilgan nomlar
 * (to'qilgan nom yo'q); har bir nom katalog qidiruviga bog'lanadi va
 * katalogda mos mahsulot bo'lmasa ko'rsatilmaydi (o'lik havola yo'q).
 */

export const DUBAI_BESTSELLERS: Record<string, { top: string[]; fresh: string[] }> = {
  bakery: {
    top: ['Condensed Milk', 'Banana', 'Pineapple', 'Vanilla', 'Butter', 'Milk', 'Coconut', 'Chocolate', 'Cake', 'Blueberry', 'Orange', 'Honey', 'Malt', 'Caramel'],
    fresh: [],
  },
  confectionery: {
    top: ['Milk Caramel', 'Toffee', 'Strawberry', 'Raspberry', 'Chocolate', 'Peppermint', 'Bubble Gum', 'Spearmint', 'Butterscotch', 'Vanilla', 'Menthol', 'Butter', 'Apple', 'Lemon'],
    fresh: ['Chocolate', 'Lemon', 'Apple', 'Tamarind', 'Raspberry', 'Coffee', 'Pina Colada', 'Cherry'],
  },
  dairy: {
    top: ['Butter Vanilla', 'Chocolate', 'Cardamom', 'Cheese', 'Butter Pecan', 'Strawberry', 'Pistachio', 'Banana', 'Cream'],
    fresh: ['Vanilla', 'Cheddar', 'Margarine', 'Tamarind'],
  },
  beverages: {
    top: ['Orange', 'Mixed Fruit', 'Mango', 'Mint', 'Strawberry', 'Pistachio', 'Banana', 'Cream', 'Lemon', 'Cola', 'Lime', 'Apple'],
    fresh: ['Cocktail', 'Apple', 'Creme Brulee', 'Acai', 'Lotus', 'Mocha'],
  },
};
