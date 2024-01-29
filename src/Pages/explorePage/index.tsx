import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPost } from "../../Redux/postList";
import { RootState } from "../../Redux";

const Explore: React.FC = () => {
  const dispatch = useDispatch();
  const allPostList = useSelector((state:RootState) => state.postListReducer);
  const [page,setPage] = useState(1)
  useEffect(()=>{
    dispatch(getAllPost(page) as any)
  },[page])
  console.log(allPostList);
  return (
    <div>gd</div>
  )
}

export default Explore;