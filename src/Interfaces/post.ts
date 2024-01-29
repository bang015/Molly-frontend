export interface uploadPostType {
  token: string;
  content: string;
  post_images: Blob[];
  hashtags?: string[];
}

export interface postListType {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  nickname: string;
  mediaList: mediaListType[];
}

export interface mediaListType {
  mediaId: number;
  mediaPath: string;
}