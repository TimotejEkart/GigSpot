import { useEffect, useState, type FormEvent } from 'react'
import { Card, Empty, Field, Opozorilo, PageTitle, buttonClass, inputClass } from '../components/ui'
import { ApiNapaka, api } from '../lib/api'

type Zanr = { id: number; ime: string }
type Clan = { id: number; prikaznoIme: string; email: string; vlogaVBendu: 'VODJA' | 'CLAN'; status: 'POVABLJEN' | 'AKTIVEN' }
type Bend = {
  id: number
  ime: string
  mesto: string
  opis: string | null
  tehnicneZahteve: string | null
  zanri: Zanr[]
  clani: Clan[]
  jeVodja: boolean
}
type Povabilo = { id: number; ime: string; mesto: string }

const prazenObrazec = { ime: '', mesto: '', opis: '', tehnicneZahteve: '', zanri: [] as number[] }

function sporociloNapake(err: unknown) {
  return err instanceof ApiNapaka ? err.message : 'Strežnik ni dosegljiv.'
}

export default function MojiBendi() {
  const [bendi, setBendi] = useState<Bend[] | null>(null)
  const [povabila, setPovabila] = useState<Povabilo[]>([])
  const [zanri, setZanri] = useState<Zanr[]>([])
  const [napaka, setNapaka] = useState('')

  const [odprtObrazec, setOdprtObrazec] = useState(false)
  const [obrazec, setObrazec] = useState(prazenObrazec)
  const [polja, setPolja] = useState<Record<string, string>>({})
  const [posiljam, setPosiljam] = useState(false)

  // ob spremembi se bendi in povabila naložijo znova
  const [osvezitev, setOsvezitev] = useState(0)
  const nalozi = () => setOsvezitev((n) => n + 1)

  useEffect(() => {
    api<{ bendi: Bend[]; povabila: Povabilo[] }>('/bands/mine')
      .then((o) => {
        setBendi(o.bendi)
        setPovabila(o.povabila)
      })
      .catch((err) => setNapaka(sporociloNapake(err)))
  }, [osvezitev])

  useEffect(() => {
    api<{ zanri: Zanr[] }>('/genres')
      .then((o) => setZanri(o.zanri))
      .catch(() => setNapaka('Žanrov ni bilo mogoče naložiti.'))
  }, [])

  function preklopiZanr(id: number) {
    setObrazec((o) => ({ ...o, zanri: o.zanri.includes(id) ? o.zanri.filter((z) => z !== id) : [...o.zanri, id] }))
  }

  async function ustvari(e: FormEvent) {
    e.preventDefault()
    setPolja({})
    setNapaka('')
    setPosiljam(true)
    try {
      await api('/bands', { method: 'POST', body: obrazec })
      setObrazec(prazenObrazec)
      setOdprtObrazec(false)
      nalozi()
    } catch (err) {
      if (err instanceof ApiNapaka && Object.keys(err.polja).length > 0) setPolja(err.polja)
      else setNapaka(sporociloNapake(err))
    } finally {
      setPosiljam(false)
    }
  }

  async function odgovori(bendId: number, odgovor: 'accept' | 'decline') {
    setNapaka('')
    try {
      await api(`/bands/${bendId}/invitation/${odgovor}`, { method: 'POST' })
      nalozi()
    } catch (err) {
      setNapaka(sporociloNapake(err))
    }
  }

  return (
    <>
      <PageTitle
        aside={
          !odprtObrazec && (
            <button className={buttonClass} onClick={() => setOdprtObrazec(true)}>
              Nov bend
            </button>
          )
        }
      >
        Moji bendi
      </PageTitle>

      {napaka && (
        <div className="mb-6">
          <Opozorilo>{napaka}</Opozorilo>
        </div>
      )}

      {povabila.length > 0 && (
        <div className="mb-8 space-y-3">
          {povabila.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent/5 px-5 py-4">
              <p className="text-sm">
                Povabljen si v bend <span className="font-semibold">{p.ime}</span> <span className="text-muted">({p.mesto})</span>
              </p>
              <div className="flex gap-2">
                <button className="rounded-md border border-line bg-card px-3 py-1.5 text-sm hover:bg-paper" onClick={() => odgovori(p.id, 'decline')}>
                  Zavrni
                </button>
                <button className={buttonClass} onClick={() => odgovori(p.id, 'accept')}>
                  Sprejmi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {odprtObrazec && (
        <Card className="mb-8">
          <form onSubmit={ustvari} noValidate className="space-y-5">
            <h2 className="text-lg font-semibold">Nov bend</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Ime benda" napaka={polja.ime}>
                <input className={inputClass} value={obrazec.ime} onChange={(e) => setObrazec({ ...obrazec, ime: e.target.value })} />
              </Field>
              <Field label="Mesto" napaka={polja.mesto}>
                <input className={inputClass} value={obrazec.mesto} onChange={(e) => setObrazec({ ...obrazec, mesto: e.target.value })} />
              </Field>
            </div>
            <div className="text-sm">
              <span className="mb-1.5 block font-medium">Žanri</span>
              <div className="flex flex-wrap gap-2">
                {zanri.map((z) => {
                  const izbran = obrazec.zanri.includes(z.id)
                  return (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => preklopiZanr(z.id)}
                      className={`rounded-full border px-3 py-1 text-sm ${izbran ? 'border-accent bg-accent text-white' : 'border-line hover:border-accent'}`}
                    >
                      {z.ime}
                    </button>
                  )
                })}
              </div>
              {polja.zanri && <span className="mt-1 block text-xs text-red-600">{polja.zanri}</span>}
            </div>
            <Field label="Opis (neobvezno)" napaka={polja.opis}>
              <textarea rows={3} className={inputClass} value={obrazec.opis} onChange={(e) => setObrazec({ ...obrazec, opis: e.target.value })} />
            </Field>
            <Field label="Tehnične zahteve (neobvezno)" napaka={polja.tehnicneZahteve}>
              <textarea rows={2} className={inputClass} value={obrazec.tehnicneZahteve} onChange={(e) => setObrazec({ ...obrazec, tehnicneZahteve: e.target.value })} />
            </Field>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="rounded-md border border-line px-4 py-2 text-sm hover:bg-paper"
                onClick={() => {
                  setOdprtObrazec(false)
                  setPolja({})
                }}
              >
                Prekliči
              </button>
              <button type="submit" className={buttonClass} disabled={posiljam}>
                {posiljam ? 'Shranjujem …' : 'Ustvari bend'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {bendi === null ? null : bendi.length === 0 ? (
        !odprtObrazec && <Empty>Nisi še član nobenega benda.</Empty>
      ) : (
        <div className="space-y-4">
          {bendi.map((b) => (
            <KarticaBenda key={b.id} bend={b} poPovabilu={nalozi} />
          ))}
        </div>
      )}
    </>
  )
}

function KarticaBenda({ bend, poPovabilu }: { bend: Bend; poPovabilu: () => void }) {
  const [email, setEmail] = useState('')
  const [sporocilo, setSporocilo] = useState<{ ok: boolean; besedilo: string } | null>(null)
  const [posiljam, setPosiljam] = useState(false)

  async function povabi(e: FormEvent) {
    e.preventDefault()
    setSporocilo(null)
    setPosiljam(true)
    try {
      const o = await api<{ povabljen: { prikaznoIme: string } }>(`/bands/${bend.id}/invite`, { method: 'POST', body: { email } })
      setSporocilo({ ok: true, besedilo: `Povabilo poslano: ${o.povabljen.prikaznoIme}` })
      setEmail('')
      poPovabilu()
    } catch (err) {
      const besedilo = err instanceof ApiNapaka ? (err.polja.email ?? err.message) : 'Strežnik ni dosegljiv.'
      setSporocilo({ ok: false, besedilo })
    } finally {
      setPosiljam(false)
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{bend.ime}</h3>
          <p className="text-sm text-muted">{bend.mesto}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {bend.zanri.map((z) => (
            <span key={z.id} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
              {z.ime}
            </span>
          ))}
        </div>
      </div>

      {bend.opis && <p className="mt-3 text-sm">{bend.opis}</p>}

      <h4 className="mt-5 mb-2 text-sm font-medium">Člani</h4>
      <ul className="divide-y divide-line rounded-lg border border-line text-sm">
        {bend.clani.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-2">
            <span>
              {c.prikaznoIme} <span className="text-muted">· {c.email}</span>
            </span>
            <span className="text-xs text-muted">
              {c.vlogaVBendu === 'VODJA' ? 'vodja' : c.status === 'POVABLJEN' ? 'povabljen' : 'član'}
            </span>
          </li>
        ))}
      </ul>

      {bend.jeVodja && (
        <form onSubmit={povabi} noValidate className="mt-4 flex flex-wrap items-start gap-2">
          <input
            type="email"
            placeholder="E-naslov glasbenika"
            className={`${inputClass} max-w-xs flex-1`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className={buttonClass} disabled={posiljam || !email}>
            Povabi
          </button>
          {sporocilo && (
            <p className={`w-full text-xs ${sporocilo.ok ? 'text-emerald-600' : 'text-red-600'}`}>{sporocilo.besedilo}</p>
          )}
        </form>
      )}
    </Card>
  )
}
