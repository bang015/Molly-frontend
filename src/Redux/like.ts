import axios from "axios";
import { INIT, LIKE_API } from "../utils/api-url";
const token = localStorage.getItem('accessToken');
export const likePost = async ( postId: number) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${LIKE_API}/`,
      { postId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch {}
};

export const getPostLike = async ( postId: number) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${LIKE_API}/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch {}
};
