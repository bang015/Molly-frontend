import React, { useEffect, useState } from 'react'
import Nav from '@/components/nav/navBar'
import { useParams } from 'react-router-dom'
import TagIcon from '@/icons/tag-icon.svg?react'
import { useDispatch, useSelector } from 'react-redux'
import { clearPostList, getTagPost } from '@/redux/postList'
import { RootState } from '@/redux'
import { openModal } from '@/redux/modal'
import { PostType } from '@/interfaces/post'

const Tag: React.FC = () => {
  const { tagName } = useParams()
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const totalPages = useSelector((state: RootState) => state.postListReducer.totalPages.tag)
  const { count, posts } = useSelector((state: RootState) => state.postListReducer.posts.tag)
  useEffect(() => {
    if (tagName) {
      dispatch(getTagPost({ tagName, page }) as any)
    }
  }, [tagName, page])
  useEffect(() => {
    dispatch(clearPostList())
  }, [tagName])
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
  posts.map(post => {})
  return (
    <div className="relative flex size-full overflow-auto">
      <Nav></Nav>
      <div className="ml-[16.6667%] flex w-full justify-center">
        <div className="flex w-2/3 flex-col p-10">
          <div className="flex items-center border-b p-10">
            <div className="rounded-full border p-4">
              <TagIcon className="h-20 w-20" />
            </div>
            <div className="ml-5">
              <h2 className="text-body20sd">#{tagName}</h2>
              <div className="text-body16rg">게시물 {count}개</div>
            </div>
          </div>
          <div className="py-5 text-body18m">게시물</div>
          <div className="grid grid-cols-3 gap-1">
            {posts.length > 0 &&
              posts.map((post:PostType) => (
                <div
                  key={post.id}
                  onClick={() => {
                    dispatch(
                      openModal({
                        modalType: 'PostDetailModal',
                        post: post,
                        id: post.id,
                      }),
                    )
                  }}
                >
                  <img className="" src={post.postMedias?.[0]?.path} loading="lazy" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Tag
