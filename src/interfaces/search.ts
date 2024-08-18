export interface ResultType {
  id: number,
  name: string,
  nickname?: string,
  profileImage?: {path:string} | null,
  tagCount? :number,
  type: string
}