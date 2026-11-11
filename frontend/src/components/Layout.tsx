import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import ApiStatus from './ApiStatus'
import { useAuth } from '../auth/kontekst'
import type { Vloga } from '../lib/api'

const links: { to: string; label: string; vloge?: Vloga[] }[] = [
  { to: '/', label: 'Koncerti' },
  { to: '/termini', label: 'Termini', vloge: ['GLASBENIK', 'ORGANIZATOR'] },
  { to: '/bendi', label: 'Moji bendi', vloge: ['GLASBENIK'] },
  { to: '/prizorisca', label: 'Prizorišča', vloge: ['ORGANIZATOR'] },
]

const imenaVlog: Record<Vloga, string> = {
  OBISKOVALEC: 'obiskovalec',
  GLASBENIK: 'glasbenik',
  ORGANIZATOR: 'organizator',
  ADMIN: 'admin',
}

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'text-ink' : 'text-muted hover:text-ink'
}

export default function Layout() {
  const { uporabnik, nalagam, odjava } = useAuth()
  const navigate = useNavigate()

  const vidni = links.filter((l) => !l.vloge || (uporabnik && l.vloge.includes(uporabnik.vloga)))

  async function odjavi() {
    navigate('/')
    await odjava()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-8 px-6">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Gig<span className="text-accent">Spot</span>
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            {vidni.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={navClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            {nalagam ? null : uporabnik ? (
              <>
                <span className="text-muted">
                  <span className="font-medium text-ink">{uporabnik.prikaznoIme}</span> · {imenaVlog[uporabnik.vloga]}
                </span>
                <button onClick={odjavi} className="rounded-md border border-line px-3 py-1.5 hover:bg-paper">
                  Odjava
                </button>
              </>
            ) : (
              <>
                <Link to="/prijava" className="text-muted hover:text-ink">
                  Prijava
                </Link>
                <Link
                  to="/registracija"
                  className="rounded-md bg-ink px-3 py-1.5 font-medium text-paper hover:bg-ink/85"
                >
                  Registracija
                </Link>
              </>
            )}
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
