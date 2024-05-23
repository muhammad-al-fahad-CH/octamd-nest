export interface AppCategory {
  type: string
  id: string
  appTitle: string
}

export interface BlogCategory {
  type: string
  id: string
  blogTitle: string
  appId: AppCategory['id']
}