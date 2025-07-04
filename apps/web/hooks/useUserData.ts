import { useEffect, useState } from 'react';
import { getUser } from '../lib/user';
import { getReviewsToUser } from '~/lib/reviews';
import { getCrafts } from '~/lib/crafts';

export const useUserData = (id: string) => {
  const [data, setData] = useState<{ user: any; reviews: any; crafts: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, reviews, crafts] = await Promise.all([
          getUser(id),
          getReviewsToUser(id),
          getCrafts(id),
        ]);
        setData({ user, reviews, crafts });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
