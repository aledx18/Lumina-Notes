'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
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
import { FieldDescription } from '@/components/ui/field'
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

const registerSchema = z
  .object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Password must be at least 6 characters')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  async function onSubmit(values: RegisterFormValues) {
    console.log(values)

    await authClient.signUp.email(
      {
        name: values.email,
        email: values.email,
        password: values.password,
        callbackURL: '/'
      },
      {
        onSuccess: () => {
          toast.success('Sign up successful')

          router.push('/')
        },
        onError: (error) => {
          let errorMessage = 'Sign up failed'

          if (error?.error.message) {
            const msgMatch = error.error.message.match(/"msg":"([^"]+)"/)
            if (msgMatch?.[1]) {
              errorMessage = msgMatch[1]
            }
          }

          toast.error(errorMessage)
        }
      }
    )
  }

  const isPending = form.formState.isSubmitting

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid gap-6'>
                <div className='flex flex-col gap-4'>
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
                </div>
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
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
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
                    Sign Up
                  </Button>
                </div>
                <div className='text-center text-sm'>
                  Already have an account ?{' '}
                  <Link className='underline underline-offset-4' href='/login'>
                    Login
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
