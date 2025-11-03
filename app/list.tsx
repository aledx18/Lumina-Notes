'use client'

import { useSuspensePosts } from '@/features/documents/suspense'

export default function List() {
  const users = useSuspensePosts()

  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      {JSON.stringify(users.data)}
    </div>
  )
}
