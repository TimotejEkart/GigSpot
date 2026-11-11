export type Vloga = 'OBISKOVALEC' | 'GLASBENIK' | 'ORGANIZATOR' | 'ADMIN'

export type Uporabnik = {
  id: number
  email: string
  prikaznoIme: string
  telefon: string | null
  vloga: Vloga
}

export class ApiNapaka extends Error {
  status: number
  polja: Record<string, string>

  constructor(status: number, sporocilo: string, polja: Record<string, string> = {}) {
    super(sporocilo)
    this.status = status
    this.polja = polja
  }
}

// Vsi klici gredo na /api (Vite proxy na backend), piškotek se pošlje samodejno.
export async function api<T>(pot: string, moznosti: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(`/api${pot}`, {
    method: moznosti.method ?? 'GET',
    credentials: 'include',
    headers: moznosti.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: moznosti.body !== undefined ? JSON.stringify(moznosti.body) : undefined,
  })

  if (res.status === 204) return undefined as T

  const podatki = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiNapaka(res.status, podatki.napaka ?? 'Prišlo je do napake.', podatki.polja)
  }
  return podatki as T
}
