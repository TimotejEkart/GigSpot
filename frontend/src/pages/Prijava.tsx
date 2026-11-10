import { Link } from 'react-router-dom'
import { Card, Field, buttonClass, inputClass } from '../components/ui'

export default function Prijava() {
  return (
    <Card className="mx-auto max-w-sm space-y-5">
      <h1 className="text-2xl font-semibold">Prijava</h1>
      <Field label="E-pošta">
        <input type="email" className={inputClass} />
      </Field>
      <Field label="Geslo">
        <input type="password" className={inputClass} />
      </Field>
      <button className={`${buttonClass} w-full`} disabled>
        Prijava
      </button>
      <p className="text-center text-sm text-muted">
        Še nimaš računa?{' '}
        <Link to="/registracija" className="text-accent hover:underline">
          Registracija
        </Link>
      </p>
    </Card>
  )
}
