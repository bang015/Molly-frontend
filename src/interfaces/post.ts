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
export interface PostType {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  postMedias: MediaListType[];
  user: { nickname: string, profileImage?: { path: string} | null };
}

export interface MediaListType {
  id: number;
  path: string;
}
