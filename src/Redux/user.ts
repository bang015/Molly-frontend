import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { INIT, QUERY_NICKNAME, USER_API } from '../utils/api-url'
import { UpdateProfileInput, UserType } from '../interfaces/user'
import { showSnackBar } from './post'
import { getUser } from './auth'
import { request } from './baseRequest'

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
    updatedProfileStart: state => {
      state.editLoading = true
    },
    updatedProfileSucces: (state, action: PayloadAction<UserType>) => {
      state.profile = action.payload
      state.editLoading = false
    },
  },
})
export const { getProfileSuccess, deletePostProfile, updatedProfileStart, updatedProfileSucces } =
  userSlice.actions
export default userSlice.reducer

const token = localStorage.getItem('accessToken')

// 유저 프로필
export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (nickname: string, { dispatch }) => {
    const response = await request(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${USER_API}${QUERY_NICKNAME}${nickname}`,
      {method: "GET"}
    )
    if (response.status === 200) {
      dispatch(getProfileSuccess(response.data))
    }
  },
)

// 유저정보 수정
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ newInfo }: { newInfo: UpdateProfileInput }, { dispatch }) => {
    try {
      const formData = new FormData()
      if (newInfo.name) formData.append('name', newInfo.name)
      if (newInfo.nickname) formData.append('nickname', newInfo.nickname)
      if (newInfo.introduce) formData.append('introduce', newInfo.introduce)
      if (newInfo.profileImg) {
        dispatch(updatedProfileStart())
        const profileImageFile = new File([newInfo.profileImg], 'profile_image.jpg')
        formData.append('profileImage', profileImageFile)
      }
      const response = await request(`${process.env.REACT_APP_SERVER_URL}${INIT}${USER_API}`, {
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        method: "PATCH"
      })
      if (response.status === 200) {
        dispatch(showSnackBar(response.data.message))
        dispatch(updatedProfileSucces(response.data.result))
        dispatch(getUser())
      }
    } catch (e) {
      dispatch(showSnackBar("프로필 수정 실패, 다시 시도해주세요."))
    }
  },
)
