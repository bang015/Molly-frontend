export interface uploadPostType {
  token: string;
  content: string;
  post_images: Blob[];
  hashtags?: string[];
}

export interface postType {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  nickname: string;
  profileImage: {path:string | null};
  mediaList: mediaListType[];
}

export interface mediaListType {
  mediaId: number;
  mediaPath: string;
}