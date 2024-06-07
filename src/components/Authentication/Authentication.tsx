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
  useTheme,
} from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { competitionPath } from "../../utils/PageConstants";
import { AppContext } from "../App/App";
import { AuthenticationFormFieldContainer } from "./AuthenticationFormFieldContainer/AuthenticationFormFieldContainer";
import { VisibilityAnimation } from "../Animations/VisibilityAnimation";

enum AuthenticationAction {
  LOGIN = "Login",
  REGISTER = "Register",
}

export const Authentication: FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setToken, requests, setAlertMessage } = useContext(AppContext);
  const [authenticationAction, setAuthenticationAction] = useState<AuthenticationAction>(AuthenticationAction.LOGIN);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => resetForm(), [authenticationAction]);

  const onSubmit = () => {
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
    if (authenticationAction === AuthenticationAction.REGISTER && firstName.trim() === "") {
      setAlertMessage("First name is required!");
      return;
    }
    if (authenticationAction === AuthenticationAction.REGISTER && lastName.trim() === "") {
      setAlertMessage("Last name is required!");
      return;
    }
    if (authenticationAction === AuthenticationAction.REGISTER && username.trim() === "") {
      setAlertMessage("Username is required!");
      return;
    }
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
    <VisibilityAnimation>
      <Box
        sx={(theme) => {
          return {
            width: "30rem",
            height: "35rem",
            backgroundColor: "primary.light",
            padding: theme.spacing(3),
            border: (theme) => `0.3rem solid ${theme.palette.primary.main}`,
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing(2),
          };
        }}
      >
        <AuthenticationFormFieldContainer marginBottom="2rem">
          {authenticationAction === AuthenticationAction.LOGIN ? (
            <VisibilityAnimation>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold" }}
              >
                {AuthenticationAction.LOGIN}
              </Typography>
            </VisibilityAnimation>
          ) : (
            <VisibilityAnimation>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold" }}
              >
                {AuthenticationAction.REGISTER}
              </Typography>
            </VisibilityAnimation>
          )}
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
          <VisibilityAnimation>
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
          </VisibilityAnimation>
        )}
        {authenticationAction === AuthenticationAction.REGISTER && (
          <VisibilityAnimation>
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
          </VisibilityAnimation>
        )}
        {authenticationAction === AuthenticationAction.REGISTER && (
          <VisibilityAnimation>
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
          </VisibilityAnimation>
        )}

        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            sx={{ width: "6rem" }}
            onClick={(_) => onSubmit()}
          >
            {authenticationAction}
          </Button>
        </Box>
      </Box>
    </VisibilityAnimation>
  );
};
