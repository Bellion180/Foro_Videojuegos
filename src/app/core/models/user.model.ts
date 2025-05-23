export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  bio?: string
  joinDate: Date
  role: "user" | "moderator" | "admin"
  postCount?: number
  threadCount?: number
  isVerified?: boolean
}
