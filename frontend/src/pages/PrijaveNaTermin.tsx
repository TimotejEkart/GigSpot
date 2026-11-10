import { Card, PageTitle, buttonClass } from '../components/ui'

// Organizatorjev pregled prijav na termin (wireframe 2).
export default function PrijaveNaTermin() {
  return (
    <>
      <PageTitle aside={<span className="text-sm text-muted">Zasedba 0 / —</span>}>Prijave na termin</PageTitle>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="px-6 py-3 font-medium">Bend</th>
              <th className="px-6 py-3 font-medium">Kontakt vodje</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Akcije</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-muted">
                Na ta termin še ni prijav.
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
      <div className="mt-6 flex justify-end">
        <button className={buttonClass} disabled>
          Objavi koncert
        </button>
      </div>
    </>
  )
}
