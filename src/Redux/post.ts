import axios from "axios";
import { uploadPostType } from "../Interfaces/post";
import { INIT, POST_API } from "../Utils/api-url";

export const uploadPost = (token: string, post: uploadPostType) => {
  const formData = new FormData();
  formData.append("content", post.content);
  post.post_images.forEach((image, index) => {
    const fileName = `image_${index}.png`;
    const file = new File([image], fileName, { type: image.type });
    formData.append(`post_images`, file);
  });
  if (post.hashtags) {
    post.hashtags.forEach((tag, index) => {
      formData.append(`hashtags[${index}]`, tag);
    });
  }
  axios
    .post(`${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "multipart/form-data", 
      },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
