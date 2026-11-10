import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Koncerti from './pages/Koncerti'
import Termini from './pages/Termini'
import Termin from './pages/Termin'
import PrijaveNaTermin from './pages/PrijaveNaTermin'
import MojiBendi from './pages/MojiBendi'
import Prizorisca from './pages/Prizorisca'
import Prijava from './pages/Prijava'
import Registracija from './pages/Registracija'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Koncerti />} />
        <Route path="termini" element={<Termini />} />
        <Route path="termini/:id" element={<Termin />} />
        <Route path="termini/:id/prijave" element={<PrijaveNaTermin />} />
        <Route path="bendi" element={<MojiBendi />} />
        <Route path="prizorisca" element={<Prizorisca />} />
        <Route path="prijava" element={<Prijava />} />
        <Route path="registracija" element={<Registracija />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
