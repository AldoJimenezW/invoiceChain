'use client'

import { useState } from 'react'
import { Card as UICard, CardContent, CardHeader, CardTitle, Card } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { createCard } from '~/lib/card'
import { useSession } from '~/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import Link from 'next/link'

type NewCard = {
  userId: string
  title: string
  description: string
}

export default function CreateCardPage() {
  const session = useSession()
  const user = session?.data?.user
  const userId = session?.data?.user?.id

  const [formData, setFormData] = useState<NewCard>({
    userId: userId ?? '',
    title: '',
    description: '',
  })

  const [createdCard, setCreatedCard] = useState<NewCard | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!userId) {
    return <p className="text-white">Please log in to create a card.</p>
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const newCard = await createCard({ ...formData, userId }) // force inject userId
      setCreatedCard(newCard)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <UICard className="border-white/10 backdrop-blur-md bg-white/20">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Create New Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white mb-6 text-sm">
            Fill out the form below to create a new digital card.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="bg-white"
            />
            <Input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="bg-white"
            />
            <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </form>
        </CardContent>
      </UICard>

      {error && <p className="text-red-500">{error}</p>}

      {createdCard && (
        <div className="align-center justify-center space-y-4 absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-white text-xl">This is your new card!</h1>
          <Card
            key={user?.id}
            className="flex flex-row items-center backdrop-blur-md bg-black/40 border border-gray-700 rounded-xl w-[55rem] h-70 shadow-md"
          >
            {/* Left side: Image */}
            <div className="flex items-center justify-center w-1/3">
              <Avatar className="h-50 w-50 ring-2 ring-blue-500">
                <AvatarImage src={user?.image || undefined} alt="avatar" className="object-cover" />
                <AvatarFallback className="bg-blue-700 text-white font-bold text-2xl">
                  {formData.title
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
                  {formData.title}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-6">{formData.description}</p>
              </div>
              {/* Wrap button with Link */}
              <Link href={`/user/${formData.userId}`}>
                <button className=" bg-blue-600 hover:bg-blue-500 transition-colors text-white text-sm font-medium py-2 px-4 rounded-md shadow">
                  Get in touch
                </button>
              </Link>
            </div>
          </Card>

        </div>
      )}
    </div>
  )
}
