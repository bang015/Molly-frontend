import { postType } from "@/interfaces/post";
import { createSlice } from "@reduxjs/toolkit"
interface modalState {
  modalType: string,
  isOpen: boolean,
  id: number | null,
  post: postType | null
}
const initialState: modalState = {
  modalType: "",
  isOpen: false,
  id: null,
  post: null
}

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, actions) => {
      const {modalType, id, post} = actions.payload;
      console.log('Opening modal:', modalType, id, post);
      state.modalType = modalType;
      state.id = id;
      state.post = post
      state.isOpen = true;
    },
    closeModal: (state) => {
      console.log('Closing modal');
      state.isOpen = false;
      state.id = null;
      state.post = null;
    }
  }
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;