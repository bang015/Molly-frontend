import React, { useState, useEffect } from 'react'
import './index.css'
import { useDispatch, useSelector } from 'react-redux'
import Nav from '@/components/nav/navBar'
import { SuggestList } from '@/components/follow/suggestList'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PostList from '@/components/post/postList'
import { getMainPost } from '@/redux/postList'
import { RootState } from '@/redux'
const Main: React.FC = () => {
  const dispatch = useDispatch()
  const limit = 5
  const navigate = useNavigate()
  const postList = useSelector((state: RootState) => state.postListReducer.posts.main)
  const totalPages = useSelector((state: RootState) => state.postListReducer.totalPages.main)

  const [page, setPage] = useState(1)
  useEffect(() => {
    dispatch(getMainPost({ page }) as any)
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
    <section className="relative flex size-full overflow-auto">
      <Nav />
      <div className={`ml-[16.6667%] w-4/6 min-w-body510`}>
        {postList.map(post => (
          <PostList key={post.id} post={post} />
        ))}
      </div>
      <div className="w-2/6">
        <div className="w-96 p-5">
          <div className="flex items-center justify-between">
            <div className="text-body14sd text-[#737373]">회원님을 위한 추천</div>
            <div>
              <Button
                onClick={() => {
                  navigate('/explore/people')
                }}
              >
                모두보기
              </Button>
            </div>
          </div>
          <SuggestList limit={limit} />
        </div>
      </div>
    </section>
  )
}

export default Main
