import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExplorePost } from '@/redux/postList'
import { RootState } from '@/redux'
import Nav from '@/components/nav/navBar'
import { openModal } from '@/redux/modal'

const Explore: React.FC = () => {
  const dispatch = useDispatch()
  const allPostList = useSelector((state: RootState) => state.postListReducer.posts.explore)
  const totalPages = useSelector((state: RootState) => state.postListReducer.totalPages.explore)
  const [page, setPage] = useState(1)
  useEffect(() => {
    dispatch(getExplorePost({ page, limit: 30 }) as any)
  }, [page])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight * 0.9) {
        if (page < totalPages) {
          setPage(prevPage => prevPage + 1)
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [page, totalPages])
  return (
    <div className="relative flex size-full overflow-auto">
      <Nav></Nav>
      <div className={`ml-[16.6667%] w-full`}>
        <div className="m-auto w-[1000px] p-10">
          <div className="grid grid-cols-3 gap-1">
            {allPostList.map(post => (
              <button
                key={post.id}
                onClick={() => {
                  dispatch(openModal({ modalType: 'PostDetailModal', id: post.id }))
                }}
              >
                <img
                  srcSet={`${post.postMedias[0].path}?w=300&h=300&fit=crop&auto=format&dpr=2 2x`}
                  src={`${post.postMedias[0].path}?w=300&h=300&fit=crop&auto=format`}
                  alt={post.content}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Explore
