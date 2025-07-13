

export type File = {
  name: string
  path: string
  extension: string
}

export type NewFileState = {
  isCreating: boolean
  tempName: string
}
