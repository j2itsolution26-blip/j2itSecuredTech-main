/**
 * Emits schema.org structured data.
 *
 * `dangerouslySetInnerHTML` is the documented approach for JSON-LD in the App
 * Router; the payload is generated server-side from typed builders in
 * `lib/seo.ts`, never from user input. `<` is escaped to close the XSS vector
 * that would otherwise exist if a value ever contained markup.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
