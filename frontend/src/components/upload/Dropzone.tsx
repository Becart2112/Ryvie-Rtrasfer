import { Button, Center, createStyles, Group, Text } from "@mantine/core";
import { Dropzone as MantineDropzone } from "@mantine/dropzone";
import { ForwardedRef, useRef } from "react";
import { TbCloudUpload, TbUpload } from "react-icons/tb";
import { FormattedMessage } from "react-intl";
import useTranslate from "../../hooks/useTranslate.hook";
import { FileUpload, UploadedItem } from "../../types/File.type";
import { byteToHumanSizeString } from "../../utils/fileSize.util";
import toast from "../../utils/toast.util";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    marginBottom: 30,
  },

  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  control: {
    position: "absolute",
    bottom: -20,
  },
}));

const Dropzone = ({
  title,
  isUploading,
  maxShareSize,
  onFilesChanged,
  onFolderDetection,
}: {
  title?: string;
  isUploading: boolean;
  maxShareSize: number;
  onFilesChanged: (files: FileUpload[]) => void;
  onFolderDetection?: (items: UploadedItem[], folders: Set<string>) => void;
}) => {
  const t = useTranslate();

  const { classes } = useStyles();
  const openRef = useRef<() => void>();
  return (
    <div className={classes.wrapper}>
      <MantineDropzone
        onReject={(e) => {
          toast.error(e[0].errors[0].message);
        }}
        disabled={isUploading}
        openRef={openRef as ForwardedRef<() => void>}
        onDrop={(files: FileUpload[]) => {
          const fileSizeSum = files.reduce((n, { size }) => n + size, 0);

          if (fileSizeSum > maxShareSize) {
            toast.error(
              t("upload.dropzone.notify.file-too-big", {
                maxSize: byteToHumanSizeString(maxShareSize),
              }),
            );
          } else {
            files = files.map((newFile) => {
              newFile.uploadingProgress = 0;
              return newFile;
            });
            onFilesChanged(files);
            
            // Detect folders using webkitRelativePath and extract root directories
            if (onFolderDetection) {
              const uploadedItems: UploadedItem[] = [];
              const folders = new Set<string>();
              
              files.forEach(file => {
                // Use webkitRelativePath to get file path (if it's from a folder)
                const relativePath = (file as any).webkitRelativePath || "";
                let rootDir: string | null = null;
                
                if (relativePath) {
                  // Extract root directory (first path segment)
                  const pathParts = relativePath.split("/");
                  if (pathParts.length > 1) {
                    rootDir = pathParts[0];
                    if (rootDir) {
                      folders.add(rootDir);
                    }
                  }
                }
                
                uploadedItems.push({ file, rootDir });
              });
              
              onFolderDetection(uploadedItems, folders);
            }
          }
        }}
        className={classes.dropzone}
        radius="md"
      >
        <div style={{ pointerEvents: "none" }}>
          <Group position="center">
            <TbCloudUpload size={50} />
          </Group>
          <Text align="center" weight={700} size="lg" mt="xl">
            {title || <FormattedMessage id="upload.dropzone.title" />}
          </Text>
          <Text align="center" size="sm" mt="xs" color="dimmed">
            <FormattedMessage
              id="upload.dropzone.description"
              values={{ maxSize: byteToHumanSizeString(maxShareSize) }}
            />
          </Text>
          <Text align="center" size="sm" mt="xs" color="dimmed">
            <FormattedMessage 
              id="upload.dropzone.folders"
              defaultMessage="Drag entire folders here or click to select files"
            />
          </Text>
        </div>
      </MantineDropzone>
      <Center>
        <Button
          className={classes.control}
          variant="light"
          size="sm"
          radius="xl"
          disabled={isUploading}
          onClick={() => openRef.current && openRef.current()}
        >
          {<TbUpload />}
        </Button>
      </Center>
    </div>
  );
};
export default Dropzone;
