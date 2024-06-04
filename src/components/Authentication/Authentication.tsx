import { AppRegistration, LockOpen, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { competitionPath } from "../../utils/PageConstants";
import { AuthenticationAction } from "../../utils/Types";
import { AppContext } from "../App/App";
import { AuthenticationFormFieldContainer } from "./AuthenticationFormFieldContainer/AuthenticationFormFieldContainer";

export const Authentication: FC = () => {
  const navigate = useNavigate();
  const { setToken, requests, doReload } = useContext(AppContext);
  const [authenticationAction, setAuthenticationAction] = useState<AuthenticationAction>(AuthenticationAction.LOGIN);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => resetForm(), [authenticationAction]);

  const onSubmit = () => {
    const authenticationData = { email, password, firstName, lastName, username };
    authenticationAction === AuthenticationAction.LOGIN
      ? requests.loginRequest({ requestBody: authenticationData }, proceed)
      : requests.registerRequest({ requestBody: authenticationData }, proceed);
  };

  const proceed = (token: string) => {
    setToken(token);
    navigate(competitionPath);
    resetForm();
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
    <>
      <AuthenticationFormFieldContainer marginBottom="2rem">
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold" }}
        >
          {authenticationAction}
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={authenticationAction}
          onChange={(_, value: AuthenticationAction) => (value ? setAuthenticationAction(value) : undefined)}
        >
          <ToggleButton value={AuthenticationAction.LOGIN}>
            <LockOpen fontSize="medium" />
          </ToggleButton>
          <ToggleButton value={AuthenticationAction.REGISTER}>
            <AppRegistration fontSize="medium" />
          </ToggleButton>
        </ToggleButtonGroup>
      </AuthenticationFormFieldContainer>
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
      {authenticationAction === AuthenticationAction.REGISTER && (
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
      )}
      {authenticationAction === AuthenticationAction.REGISTER && (
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
      )}
      {authenticationAction === AuthenticationAction.REGISTER && (
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
      )}
      <Box sx={{ flex: "1" }} />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          sx={{ width: "6rem" }}
          onClick={(_) => onSubmit()}
        >
          {authenticationAction}
        </Button>
      </Box>
    </>
  );
};
