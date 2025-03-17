import {
  ActionIcon,
  Box,
  Card,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { TbTrash } from "react-icons/tb";
import { GrUndo } from "react-icons/gr";
import { FileListItem } from "../../types/File.type";
import { byteToHumanSizeString } from "../../utils/fileSize.util";
import UploadProgressIndicator from "./UploadProgressIndicator";
import shareService from "../../services/share.service";

const UploadGalleryView = <T extends FileListItem = FileListItem>({
  files,
  onRemove,
  onRestore,
}: {
  files: T[];
  onRemove: (index: number) => void;
  onRestore: (index: number) => void;
}) => {
  const getFileIcon = (file: FileListItem) => {
    const mimeType = shareService.getFileMimeType(file.name);
    if (mimeType && mimeType.startsWith("image/")) {
      return <Image src={URL.createObjectURL(file as unknown as Blob)} alt={file.name} height={120} fit="contain" />;
    } else if (mimeType && mimeType.startsWith("video/")) {
      return <video src={URL.createObjectURL(file as unknown as Blob)} style={{ maxHeight: 120, width: "100%", objectFit: "contain" }} />;
    } else if (mimeType === "application/pdf") {
      return <Image src="/pdf-icon.svg" alt="PDF" height={120} fit="contain" />;
    }
    return <Image src="/file-icon.svg" alt="File" height={120} fit="contain" />;
  };

  return (
    <Box>
      <Grid>
        {files.map((file, i) => {
          const uploadable = "uploadingProgress" in file;
          const uploading = uploadable && file.uploadingProgress !== 0;
          const removable = uploadable
            ? file.uploadingProgress === 0
            : !file.deleted;
          const restorable = !uploadable && file.deleted;
          const deleted = !uploadable && !!file.deleted;

          return (
            <Grid.Col key={i} xs={12} sm={6} md={4} lg={3}>
              <Card shadow="sm" p="sm" style={{
                opacity: deleted ? 0.5 : 1,
                textDecoration: deleted ? "line-through" : "none",
              }}>
                <Card.Section>
                  <Box sx={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {getFileIcon(file)}
                  </Box>
                </Card.Section>

                <Stack spacing={5} mt="sm">
                  <Tooltip label={file.name}>
                    <Text size="sm" weight={500} lineClamp={1}>
                      {file.name}
                    </Text>
                  </Tooltip>
                  <Text size="xs" color="dimmed">
                    {byteToHumanSizeString(+file.size)}
                  </Text>

                  <Group position="right" spacing={5}>
                    {removable && (
                      <ActionIcon
                        color="red"
                        variant="light"
                        size={25}
                        onClick={() => onRemove(i)}
                      >
                        <TbTrash />
                      </ActionIcon>
                    )}
                    {uploading && (
                      <UploadProgressIndicator progress={file.uploadingProgress} />
                    )}
                    {restorable && (
                      <ActionIcon
                        color="primary"
                        variant="light"
                        size={25}
                        onClick={() => onRestore(i)}
                      >
                        <GrUndo />
                      </ActionIcon>
                    )}
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
    </Box>
  );
};

export default UploadGalleryView;
