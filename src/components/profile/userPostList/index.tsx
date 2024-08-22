import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearPostList, getUserPost } from '@/redux/postList'
import { RootState } from '@/redux'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import { openModal } from '@/redux/modal'
import { PostType } from '@/interfaces/post'
import { CircularProgress } from '@mui/material'
interface userPostListProps {
  userId: number
}
const UserPostList: React.FC<userPostListProps> = ({ userId }) => {
  const target = useRef<HTMLDivElement | null>(null)
  const [hasObserved, setHasObserved] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const user = useSelector((state: RootState) => state.authReducer.user)
  const post = useSelector((state: RootState) => state.postListReducer.posts.user)
  const totalPages = useSelector((state: RootState) => state.postListReducer.totalPages.user)
  const loading = useSelector((state: RootState) => state.postListReducer.loading.user)
  useEffect(() => {
    dispatch(clearPostList())
  }, [userId])
  useEffect(() => {
    dispatch(getUserPost({ userId, page }) as any)
  }, [userId, page])

  const callback = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && !isFetching && !loading) {
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
    <div className="">
      {post.length ? (
        <div className="grid w-full grid-cols-3 gap-1 pb-5">
          {post.map((post: PostType) => (
            <div
              key={post.id}
              onClick={() => {
                dispatch(openModal({ modalType: 'PostDetailModal', id: post.id }))
              }}
            >
              <img className="cursor-pointer" src={post.postMedias[0].path} />
            </div>
          ))}
          <div ref={target}></div>
          {loading && (
            <div className="p-5 text-center">
              <CircularProgress />
            </div>
          )}
        </div>
      ) : (
        <div className="m-4 flex flex-col items-center p-20">
          <div className="rounded-full border-2 border-black p-5">
            <CameraAltOutlinedIcon sx={{ width: '40px', height: '40px' }} />
          </div>
          <div className="p-3 text-body18sd">게시물 없음</div>
          {userId === user?.id && (
            <div className="flex flex-col">
              <div className="text-body16m">
                <div>회원님의 추억을 공유해주세요.</div>
              </div>
              <button
                className="p-3 text-body14sd text-main hover:text-hover"
                onClick={() => {
                  dispatch(
                    openModal({
                      modalType: 'PostFormModal',
                      id: null,
                      post: null,
                    }),
                  )
                }}
              >
                첫 사진 공유하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UserPostList
