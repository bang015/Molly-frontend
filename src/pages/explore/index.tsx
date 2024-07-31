import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPost } from '@/redux/postList'
import { RootState } from '@/redux'
import Nav from '@/components/nav/navBar'
import './index.css'
import { openModal } from '@/redux/modal'

const Explore: React.FC = () => {
  const dispatch = useDispatch()
  const allPostList = useSelector((state: RootState) => state.postListReducer.posts.explore)
  const [page, setPage] = useState(1)
  useEffect(() => {
    dispatch(getAllPost({ page }) as any)
  }, [page])

  window.addEventListener('scroll', function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPage(page + 1)
    }
  })
  return (
    <div className="mainPage">
      <Nav></Nav>
      <div className="pcontent">
        <div className="image-grid">
          {allPostList.map(post => (
            <div
              key={post.id}
              onClick={() => {
                dispatch(openModal({ modalType: 'PostDetailModal', id: post.id }))
              }}
            >
              <img
                className="image_item"
                srcSet={`${post.postMedias[0].path}?w=300&h=300&fit=crop&auto=format&dpr=2 2x`}
                src={`${post.postMedias[0].path}?w=300&h=300&fit=crop&auto=format`}
                alt={post.content}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Explore
