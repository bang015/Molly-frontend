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
    tag: { count: number; posts: PostType[] }
  }
  postDetail: PostType | null
  totalPages: {
    explore: number
    main: number
    user: number
    bookmark: number
    tag: number
  }
}

const initialState: PostListState = {
  posts: {
    explore: [],
    main: [],
    user: [],
    bookmark: [],
    tag: { count: 0, posts: [] },
  },
  postDetail: null,
  totalPages: {
    explore: 1,
    main: 1,
    user: 1,
    bookmark: 1,
    tag: 1,
  },
}
const postListSlice = createSlice({
  name: 'postList',
  initialState,
  reducers: {
    postUpload: (state, action: PayloadAction<PostType>) => {
      state.posts.main = [action.payload, ...state.posts.main]
    },
    postUpdateList: (state, action: PayloadAction<updatedPost>) => {
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
        tag: { count: 0, posts: [] },
      }
    },
    clearPostDetail: state => {
      state.postDetail = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getMainPost.fulfilled, (state, action) => {
        const post = [...state.posts.main, ...action.payload.postList]
        const filter = new Map(post.map(p => [p.id, p]))
        state.posts.main = Array.from(filter.values())
        state.totalPages.main = action.payload.totalPages
      })
      .addCase(getExplorePost.fulfilled, (state, action) => {
        const post = [...state.posts.explore, ...action.payload.postList]
        const filter = new Map(post.map(p => [p.id, p]))
        state.posts.explore = Array.from(filter.values())
        state.totalPages.explore = action.payload.totalPages
      })
      .addCase(getTagPost.fulfilled, (state, action) => {
        const post = [...state.posts.tag.posts, ...action.payload.postList]
        const filter = new Map(post.map(p => [p.id, p]))
        state.posts.tag.posts = Array.from(filter.values())
        state.posts.tag.count = action.payload.tagCount
        state.totalPages.tag = action.payload.totalPages
      })
      .addCase(getUserPost.fulfilled, (state, action) => {
        const post = [...state.posts.user, ...action.payload.postList]
        const filter = new Map(post.map(p => [p.id, p]))
        state.posts.user = Array.from(filter.values())
        state.totalPages.user = action.payload.totalPages
      })
      .addCase(getBookmarkPost.fulfilled, (state, action) => {
        const post = [...state.posts.bookmark, ...action.payload.postList]
        const filter = new Map(post.map(p => [p.id, p]))
        state.posts.bookmark = Array.from(filter.values())
        state.totalPages.bookmark = action.payload.totalPages
      })
      .addCase(getPostDetail.fulfilled, (state, action) => {
        state.postDetail = action.payload
      })
  },
})

export const { postDelete, postUpdateList, postUpload, clearPostList, clearPostDetail } =
  postListSlice.actions
export default postListSlice.reducer

export const getMainPost = createAsyncThunk<{ postList: PostType[]; totalPages: number }, number>(
  'postList/getMainPost',
  async (page: number, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/main/?page=${page}`,
        {
          method: 'GET',
          headers: {},
        },
      )
      return response.data
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getExplorePost = createAsyncThunk<
  { postList: PostType[]; totalPages: number },
  { page: number; limit: number }
>(
  'postList/getExplorePost',
  async ({ page, limit }: { page: number; limit: number }, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {},
        },
      )
      return response.data
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getPostDetail = createAsyncThunk<PostType, number>(
  'postList/getPostDetail',
  async (postId: number, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/${postId}`,
        {
          method: 'GET',
        },
      )
      return response.data
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getUserPost = createAsyncThunk<
  { postList: PostType[]; totalPages: number },
  { userId: number; page: number }
>(
  'postList/getUserPost',
  async ({ userId, page }: { userId: number; page: number }, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/my/${userId}?page=${page}`,
        {
          method: 'GET',
        },
      )
      return response.data
    } catch (e: any) {
      dispatch(e.response.data.message)
    }
  },
)
export const getTagPost = createAsyncThunk<
  { postList: PostType[]; totalPages: number; tagCount: number },
  { tagName: string; page: number }
>(
  'postList/getTagPost',
  async ({ tagName, page }: { tagName: string; page: number }, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/tags/${tagName}?page=${page}`,
        {
          method: 'GET',
        },
      )
      return response.data
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getBookmarkPost = createAsyncThunk<
  { postList: PostType[]; totalPages: number; tagCount: number },
  { userId: number; page: number }
>(
  'postList/getBookmarkPost',
  async ({ userId, page }: { userId: number; page: number }, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/bookmark/${userId}?page=${page}`,
        {
          method: 'GET',
        },
      )
      return response.data
    } catch (e: any) {
      dispatch(e.response.data.message)
    }
  },
)
