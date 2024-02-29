import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { INIT, USER_API } from "../Utils/api-url";
import { userType } from "../Interfaces/user";

interface profileState {
  profile: userType | null;
}
const initialState: profileState = {
  profile: null,
};
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    getProfileSuccess: (
      state,
      action: PayloadAction<userType>
    ) => {
      state.profile = action.payload;
    },
    deletePostProfile: (state) => {
      if(state.profile && state.profile.postCount !== undefined){
        state.profile.postCount = state.profile.postCount - 1;
      }
    },
    updateFollowCount: (state, action: PayloadAction<number>) => {

    }
  },
});
export const { getProfileSuccess, deletePostProfile } = profileSlice.actions;
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
