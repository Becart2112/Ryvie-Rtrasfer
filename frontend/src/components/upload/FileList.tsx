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
import { FileListItem } from "../../types/File.type";
import { byteToHumanSizeString } from "../../utils/fileSize.util";
import UploadProgressIndicator from "./UploadProgressIndicator";
import { FormattedMessage } from "react-intl";
import { useState } from "react";
import useTranslate from "../../hooks/useTranslate.hook";
import UploadGalleryView from "./UploadGalleryView";

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
}

const FileList = <T extends FileListItem = FileListItem>({
  files,
  setFiles,
}: FileListProps<T>) => {
  const t = useTranslate();
  const [viewMode, setViewMode] = useState<"list" | "gallery">("gallery");

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

  return (
    <Stack spacing="md">
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
