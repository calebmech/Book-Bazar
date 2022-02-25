import ImageUploadModal from "@components/ImageUpload/ImageUploadModal";

interface Props {
  onCoverPhotoUploaded: (coverPhoto: Blob) => void;
  isOpen: boolean;
  onClose: VoidFunction;
}

export default function UploadTextbookCover({
  onCoverPhotoUploaded,
  isOpen,
  onClose,
}: Props) {
  const newWrapTextbookCoverUploaded = async (blob: Blob) => {
    onCoverPhotoUploaded(blob);
  };
  return (
    <ImageUploadModal
      key={"image-upload-modal"}
      aspectRatio={4 / 5}
      isOpen={isOpen}
      onClose={onClose}
      onUpload={newWrapTextbookCoverUploaded}
      shape="rect"
    />
  );
}
