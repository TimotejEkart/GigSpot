import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './kontekst'
import type { Vloga } from '../lib/api'
import { Empty } from '../components/ui'

type Props = { children: ReactNode; vloge?: Vloga[] }

// stran je dostopna samo prijavljenim
export default function ZascitenaPot({ children, vloge }: Props) {
  const { uporabnik, nalagam } = useAuth()
  const lokacija = useLocation()

  if (nalagam) return null

  if (!uporabnik) {
    return <Navigate to="/prijava" replace state={{ iz: lokacija.pathname }} />
  }

  if (vloge && !vloge.includes(uporabnik.vloga)) {
    return <Empty>Za ogled te strani nimaš pravic.</Empty>
  }

  return children
}
