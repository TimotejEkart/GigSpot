import { Empty, PageTitle, Select } from '../components/ui'

export default function Termini() {
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
