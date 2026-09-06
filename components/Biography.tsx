import type { ReactNode } from 'react'

function formatInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*\n]+\*\*|__[^_\n]+__|\*[^*\n]+\*|_[^_\n]+_)/g)

  return parts.filter(Boolean).map((part, index) => {
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      return <em key={index}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

export function Biography({ children }: { children: string }) {
  return children.split(/\n{2,}/).map((paragraph, paragraphIndex) => (
    <p key={paragraphIndex}>
      {paragraph.split('\n').map((line, lineIndex) => (
        <span key={lineIndex}>
          {lineIndex > 0 && <br />}
          {formatInline(line)}
        </span>
      ))}
    </p>
  ))
}
