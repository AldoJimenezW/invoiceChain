'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent
} from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import EmblaCarousel from '~/components/ui/EmblaCarousel'
import { EmblaOptionsType } from 'embla-carousel'
import { Star } from 'lucide-react';

export default function Dashboard() {
  const [user] = useState({
    name: 'Jane Doe',
    email: 'jane@example.com',
    joinedDate: 'March 2023',
  })
  const [bestRatedUsers, setBestRatedUsers] = useState<{ id: number, pic: string, name: string, rating: number }[]>([])
  const OPTIONS: EmblaOptionsType = { loop: true }

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/top-users/3`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        console.log(data)
        setBestRatedUsers(data)
      } catch (e) {
        // Optionally handle error
        setBestRatedUsers([])
      }
    }
    fetchTopUsers()
  }, [])

  const cards = [
    { id: 1, image: '/bg.jpg', title: 'User A', description: "This is a description" },
    { id: 2, image: '/bg.jpg', title: 'User B', description: "This is a description" },
    { id: 3, image: '/bg.jpg', title: 'User C', description: "This is a description" },
    { id: 4, image: '/bg.jpg', title: 'User C', description: "This is a description" },
    { id: 5, image: '/bg.jpg', title: 'User C', description: "This is a description" },
    { id: 6, image: '/bg.jpg', title: 'User C', description: "This is a description" },
    { id: 7, image: '/bg.jpg', title: 'User C', description: "This is a description" },
    { id: 8, image: '/bg.jpg', title: 'User C', description: "This is a description" },
  ]

  const cardSlides = cards.map((card) => (
    <Card key={card.id} className='bg-black/60 border-none backdrop-blur-xl'>
      <CardContent className='flex items-center px-16 h-80 w-240 gap-x-6'>
        <Avatar className='h-64 w-64 mr-4'>
          <AvatarImage src={card.image} alt="image" />
          <AvatarFallback className='bg-blue-100 text-blue-700'>
            {card.title
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-4 justify-start h-full">
          <p className='font-medium text-gray-800 text-white'>{card.title}</p>
          <p className='text-xl text-white'>
            {card.description}
          </p>
        </div>
        <button className='absolute bottom-4 right-4 text-white bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
          Get in touch
        </button>
      </CardContent>
    </Card>
  ))

  return (
    <div>
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]" >
        <EmblaCarousel slides={cardSlides} options={OPTIONS} />
      </div>
      <div className='container mx-auto py-8 '>
        {/* Best Rated Section */}
        <section >
          <h2 className='text-4xl font-bold text-white mb-4'>Best Rated</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {bestRatedUsers.map((user) => (
              <Card key={user.id} className='bg-black/60 border-none backdrop-blur-xl'>
                <CardContent className='flex items-center p-4'>
                  <Avatar className='h-12 w-12 mr-4'>
                    <AvatarImage src={user.pic} alt={user.name} />
                    <AvatarFallback className='bg-blue-100 text-blue-700'>
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium text-white'>{user.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-2 text-sm text-white">{user.rating}/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section >
      </div>
    </div>
  )
}
