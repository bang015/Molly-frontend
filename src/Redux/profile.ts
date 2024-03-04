import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { INIT, USER_API } from "../Utils/api-url";
import { userType } from "../Interfaces/user";
import { showSnackBar } from "./post";

interface profileState {
  profile: userType | null;
  updateProfile: userType | null;
  editLoading: boolean;
}
const initialState: profileState = {
  profile: null,
  updateProfile: null,
  editLoading: false
};
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    getProfileSuccess: (state, action: PayloadAction<userType>) => {
      state.profile = action.payload;
    },
    deletePostProfile: (state) => {
      if (state.profile && state.profile.postCount !== undefined) {
        state.profile.postCount = state.profile.postCount - 1;
      }
    },
    updatedProfileStart: (state) => {
      state.editLoading = true;
    },
    updatedProfileSucces: (state, action: PayloadAction<userType>) => {
      state.updateProfile = action.payload;
      state.editLoading = false;
    },
  },
});
export const { getProfileSuccess, deletePostProfile, updatedProfileStart, updatedProfileSucces } = profileSlice.actions;
export default profileSlice.reducer;

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (nickname: string, { dispatch }) => {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${USER_API}/${nickname}`
    );
    if (response.status === 200) {
      dispatch(getProfileSuccess(response.data));
    }
  }
);


