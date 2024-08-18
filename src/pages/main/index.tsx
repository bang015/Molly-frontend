import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Nav from '@/components/nav/navBar'
import { SuggestList } from '@/components/follow/suggestList'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PostList from '@/components/post/postList'
import { getExplorePost, getMainPost } from '@/redux/postList'
import { RootState } from '@/redux'
import { PostType } from '@/interfaces/post'
const Main: React.FC = () => {
  const dispatch = useDispatch()
  const limit = 5
  const navigate = useNavigate()
  const postList = useSelector((state: RootState) => state.postListReducer.posts.main)
  const explorePostList = useSelector((state: RootState) => state.postListReducer.posts.explore)
  const mainTotalPages = useSelector((state: RootState) => state.postListReducer.totalPages.main)
  const exploreTotalPages = useSelector(
    (state: RootState) => state.postListReducer.totalPages.explore,
  )
  const [mainPage, setMainPage] = useState(1)
  const [explorePage, setExplorePage] = useState(1)
  useEffect(() => {
    dispatch(getMainPost(mainPage) as any)
  }, [mainPage])
  useEffect(() => {
    dispatch(getExplorePost({ page: explorePage, limit: 5 }) as any)
  }, [explorePage])
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight * 0.9) {
        if (mainPage < mainTotalPages) {
          setMainPage(prevPage => prevPage + 1)
        } else if (explorePage < exploreTotalPages) {
          setExplorePage(prevPage => prevPage + 1)
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [mainPage, mainTotalPages, explorePage, exploreTotalPages])
  return (
    <section className="relative flex size-full overflow-auto">
      <Nav />
      <div className={`ml-[16.6667%] w-4/6 min-w-body510`}>
        {postList.map((post: PostType) => (
          <PostList key={post.id} post={post} />
        ))}
        <div className="m-auto w-body510 px-5 text-body20sd">추천 게시물</div>
        {explorePostList.map((post: PostType) => (
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
