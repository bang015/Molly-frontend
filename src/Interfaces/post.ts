export interface uploadPostType {
  token: string;
  content: string;
  post_images: Blob[];
  hashtags?: string[];
}
