import type { ReactNode } from 'react'

export function PageTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h1 className="text-3xl font-semibold tracking-tight">{children}</h1>
      {aside}
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-card p-6 ${className}`}>{children}</div>
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line px-6 py-16 text-center text-sm text-muted">
      {children}
    </div>
  )
}

export function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <select
      aria-label={label}
      defaultValue=""
      className="rounded-md border border-line bg-card px-3 py-2 text-sm focus:border-accent focus:outline-none"
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      {children}
    </label>
  )
}

export const inputClass =
  'w-full rounded-md border border-line bg-card px-3 py-2 text-sm focus:border-accent focus:outline-none'

export const buttonClass =
  'rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40'
