import axios from "axios";
import { INIT, LIKE_API } from "../utils/api-url";

export const likePost = async (token: string, postId: number) => {
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

export const getPostLike = async (token: string, postId: number) => {
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
