import { RootState } from '@/redux'
import { useSelector } from 'react-redux'
import DeleteModal from '../delete'
import PostActionModal from '../post'
import PostForm from '@/components/post/postForm'
import PostLoading from '@/components/post/postLoading'
import PostDetail from '@/components/post/postDetail'
import CommentActionModal from '../comment'
import LeaveRoomModal from '../leaveChatRoom'
import ModifyPasswordModal from '../password'

const MODAL_TYPES = {
  DeleteModal: 'DeleteModal',
  PostActionModal: 'PostActionModal',
  PostFormModal: 'PostFormModal',
  PostingModal: 'PostingModal',
  PostDetailModal: 'PostDetailModal',
  CommentActionModal: 'CommentActionModal',
  LeaveRoomModal: 'LeaveRoomModal',
  ModifyPasswordModal: 'ModifyPasswordModal',
}
const MODAL_COMPONENTS = [
  {
    type: MODAL_TYPES.DeleteModal,
    component: <DeleteModal />,
  },
  {
    type: MODAL_TYPES.PostActionModal,
    component: <PostActionModal />,
  },
  {
    type: MODAL_TYPES.PostFormModal,
    component: <PostForm />,
  },
  {
    type: MODAL_TYPES.PostingModal,
    component: <PostLoading />,
  },
  {
    type: MODAL_TYPES.PostDetailModal,
    component: <PostDetail />,
  },
  {
    type: MODAL_TYPES.CommentActionModal,
    component: <CommentActionModal />,
  },
  {
    type: MODAL_TYPES.LeaveRoomModal,
    component: <LeaveRoomModal />,
  },
  {
    type: MODAL_TYPES.ModifyPasswordModal,
    component: <ModifyPasswordModal />,
  },
]

const GlobalModal: React.FC = () => {
  const { modalType, isOpen, subModalType, isSubOpen } = useSelector(
    (state: RootState) => state.modalReducer,
  )
  if (!isOpen && !isSubOpen) return null
  const findModal = MODAL_COMPONENTS.find(modal => {
    return modal.type === modalType
  })
  const findSubModal = MODAL_COMPONENTS.find(modal => {
    return modal.type === subModalType
  })
  const renderModal = () => {
    return findModal?.component
  }
  const renderSubModal = () => {
    return findSubModal?.component
  }
  return (
    <div>
      {isOpen && renderModal()}
      {isSubOpen && renderSubModal()}
    </div>
  )
}
export default GlobalModal
