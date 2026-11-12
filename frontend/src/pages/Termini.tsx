import { useAuth } from '../auth/kontekst'
import MojiTermini from './MojiTermini'
import ProstiTermini from './ProstiTermini'

export default function Termini() {
  const { uporabnik } = useAuth()

  // organizator na tej strani upravlja svoje termine, glasbenik išče proste termine
  return uporabnik?.vloga === 'ORGANIZATOR' ? <MojiTermini /> : <ProstiTermini />
}
