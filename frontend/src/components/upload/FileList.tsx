import {
  ActionIcon,
  Box,
  Group,
  SegmentedControl,
  Stack,
  Table,
} from "@mantine/core";
import { TbTrash } from "react-icons/tb";
import { GrUndo } from "react-icons/gr";
import { FileListItem, UploadedItem } from "../../types/File.type";
import { byteToHumanSizeString } from "../../utils/fileSize.util";
import UploadProgressIndicator from "./UploadProgressIndicator";
import { FormattedMessage } from "react-intl";
import { useState, useEffect } from "react";
import useTranslate from "../../hooks/useTranslate.hook";
import UploadGalleryView from "./UploadGalleryView";
import UploadFolderView from "./UploadFolderView";

interface FileListRowProps {
  file: FileListItem;
  onRemove?: () => void;
  onRestore?: () => void;
}

const FileListRow = ({ file, onRemove, onRestore }: FileListRowProps) => {
  const uploadable = "uploadingProgress" in file;
  const uploading = uploadable && file.uploadingProgress !== 0;
  const removable = uploadable
    ? file.uploadingProgress === 0
    : !file.deleted;
  const restorable = !uploadable && file.deleted;
  const deleted = !uploadable && !!file.deleted;

  return (
    <tr
      style={{
        color: deleted ? "rgba(120, 120, 120, 0.5)" : "inherit",
        textDecoration: deleted ? "line-through" : "none",
      }}
    >
      <td>{file.name}</td>
      <td>{byteToHumanSizeString(+file.size)}</td>
      <td>
        {removable && onRemove && (
          <ActionIcon
            color="red"
            variant="light"
            size={25}
            onClick={onRemove}
          >
            <TbTrash />
          </ActionIcon>
        )}
        {uploading && (
          <UploadProgressIndicator progress={file.uploadingProgress} />
        )}
        {restorable && onRestore && (
          <ActionIcon
            color="primary"
            variant="light"
            size={25}
            onClick={onRestore}
          >
            <GrUndo />
          </ActionIcon>
        )}
      </td>
    </tr>
  );
};

interface FileListProps<T extends FileListItem = FileListItem> {
  files: T[];
  setFiles: (files: T[]) => void;
  uploadedItems?: UploadedItem[];
  onFoldersUpdated?: (items: UploadedItem[], folders: Set<string>) => void;
}

const FileList = <T extends FileListItem = FileListItem>({
  files,
  setFiles,
  uploadedItems,
  onFoldersUpdated,
}: FileListProps<T>) => {
  const t = useTranslate();
  const [viewMode, setViewMode] = useState<"list" | "gallery">("gallery");
  const [folderItems, setFolderItems] = useState<UploadedItem[]>([]);
  const [folders, setFolders] = useState<Set<string>>(new Set());
  
  // Initialize folder state if provided from parent component
  useEffect(() => {
    if (uploadedItems) {
      setFolderItems(uploadedItems);
      
      // Extract folders from uploadedItems
      const detectedFolders = new Set<string>();
      uploadedItems.forEach(item => {
        if (item.rootDir) {
          detectedFolders.add(item.rootDir);
        }
      });
      
      setFolders(detectedFolders);
    }
  }, [uploadedItems]);

  const remove = (index: number) => {
    const newFiles = [...files];
    const file = newFiles[index];

    if ("uploadingProgress" in file) {
      newFiles.splice(index, 1);
    } else {
      newFiles[index] = { ...file, deleted: true };
    }

    setFiles(newFiles);
  };

  const restore = (index: number) => {
    const newFiles = [...files];
    const file = newFiles[index];

    if ("uploadingProgress" in file) {
      return;
    } else {
      newFiles[index] = { ...file, deleted: false };
    }

    setFiles(newFiles);
  };
  
  // Handle folder deletion - removes all files from that folder
  const handleDeleteFolder = (folderName: string) => {
    // Remove all files that belong to this folder
    const newFiles = [...files];
    const filesToKeep = [];
    
    // Find files with matching rootDir
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const matchingItem = folderItems.find(item => {
        if (!item.file) return false;
        // Compare names since file references may not be the same objects
        return item.file.name === (file as any).name && 
               item.rootDir === folderName;
      });
      
      if (!matchingItem) {
        // Keep file if it doesn't belong to the deleted folder
        filesToKeep.push(file);
      }
    }
    
    setFiles(filesToKeep as T[]);
    
    // Update folder state
    const newFolderItems = folderItems.filter(item => item.rootDir !== folderName);
    setFolderItems(newFolderItems);
    
    const newFolders = new Set(folders);
    newFolders.delete(folderName);
    setFolders(newFolders);
    
    // Notify parent component if needed
    if (onFoldersUpdated) {
      onFoldersUpdated(newFolderItems, newFolders);
    }
  };

  return (
    <Stack spacing="md">
      {/* Folder section - only shown when folders are detected */}
      {folders.size > 0 && (
        <UploadFolderView 
          items={folderItems}
          folders={folders}
          onDeleteFolder={handleDeleteFolder}
        />
      )}
      
      <Group position="right">
        <SegmentedControl
          value={viewMode}
          onChange={(value: "list" | "gallery") => setViewMode(value)}
          data={[
            { label: t("share.view.list"), value: "list" },
            { label: t("share.view.gallery"), value: "gallery" },
          ]}
        />
      </Group>

      {viewMode === "gallery" ? (
        <UploadGalleryView
          files={files}
          onRemove={remove}
          onRestore={restore}
        />
      ) : (
        <Box sx={{ display: "block", overflowX: "auto" }}>
          <Table>
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="upload.filelist.name" />
                </th>
                <th>
                  <FormattedMessage id="upload.filelist.size" />
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, i) => (
                <FileListRow
                  key={i}
                  file={file}
                  onRemove={() => remove(i)}
                  onRestore={() => restore(i)}
                />
              ))}
            </tbody>
          </Table>
        </Box>
      )}
    </Stack>
  );
};

export default FileList;
