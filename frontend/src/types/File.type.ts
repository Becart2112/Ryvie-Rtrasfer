export type FileUpload = File & { uploadingProgress: number };

export type FileUploadResponse = { id: string; name: string };

export type FileMetaData = {
  id: string;
  name: string;
  size: string;
};

export type FileListItem = FileUpload | (FileMetaData & { deleted?: boolean });

export interface UploadedItem {
  file: File;
  rootDir: string | null; // null if upload of a single file
}

export type FolderUploadState = {
  items: UploadedItem[];      // all files
  folders: Set<string>;       // distinct root folders
};
