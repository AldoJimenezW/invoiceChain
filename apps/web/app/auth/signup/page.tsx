'use client'

import React, { Suspense, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Flower, Loader2, Github, Wand2 } from 'lucide-react'
//
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Separator } from '~/components/ui/separator'
import { authClient } from '~/lib/auth'

type FormValues = {
  name: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

type MagicLinkFormValues = {
  email: string
  terms: boolean
}

function RegisterForm() {
  const router = useRouter()

  // Regular registration form
  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (data: FormValues) => {
    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      })
      return
    }

    // Register with email and password
    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        lastName: data.lastName,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success('Welcome!', {
            description: 'Your account has been created successfully.',
          })
          router.push('/dashboard')
        },
        onError: ({ error }) => {
          toast.error('Registration failed', {
            description:
              error.message || 'There was a problem creating your account',
          })
        },
      }
    )
  }

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: 'url("/bg.jpg")' }}
    >      <Card className='className="px-4 py-8 md:p-10 sm:p-4 border border-black rounded-xl bg-black/50 shadow w-1/2 sm:w-full sm:max-w-sm md:max-w-md xl:max-w-2xl"'>
        <CardHeader className='text-center'>

          <CardTitle className='text-2xl font-bold text-white'>
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <Separator className='w-full' />
              </div>

            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 mt-2 '
              >
                <FormField
                  control={form.control}
                  name='name'
                  rules={{
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Name'
                          {...field}
                          className="w-full bg-white px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lastName'
                  rules={{
                    required: 'Last Name is required',
                    minLength: {
                      value: 2,
                      message: 'Last Name must be at least 2 characters',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Last Name'
                          {...field}
                          className="w-full bg-white px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder="Email"
                          {...field}
                          className="w-full bg-white px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    pattern: {
                      value:
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                      message:
                        'Password must include at least one letter, one number, and one special character',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Password'
                          type='password'
                          {...field}
                          className="w-full bg-white px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  rules={{
                    required: 'Please confirm your password',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Confirm Password'

                          {...field}
                          className="w-full bg-white px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='terms'
                  rules={{
                    required: 'You must agree to the terms and conditions',
                  }}
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md p-1'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className='data-[state=checked]:bg-blue-700 data-[state=checked]:border-indigo-600'
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel className='text-white leading-none'>
                          I agree to the{' '}
                          <Link
                            href='#'
                            className='text-gray-300 hover:text-blue-300 hover:underline'
                          >
                            terms and conditions
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type='submit'
                  className="w-full py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition font-medium text-xs md:text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Creating account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </form>
            </Form>

          </div>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4 pt-0'>
          <div className='text-center text-white'>
            Already have an account?{' '}
            <Link
              href='/auth/signin'
              className='text-gray-300 hover:text-blue-300 hover:underline'
            >
              Sign In
            </Link>
          </div>
          <Link
            href='/'
            className='text-gray-300 hover:text-blue-300 hover:underline text-sm flex items-center justify-center'
          >
            <ArrowLeft className='mr-1 h-3 w-3' />
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

// Main exported component wrapped in Suspense
export default function SignUp() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4'>
          <div className='text-center'>
            <Loader2 className='h-8 w-8 animate-spin mx-auto text-indigo-500' />
            <p className='mt-2 text-indigo-700'>Loading...</p>
          </div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
