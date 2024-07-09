import axios from "axios";
import { BOOKMARK_API, INIT } from "../utils/api-url";

export const bookmarkPost = async (token: string, postId: number) => {
  const response = await axios.post(
    `${process.env.REACT_APP_SERVER_URL}${INIT}${BOOKMARK_API}/`,
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
};
export const getPostBookmark = async (postId: number, token: string) => {
  const response = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}${INIT}${BOOKMARK_API}/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response.status === 200) {
    return response.data;
  }
};
