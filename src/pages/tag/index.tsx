import React, { useEffect, useState } from 'react'
import Nav from '@/components/nav/navBar'
import { useParams } from 'react-router-dom'
import TagIcon from '@/icons/tag-icon.svg?react'
import { useDispatch, useSelector } from 'react-redux'
import { clearPostList, getPostByTagName } from '@/redux/postList'
import { RootState } from '@/redux'
import { openModal } from '@/redux/modal'

const Tag: React.FC = () => {
  const { tagName } = useParams()
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const post = useSelector((state: RootState) => state.postListReducer.posts.user)
  useEffect(() => {
    if (tagName) {
      dispatch(getPostByTagName({ tagName, page }) as any)
    }
  }, [tagName, page])
  useEffect(() => {
    dispatch(clearPostList())
  }, [tagName])
  return (
    <div className="mainPage">
      <div className="nav-container">
        <Nav></Nav>
      </div>
      <div className="pcontent">
        <div className="prfile">
          <div className="header">
            <div style={{ flexGrow: 0 }} className="profile_image">
              <div className="profileImg">
                <TagIcon width={50} />
              </div>
            </div>
            <div className="pui">
              <h2 className="tagN">#{tagName}</h2>
              <div>게시물</div>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'rgb(115,115,115)' }}>게시물</h4>
            <div className="user_post">
              {post.map(post => (
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
                  <img className="image_item" src={post.postMedias[0]?.path} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Tag
