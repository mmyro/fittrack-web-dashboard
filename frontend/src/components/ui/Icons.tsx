interface IconProps {
  className?: string
}

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
}

export function ClockIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function FlameIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z" />
    </svg>
  )
}

export function SearchIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function ActivityIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
  )
}