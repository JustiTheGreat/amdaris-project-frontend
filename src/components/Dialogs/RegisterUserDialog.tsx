import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { FC, useContext, useState } from "react";
import { AppContext } from "../App/App";
import { AuthenticationFormFieldContainer } from "../Authentication/AuthenticationFormFieldContainer/AuthenticationFormFieldContainer";
import { BaseDialogProps, DialogBase } from "./DialogBase";

interface RegisterUserDialogProps extends BaseDialogProps {}

export const RegisterUserDialog: FC<RegisterUserDialogProps> = ({
  dialogIsOpen,
  closeDialog,
  handleReload,
}: RegisterUserDialogProps) => {
  const { requests, setAlertMessage } = useContext(AppContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const registerUser = () => {
    if (email.trim() === "") {
      setAlertMessage("Email is required!");
      return;
    }
    const emailIsValid = (email: string): boolean => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    if (!emailIsValid(email)) {
      setAlertMessage("Enter a valid email address!");
      return;
    }
    if (password.trim() === "") {
      setAlertMessage("Password is required!");
      return;
    }
    if (firstName.trim() === "") {
      setAlertMessage("First name is required!");
      return;
    }
    if (lastName.trim() === "") {
      setAlertMessage("Last name is required!");
      return;
    }
    if (username.trim() === "") {
      setAlertMessage("Username is required!");
      return;
    }

    if (username.includes(" ")) {
      setAlertMessage("Username must not contain white spaces!");
      return;
    }
    const authenticationData = { email, password, firstName, lastName, username };
    requests.registerRequest({ requestBody: authenticationData }, () => {
      handleReload();
      closeDialog();
      resetForm();
    });
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setUsername("");
  };

  const fieldLabelWeight = "40";
  const textfieldWeight = "60";
  return (
    <DialogBase
      title={"Register user as player"}
      open={dialogIsOpen}
      doAction={{ name: "Register", handle: registerUser }}
      handleClose={() => {
        closeDialog();
        resetForm();
      }}
    >
      <AuthenticationFormFieldContainer>
        <Typography sx={{ flex: fieldLabelWeight }}>Email address:</Typography>
        <TextField
          sx={{ flex: textfieldWeight }}
          name="email"
          label="Email address"
          type="email"
          required
          defaultValue={""}
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
      </AuthenticationFormFieldContainer>
      <AuthenticationFormFieldContainer>
        <Typography sx={{ flex: fieldLabelWeight }}>Password:</Typography>
        <TextField
          sx={{ flex: textfieldWeight }}
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          required
          defaultValue={""}
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
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
      </AuthenticationFormFieldContainer>

      <AuthenticationFormFieldContainer>
        <Typography sx={{ flex: fieldLabelWeight }}>First name:</Typography>
        <TextField
          sx={{ flex: textfieldWeight }}
          name="firstName"
          label="First name"
          required
          defaultValue={""}
          value={firstName}
          onChange={(event) => setFirstName(event.currentTarget.value)}
        />
      </AuthenticationFormFieldContainer>

      <AuthenticationFormFieldContainer>
        <Typography sx={{ flex: fieldLabelWeight }}>Last name:</Typography>
        <TextField
          sx={{ flex: textfieldWeight }}
          name="lastName"
          label="Last name"
          required
          defaultValue={""}
          value={lastName}
          onChange={(event) => setLastName(event.currentTarget.value)}
        />
      </AuthenticationFormFieldContainer>

      <AuthenticationFormFieldContainer>
        <Typography sx={{ flex: fieldLabelWeight }}>Username:</Typography>
        <TextField
          sx={{ flex: textfieldWeight }}
          name="username"
          label="Username"
          required
          defaultValue={""}
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
      </AuthenticationFormFieldContainer>
    </DialogBase>
  );
};
