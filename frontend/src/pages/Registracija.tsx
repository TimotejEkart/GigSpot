import { Link } from 'react-router-dom'
import { Card, Field, buttonClass, inputClass } from '../components/ui'

export default function Registracija() {
  return (
    <Card className="mx-auto max-w-sm space-y-5">
      <h1 className="text-2xl font-semibold">Registracija</h1>
      <Field label="Ime in priimek">
        <input className={inputClass} />
      </Field>
      <Field label="E-pošta">
        <input type="email" className={inputClass} />
      </Field>
      <Field label="Geslo">
        <input type="password" className={inputClass} />
      </Field>
      <Field label="Vloga">
        <select className={inputClass}>
          <option>Glasbenik</option>
          <option>Organizator</option>
          <option>Obiskovalec</option>
        </select>
      </Field>
      <button className={`${buttonClass} w-full`} disabled>
        Ustvari račun
      </button>
      <p className="text-center text-sm text-muted">
        Že imaš račun?{' '}
        <Link to="/prijava" className="text-accent hover:underline">
          Prijava
        </Link>
      </p>
    </Card>
  )
}
