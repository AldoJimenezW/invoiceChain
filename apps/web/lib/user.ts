import Axios from './axios'


export const getTopUsers = async (amount: number) => {
  const res = await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/top-users/${amount}`);
  return res.data;
};

// export const updateUserProfile = async (data: UserProfileUpdateDto) => {
//   const res = await axios.put('/users/profile', data);
//   return res.data;
// };
