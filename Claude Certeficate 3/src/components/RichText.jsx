/*
 * Minimal inline formatter for course copy.
 *
 * The source material occasionally emphasises a lead-in phrase. Rather than
 * injecting HTML, `**bold**` spans are split out and rendered as <strong>.
 * Nothing else is parsed, so course text can never inject markup.
 */

export default function RichText({ text }) {
  if (typeof text !== 'string') return null;

  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
          <strong key={index}>{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      )}
    </>
  );
}
