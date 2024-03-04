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
  postCount? : number;
  followerCount?: number;
  followCount? : number; 
}
export interface updateProfile {
  nickname?: string;
  name?: string;
  introduce?: string;
  profileImg?: Blob|null;
  password?: string;
}
export interface IUserforSignUp {
  email?: string;
  nickname?: string;
  password?: string;
  name?: string;
}

