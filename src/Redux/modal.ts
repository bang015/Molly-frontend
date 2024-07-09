import { createSlice } from "@reduxjs/toolkit"
import { number } from "prop-types";
interface modalState {
  modalType: string,
  isOpen: boolean,
  id: number | null
}
const initialState: modalState = {
  modalType: "",
  isOpen: false,
  id: null
}

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, actions) => {
      const {modalType, id} = actions.payload;
      state.modalType = modalType;
      state.id = id;
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.id = null;
    }
  }
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;