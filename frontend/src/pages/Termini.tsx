import { Empty, PageTitle, Select } from '../components/ui'
import { useAuth } from '../auth/kontekst'
import MojiTermini from './MojiTermini'

export default function Termini() {
  const { uporabnik } = useAuth()

  // organizator na tej strani upravlja svoje termine, glasbenik išče proste termine
  if (uporabnik?.vloga === 'ORGANIZATOR') return <MojiTermini />

  return (
    <>
      <PageTitle
        aside={
          <div className="flex gap-3">
            <Select label="Mesto" options={['Maribor', 'Ljubljana', 'Celje']} />
            <Select label="Obdobje" options={['Ta teden', 'Ta mesec', 'Naslednji mesec']} />
          </div>
        }
      >
        Prosti termini
      </PageTitle>
      <Empty>Trenutno ni razpisanih terminov.</Empty>
    </>
  )
}
