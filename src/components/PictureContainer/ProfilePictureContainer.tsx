import { FC } from "react";
import defaultProfilePicture from "../../assets/default_profile_picture.png";
import { ImageContainer } from "./ImageContainer";

interface ProfilePictureContainerProps {
  src: string | null;
}

export const ProfilePictureContainer: FC<ProfilePictureContainerProps> = ({ src }: ProfilePictureContainerProps) => {
  return (
    <ImageContainer
      src={src ?? defaultProfilePicture}
      width={4}
      height={4}
    />
  );
};
