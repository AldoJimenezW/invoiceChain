'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link' // Import Link
import {
  Card,
} from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import EmblaCarousel from '~/components/ui/EmblaCarousel'
import { EmblaOptionsType } from 'embla-carousel'
import { Star } from 'lucide-react';
import { useDashboardData } from '~/hooks/useDashboardData'

export default function Dashboard() {
  const [bestRatedUsers, setBestRatedUsers] = useState<{ id: number, image: string, name: string, rating: number, profession: string, biography: string }[]>([])
  const [cards, setCards] = useState<{ id: number, userId: string, image: string, title: string, description: string }[]>([])
  const OPTIONS: EmblaOptionsType = { loop: true }
  const { data, loading, error } = useDashboardData(5);

  useEffect(() => {
    if (data) {
      setBestRatedUsers(data.user);
      setCards(data.card);
    }
  }, [data]);

  const cardSlides = cards.map((card) => (
    <Card
      key={card.id}
      className="flex flex-row items-center backdrop-blur-md bg-black/40 border border-gray-700 rounded-xl w-[55rem] h-70 shadow-md"
    >
      {/* Left side: Image */}
      <div className="flex items-center justify-center w-1/3">
        <Avatar className="h-50 w-50 ring-2 ring-blue-500">
          <AvatarImage src={card.image} alt="avatar" className="object-cover" />
          <AvatarFallback className="bg-blue-700 text-white font-bold text-2xl">
            {card.title
              .split(' ')
              .map(word => word[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Right side: Content */}
      <div className="flex flex-col justify-between w-2/3 h-full pr-6 pb-2">
        <div>
          <h3 className="text-2xl font-semibold text-white mb-2 truncate">
            {card.title}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-6">{card.description}</p>
        </div>
        {/* Wrap button with Link */}
        <Link href={`/user/${card.userId}`}>
          <button className=" bg-blue-600 hover:bg-blue-500 transition-colors text-white text-sm font-medium py-2 px-4 rounded-md shadow">
            Get in touch
          </button>
        </Link>
      </div>
    </Card>
  ));

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
                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-medium">{user.rating}/5</span>
                  </div>

                  <p
                    className="text-sm text-white/90 max-w-xs
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
