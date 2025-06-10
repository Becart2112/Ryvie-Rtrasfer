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
              console.log("[Dropzone] Starting folder detection process");
              console.log("[Dropzone] Browser/OS information:", navigator.userAgent);
              console.log("[Dropzone] Files count:", files.length);
              
              const uploadedItems: UploadedItem[] = [];
              const folders = new Set<string>();
              
              // Debug first file properties
              if (files.length > 0) {
                console.log("[Dropzone] First file properties:", Object.keys(files[0]));
                console.log("[Dropzone] WebkitRelativePath support:", 'webkitRelativePath' in files[0]);
                console.log("[Dropzone] Path property support:", 'path' in files[0]);
              }
              
              files.forEach((file, index) => {
                // Use webkitRelativePath to get file path (if it's from a folder)
                const webkitPath = (file as any).webkitRelativePath || "";
                const filePath = (file as any).path || "";
                const relativePath = webkitPath || filePath || "";
                
                console.log(`[Dropzone] File ${index+1}/${files.length}: ${file.name}`);
                console.log(`[Dropzone] - Type: ${file.type}`);
                console.log(`[Dropzone] - Size: ${byteToHumanSizeString(file.size)}`);
                console.log(`[Dropzone] - webkitRelativePath: "${webkitPath}"`);
                console.log(`[Dropzone] - path property: "${filePath}"`);
                console.log(`[Dropzone] - effective path: "${relativePath}"`);
                
                let rootDir: string | null = null;
                
                if (relativePath) {
                  // Extract root directory (first path segment)
                  const pathParts = relativePath.split("/");
                  console.log(`[Dropzone] - path parts:`, pathParts);
                  
                  if (pathParts.length > 1) {
                    // Si le chemin commence par /, le premier élément sera vide
                    // Dans ce cas, on prend le deuxième élément comme nom de dossier
                    if (pathParts[0] === "" && pathParts.length > 2) {
                      rootDir = pathParts[1];
                      console.log(`[Dropzone] Path starts with /, using second part as folder name: ${rootDir}`);
                    } else {
                      rootDir = pathParts[0];
                    }
                    
                    if (rootDir) {
                      folders.add(rootDir);
                      console.log(`[Dropzone] ✓ Added to folder "${rootDir}": ${file.name}`);
                    }
                  } else {
                    console.log(`[Dropzone] ✗ Not in a folder: ${file.name}`);
                  }
                } else {
                  console.log(`[Dropzone] ✗ No path information for: ${file.name}`);
                }
                
                uploadedItems.push({ file, rootDir });
              });
              
              console.log("[Dropzone] Folder detection complete. Found", folders.size, "root folders:", Array.from(folders));
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
