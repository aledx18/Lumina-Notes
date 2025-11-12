'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { FieldDescription, FieldSeparator } from '@/components/ui/field'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(values: LoginFormValues) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: '/'
      },
      {
        onSuccess: () => {
          router.push('/')
        },
        onError: (ctx) => {
          toast.error(ctx.error.message)
        }
      }
    )
  }

  //   const authClient = createAuthClient()

  //   const signIn = async () => {
  //     await authClient.signIn.social({
  //       provider: 'github'
  //     })
  //   }

  const isPending = form.formState.isSubmitting

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>
            Login with your Github or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid gap-6'>
                {/* <div className='flex flex-col gap-4'>
                  <Button
                    disabled={isPending}
                    type='button'
                    className='w-full'
                    variant='outline'
                  >
                    <Image
                      src='/github.svg'
                      alt='GitHub'
                      width={20}
                      height={20}
                    />
                    Continue with GitHub
                  </Button>
                  <Button
                    disabled={isPending}
                    type='button'
                    className='w-full'
                    variant='outline'
                  >
                    <Image
                      src='/google.svg'
                      alt='Google'
                      width={20}
                      height={20}
                    />
                    Continue with Google
                  </Button>
                </div> */}
                <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                  Or continue with
                </FieldSeparator>
                <div className='grid gap-6'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='email'
                            placeholder='m@example.com'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='password'
                            placeholder='••••••••'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={isPending} type='submit' className='w-full'>
                    Login
                  </Button>
                </div>
                <div className='text-center text-sm'>
                  Don&apos;t have an account ?{' '}
                  <Link className='underline underline-offset-4' href='/signup'>
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className='px-6 text-center'>
        By clicking continue, you agree to our{' '}
        <a href='/terms'>Terms of Service</a> and{' '}
        <a href='/privacy'>Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
