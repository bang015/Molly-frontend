export interface resultType {
  id: number,
  name: string,
  nickname?: string,
  ProfileImage?: {path:string} | null,
  tagCount? :number,
  type: string
}