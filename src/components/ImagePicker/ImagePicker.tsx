import { AddPhotoAlternate as AddPhotoAlternateIcon } from "@mui/icons-material";
import { Box, Card, Fab, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { ImageContainer } from "../PictureContainer/ImageContainer";
import { VisibilityAnimation } from "../Animations/VisibilityAnimation";
import { DeleteForever as DeleteForeverIcon } from "@mui/icons-material";

interface ImagePickerProps {
  profilePicture: File | null;
  setProfilePicture: (value: File | null) => void;
  width?: string;
  height?: string;
}

export const ImagePicker = ({
  profilePicture,
  setProfilePicture,
  width = "100%",
  height = "100%",
}: ImagePickerProps) => {
  const [profilePictureString, setProfilePictureString] = useState<string | undefined>(undefined);
  const [isHoverOnImage, setHoverOnImage] = useState<boolean>(false);
  const [isHoverOnFab, setHoverOnFab] = useState<boolean>(false);

  useEffect(() => {
    if (!profilePicture) {
      reset();
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(profilePicture);
    reader.onloadend = (_) => {
      setProfilePictureString((reader.result as string) ?? undefined);
      setHoverOnFab(false);
    };
  }, [profilePicture]);

  const handleUploadClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];

    setProfilePicture(file);

    // if (file) {
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onloadend = (_) => setProfilePictureString((reader.result as string) ?? undefined);
    // }
  };

  const reset = () => {
    setProfilePicture(null);
    setProfilePictureString(undefined);
  };

  return (
    <Card
      sx={{
        width: width,
        height: height,
        overflow: "visible",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: (theme) => (isHoverOnFab ? theme.palette.focus.light : theme.palette.secondary.light),
      }}
      onMouseEnter={() => setHoverOnImage(true)}
      onMouseLeave={() => setHoverOnImage(false)}
    >
      {profilePictureString ? (
        <>
          {isHoverOnImage && (
            <VisibilityAnimation style={{ position: "absolute" }}>
              <Fab
                component="span"
                onClick={() => reset()}
                onMouseEnter={() => setHoverOnFab(true)}
                onMouseLeave={() => setHoverOnFab(false)}
              >
                <DeleteForeverIcon />
              </Fab>
            </VisibilityAnimation>
          )}

          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              backgroundColor: (theme) => (isHoverOnFab ? theme.palette.focus.light : undefined),
            }}
          />

          <ImageContainer src={profilePictureString} />
        </>
      ) : (
        <>
          <input
            id="profile-picture-input"
            style={{ display: "none" }}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleUploadClick}
          />
          <label htmlFor="profile-picture-input">
            <Tooltip title="Upload profile picture">
              <Fab
                component="span"
                onMouseEnter={() => setHoverOnFab(true)}
                onMouseLeave={() => setHoverOnFab(false)}
              >
                <AddPhotoAlternateIcon />
              </Fab>
            </Tooltip>
          </label>
        </>
      )}
    </Card>
  );
};
