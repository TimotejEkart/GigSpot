import { Link, NavLink, Outlet } from 'react-router-dom'
import ApiStatus from './ApiStatus'

const links = [
  { to: '/', label: 'Koncerti' },
  { to: '/termini', label: 'Termini' },
  { to: '/bendi', label: 'Moji bendi' },
  { to: '/prizorisca', label: 'Prizorišča' },
]

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'text-ink' : 'text-muted hover:text-ink'
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-8 px-6">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Gig<span className="text-accent">Spot</span>
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={navClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <Link to="/prijava" className="text-muted hover:text-ink">
              Prijava
            </Link>
            <Link
              to="/registracija"
              className="rounded-md bg-ink px-3 py-1.5 font-medium text-paper hover:bg-ink/85"
            >
              Registracija
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 text-xs text-muted">
          <span>GigSpot · RIRS, FERI</span>
          <ApiStatus />
        </div>
      </footer>
    </div>
  )
}
