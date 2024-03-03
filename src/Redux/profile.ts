import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { INIT, USER_API } from "../Utils/api-url";
import { userType } from "../Interfaces/user";
import { showSnackBar } from "./post";

interface profileState {
  profile: userType | null;
  updateProfile: userType | null;
}
const initialState: profileState = {
  profile: null,
  updateProfile: null,
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
    updatedProfile: (state, action: PayloadAction<userType>) => {
      state.updateProfile = action.payload;
    },
  },
});
export const { getProfileSuccess, deletePostProfile, updatedProfile } = profileSlice.actions;
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

export const editProfileImage = createAsyncThunk(
  "profile/editProfileImage",
  async (
    { token, profileImg }: { token: string; profileImg: Blob },
    { dispatch }
  ) => {
    try {
      const formData = new FormData();
      const profileImageFile = new File([profileImg], "profile_image.jpg");
      formData.append("profile_image", profileImageFile);
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${USER_API}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(showSnackBar(response.data.message));
        dispatch(updatedProfile(response.data.user));
      }
    } catch {}
  }
);
