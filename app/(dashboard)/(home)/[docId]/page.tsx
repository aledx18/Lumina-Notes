import { requireAuth } from '@/lib/auth-utils'

interface Props {
  params: Promise<{ docId: string }>
}

export default async function Page({ params }: Props) {
  await requireAuth()
  const { docId } = await params
  return (
    <div>
      <h1>Hello DocId! {docId}</h1>
    </div>
  )
}
