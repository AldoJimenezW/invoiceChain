'use client'

import { use, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Star, MapPin } from 'lucide-react'
import { useUserData } from '~/hooks/useUserData'

type Props = {
  params: Promise<{ id: string }>
}

export default function Profile({ params }: Props) {
  const { id } = use(params)

  const { data, loading, error } = useUserData(id) as {
    data: {
      user: {
        name?: string
        lastName?: string
        image?: string
        profession?: string
        location?: string
        email?: string
        createdAt?: string
        biography?: string
        rating?: number
      } | null,
      reviews: {
        rating: number
        comment: string
        timestamp: string
      }[] | null,
      crafts: {
        title: string
        description: string
        image: string
      }[]
    }
    loading: boolean
    error: any
  }

  const user = data?.user;
  const reviews = data?.reviews;
  const crafts = data?.crafts;
  console.log(crafts)

  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in')
  const [showContent, setShowContent] = useState(!loading)

  useEffect(() => {
    if (!loading !== showContent) {
      setFadeState('fade-out')
      const timeout = setTimeout(() => {
        setShowContent(!loading)
        setFadeState('fade-in')
      }, 250)
      return () => clearTimeout(timeout)
    }
  }, [loading, showContent])

  const getInitials = (name?: string, lastName?: string) => {
    if (!name && !lastName) return 'U'
    return `${name?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()
  }

  if (loading && !showContent) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <p className='text-white text-xl'>Loading...</p>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        .fade-in {
          opacity: 1;
          transition: opacity 250ms ease-in;
        }
        .fade-out {
          opacity: 0;
          transition: opacity 250ms ease-out;
        }
      `}</style>

      <div className={`max-w-3xl mx-auto ${fadeState} space-y-6`}>

        {/* PROFILE CARD */}
        <Card className='border-white/10 backdrop-blur-md bg-white/20'>
          <CardContent className='pt-6 flex flex-col items-center text-center'>
            <Avatar className='h-24 w-24 mb-4'>
              <AvatarImage
                src={user?.image ?? '/placeholder.svg?height=96&width=96'}
                alt={`${user?.name ?? ''} ${user?.lastName ?? ''}`}
                className='object-cover object-center w-full h-full'
              />
              <AvatarFallback className='bg-blue-500 text-[#71fff0] text-xl'>
                {getInitials(user?.name, user?.lastName)}
              </AvatarFallback>
            </Avatar>
            <h2 className='text-xl font-bold text-white'>
              {user?.name} {user?.lastName}
            </h2>
            <p className='text-white text-sm'>{user?.profession ?? 'No profession'}</p>
            <p className='text-white text-sm flex items-center mt-1'>
              <MapPin className='h-3 w-3 mr-1' />
              {user?.location ?? 'N/A'}
            </p>
            <div className='flex items-center text-[#71fff0] mt-2'>
              <Star className='h-5 w-5 mr-1 text-yellow-500 fill-yellow-500' />
              <span className='text-white text-sm'>
                {user?.rating?.toFixed(1) ?? '0.0'}/5.0
              </span>
            </div>
            <Button className='mt-4 bg-blue-500 text-white hover:bg-blue-600'>Contact Now</Button>
          </CardContent>
        </Card>

        {/* CRAFTS SECTION */}
        <Card className='border-white/10 backdrop-blur-md bg-white/20'>
          <CardHeader>
            <CardTitle className='text-[#71fff0]'>Crafts</CardTitle>
            <CardDescription className='text-white'>
              Creations and work samples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2'>
              {Array.isArray(crafts) && crafts.length > 0 ? (
                crafts.map((craft, index) => (
                  <Card key={index} className='bg-white/10 border-white/10'>
                    <CardContent className='p-4'>
                      <img
                        src={craft.image}
                        alt={craft.title}
                        className='w-full h-32 object-cover rounded mb-2'
                      />
                      <h3 className='text-white font-bold'>{craft.title}</h3>
                      <p className='text-white text-sm'>{craft.description}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className='text-white text-sm'>No crafts to show.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* REVIEWS SECTION */}
        <Card className='border-white/10 backdrop-blur-md bg-white/20'>
          <CardHeader>
            <CardTitle className='text-[#71fff0]'>Reviews</CardTitle>
            <CardDescription className='text-white'>
              What people are saying
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {(reviews ?? []).map((review, index) => (
                <div key={index} className='bg-white/10 p-3 rounded'>
                  <div className="flex items-center space-x-1 text-yellow-200">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{review.rating}/5</span>
                  </div>
                  <p className='text-sm text-white'>{review.comment}</p>
                  <p className='text-xs text-white/70 mt-1'>
                    {new Date(review.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {reviews?.length === 0 && (
                <p className='text-white text-sm'>No reviews yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
