import React from 'react'
import Nav from '@/components/nav/navBar'
import { SuggestList } from '@/components/follow/suggestList'

const People: React.FC = () => {
  const limit = 30
  return (
    <div className="relative flex size-full overflow-auto">
      <Nav></Nav>
      <div className="ml-[200px] flex w-full justify-center">
        <div className="p-5 min-w-[300px] w-[35%] py-10">
          <div className="pb-5 text-body16sd">추천</div>
          <SuggestList limit={limit} />
        </div>
      </div>
    </div>
  )
}

export default People
