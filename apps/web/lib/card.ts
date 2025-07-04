import Axios from './axios'


export const getCardsWithImage = async (amount: number = 10) => {
  const res = await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards/with-image/${amount}`);
  return res.data;
};

export type Card = {
  id?: number
  userId: string
  title: string
  description: string
}

export const createCard = async (data: Card) => {
  const res = await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cards`, data)
  return res.data as Card
}