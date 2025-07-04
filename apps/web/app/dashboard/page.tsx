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
import { useDashboardData } from '~/hooks/useDashboardData'

export default function Dashboard() {
  const [bestRatedUsers, setBestRatedUsers] = useState<{ id: number, image: string, name: string, rating: number, profession: string, biography: string }[]>([])
  const [cards, setCards] = useState<{ id: number, image: string, title: string, description: string }[]>([])
  const OPTIONS: EmblaOptionsType = { loop: true }
  const { data, loading, error } = useDashboardData(5);

  useEffect(() => {
    if (data) {
      setBestRatedUsers(data.user);
      setCards(data.card);
      console.log(data.card)
    }
  }, [data]);

  const cardSlides = cards.map((card) => (
    <Card key={card.id} className='bg-black/60 border-none backdrop-blur-xl'>
      <CardContent className='flex items-center px-16 h-64 w-220 gap-x-6'>
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
      <div className='container mx-auto '>
        {/* Best Rated Section */}
        <section >
          <h2 className='text-4xl font-bold text-white mb-4'>Best Rated</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
            {bestRatedUsers.map((user) => (
              <Card
                key={user.id}
                className="w-full max-w-sm mx-auto p-6 rounded-3xl shadow-xl border border-white/10 backdrop-blur-md bg-white/20"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
                    <AvatarImage src={user.image} alt={user.name} className='object-cover' />
                    <AvatarFallback className="bg-blue-200 text-white text-xl font-bold">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="text-lg font-bold text-white drop-shadow">{user.name}</p>
                    <p className="text-sm text-blue-100">{user.profession}</p>
                  </div>

                  <div className="flex items-center space-x-1 text-yellow-300">
                    <Star className="w-5 h-5 fill-yellow-300" />
                    <span className="text-sm font-medium">{user.rating}/5</span>
                  </div>

                  <p
                    className="
        text-sm text-white/90 max-w-xs
        line-clamp-4
        overflow-hidden
      "
                    style={{ maxHeight: '5.5rem' }}
                  >
                    {user.biography}
                  </p>
                </div>
              </Card>


            ))}
          </div>
        </section >
      </div>
    </div>
  )
}
