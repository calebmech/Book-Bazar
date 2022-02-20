import ImageUploadModal from "@components/ImageUpload/ImageUploadModal";

export const TEXTBOOK_ASPECT_RATIO = 4 / 5;

interface Props {
  onCoverPhotoUploaded: (coverPhoto: Blob) => void;
}

export default function UploadTextbookCover({ onCoverPhotoUploaded }: Props) {
  const newWrapTextbookCoverUploaded = async (blob: Blob) => {
    onCoverPhotoUploaded(blob);
  };

  return (
    <ImageUploadModal
      aspectRatio={TEXTBOOK_ASPECT_RATIO}
      isOpen={true}
      onClose={() => {}}
      onUpload={newWrapTextbookCoverUploaded}
      shape="rect"
    />
  );
}
