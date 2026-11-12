import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Empty, Field, buttonClass, inputClass } from '../components/ui'
import { ApiNapaka, api } from '../lib/api'
import { formatDatum, formatRok, opisPlacila, statusiTermina, steviloBendov, type Termin as TipTermina } from '../lib/termini'
import { useAuth } from '../auth/kontekst'

// Podrobnosti termina in prijava benda (wireframe 1).
export default function Termin() {
  const { id } = useParams()
  const { uporabnik } = useAuth()
  const [termin, setTermin] = useState<TipTermina | null>(null)
  const [napaka, setNapaka] = useState('')

  useEffect(() => {
    api<{ termin: TipTermina }>(`/slots/${id}`)
      .then((o) => setTermin(o.termin))
      .catch((err) => setNapaka(err instanceof ApiNapaka ? err.message : 'Strežnik ni dosegljiv.'))
  }, [id])

  if (napaka) return <Empty>{napaka}</Empty>
  if (!termin) return null

  const p = termin.prizorisce
  const podatki: [string, string][] = [
    ['Datum', formatDatum(termin.datum)],
    ['Žanri', termin.zanri.map((z) => z.ime).join(', ')],
    ['Iščejo', steviloBendov(termin.stBendov)],
    ['Plačilo', opisPlacila(termin)],
    ['Rok prijave', formatRok(termin.rokPrijave)],
    ['Status', statusiTermina[termin.status]],
  ]
  const imaKontakt = 'kontaktEmail' in p || 'kontaktTelefon' in p

  return (
    <>
      <Link to="/termini" className="mb-6 inline-block text-sm text-muted hover:text-ink">
        ← Nazaj na termine
      </Link>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <div className="mb-6 flex gap-4">
              <div className="h-20 w-20 shrink-0 rounded-lg bg-line" />
              <div>
                <h1 className="text-xl font-semibold">{p.ime}</h1>
                <p className="text-sm text-muted">
                  {p.naslov}, {p.mesto}
                </p>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              {podatki.map(([naziv, vrednost]) => (
                <div key={naziv} className="flex justify-between gap-4 border-b border-line pb-2 last:border-0">
                  <dt className="text-muted">{naziv}</dt>
                  <dd className="text-right">{vrednost}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card>
            <h2 className="mb-4 font-semibold">Kontakt prizorišča</h2>
            {imaKontakt ? (
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Telefon</dt><dd>{p.kontaktTelefon ?? '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">E-pošta</dt><dd>{p.kontaktEmail ?? '—'}</dd></div>
              </dl>
            ) : (
              <p className="text-sm text-muted">Kontakt vidijo samo prijavljeni glasbeniki in organizatorji.</p>
            )}
          </Card>
        </div>

        {uporabnik?.vloga === 'GLASBENIK' && (
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
        )}
        {uporabnik?.vloga === 'ORGANIZATOR' && (
          <Card className="h-fit space-y-3">
            <h2 className="text-xl font-semibold">Prijave bendov</h2>
            <p className="text-sm text-muted">Pregled prijav in izbor zasedbe za ta termin.</p>
            <Link to={`/termini/${termin.id}/prijave`} className={`${buttonClass} inline-block`}>
              Poglej prijave
            </Link>
          </Card>
        )}
      </div>
    </>
  )
}
