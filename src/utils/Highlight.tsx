
export interface HighlightProps {
  text: string;
  query: string;
  highlightStyle?: React.CSSProperties;
  className?: string;
}

export function Highlight({
  text = '',
  query = '',
  highlightStyle = { backgroundColor: '#fef08a', color: '#854d0e', padding: '0 2px', borderRadius: 2 },
  className = '',
}: HighlightProps) {
  if (!query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, idx) =>
        regex.test(part) ? (
          <mark key={idx} style={highlightStyle}>
            {part}
          </mark>
        ) : (
          <span key={idx}>{part}</span>
        ),
      )}
    </span>
  );
}
