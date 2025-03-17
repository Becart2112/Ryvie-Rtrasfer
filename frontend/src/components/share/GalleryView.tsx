import {
  ActionIcon,
  Box,
  Card,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { TbDownload, TbEye, TbLink } from "react-icons/tb";
import { FormattedMessage } from "react-intl";
import useTranslate from "../../hooks/useTranslate.hook";
import shareService from "../../services/share.service";
import { FileMetaData } from "../../types/File.type";
import { Share } from "../../types/share.type";
import { byteToHumanSizeString } from "../../utils/fileSize.util";
import toast from "../../utils/toast.util";
import showFilePreviewModal from "./modals/showFilePreviewModal";

const GalleryView = ({
  files,
  share,
}: {
  files?: FileMetaData[];
  share: Share;
}) => {
  const clipboard = useClipboard();
  const modals = useModals();
  const t = useTranslate();

  const copyFileLink = (file: FileMetaData) => {
    const link = `${window.location.origin}/api/shares/${share.id}/files/${file.id}`;

    if (window.isSecureContext) {
      clipboard.copy(link);
      toast.success(t("common.notify.copied-link"));
    } else {
      modals.openModal({
        title: t("share.modal.file-link"),
        children: <TextInput variant="filled" value={link} />,
      });
    }
  };

  const getPreviewUrl = (file: FileMetaData) => {
    return `${window.location.origin}/api/shares/${share.id}/files/${file.id}?download=false`;
  };

  const getFileIcon = (file: FileMetaData) => {
    const mimeType = shareService.getFileMimeType(file.name);
    if (mimeType && mimeType.startsWith("image/")) {
      return <Image src={getPreviewUrl(file)} alt={file.name} height={120} fit="contain" />;
    } else if (mimeType && mimeType.startsWith("video/")) {
      return <video src={getPreviewUrl(file)} style={{ maxHeight: 120, width: "100%", objectFit: "contain" }} />;
    } else if (mimeType === "application/pdf") {
      return <Image src="/pdf-icon.svg" alt="PDF" height={120} fit="contain" />;
    }
    return <Image src="/file-icon.svg" alt="File" height={120} fit="contain" />;
  };

  if (!files) return null;

  return (
    <Box>
      <Grid>
        {files.map((file) => (
          <Grid.Col key={file.id} xs={12} sm={6} md={4} lg={3}>
            <Card shadow="sm" p="sm">
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
                  {byteToHumanSizeString(parseInt(file.size))}
                </Text>

                <Group position="right" spacing={5}>
                  {shareService.doesFileSupportPreview(file.name) && (
                    <ActionIcon
                      size={25}
                      onClick={() => showFilePreviewModal(share.id, file, modals)}
                    >
                      <TbEye />
                    </ActionIcon>
                  )}
                  {!share.hasPassword && (
                    <ActionIcon size={25} onClick={() => copyFileLink(file)}>
                      <TbLink />
                    </ActionIcon>
                  )}
                  <ActionIcon
                    size={25}
                    onClick={async () => {
                      await shareService.downloadFile(share.id, file.id);
                    }}
                  >
                    <TbDownload />
                  </ActionIcon>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
};

export default GalleryView;
