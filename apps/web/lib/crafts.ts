import Axios from './axios'

export const getCrafts = async (id: string) => {
  const res = await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/crafts/${id}`);
  return res.data;
};
