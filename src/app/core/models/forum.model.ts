export interface Forum {
  id: number
  name: string
  description?: string
  icon?: string
  threadCount?: number
  postCount?: number
  lastPost?: {
    id: number
    title: string
    date: Date
    author: {
      id: number
      username: string
      avatar?: string
    }
  }
}
