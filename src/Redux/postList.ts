import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { INIT, POST_API } from '../utils/api-url'
import { PostType } from '../interfaces/post'
import { updatedPost } from './post'
import { request } from './baseRequest'
import { openSnackBar } from './snackBar'

interface PostListState {
  posts: {
    explore: PostType[]
    main: PostType[]
    user: PostType[]
    bookmark: PostType[]
  }
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
    getExplorePostList: (
      state,
      action: PayloadAction<{ post: PostType[]; totalPages: number }>,
    ) => {
      const post = [...state.posts.explore, ...action.payload.post]
      const filter = post.filter(
        (post, index, self) => index === self.findIndex(p => p.id === post.id),
      )
      state.posts.explore = filter
      state.totalPages.all = action.payload.totalPages
    },

    getPostDetailSuccess: (state, action: PayloadAction<PostType>) => {
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
    getUserPostList: (state, action: PayloadAction<{ post: PostType[]; totalPages: number }>) => {
      console.log(action.payload)
      const post = [...state.posts.user, ...action.payload.post]
      const filter = post.filter(
        (post, index, self) => index === self.findIndex(p => p.id === post.id),
      )
      state.posts.user = filter
      state.totalPages.user = action.payload.totalPages
    },
    getbookmarkList: (state, action: PayloadAction<{ post: PostType[]; totalPages: number }>) => {
      const post = [...state.posts.bookmark, ...action.payload.post]
      const filter = post.filter(
        (post, index, self) => index === self.findIndex(p => p.id === post.id),
      )
      state.posts.bookmark = filter
      state.totalPages.bookmark = action.payload.totalPages
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
  getExplorePostList,
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
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/main/?page=${page}`,
        {
          method: 'GET',
          headers: {},
        },
      )
      if (response.status === 200) {
        dispatch(getMainPostList(response.data))
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getAllPost = createAsyncThunk(
  'postList/getAllPost',
  async ({ page }: { page: number }, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}?page=${page}`,
        {
          method: 'GET',
          headers: {},
        },
      )
      if (response.status === 200) {
        const result = response.data
        dispatch(getExplorePostList(result))
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getPostByPostId = createAsyncThunk(
  'postList/getPostByPostId',
  async (postId: number, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/${postId}`,
        {
          method: 'GET',
        },
      )
      if (response.status === 200) {
        dispatch(getPostDetailSuccess(response.data))
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getPostByUserId = createAsyncThunk(
  'postList/getPostByUserId',
  async ({ userId, page }: { userId: number; page: number }, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/my/${userId}?page=${page}`,
        {
          method: 'GET',
        },
      )
      if (response.status === 200) {
        dispatch(getUserPostList(response.data))
      }
    } catch (e: any) {
      dispatch(e.response.data.message)
    }
  },
)
export const getPostByTagName = createAsyncThunk(
  'postList/getPostByTagName',
  async ({ tagName, page }: { tagName: string; page: number }, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/tags/${tagName}?page=${page}`,
        {
          method: 'GET',
        },
      )
      if (response.status === 200) {
        dispatch(getUserPostList(response.data))
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getBookmarkPost = createAsyncThunk(
  'postList/getBookmarkPost',
  async ({ userId, page }: { userId: number; page: number }, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/bookmark/${userId}?page=${page}`,
        {
          method: 'GET',
        },
      )
      if (response.status === 200) {
        dispatch(getbookmarkList(response.data))
      }
    } catch (e: any) {
      dispatch(e.response.data.message)
    }
  },
)
