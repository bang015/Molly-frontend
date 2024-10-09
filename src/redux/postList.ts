import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { INIT, POST_API } from '../utils/api-url'
import { PostType } from '../interfaces/post'
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
  loading: {
    explore: boolean
    main: boolean
    detail: boolean
    user: boolean
    bookmark: boolean
    tag: boolean
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
  loading: {
    explore: false,
    main: false,
    detail: false,
    user: false,
    bookmark: false,
    tag: false,
  },
}
const postListSlice = createSlice({
  name: 'postList',
  initialState,
  reducers: {
    postUpload: (state, action: PayloadAction<PostType>) => {
      state.posts.main = [action.payload, ...state.posts.main]
      if (state.posts.user.length > 0) {
        const userPostIndex = state.posts.user.findIndex(
          post => post.user.id === action.payload.userId,
        )
        if (userPostIndex !== -1) {
          state.posts.user = [action.payload, ...state.posts.user]
        }
      }
    },
    postUpdateList: (state, action) => {
      if (state.postDetail && state.postDetail?.id === action.payload.id) {
        state.postDetail.content = action.payload.content
      }
      const updatedPosts = state.posts.main.map(post =>
        post.id === action.payload.id ? { ...post, content: action.payload.content! } : post,
      )
      state.posts.main = updatedPosts
    },
    updatePostLike: (state, action) => {
      const { postId, isLiked } = action.payload
      if (state.postDetail && state.postDetail.id === postId) {
        state.postDetail.isLiked = isLiked
        state.postDetail.likeCount = isLiked
          ? state.postDetail.likeCount + 1
          : state.postDetail.likeCount - 1
      }
      state.posts.main = updateLikeStatus(state.posts.main, postId, isLiked)
      state.posts.explore = updateLikeStatus(state.posts.explore, postId, isLiked)
      state.posts.user = updateLikeStatus(state.posts.user, postId, isLiked)
      state.posts.bookmark = updateLikeStatus(state.posts.bookmark, postId, isLiked)
    },
    updatePostBookmark: (state, action) => {
      const { postId, isBookmarked } = action.payload
      if (state.postDetail && state.postDetail.id === postId) {
        state.postDetail.isBookmarked = isBookmarked
      }
      state.posts.main = updateBookmarkStatus(state.posts.main, postId, isBookmarked)
      state.posts.explore = updateBookmarkStatus(state.posts.explore, postId, isBookmarked)
      state.posts.user = updateBookmarkStatus(state.posts.user, postId, isBookmarked)
      state.posts.bookmark = updateBookmarkStatus(state.posts.bookmark, postId, isBookmarked)
    },
    setPostDetail: (state, action) => {
      state.postDetail = action.payload
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
      .addCase(getMainPost.pending, state => {
        state.loading.main = true
      })
      .addCase(getMainPost.fulfilled, (state, action) => {
        const post = [...state.posts.main, ...action.payload.result]
        const filter = new Map(post.map(p => [p.id, p]))
        state.posts.main = Array.from(filter.values())
        state.totalPages.main = action.payload.totalPages
        state.loading.main = false
      })
      .addCase(getExplorePost.pending, state => {
        state.loading.explore = true
      })
      .addCase(getExplorePost.fulfilled, (state, action) => {
        const post = [...state.posts.explore, ...action.payload.result]
        const filter = new Map(post.map(p => [p.id, p]))
        state.posts.explore = Array.from(filter.values())
        state.totalPages.explore = action.payload.totalPages
        state.loading.explore = false
      })
      .addCase(getTagPost.pending, state => {
        state.loading.tag = true
      })
      .addCase(getTagPost.fulfilled, (state, action) => {
        const post = [...state.posts.tag.posts, ...action.payload.result]
        const filter = new Map(post.map(p => [p.id, p]))
        state.posts.tag.posts = Array.from(filter.values())
        state.posts.tag.count = action.payload.tagPostCount
        state.totalPages.tag = action.payload.totalPages
        state.loading.tag = false
      })
      .addCase(getUserPost.pending, state => {
        state.loading.user = true
      })
      .addCase(getUserPost.fulfilled, (state, action) => {
        const post = [...state.posts.user, ...action.payload.result].filter(
          post => post.user.id === action.meta.arg.userId,
        )
        const filter = new Map(post.map(p => [p.id, p]))
        state.posts.user = Array.from(filter.values())
        state.totalPages.user = action.payload.totalPages
        state.loading.user = false
      })
      .addCase(getBookmarkPost.pending, state => {
        state.loading.bookmark = true
      })
      .addCase(getBookmarkPost.fulfilled, (state, action) => {
        const post = [...state.posts.bookmark, ...action.payload.result].filter(
          post => post.user.id === action.meta.arg.userId,
        )
        const filter = new Map(post.map(p => [p.id, p]))
        state.posts.bookmark = Array.from(filter.values())
        state.totalPages.bookmark = action.payload.totalPages
        state.loading.bookmark = false
      })
      .addCase(getPostDetail.pending, state => {
        state.loading.detail = true
      })
      .addCase(getPostDetail.fulfilled, (state, action) => {
        state.postDetail = action.payload
        state.loading.detail = false
      })
  },
})

export const {
  postDelete,
  postUpdateList,
  postUpload,
  clearPostList,
  clearPostDetail,
  updatePostLike,
  updatePostBookmark,
  setPostDetail,
} = postListSlice.actions
export default postListSlice.reducer

function updateLikeStatus(posts: PostType[], postId: number, isLiked: boolean) {
  return posts.map(post => {
    if (post.id === postId) {
      return {
        ...post,
        isLiked: isLiked,
        likeCount: isLiked ? post.likeCount + 1 : post.likeCount - 1,
      }
    }
    return post
  })
}

function updateBookmarkStatus(posts: PostType[], postId: number, isBookmarked: boolean) {
  return posts.map(post => {
    if (post.id === postId) {
      return {
        ...post,
        isBookmarked: isBookmarked,
      }
    }
    return post
  })
}

export const getMainPost = createAsyncThunk<{ result: PostType[]; totalPages: number }, number>(
  'postList/getMainPost',
  async (page: number, { dispatch }) => {
    try {
      const response = await request(`${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/main`, {
        method: 'GET',
        headers: {},
        params: { page },
      })
      return response.data
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getExplorePost = createAsyncThunk<
  { result: PostType[]; totalPages: number },
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
  { result: PostType[]; totalPages: number; userId: number },
  { userId: number; page: number }
>(
  'postList/getUserPost',
  async ({ userId, page }: { userId: number; page: number }, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/my/${userId}?page=${page}`,
        {
          method: 'GET',
          headers: {},
        },
      )
      return response.data
    } catch (e: any) {
      dispatch(e.response.data.message)
    }
  },
)
export const getTagPost = createAsyncThunk<
  { result: PostType[]; totalPages: number; tagPostCount: number },
  { tagName: string; page: number }
>(
  'postList/getTagPost',
  async ({ tagName, page }: { tagName: string; page: number }, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/tags/${tagName}?page=${page}`,
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

export const getBookmarkPost = createAsyncThunk<
  { result: PostType[]; totalPages: number },
  { userId: number; page: number }
>(
  'postList/getBookmarkPost',
  async ({ userId, page }: { userId: number; page: number }, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/bookmark/${userId}?page=${page}`,
        {
          method: 'GET',
          headers: {},
        },
      )
      return response.data
    } catch (e: any) {
      dispatch(e.response.data.message)
    }
  },
)
