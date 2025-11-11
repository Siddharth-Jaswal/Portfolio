import React from 'react'

export function Card({ className = '', children }) {
  return <div className={['rounded-3xl border', className].join(' ')}>{children}</div>
}
export function CardContent({ className = '', children }) {
  return <div className={['p-4 md:p-6', className].join(' ')}>{children}</div>
}
