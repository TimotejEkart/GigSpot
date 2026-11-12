export type NacinPlacila = 'HONORAR' | 'DELITEV_VSTOPNINE' | 'BREZ'
export type StatusTermina = 'ODPRT' | 'ZAPRT' | 'OBJAVLJEN' | 'IZVEDEN' | 'ODPOVEDAN'

export type Termin = {
  id: number
  datum: string
  stBendov: number
  nacinPlacila: NacinPlacila
  znesek: number | null
  rokPrijave: string
  status: StatusTermina
  zanri: { id: number; ime: string }[]
  prizorisce: {
    id: number
    ime: string
    mesto: string
    naslov: string
    kontaktTelefon?: string | null
    kontaktEmail?: string | null
  }
}

export const naciniPlacila: Record<NacinPlacila, string> = {
  HONORAR: 'Honorar',
  DELITEV_VSTOPNINE: 'Delitev vstopnine',
  BREZ: 'Brez plačila',
}

export const statusiTermina: Record<StatusTermina, string> = {
  ODPRT: 'Odprt',
  ZAPRT: 'Zaprt',
  OBJAVLJEN: 'Objavljen',
  IZVEDEN: 'Izveden',
  ODPOVEDAN: 'Odpovedan',
}

export function formatDatum(datum: string) {
  return new Date(`${datum}T00:00`).toLocaleDateString('sl-SI', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatRok(rok: string) {
  return new Date(rok).toLocaleString('sl-SI', { dateStyle: 'medium', timeStyle: 'short' })
}

export function opisPlacila(t: Pick<Termin, 'nacinPlacila' | 'znesek'>) {
  return t.nacinPlacila === 'HONORAR' && t.znesek !== null ? `Honorar ${t.znesek} €` : naciniPlacila[t.nacinPlacila]
}

// "iščejo 1 bend / 2 benda / 3 bende / 5 bendov"
export function steviloBendov(n: number) {
  if (n === 1) return '1 bend'
  if (n === 2) return '2 benda'
  if (n === 3 || n === 4) return `${n} bende`
  return `${n} bendov`
}
