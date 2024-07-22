import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { INIT, POST_API } from '../utils/api-url'
import { PostType } from '../interfaces/post'
import { updatedPost } from './post'
import { request } from './baseRequest'
import { authStore } from './auth'

interface PostListState {
  posts: {
    explore: PostType[]
    main: PostType[]
    user: PostType[]
    bookmark: PostType[]
  }
  getPostLoading: boolean
  getPostDetail: PostType | null
  totalPages: {
    all: number
    main: number
    user: number
    bookmark: number
  }
}

const initialState: PostListState = {
  posts: {
    explore: [],
    main: [],
    user: [],
    bookmark: [],
  },
  getPostLoading: false,
  getPostDetail: null,
  totalPages: {
    all: 1,
    main: 1,
    user: 1,
    bookmark: 1,
  },
}
const postListSlice = createSlice({
  name: 'postList',
  initialState,
  reducers: {
    getListStart: state => {
      state.getPostLoading = true
    },
    getExplorePostList: (state, action: PayloadAction<PostType[]>) => {
      state.getPostLoading = false
      const post = [...state.posts.explore, ...action.payload]
      const filter = post.filter(
        (post, index, self) => index === self.findIndex(p => p.id === post.id),
      )
      state.posts.explore = filter
    },
    getListfailure: state => {
      state.getPostLoading = false
    },
    getPostDetailSuccess: (state, action: PayloadAction<PostType>) => {
      state.getPostLoading = false
      state.getPostDetail = action.payload
    },
    getMainPostList: (state, action: PayloadAction<{ post: PostType[]; totalPages: number }>) => {
      const post = [...state.posts.main, ...action.payload.post]
      const filter = post.filter(
        (post, index, self) => index === self.findIndex(p => p.id === post.id),
      )
      state.posts.main = filter
      state.totalPages.main = action.payload.totalPages
    },
    getUserPostList: (state, action: PayloadAction<PostType[]>) => {
      const post = [...state.posts.user, ...action.payload]
      const filter = post.filter(
        (post, index, self) => index === self.findIndex(p => p.id === post.id),
      )
      state.posts.user = filter
    },
    getbookmarkList: (state, action: PayloadAction<PostType[]>) => {
      const post = [...state.posts.bookmark, ...action.payload]
      const filter = post.filter(
        (post, index, self) => index === self.findIndex(p => p.id === post.id),
      )
      state.posts.bookmark = filter
    },
    postUpload: (state, action: PayloadAction<PostType>) => {
      state.posts.main = [action.payload, ...state.posts.main]
    },
    postUpdateList: (state, action: PayloadAction<updatedPost>) => {
      console.log(action.payload)
      const updatedPosts = state.posts.main.map(post =>
        post.id === action.payload.updatedPost.id
          ? { ...post, content: action.payload.updatedPost.content! }
          : post,
      )
      state.posts.main = updatedPosts
    },
    postDelete: (state, action: PayloadAction<number>) => {
      state.posts.main = state.posts.main.filter(post => post.id !== action.payload)
      state.posts.user = state.posts.user.filter(post => post.id !== action.payload)
    },
    clearPostList: state => {
      state.posts = {
        explore: [],
        main: [],
        user: [],
        bookmark: [],
      }
    },
    clearPostDetail: state => {
      state.getPostDetail = null
    },
  },
})

export const {
  getListStart,
  getExplorePostList,
  getListfailure,
  getPostDetailSuccess,
  getMainPostList,
  getUserPostList,
  getbookmarkList,
  postDelete,
  postUpdateList,
  postUpload,
  clearPostList,
  clearPostDetail,
} = postListSlice.actions
export default postListSlice.reducer

export const getMainPost = createAsyncThunk(
  'postList/getMainPost',
  async ({ page }: { page: number }, { dispatch }) => {
    try {
      const response = await request(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}/main/?page=${page}`,
        {
          method: 'GET',
          headers: {},
        },
      )
      if (response.status === 200) {
        dispatch(getMainPostList(response.data))
      }
    } catch {}
  },
)

export const getAllPost = createAsyncThunk(
  'postList/getAllPost',
  async ({ page, token }: { page: number; token: string }, { dispatch }) => {
    dispatch(getListStart())
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}?page=${page}`,
        {
          headers: {},
        },
      )
      if (response.status === 200) {
        const result = response.data
        dispatch(getExplorePostList(result))
      } else {
        dispatch(getListfailure())
      }
    } catch (err) {
      dispatch(getListfailure())
    }
  },
)

export const getPostByPostId = createAsyncThunk(
  'postList/getPostByPostId',
  async (postId: number, { dispatch }) => {
    dispatch(getListStart())
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}/${postId}`,
      )
      if (response.status === 200) {
        dispatch(getPostDetailSuccess(response.data))
      }
    } catch (err) {
      dispatch(getListfailure())
    }
  },
)

export const getPostByUserId = createAsyncThunk(
  'postList/getPostByUserId',
  async ({ userId, page }: { userId: number; page: number }, { dispatch }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}/my/${userId}?page=${page}`,
      )
      if (response.status === 200) {
        dispatch(getUserPostList(response.data.post))
      }
    } catch {}
  },
)
export const getPostByTagName = createAsyncThunk(
  'postList/getPostByTagName',
  async ({ tagName, page }: { tagName: string; page: number }, { dispatch }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}/tags/${tagName}?page=${page}`,
      )
      if (response.status === 200) {
        dispatch(getUserPostList(response.data))
      }
    } catch {}
  },
)

export const getBookmarkPost = createAsyncThunk(
  'postList/getBookmarkPost',
  async ({ userId, page }: { userId: number; page: number }, { dispatch }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}/bookmark/${userId}?page=${page}`,
      )
      if (response.status === 200) {
        dispatch(getbookmarkList(response.data))
      }
    } catch {}
  },
)
