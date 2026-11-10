import { Empty, PageTitle, buttonClass } from '../components/ui'

export default function Prizorisca() {
  return (
    <>
      <PageTitle aside={<button className={buttonClass} disabled>Novo prizorišče</button>}>Moja prizorišča</PageTitle>
      <Empty>Nimaš še dodanih prizorišč.</Empty>
    </>
  )
}
