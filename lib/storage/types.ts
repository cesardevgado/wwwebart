export type StoredFile = { key: string; publicUrl: string; bytes: number }
export interface StorageAdapter {
  upload(file: File, kind: 'image' | 'video'): Promise<StoredFile>
  delete(key: string): Promise<void>
  getPublicUrl(key: string): string
}
