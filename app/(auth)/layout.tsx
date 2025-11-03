import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <Link
          href='/'
          className='flex items-center gap-2 self-center font-medium'
        >
          <div className='flex gap-x-1 items-center justify-center rounded-md text-xl'>
            {/** biome-ignore lint/a11y/noSvgWithoutTitle: <...> */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3' />
            </svg>
            Acme Inc.
          </div>
        </Link>
        {children}
      </div>
    </div>
  )
}
