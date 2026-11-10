import { Empty, PageTitle, buttonClass } from '../components/ui'

export default function MojiBendi() {
  return (
    <>
      <PageTitle aside={<button className={buttonClass} disabled>Nov bend</button>}>Moji bendi</PageTitle>
      <Empty>Nisi še član nobenega benda.</Empty>
    </>
  )
}
