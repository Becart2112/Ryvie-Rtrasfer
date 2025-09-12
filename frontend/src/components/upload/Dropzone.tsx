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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  dropzone: {
    position: "relative",
    width: "30vw", // Adjust this value to make it scale with the viewport
    height: "30vw", // Adjust this value to make it scale with the viewport
    borderRadius: "50%",
    border: `2px dashed ${
      theme.colorScheme === "dark" ? theme.colors.gray[6] : theme.colors.gray[4]
    }`,
    background: theme.colorScheme === "dark"
      ? "radial-gradient(circle at center, #2a2a40, #1a1a2e)"
      : "radial-gradient(circle at center, #f8f9fa, #dee2e6)",
    overflow: "hidden",
    transition: "0.3s ease",
    "&:hover": {
      borderColor: theme.colors.violet[5],
      boxShadow: `0 0 20px ${theme.colors.violet[6]}40`,
    },
  },
  

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[3]
        : theme.colors.gray[6],
  },

  control: {
    position: "absolute",
    bottom: -20,
  },

  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: theme.white,
    textAlign: "center",
    zIndex: 2,
  },

  bubbles: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    borderRadius: "50%",
    zIndex: 1,
  },

  bubble: {
    position: "absolute",
    bottom: -50,
    width: 20,
    height: 20,
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "50%",
    animation: "float 6s infinite ease-in-out",
  },

  "@keyframes float": {
    "0%": { transform: "translateY(0) scale(1)", opacity: 0.4 },
    "50%": { transform: "translateY(-100px) scale(1.1)", opacity: 0.8 },
    "100%": { transform: "translateY(-220px) scale(0.9)", opacity: 0 },
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
  const { classes, cx } = useStyles();
  const openRef = useRef<() => void>();

  return (
    <div className={classes.wrapper}>
      <MantineDropzone
        onReject={(e) => toast.error(e[0].errors[0].message)}
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

            if (onFolderDetection) {
              const uploadedItems: UploadedItem[] = [];
              const folders = new Set<string>();

              files.forEach((file) => {
                const relativePath =
                  (file as any).webkitRelativePath ||
                  (file as any).path ||
                  "";
                let rootDir: string | null = null;

                if (relativePath) {
                  const pathParts = relativePath.split("/");
                  if (pathParts.length > 1) {
                    rootDir =
                      pathParts[0] === "" && pathParts.length > 2
                        ? pathParts[1]
                        : pathParts[0];
                    if (rootDir) folders.add(rootDir);
                  }
                }
                uploadedItems.push({ file, rootDir });
              });

              onFolderDetection(uploadedItems, folders);
            }
          }
        }}
        className={classes.dropzone}
      >
        {/* Fond animé avec bulles */}
        <div className={classes.bubbles}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className={classes.bubble}
              style={{
                left: `${20 + i * 15}%`,
                width: `${10 + (i % 3) * 10}px`,
                height: `${10 + (i % 3) * 10}px`,
                animationDuration: `${4 + i}s`,
              }}
            />
          ))}
        </div>

        {/* Contenu central */}
        <div className={classes.content}>
          <Group position="center">
            <TbCloudUpload size={50} />
          </Group>
          <Text weight={700} size="lg" mt="sm">
            {title || <FormattedMessage id="upload.dropzone.title" />}
          </Text>
          <Text size="sm" mt="xs" color="dimmed">
            <FormattedMessage
              id="upload.dropzone.description"
              values={{ maxSize: byteToHumanSizeString(maxShareSize) }}
            />
          </Text>
          <Text size="sm" mt="xs" color="dimmed">
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
