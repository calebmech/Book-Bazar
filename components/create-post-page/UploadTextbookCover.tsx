import ImageUploadModal from "@components/ImageUpload/ImageUploadModal";
import { ChangeEvent } from "react";

interface Props {
  onCoverPhotoUploaded: (coverPhoto: Blob) => void;
}

export default function UploadTextbookCover({ onCoverPhotoUploaded }: Props) {
  const wrapTextbookCoverUploaded = (e: ChangeEvent<HTMLInputElement>) => {
    const blob = e.target.files?.[0];
    if (blob) {
      onCoverPhotoUploaded(blob);
    }
  };

  const newWrapTextbookCoverUploaded = async (blob: Blob) => {
    onCoverPhotoUploaded(blob);
  };

  return (
    <ImageUploadModal
      aspectRatio={4 / 5}
      isOpen={true}
      onClose={() => {}}
      onUpload={newWrapTextbookCoverUploaded}
      shape="rect"
    />
  );
}
