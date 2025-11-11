import React from 'react'

export function Button({ asChild, className = '', variant = 'default', size = 'md', children, href, ...props }) {
  const base = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    default: 'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-black dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white',
    outline: 'border border-neutral-300 hover:bg-neutral-100 text-black dark:border-neutral-700 dark:hover:bg-neutral-800 dark:text-white',
    ghost: 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
    gold: 'text-black bg-[linear-gradient(135deg,#ffd34d_0%,#ffb300_40%,#ffcc66_100%)] shadow-[0_0_0_1px_rgba(255,184,0,.25),0_10px_30px_-10px_rgba(255,184,0,.45)] hover:brightness-110 focus:ring-yellow-400 focus:ring-offset-neutral-900'
  }
  const sizes = { sm: 'h-9 px-3 rounded-full text-sm', md: 'h-10 px-4 rounded-full', lg: 'h-11 px-6 rounded-full' }
  const cls = [base, variants[variant] || variants.default, sizes[size] || sizes.md, className].join(' ')

  // Radix-style `asChild`: merge our classes/props into the child instead of wrapping
  if (asChild && React.isValidElement(children)) {
    const childClass = children.props?.className || ''
    return React.cloneElement(children, { className: [cls, childClass].filter(Boolean).join(' '), ...props })
  }

  // Fallback: render as anchor if href is provided, else as button
  const Comp = href ? 'a' : 'button'
  return <Comp className={cls} href={href} {...props}>{children}</Comp>
}
