import client from './client'

export type UserCreate = {
  username: string
  email: string
  password: string
}

export type UserLogin = {
  email: string
  password: string
}

export type TokenResponse = {
  access_token: string
  token_type: string
}

export type UserResponse = {
  id: string
  username: string
  email: string
}

export const register = async (body: UserCreate): Promise<TokenResponse> => {
  const { data } = await client.post<TokenResponse>('/auth/register', body)
  return data
}

export const login = async (body: UserLogin): Promise<TokenResponse> => {
  const { data } = await client.post<TokenResponse>('/auth/login', body)
  return data
}

export const getMe = async (): Promise<UserResponse> => {
  const { data } = await client.get<UserResponse>('/auth/me')
  return data
}
