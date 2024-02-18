import React, { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import { getMainPost } from "../../../Redux/postList";
import { postType } from "../../../Interfaces/post";
interface postListProps {
  post: postType
}
const PostList: React.FC<postListProps> = (
  post
) => {
  const dispatch = useDispatch();
  return (
    <div>{post.post.content}</div>
  )
}

export default PostList;