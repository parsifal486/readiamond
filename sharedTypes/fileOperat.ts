export type FolderItem = {
  name: string
  path: string
  type: 'folder'
  children: (FileItem | FolderItem)[]
}

export type FileItem = {
  name: string
  path: string
  type: 'file'
  extension: string
}

