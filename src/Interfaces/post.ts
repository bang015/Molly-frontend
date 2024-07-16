export interface uploadPostType {
  content: string;
  postMedias: Blob[];
  hashtags?: string[];
}
export interface updatePostType {
  content: string;
  postId: string;
  hashtags?: string[];
}
export interface postType {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;

  PostMedia: mediaListType[];
  User: { nickname: string, ProfileImage?: { path: string} | null };
}

export interface mediaListType {
  id: number;
  path: string;
}
