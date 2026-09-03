/**
 * JSON-LD — strukturali ma'lumot (schema.org)
 * ----------------------------------------------------------------
 * Server komponent: `<script type="application/ld+json">` chiqaradi.
 * Qiymatlar JSON.stringify orqali xavfsiz seriyalanadi (`</script>`
 * kabi ketma-ketliklar parchalanadi — XSS'dan himoya).
 */

export function JsonLd({ data }: { data: unknown }) {
  if (data == null) return null;
  const json = JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/** Bir nechta blokni bitta konteynerda chiqarish */
export function JsonLdGroup({ items }: { items: unknown[] }) {
  return (
    <>
      {items.filter(Boolean).map((d, i) => (
        <JsonLd key={i} data={d} />
      ))}
    </>
  );
}

export default JsonLd;
