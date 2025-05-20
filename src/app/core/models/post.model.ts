import type { User } from "./user.model"

export interface Post {
  id: number
  content: string
  threadId: number
  author: User
  createdAt: Date
  updatedAt?: Date
  isEdited: boolean
  likes: number
  isAcceptedAnswer?: boolean
}
