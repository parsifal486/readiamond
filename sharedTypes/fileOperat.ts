

export type File = {
  name: string
  path: string
}

export type NewFileState = {
  isCreating: boolean
  tempName: string
}

// Type for tracking file rename state
export type RenamingFileState = {
  isRenaming: boolean
  originalFile: File | null
  tempName: string
}
