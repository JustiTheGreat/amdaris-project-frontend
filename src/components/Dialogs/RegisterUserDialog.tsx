import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { FC, useCallback, useContext, useState } from "react";
import { useValidation } from "../../utils/UseValidation";
import { AppContext } from "../App/App";
import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface RegisterUserDialogProps extends BaseDialogProps {}

export const RegisterUserDialog: FC<RegisterUserDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
}: RegisterUserDialogProps) => {
  const { requests } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const email = "email";
  const password = "password";
  const firstName = "firstName";
  const lastName = "lastName";
  const username = "username";

  const validation = useValidation(
    [
      {
        name: email,
        defaultValue: "",
        conditions: [
          { expression: (value: any) => value.trim() === "", errorMessage: "Email is required!" },
          {
            expression: (value: any) => !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
            errorMessage: "Enter a valid email address!",
          },
        ],
      },
      {
        name: password,
        defaultValue: "",
        conditions: [{ expression: (value: any) => value.trim() === "", errorMessage: "Password is required!" }],
      },
      {
        name: firstName,
        defaultValue: "",
        conditions: [
          {
            expression: (value: any) => value.trim() === "",
            errorMessage: "First name is required!",
          },
        ],
      },
      {
        name: lastName,
        defaultValue: "",
        conditions: [
          {
            expression: (value: any) => value.trim() === "",
            errorMessage: "Last name is required!",
          },
        ],
      },
      {
        name: username,
        defaultValue: "",
        conditions: [
          {
            expression: (value: any) => value.trim() === "",
            errorMessage: "Username is required!",
          },
          {
            expression: (value: any) => value.trim().includes(" "),
            errorMessage: "Username must not contain white spaces!",
          },
        ],
      },
    ],
    []
  );

  const registerUser = useCallback(() => {
    if (!validation.pass()) return;
    const data = validation.getData();
    requests.registerRequest({ requestBody: data }, () => {
      handleReload();
      closeDialog();
      validation.reset();
    });
  }, [validation]);

  return (
    <DialogBase
      title={"Register user as player"}
      open={dialogIsOpen}
      doAction={{ name: "Register", handle: registerUser }}
      handleClose={() => {
        closeDialog();
        validation.reset();
      }}
    >
      <Box>
        <TextField
          fullWidth
          label="Email address"
          required
          defaultValue={""}
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
          error={Boolean(validation.errors[username]?.error)}
          onChange={(event) => validation.setFieldValue(username, event.currentTarget.value)}
        />
        <FormErrorMessage>{validation.errors[username]?.error}</FormErrorMessage>
      </Box>
    </DialogBase>
  );
};
