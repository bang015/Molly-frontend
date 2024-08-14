export interface SignUpInput {
  email?: string
  nickname?: string
  password?: string
  name?: string
  code: string
}

export interface Token {
  accessToken: string
  refreshToken: string
}

export interface ResetPassword {
  email: string
  code: string
  newPassword: string
}
