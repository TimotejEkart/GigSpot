import { useEffect, useState } from 'react'

type Stanje = 'preverjam' | 'ok' | 'napaka'

// Pokaže, ali frontend doseže backend (GET /api/health).
export default function ApiStatus() {
  const [stanje, setStanje] = useState<Stanje>('preverjam')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => setStanje(res.ok ? 'ok' : 'napaka'))
      .catch(() => setStanje('napaka'))
  }, [])

  const barva = stanje === 'ok' ? 'bg-emerald-500' : stanje === 'napaka' ? 'bg-red-500' : 'bg-stone-300'
  const besedilo = stanje === 'ok' ? 'API dosegljiv' : stanje === 'napaka' ? 'API ni dosegljiv' : 'Preverjam API'

  return (
    <span className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${barva}`} />
      {besedilo}
    </span>
  )
}
