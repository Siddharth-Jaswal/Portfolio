import React from 'react'

export function Badge({ className = '', variant = 'default', children }) {
  const base = 'inline-flex items-center rounded-md border px-2 py-0.5 text-xs'
  const variants = {
    default: 'bg-black text-white border-black',
    secondary: 'bg-white text-black border-neutral-200 dark:bg-neutral-900 dark:text-white dark:border-neutral-700',
  }
  return <span className={[base, variants[variant] || variants.default, className].join(' ')}>{children}</span>
}
