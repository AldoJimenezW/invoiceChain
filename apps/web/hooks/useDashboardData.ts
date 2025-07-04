import { useEffect, useState } from 'react';
import { getTopUsers } from '../lib/user';
import { getCardsWithImage } from '~/lib/card';

export const useDashboardData = (amount: number) => {
  const [data, setData] = useState<{ user: any; card: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, card] = await Promise.all([
          getTopUsers(amount),
          getCardsWithImage(),
        ]);
        setData({ user, card });
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
