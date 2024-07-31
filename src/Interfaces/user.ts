export interface UserType {
  id: number
  email: string
  nickname: string
  name: string
  introduce?: string
  profileImageId?: number
  createdAt: string
  updatedAt: string
  profileImage?: {
    id?: number
    path: string
  }
  postCount: number
  followerCount: number
  followingCount: number
}
export interface UpdateProfileInput {
  nickname?: string
  name?: string
  introduce?: string
  profileImg?: Blob | null
  password?: string
}
