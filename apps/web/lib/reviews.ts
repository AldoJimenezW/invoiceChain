import Axios from './axios'

export const getReviewsToUser = async (id: string) => {
  const res = await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews/to/${id}`);
  return res.data;
};
