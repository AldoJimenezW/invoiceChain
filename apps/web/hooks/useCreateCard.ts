import { useEffect, useState } from 'react'
import { createCard } from '~/lib/card'

export const useCreateCard = (dataCard: any | null) => {
  const [data, setData] = useState<{ card: any } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!dataCard) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const card = await createCard(dataCard)
        setData({ card })
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dataCard])

  return { data, loading, error }
}
