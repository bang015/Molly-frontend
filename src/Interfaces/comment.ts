export interface commentType {
  id: number;
  postId: number;
  userId: number;
  content: string;
  commentId: number | null;
  createdAt: string;
  updatedAt: string;
  user: { nickname: string; ProfileImage: { path: string } | null };
  subcommentCount?: number;
}
export interface addCommentType {
  postId: number;
  content: string;
  commentId?: number | null;
}
