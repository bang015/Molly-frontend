export interface FollowType {
  id: number;
  name: string;
  nickname: string;
  profileImage: {path: string} | null;
  message? :string;
}
