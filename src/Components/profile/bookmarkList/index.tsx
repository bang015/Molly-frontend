import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearPostList, getBookmarkPost } from '@/redux/postList'
import { RootState } from '@/redux'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import { openModal } from '@/redux/modal'
interface bookmarkListProps {
  userId: number
}
const BookmarkList: React.FC<bookmarkListProps> = ({ userId }) => {
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const bookmark = useSelector((state: RootState) => state.postListReducer.posts.bookmark)
  const totalPages = useSelector((state: RootState) => state.postListReducer.totalPages.user)
  useEffect(() => {
    dispatch(clearPostList())
    dispatch(getBookmarkPost({ userId, page }) as any)
  }, [userId, page])
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
    <div className="flex flex-col">
      <div className="text-body12sd text-gray-500">저장한 내용은 회원님만 볼 수 있습니다.</div>
      {bookmark.length ? (
        <div className="grid w-full grid-cols-3 gap-1">
          {bookmark &&
            bookmark.map((bookmark: any) => (
              <div
                key={bookmark.id}
                onClick={() => {
                  dispatch(openModal({ modalType: 'PostDetailModal', id: bookmark.post.id }))
                }}
              >
                <img className="cursor-pointer" src={bookmark.post.postMedias[0].path} />
              </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center p-20">
          <div className="rounded-full border-2 border-black p-5">
            <BookmarkBorderIcon sx={{ width: '40px', height: '40px' }} />
          </div>
          <div className="p-3 text-body18sd">저장</div>
          <div className="flex flex-col text-center text-body16m">
            <div>다시 보고 싶은 콘텐츠를 저장하세요.</div>
            <div>저장된 콘텐츠는 회원님만 볼 수 있습니다.</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookmarkList
