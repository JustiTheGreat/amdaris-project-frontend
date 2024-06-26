import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { RegisterStep } from "../../utils/RegisterStep";
import { useValidation } from "../../utils/UseValidation";
import { AppContext } from "../App/App";
import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { BaseDialogProps, DialogBase } from "./DialogBase";
import { VisibilityAnimation } from "../Animations/VisibilityAnimation";
import { ImagePicker } from "../ImagePicker/ImagePicker";

interface RegisterUserDialogProps extends BaseDialogProps {}

export const RegisterUserDialog: FC<RegisterUserDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
}: RegisterUserDialogProps) => {
  const { requests } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [registerStep, setRegisterStep] = useState<RegisterStep>(RegisterStep.REGISTER_STEP_1);

  const email = "email";
  const password = "password";
  const firstName = "firstName";
  const lastName = "lastName";
  const username = "username";
  const profilePicture = "profilePicture";

  const validation = useValidation(
    [
      {
        name: email,
        defaultValue: "",
        conditions: [
          { expression: (value: string) => value.trim() === "", errorMessage: "Email is required!" },
          {
            expression: (value: string) => !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
            errorMessage: "Enter a valid email address!",
          },
        ],
      },
      {
        name: password,
        defaultValue: "",
        conditions: [
          { expression: (value: string) => value.trim() === "", errorMessage: "Password is required!" },
          {
            expression: (value: string) => value.trim().length < 3,
            errorMessage: "Password must be at least 3 characters long!",
          },
        ],
      },
      {
        name: firstName,
        defaultValue: "",
        conditions: [
          {
            expression: (value: string) => value.trim() === "",
            errorMessage: "First name is required!",
          },
        ],
      },
      {
        name: lastName,
        defaultValue: "",
        conditions: [
          {
            expression: (value: string) => value.trim() === "",
            errorMessage: "Last name is required!",
          },
        ],
      },
      {
        name: username,
        defaultValue: "",
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
        defaultValue: null,
        conditions: [],
      },
    ],
    [dialogIsOpen]
  );

  const next = useCallback(() => {
    if (!validation.pass()) return;
    setRegisterStep(RegisterStep.REGISTER_STEP_2);
  }, [validation]);

  const registerUser = useCallback(() => {
    if (!validation.pass()) return;
    const data = validation.getData();
    const formData = new FormData();
    Object.keys(data).forEach(async (key) => formData.append(key, data[key]));
    requests.registerRequest({ requestBody: formData }, () => {
      handleReload();
      closeDialog();
      validation.reset();
      setRegisterStep(RegisterStep.REGISTER_STEP_1);
    });
  }, [validation]);

  const buttons = useMemo(() => {
    const buttonList = [];
    if (registerStep === RegisterStep.REGISTER_STEP_2)
      buttonList.push(<Button onClick={() => setRegisterStep(RegisterStep.REGISTER_STEP_1)}>Previous</Button>);
    if (registerStep === RegisterStep.REGISTER_STEP_1) buttonList.push(<Button onClick={() => next()}>Next</Button>);
    buttonList.push(
      <Button
        onClick={registerUser}
        disabled={registerStep === RegisterStep.REGISTER_STEP_1}
      >
        Register
      </Button>
    );
    return buttonList;
  }, [validation]);

  return (
    <DialogBase
      title={"Register user as player"}
      open={dialogIsOpen}
      handleClose={() => {
        closeDialog();
        validation.reset();
        setRegisterStep(RegisterStep.REGISTER_STEP_1);
      }}
      buttons={buttons}
    >
      {registerStep === RegisterStep.REGISTER_STEP_1 && (
        <>
          <Box>
            <TextField
              fullWidth
              label="Email address"
              required
              defaultValue={""}
              value={validation.errors[email]?.value}
              error={Boolean(validation.errors[email]?.error)}
              onChange={(event) => validation.setFieldValue(email, event.currentTarget.value)}
            />
            <FormErrorMessage>{validation.errors[email]?.error}</FormErrorMessage>
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              defaultValue={""}
              value={validation.errors[password]?.value}
              error={Boolean(validation.errors[password]?.error)}
              onChange={(event) => validation.setFieldValue(password, event.currentTarget.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={(_) => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormErrorMessage>{validation.errors[password]?.error}</FormErrorMessage>
          </Box>
          <Box>
            <TextField
              fullWidth
              label="First name"
              required
              defaultValue={""}
              value={validation.errors[firstName]?.value}
              error={Boolean(validation.errors[firstName]?.error)}
              onChange={(event) => validation.setFieldValue(firstName, event.currentTarget.value)}
            />
            <FormErrorMessage>{validation.errors[firstName]?.error}</FormErrorMessage>
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Last name"
              required
              defaultValue={""}
              value={validation.errors[lastName]?.value}
              error={Boolean(validation.errors[lastName]?.error)}
              onChange={(event) => validation.setFieldValue(lastName, event.currentTarget.value)}
            />
            <FormErrorMessage>{validation.errors[lastName]?.error}</FormErrorMessage>
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Username"
              required
              defaultValue={""}
              value={validation.errors[username]?.value}
              error={Boolean(validation.errors[username]?.error)}
              onChange={(event) => validation.setFieldValue(username, event.currentTarget.value)}
            />
            <FormErrorMessage>{validation.errors[username]?.error}</FormErrorMessage>
          </Box>
        </>
      )}
      {registerStep === RegisterStep.REGISTER_STEP_2 && (
        <>
          <Typography>You may choose a profile picture</Typography>
          <VisibilityAnimation style={{ display: "flex", justifyContent: "center" }}>
            <ImagePicker
              profilePicture={validation.errors[profilePicture]?.value}
              setProfilePicture={(value: File | null) => validation.setFieldValue(profilePicture, value)}
              width="15rem"
              height="15rem"
            />
          </VisibilityAnimation>
        </>
      )}
    </DialogBase>
  );
};
