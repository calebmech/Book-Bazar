import ImageUploadModal from "@components/ImageUpload/ImageUploadModal";

interface Props {
  key: string;
  onCoverPhotoUploaded: (coverPhoto: Blob) => void;
  isOpen: boolean;
  onClose: VoidFunction;
}

export default function UploadTextbookCover({
  key,
  onCoverPhotoUploaded,
  isOpen,
  onClose,
}: Props) {
  const newWrapTextbookCoverUploaded = async (blob: Blob) => {
    onCoverPhotoUploaded(blob);
  };
  return (
    <ImageUploadModal
      key={key}
      aspectRatio={4 / 5}
      isOpen={isOpen}
      onClose={onClose}
      onUpload={newWrapTextbookCoverUploaded}
      shape="rect"
    />
  );
}
