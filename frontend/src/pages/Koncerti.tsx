import { Empty, PageTitle, Select } from '../components/ui'

// Javni seznam koncertov (wireframe 3). Podatki pridejo z API-jem koledarja.
export default function Koncerti() {
  return (
    <>
      <PageTitle
        aside={
          <div className="flex gap-3">
            <Select label="Mesto" options={['Maribor', 'Ljubljana', 'Celje']} />
            <Select label="Žanr" options={['Rock', 'Indie', 'Punk', 'Jazz']} />
          </div>
        }
      >
        Koncerti
      </PageTitle>
      <Empty>Ni še objavljenih koncertov.</Empty>
    </>
  )
}
