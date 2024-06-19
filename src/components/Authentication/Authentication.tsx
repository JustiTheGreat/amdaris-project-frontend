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
import authImage from "../../assets/authentication_image.jpeg";
import { competitionPath } from "../../utils/PageConstants";
import { useValidation } from "../../utils/UseValidation";
import { VisibilityAnimation } from "../Animations/VisibilityAnimation";
import { AppContext } from "../App/App";
import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";

enum AuthenticationAction {
  LOGIN = "Login",
  REGISTER = "Register",
}

export const Authentication: FC = () => {
  const navigate = useNavigate();
  const { requests } = useContext(AppContext);
  const [authenticationAction, setAuthenticationAction] = useState<AuthenticationAction>(AuthenticationAction.LOGIN);
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
            expression: (value: any) => authenticationAction === AuthenticationAction.REGISTER && value.trim() === "",
            errorMessage: "First name is required!",
          },
        ],
      },
      {
        name: lastName,
        defaultValue: "",
        conditions: [
          {
            expression: (value: any) => authenticationAction === AuthenticationAction.REGISTER && value.trim() === "",
            errorMessage: "Last name is required!",
          },
        ],
      },
      {
        name: username,
        defaultValue: "",
        conditions: [
          {
            expression: (value: any) => authenticationAction === AuthenticationAction.REGISTER && value.trim() === "",
            errorMessage: "Username is required!",
          },
          {
            expression: (value: any) =>
              authenticationAction === AuthenticationAction.REGISTER && value.trim().includes(" "),
            errorMessage: "Username must not contain white spaces!",
          },
        ],
      },
    ],
    [authenticationAction]
  );

  useEffect(() => {
    if (localStorage.getItem("token")) navigate(competitionPath); //TODO
  }, []);

  const onSubmit = () => {
    if (!validation.pass()) return;
    const data = validation.getData();
    authenticationAction === AuthenticationAction.LOGIN
      ? requests.loginRequest({ requestBody: data }, proceed)
      : requests.registerRequest({ requestBody: data }, proceed);
  };

  const proceed = (token: string) => {
    localStorage.setItem("token", token);
    navigate(competitionPath);
  };

  return (
    <VisibilityAnimation>
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
            width: "15rem",
            backgroundImage: `url(${authImage})`,
            backgroundSize: "cover",
            borderTopLeftRadius: (theme) => theme.spacing(6),
            borderBottomLeftRadius: (theme) => theme.spacing(6),
          }}
        />
        <Box
          sx={(theme) => {
            return {
              width: "20rem",
              height: "37rem",
              backgroundColor: "primary.light",
              padding: theme.spacing(3),
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing(2),
              borderTopRightRadius: (theme) => theme.spacing(6),
              borderBottomRightRadius: (theme) => theme.spacing(6),
            };
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: (theme) => theme.spacing(2),
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold" }}
            >
              <VisibilityAnimation key={authenticationAction}>{authenticationAction}</VisibilityAnimation>
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
          </Box>
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
          {authenticationAction === AuthenticationAction.REGISTER && (
            <VisibilityAnimation>
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
            </VisibilityAnimation>
          )}
          {authenticationAction === AuthenticationAction.REGISTER && (
            <VisibilityAnimation>
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
            </VisibilityAnimation>
          )}
          {authenticationAction === AuthenticationAction.REGISTER && (
            <VisibilityAnimation>
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
            </VisibilityAnimation>
          )}

          <Box sx={{ flex: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              sx={{ width: "6rem" }}
              onClick={(_) => onSubmit()}
            >
              <VisibilityAnimation key={authenticationAction}>{authenticationAction}</VisibilityAnimation>
            </Button>
          </Box>
        </Box>
      </Box>
    </VisibilityAnimation>
  );
};
