import React, { useState } from 'react'
import { ResultType } from '@/interfaces/search'
import { Avatar } from '@mui/material'
import TagIcon from '@/icons/tag-icon.svg?react'
import './index.css'
import { useDispatch, useSelector } from 'react-redux'
import { deleteSearchHistory, saveSearchHistory } from '@/redux/search'
import { RootState } from '@/redux'
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
    <div
      className={isHovered ? 'search_result hov' : 'search_result'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="se1" onClick={goToPage}>
        {result.type === 'user' ? (
          <div>
            <Avatar src={result?.profileImage?.path} sx={{ width: 44, height: 44 }} />
          </div>
        ) : (
          <div>
            <TagIcon />
          </div>
        )}
      </div>
      <div className="se2" onClick={goToPage}>
        <div>
          {result.type === 'user' ? <div>{result.nickname}</div> : <div># {result.name}</div>}
        </div>
        <div className="ch">
          {result.type === 'user' ? <div>{result.name}</div> : <div>게시물 {result.tagCount}</div>}
        </div>
      </div>
      {type === 'history' && (
        <div className="se3">
          <button onClick={deleteHistory}>
            <CloseIcon sx={{ fontSize: 23 }} />
          </button>
        </div>
      )}
    </div>
  )
}

export default Result
