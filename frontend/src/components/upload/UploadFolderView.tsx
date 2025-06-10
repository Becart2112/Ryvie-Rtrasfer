import { ActionIcon, Badge, Box, Card, Group, Stack, Text, Title } from "@mantine/core";
import { TbFolder, TbTrash } from "react-icons/tb";
import { FormattedMessage } from "react-intl";
import useTranslate from "../../hooks/useTranslate.hook";
import { byteToHumanSizeString } from "../../utils/fileSize.util";
import { UploadedItem } from "../../types/File.type";

interface FolderDisplayProps {
  folderName: string;
  fileCount: number;
  totalSize: number;
  onDelete: () => void;
}

const FolderDisplay = ({ folderName, fileCount, totalSize, onDelete }: FolderDisplayProps) => {
  const t = useTranslate();
  
  return (
    <Card shadow="sm" p="md" withBorder>
      <Group position="apart">
        <Group>
          <TbFolder size={24} />
          <Stack spacing={0}>
            <Text weight={500}>{folderName}</Text>
            <Group spacing={5}>
              <Badge size="sm" variant="light">
                {fileCount} <FormattedMessage 
                  id="upload.folders.fileCount"
                  defaultMessage="{count, plural, one {file} other {files}}"
                  values={{ count: fileCount }}
                />
              </Badge>
              <Text size="xs" color="dimmed">
                {byteToHumanSizeString(totalSize)}
              </Text>
            </Group>
          </Stack>
        </Group>
        <ActionIcon 
          color="red" 
          variant="light" 
          onClick={onDelete} 
          title={t("upload.folders.deleteFolder", { defaultMessage: "Delete folder" })}
        >
          <TbTrash size={18} />
        </ActionIcon>
      </Group>
    </Card>
  );
};

interface UploadFolderViewProps {
  items: UploadedItem[];
  folders: Set<string>;
  onDeleteFolder: (folderName: string) => void;
}

/**
 * UploadFolderView - Displays folders that were uploaded via drag and drop
 * 
 * This component shows a list of root folders detected in the uploaded files
 * and allows users to delete entire folders at once.
 * 
 * @param items - All uploaded files with their root folder information
 * @param folders - Set of distinct root folder names
 * @param onDeleteFolder - Callback to delete a folder and all its files
 */
const UploadFolderView = ({ items, folders, onDeleteFolder }: UploadFolderViewProps) => {
  const t = useTranslate();

  // Don't render if there are no folders
  if (folders.size === 0) {
    return null;
  }

  // Calculate file counts and total size for each folder
  const folderStats: Record<string, { count: number; size: number }> = {};
  
  folders.forEach(folder => {
    folderStats[folder] = { count: 0, size: 0 };
  });
  
  items.forEach(item => {
    if (item.rootDir) {
      folderStats[item.rootDir].count++;
      folderStats[item.rootDir].size += item.file.size;
    }
  });

  return (
    <Stack spacing="md">
      <Title order={4}>
        <FormattedMessage id="upload.folders.title" defaultMessage="Folders" />
      </Title>
      <Box>
        {Array.from(folders).map((folder) => (
          <FolderDisplay 
            key={folder}
            folderName={folder}
            fileCount={folderStats[folder].count}
            totalSize={folderStats[folder].size}
            onDelete={() => onDeleteFolder(folder)}
          />
        ))}
      </Box>
    </Stack>
  );
};

export default UploadFolderView;
