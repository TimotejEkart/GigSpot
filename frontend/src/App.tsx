import type { ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ZascitenaPot from './auth/ZascitenaPot'
import type { Vloga } from './lib/api'
import Koncerti from './pages/Koncerti'
import Termini from './pages/Termini'
import Termin from './pages/Termin'
import PrijaveNaTermin from './pages/PrijaveNaTermin'
import MojiBendi from './pages/MojiBendi'
import Prizorisca from './pages/Prizorisca'
import Prijava from './pages/Prijava'
import Registracija from './pages/Registracija'
import NotFound from './pages/NotFound'

function samo(vloge: Vloga[] | undefined, stran: ReactNode) {
  return <ZascitenaPot vloge={vloge}>{stran}</ZascitenaPot>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Koncerti />} />
        <Route path="termini" element={samo(['GLASBENIK', 'ORGANIZATOR'], <Termini />)} />
        <Route path="termini/:id" element={samo(['GLASBENIK', 'ORGANIZATOR'], <Termin />)} />
        <Route path="termini/:id/prijave" element={samo(['ORGANIZATOR'], <PrijaveNaTermin />)} />
        <Route path="bendi" element={samo(['GLASBENIK'], <MojiBendi />)} />
        <Route path="prizorisca" element={samo(['ORGANIZATOR'], <Prizorisca />)} />
        <Route path="prijava" element={<Prijava />} />
        <Route path="registracija" element={<Registracija />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
