import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-5xl font-semibold text-line">404</p>
      <p className="mt-4 text-muted">Ta stran ne obstaja.</p>
      <Link to="/" className="mt-6 inline-block text-sm text-accent hover:underline">
        Nazaj na koncerte
      </Link>
    </div>
  )
}
