/**
 * LLMS.TXT — AI qidiruv va yordamchilar (ChatGPT, Claude, Perplexity, Gemini) uchun
 * sayt xaritasi. Faqat ma'lumotdan (katalog, taksonomiya, config) yig'iladi —
 * qo'lda yozilgan raqam/da'vo yo'q (§7.1).
 *
 * Avval `/llms.txt` `[locale]` segmentiga tushib, bosh sahifa HTML'ini 200 bilan
 * qaytarardi (soft-404). Bu route shuni oldini oladi.
 */

import { SITE_URL, siteConfig } from '@/lib/config';
import { allProducts, applicationCounts } from '@/lib/catalog';
import { categoryIdsWithData, categoryName, groupsFor } from '@/lib/category-pages';
import { industryIds } from '@/lib/industry-copy';
import { ensureCatalog } from '@/lib/catalog-live';
import { APPLICATIONS, tr } from '@/lib/taxonomy';
import { blogArticles } from '@/lib/blog';

export const revalidate = 3600;

export async function GET(): Promise<Response> {
  await ensureCatalog();
  const c = siteConfig.contact;
  const lines: string[] = [];

  lines.push(`# ${siteConfig.brand.distributor} — ${siteConfig.brand.full}`);
  lines.push('');
  lines.push(
    `> ${siteConfig.brand.full} kompaniyasining O‘zbekistondagi rasmiy va yagona distribyutori. ` +
      `B2B: oziq-ovqat aromatizatorlari (pishiriq, qandolat, sut, ichimlik va boshqalar), atir kompozitsiyalari, ` +
      `efir moylari, aroma kimyosi va ingredientlar. Katalogda ${allProducts().length} pozitsiya. ` +
      `Narxlar e’lon qilinmaydi — har bir so‘rov bo‘yicha hisoblanadi; bepul namuna (test box) so‘rash mumkin.`,
  );
  lines.push('');
  lines.push('## Asosiy sahifalar');
  lines.push(`- [Bosh sahifa](${SITE_URL}/uz)`);
  lines.push(`- [Katalog](${SITE_URL}/uz/catalog)`);
  lines.push(`- [Bepul namuna (test box)](${SITE_URL}/uz/samples)`);
  lines.push(`- [Narx so‘rash](${SITE_URL}/uz/quote)`);
  lines.push(`- [Kompaniya haqida](${SITE_URL}/uz/about)`);
  lines.push(`- [Aloqa](${SITE_URL}/uz/contact)`);
  lines.push('');

  lines.push('## Kategoriyalar');
  for (const id of categoryIdsWithData()) {
    lines.push(`- [${categoryName(id, 'uz')}](${SITE_URL}/uz/category/${id})`);
    for (const g of groupsFor(id, 'uz')) {
      lines.push(`  - [${g.label}](${SITE_URL}/uz/category/${id}/${g.id}) — ${g.count} pozitsiya`);
    }
  }
  lines.push('');

  lines.push('## Sohalar (qo‘llanilishi bo‘yicha)');
  const counts = applicationCounts();
  for (const id of industryIds().filter((i) => (counts[i] ?? 0) > 0)) {
    const label = tr(APPLICATIONS.find((a) => a.id === id)?.name, 'uz', id);
    lines.push(`- [${label}](${SITE_URL}/uz/industries/${id})`);
  }
  lines.push('');

  lines.push('## Maqolalar (uz)');
  for (const a of blogArticles('uz')) {
    lines.push(`- [${a.text.uz.title}](${SITE_URL}/uz/blog/${a.slug}) — ${a.text.uz.description}`);
  }
  lines.push('');

  lines.push('## Tillar');
  lines.push(`- O‘zbekcha: ${SITE_URL}/uz`);
  lines.push(`- Русский: ${SITE_URL}/ru`);
  lines.push(`- English: ${SITE_URL}/en`);
  lines.push('');

  lines.push('## Aloqa');
  lines.push(`- Telefon: ${c.phonePrimary}`);
  lines.push(`- E-mail: ${c.salesEmail}`);
  lines.push(`- Manzil: ${c.addressEn}`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' },
  });
}
