import React, { useState } from 'react'
import { ResultType } from '@/interfaces/search'
import { Avatar } from '@mui/material'
import TagIcon from '@/icons/tag-icon.svg?react'
import { useDispatch } from 'react-redux'
import { deleteSearchHistory, saveSearchHistory } from '@/redux/search'
import { useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
interface resultProps {
  result: ResultType
  type: string
}
const Result: React.FC<resultProps> = ({ result, type }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }
  const goToPage = () => {
    if (result.type === 'user') {
      navigate(`/profile/${result.nickname}`)
    } else {
      navigate(`/explore/tags/${result.name}`)
    }
    dispatch(saveSearchHistory({ result }) as any)
  }
  const deleteHistory = () => {
    const history = JSON.stringify(result)

    dispatch(deleteSearchHistory({ history }) as any)
  }
  return (
    <div className="flex cursor-pointer items-center rounded-lg p-2.5 hover:bg-gray-100">
      <div
        className="flex size-[44px] flex-col justify-center overflow-hidden rounded-full border bg-white"
        onClick={goToPage}
      >
        {result.type === 'user' ? (
          <div>
            <Avatar src={result?.profileImage?.path} sx={{ width: 44, height: 44 }} />
          </div>
        ) : (
          <div className="flex justify-center">
            <TagIcon className="h-10" />
          </div>
        )}
      </div>
      <div className="flex grow flex-col pl-2.5 text-body14m" onClick={goToPage}>
        <div>
          {result.type === 'user' ? <div>{result.nickname}</div> : <div># {result.name}</div>}
        </div>
        <div className="text-body14rg text-gray-400">
          {result.type === 'user' ? <div>{result.name}</div> : <div>게시물 {result.tagCount}</div>}
        </div>
      </div>
      {type === 'history' && (
        <button className="hover:text-main" onClick={deleteHistory}>
          <CloseIcon sx={{ fontSize: 23 }} />
        </button>
      )}
    </div>
  )
}

export default Result
