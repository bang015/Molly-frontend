export interface userType {
  id?: number;
  email?: string;
  nickname?: string;
  name?: string;
  introduce?: string;
  profile_image?: string;
  createdAt?: string;
  updatedAt?: string;
  ProfileImage? : {
    id:number,
    path:string
  }
}
export interface updateProfile {
  nickname?: string;
  name?: string;
  introduce?: string;
  profile_image?: Blob|null;
  password?: string;
}
export interface IUserforSignUp {
  email?: string;
  nickname?: string;
  password?: string;
  name?: string;
}

export interface suggestFollower {
  userId: number;
  userName: string;
  userNickname: string;
  profileImagePath: string|null;
}