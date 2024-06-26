import { Box, Button, TextField, Typography } from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import { useValidation } from "../../utils/UseValidation";
import { VisibilityAnimation } from "../Animations/VisibilityAnimation";
import { AppContext } from "../App/App";
import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { ImagePicker } from "../ImagePicker/ImagePicker";

const ImageUriToFile = async (uri: string): Promise<File | null> => {
  const fileName = uri.split("/")[uri.split("/").length - 1];
  const extension = fileName.split(".")[fileName.split(".").length - 1];
  const mimeType = extension === "jpeg" ? "image/jpeg" : "image/png";

  const response = await fetch(uri);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: mimeType });
  return file;
};

export const ProfileSettings: FC = () => {
  const { user, requests } = useContext(AppContext);
  const [isEditingUsername, setEditingUsername] = useState<boolean>(false);
  const [initialProfilePicture, setInitialProfilePicture] = useState<File | null>(null);

  const username = "username";
  const profilePicture = "profilePicture";

  useEffect(() => {
    setEditingUsername(false);

    if (!user?.profilePictureUri) {
      setInitialProfilePicture(null);
      return;
    }
    ImageUriToFile(user?.profilePictureUri).then((result) => setInitialProfilePicture(result));
  }, [user]);

  const validation = useValidation(
    [
      {
        name: username,
        defaultValue: user?.username,
        conditions: [
          {
            expression: (value: string) => value.trim() === "",
            errorMessage: "Username is required!",
          },
          {
            expression: (value: string) => value.trim().includes(" "),
            errorMessage: "Username must not contain white spaces!",
          },
        ],
      },
      {
        name: profilePicture,
        defaultValue: initialProfilePicture,
        conditions: [],
      },
    ],
    [initialProfilePicture]
  );

  const onSubmit = () => {
    if (!validation.pass()) return;
    const data = validation.getData();
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    requests.updateUserProfileRequest({ requestBody: formData }, (token: string) => {
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("storage"));
    });
  };

  return (
    <VisibilityAnimation style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "primary.light",
          borderRadius: (theme) => theme.spacing(6),
          boxShadow: 20,
        }}
      >
        <Box
          sx={{
            borderTopLeftRadius: (theme) => theme.spacing(6),
            borderBottomLeftRadius: (theme) => theme.spacing(6),
            overflow: "hidden ",
            backgroundColor: "primary.main",
            width: "10rem",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: (theme) => theme.spacing(4),
            gap: (theme) => theme.spacing(2),
          }}
        >
          <Typography variant="h5">Profile settings</Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: (theme) => theme.spacing(2) }}
          >
            <Typography>Username:</Typography>
            <Box>
              <TextField
                InputProps={{
                  readOnly: !isEditingUsername,
                }}
                fullWidth
                value={validation.errors[username]?.value}
                error={Boolean(validation.errors[username]?.error)}
                onChange={(event) => validation.setFieldValue(username, event.currentTarget.value)}
              />
              <FormErrorMessage>{validation.errors[username]?.error}</FormErrorMessage>
            </Box>
            <Button
              sx={{ width: (theme) => theme.spacing(16) }}
              onClick={() => {
                if (!isEditingUsername) {
                  setEditingUsername(true);
                  return;
                }
                setEditingUsername(false);
                validation.setFieldValue(username, user?.username);
              }}
            >
              {isEditingUsername ? "Cancel" : "Edit"}
            </Button>
          </Box>

          <Box>
            <Typography>Email address: {user?.email}</Typography>
            <Typography>Firstname: {user?.firstName}</Typography>
            <Typography>Lastname: {user?.lastName}</Typography>
            <Typography>Role: {user?.role}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: (theme) => theme.spacing(2) }}>
            <Typography>Profile picture:</Typography>
            <ImagePicker
              profilePicture={validation.errors[profilePicture]?.value}
              setProfilePicture={(value: File | null) => validation.setFieldValue(profilePicture, value)}
              width="10rem"
              height="10rem"
            />
          </Box>
          <Button
            disabled={
              validation.errors[username]?.value === user?.username &&
              validation.errors[profilePicture]?.value === initialProfilePicture
            }
            onClick={onSubmit}
          >
            Save changes
          </Button>
        </Box>
      </Box>
    </VisibilityAnimation>
  );
};
