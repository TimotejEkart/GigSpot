import { Card, Field, buttonClass, inputClass } from '../components/ui'

const podatki = ['Datum', 'Žanri', 'Iščejo', 'Rok prijave']

// Podrobnosti termina in prijava benda (wireframe 1).
export default function Termin() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <div className="mb-6 flex gap-4">
            <div className="h-20 w-20 shrink-0 rounded-lg bg-line" />
            <div>
              <h1 className="text-xl font-semibold">Prizorišče</h1>
              <p className="text-sm text-muted">Naslov prizorišča</p>
            </div>
          </div>
          <dl className="space-y-2 text-sm">
            {podatki.map((p) => (
              <div key={p} className="flex justify-between border-b border-line pb-2 last:border-0">
                <dt className="text-muted">{p}</dt>
                <dd>—</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold">Kontakt prizorišča</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Telefon</dt><dd>—</dd></div>
            <div className="flex justify-between"><dt className="text-muted">E-pošta</dt><dd>—</dd></div>
          </dl>
        </Card>
      </div>

      <Card className="space-y-5">
        <h2 className="text-xl font-semibold">Prijava benda</h2>
        <Field label="Bend">
          <select className={inputClass} disabled>
            <option>Izberi bend</option>
          </select>
        </Field>
        <Field label="Sporočilo organizatorju">
          <textarea rows={4} className={inputClass} disabled />
        </Field>
        <button className={`${buttonClass} w-full`} disabled>
          Prijavi
        </button>
      </Card>
    </div>
  )
}
