export interface CommentType {
  id : number;
  postId: number;
  userId: number;
  content: string;
  commentId: number | null;
  createdAt: string;
  updatedAt: string;
  nickname: string;
  profileImage: string;
}
export interface addCommentType {
  postId: number;
  content: string;
  commentId? : number | null;
}