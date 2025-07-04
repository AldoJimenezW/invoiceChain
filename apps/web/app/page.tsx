'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { authClient, useSession } from '~/lib/auth'
import { Flower, Github, Loader2 } from 'lucide-react'
import { Separator } from '~/components/ui/separator'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function Home() {
  const [isGithubLoading, setIsGithubLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)

  const router = useRouter()
  // const { data: session } = useSession()

  const handleGithubLogin = async () => {
    setIsGithubLoading(true)
    await authClient.signIn.social(
      {
        provider: 'github',
        callbackURL: window.location.origin,
      },
      {
        onError: ({ error }) => {
          toast.error('GitHub login failed', {
            description: 'Could not authenticate with GitHub.',
          })

          setIsGithubLoading(false)
        },
      }
    )
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    await authClient.signIn.social(
      {
        provider: 'google',
        callbackURL: window.location.origin,
      },
      {
        onError: ({ error }) => {
          toast.error('Google login failed', {
            description: 'Could not authenticate with Google.',
          })

          setIsGoogleLoading(false)
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url("/bg.jpg")' }}>
      <div className="text-center">
        <h1 className="text-white text-[100px] font-light">inVoiceChain</h1>
        <p className="mb-8 text-white text-xl">Handmade with soul. Secured by blockchain.</p>
        <div className="flex justify-center gap-4">
          <Link href='/auth/signin' className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'>
            Sign In
          </Link>
          <Link href='/auth/signup' className='px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition'>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
