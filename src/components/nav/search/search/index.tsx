import React, { useEffect, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'
import { deleteSearchHistory, getSearchHistory, getSearchResult, resetResult } from '@/redux/search'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import Result from '../result'
interface searchProps {
  isCollapsed: boolean
}
export interface SearchHandle {
  getCurrentRef: () => HTMLDivElement | null
}
const Search: React.FC<searchProps> = ({ isCollapsed }) => {
  const [keyword, setKeyword] = useState('')
  const dispatch = useDispatch()
  const result = useSelector((state: RootState) => state.searchReducer.result)
  const history = useSelector((state: RootState) => state.searchReducer.history)

  useEffect(() => {
    dispatch(getSearchHistory() as any)
  }, [dispatch])
  useEffect(() => {
    if (keyword === '') {
      dispatch(resetResult())
    }
  }, [keyword])
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
    let keyword = e.target.value
    const firstChar = keyword.charAt(0)
    let type
    if (firstChar === '#') {
      type = 'tag'
      keyword = keyword.slice(1)
    } else if (firstChar === '@') {
      type = 'user'
      keyword = keyword.slice(1)
    } else {
      type = 'all'
    }
    if (keyword !== '' && keyword !== '@' && keyword !== '#') {
      dispatch(getSearchResult({ keyword, type }) as any)
    }
  }
  const handleSearchReset = () => {
    setKeyword('')
  }

  const deleteHistory = () => {
    const history = null
    dispatch(deleteSearchHistory({ history }) as any)
  }
  return (
    <>
      <div className="p-5 pb-10 text-body18sd">
        <h2>검색</h2>
      </div>
      <div className="flex grow flex-col">
        <div className="relative border-b px-4 pb-10">
          <input
            className="h-11 w-full rounded-lg bg-[#EFEFEF] px-3 text-body16m focus:outline-none"
            value={keyword}
            type="text"
            placeholder="검색"
            onChange={handleSearch}
          />
          <button className="absolute right-7 top-2" type="button" onClick={handleSearchReset}>
            <CancelIcon color="disabled" sx={{ fontSize: 16 }} />
          </button>
        </div>
        <div className="flex grow flex-col p-2.5">
          {keyword === '' && (
            <div className="flex items-center justify-between p-2.5">
              <div className="text-body16sd">최근 검색 항목</div>
              <div>
                <button
                  className="text-body14sd text-[#0095F6] hover:text-[#00376B]"
                  onClick={deleteHistory}
                >
                  모두 지우기
                </button>
              </div>
            </div>
          )}
          <div className="flex grow flex-col">
            {keyword === '' ? (
              <>
                {history.length ? (
                  <>
                    {history.map((res, index) => (
                      <Result key={index} result={res} type="history" />
                    ))}
                  </>
                ) : (
                  <div className="flex grow items-center justify-center text-body14m text-[#737373]">
                    최근 검색 내역 없음.
                  </div>
                )}
              </>
            ) : (
              <>
                {result.map((res, index) => (
                  <Result key={index} result={res} type="result" />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
export default Search
