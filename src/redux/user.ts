import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { INIT, QUERY_NICKNAME, USER_API } from '../utils/api-url'
import { UpdateProfileInput, UserType } from '../interfaces/user'
import { getUser } from './auth'
import { request } from './baseRequest'
import { openSnackBar } from './snackBar'

interface UserState {
  profile: UserType | null
  editLoading: boolean
}
const initialState: UserState = {
  profile: null,
  editLoading: false,
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getProfileSuccess: (state, action: PayloadAction<UserType>) => {
      state.profile = action.payload
    },
    deletePostProfile: state => {
      if (state.profile && state.profile.postCount !== undefined) {
        state.profile.postCount = state.profile.postCount - 1
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(updateUser.pending, state => {
        state.editLoading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.profile = action.payload
        state.editLoading = false
      })
      .addCase(updateUser.rejected, state => {
        state.editLoading = false
      })
  },
})
export const { getProfileSuccess, deletePostProfile } = userSlice.actions
export default userSlice.reducer

// 유저 프로필
export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (nickname: string, { dispatch }) => {
    const response = await request(
      `${import.meta.env.VITE_SERVER_URL}${INIT}${USER_API}${QUERY_NICKNAME}${nickname}`,
      { method: 'GET', headers: {} },
    )
    if (response.status === 200) {
      dispatch(getProfileSuccess(response.data))
    }
  },
)

// 유저정보 수정
export const updateUser = createAsyncThunk<UserType, { newInfo: UpdateProfileInput }>(
  'auth/updateUser',
  async ({ newInfo }: { newInfo: UpdateProfileInput }, { dispatch }) => {
    try {
      const formData = new FormData()
      if (newInfo.name) formData.append('name', newInfo.name)
      if (newInfo.nickname) formData.append('nickname', newInfo.nickname)
      if (newInfo.introduce) formData.append('introduce', newInfo.introduce)
      if (newInfo.newPassword) formData.append('newPassword', newInfo.newPassword)
      if (newInfo.currentPassword) formData.append('currentPassword', newInfo.currentPassword)
      if (newInfo.profileImg) {
        const profileImageFile = new File([newInfo.profileImg], 'profile_image.jpg')
        formData.append('profileImage', profileImageFile)
      }
      const response = await request(`${import.meta.env.VITE_SERVER_URL}${INIT}${USER_API}`, {
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        method: 'PATCH',
      })
      if (response.status === 200) {
        dispatch(openSnackBar(response.data.message))
        dispatch(getUser())
      }
      return response.data.result
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)
