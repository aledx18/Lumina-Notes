import { caller } from '@/trpc/server'

export default async function Ejempl() {
  const data = await caller.user.getOne()
  return <div>{JSON.stringify(data)}</div>
}
