export interface SignUpInput {
  email?: string;
  nickname?: string;
  password?: string;
  name?: string;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}