import Axios from './axios'


export const getCardsWithImage = async (amount: number = 10) => {
  const res = await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards/with-image/${amount}`);
  return res.data;
};

