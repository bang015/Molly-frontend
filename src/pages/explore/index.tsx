import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExplorePost } from '@/redux/postList'
import { RootState } from '@/redux'
import Nav from '@/components/nav/navBar'
import { openModal } from '@/redux/modal'
import { PostType } from '@/interfaces/post'
import { CircularProgress } from '@mui/material'

const Explore: React.FC = () => {
  const dispatch = useDispatch()
  const target = useRef<HTMLDivElement | null>(null)
  const [hasObserved, setHasObserved] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const allPostList = useSelector((state: RootState) => state.postListReducer.posts.explore)
  const totalPages = useSelector((state: RootState) => state.postListReducer.totalPages.explore)
  const exploreLoading = useSelector((state: RootState) => state.postListReducer.loading.explore)
  const [page, setPage] = useState(1)
  useEffect(() => {
    dispatch(getExplorePost({ page, limit: 30 }) as any)
  }, [page])

  const callback = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && !isFetching && !exploreLoading) {
      if (hasObserved) {
        setIsFetching(true)
        if (page < totalPages) {
          setPage(prevPage => prevPage + 1)
        }
        setIsFetching(false)
      } else {
        setHasObserved(true)
      }
    }
  }
  const observer = new IntersectionObserver(callback, {
    threshold: 0.5,
  })

  useEffect(() => {
    if (target.current) {
      observer.observe(target.current)
    }

    return () => {
      if (target.current) {
        observer.unobserve(target.current)
      }
    }
  }, [observer])
  return (
    <div className="relative flex size-full overflow-auto">
      <Nav></Nav>
      <div className={`ml-[16.6667%] w-full`}>
        <div className="m-auto w-[1000px] p-10">
          <div className="grid grid-cols-3 gap-1">
            {allPostList.map((post: PostType) => (
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
          {exploreLoading && (
            <div className="p-5 text-center">
              <CircularProgress />
            </div>
          )}
          <div ref={target}></div>
        </div>
      </div>
    </div>
  )
}

export default Explore
