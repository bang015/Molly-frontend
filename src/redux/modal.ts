import { CommentType } from '@/interfaces/comment'
import { PostType } from '@/interfaces/post'
import { createSlice } from '@reduxjs/toolkit'
interface modalState {
  modalType: string
  subModalType: string
  isOpen: boolean
  isSubOpen: boolean
  id: number | null
  post: PostType | null
  comment: CommentType | null
  followType: string
}
const initialState: modalState = {
  modalType: '',
  subModalType: '',
  isOpen: false,
  isSubOpen: false,
  id: null,
  post: null,
  comment: null,
  followType: '',
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, actions) => {
      const { modalType, id, post } = actions.payload
      state.modalType = modalType
      state.id = id
      state.post = post
      state.isSubOpen = false
      state.isOpen = true
    },
    closeModal: state => {
      state.isOpen = false
      state.isSubOpen = false
      state.id = null
      state.post = null
    },
    openSubModal: (state, actions) => {
      const { subModalType, id, post, comment, followType } = actions.payload
      state.subModalType = subModalType
      if (post) state.post = post
      if (id) state.id = id
      if (comment) state.comment = comment
      if (followType) state.followType = followType
      state.isSubOpen = true
    },
    closeSubModal: state => {
      state.isSubOpen = false
      state.comment = null
      state.followType = ''
      state.id = null
    },
  },
})

export const { openModal, closeModal, openSubModal, closeSubModal } = modalSlice.actions
export default modalSlice.reducer
