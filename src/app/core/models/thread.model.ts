import type { User } from "./user.model"
import type { Post } from "./post.model"

export interface Thread {
  id: number
  title: string
  content: string
  forumId: number
  author: User
  createdAt: Date
  updatedAt?: Date
  viewCount: number
  replyCount: number
  isPinned: boolean
  isLocked: boolean
  lastReply?: {
    id: number
    author: User
    createdAt: Date
  }
  tags?: string[]
  posts?: Post[]
}
