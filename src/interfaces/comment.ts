export interface CommentType {
  id: number
  postId: number
  userId: number
  content: string
  commentId: number | null
  createdAt: string
  updatedAt: string
  user: { nickname: string; profileImage: { path: string } | null }
  subComment: CommentType[]
  showSubComments: boolean
  subCommentsCount: number
}
export interface addCommentType {
  postId: number
  content: string
  commentId?: number | null
}
