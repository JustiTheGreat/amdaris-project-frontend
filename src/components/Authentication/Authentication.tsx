import { AppRegistration, LockOpen, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { competitionPath } from "../../utils/PageConstants";
import { RegisterStep } from "../../utils/RegisterStep";
import { useValidation } from "../../utils/UseValidation";
import { VisibilityAnimation } from "../Animations/VisibilityAnimation";
import { AppContext } from "../App/App";
import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { ImagePicker } from "../ImagePicker/ImagePicker";

enum AuthenticationAction {
  LOGIN = "Login",
  REGISTER = "Register",
}

export const Authentication: FC = () => {
  const navigate = useNavigate();
  const { requests } = useContext(AppContext);
  const [authenticationAction, setAuthenticationAction] = useState<AuthenticationAction>(AuthenticationAction.LOGIN);
  const [registerStep, setRegisterStep] = useState<RegisterStep>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
            expression: (value: string) =>
              authenticationAction === AuthenticationAction.REGISTER && value.trim() === "",
            errorMessage: "First name is required!",
          },
        ],
      },
      {
        name: lastName,
        defaultValue: "",
        conditions: [
          {
            expression: (value: string) =>
              authenticationAction === AuthenticationAction.REGISTER && value.trim() === "",
            errorMessage: "Last name is required!",
          },
        ],
      },
      {
        name: username,
        defaultValue: "",
        conditions: [
          {
            expression: (value: string) =>
              authenticationAction === AuthenticationAction.REGISTER && value.trim() === "",
            errorMessage: "Username is required!",
          },
          {
            expression: (value: string) =>
              authenticationAction === AuthenticationAction.REGISTER && value.trim().includes(" "),
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
    [authenticationAction]
  );

  useEffect(() => {
    if (localStorage.getItem("token")) navigate(competitionPath);
  }, []);

  const onSubmit = () => {
    if (!validation.pass()) return;
    const data = validation.getData();

    if (authenticationAction === AuthenticationAction.LOGIN) {
      requests.loginRequest({ requestBody: data }, proceed);
    } else if (registerStep === RegisterStep.REGISTER_STEP_1) {
      setRegisterStep(RegisterStep.REGISTER_STEP_2);
    } else if (registerStep === RegisterStep.REGISTER_STEP_2) {
      const formData = new FormData();
      Object.keys(data).forEach(async (key) => formData.append(key, data[key]));
      requests.registerRequest({ requestBody: formData }, proceed);
    }
  };

  const proceed = (token: string) => {
    localStorage.setItem("token", token);
    window.dispatchEvent(new Event("storage"));
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
            borderTopLeftRadius: (theme) => theme.spacing(6),
            borderBottomLeftRadius: (theme) => theme.spacing(6),
            overflow: "hidden ",
            backgroundColor: "primary.main",
            width: "10rem",
          }}
        />

        <Box
          sx={(theme) => {
            return {
              width: "20rem",
              padding: theme.spacing(3),
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing(2),
              borderTopRightRadius: theme.spacing(6),
              borderBottomRightRadius: theme.spacing(6),
            };
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: (theme) => theme.spacing(4),
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold" }}
            >
              <VisibilityAnimation key={authenticationAction}>
                {authenticationAction === AuthenticationAction.LOGIN ? "Login" : "Register"}
              </VisibilityAnimation>
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={authenticationAction}
              onChange={(_, value: AuthenticationAction) => {
                if (!value) return;
                setAuthenticationAction(value);
                if (value === AuthenticationAction.LOGIN) setRegisterStep(undefined);
                if (value === AuthenticationAction.REGISTER) setRegisterStep(RegisterStep.REGISTER_STEP_1);
              }}
            >
              <Tooltip title="Login">
                <ToggleButton value={AuthenticationAction.LOGIN}>
                  <LockOpen fontSize="medium" />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Register">
                <ToggleButton value={AuthenticationAction.REGISTER}>
                  <AppRegistration fontSize="medium" />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
          </Box>
          {(authenticationAction === AuthenticationAction.LOGIN || registerStep === RegisterStep.REGISTER_STEP_1) && (
            <Box>
              <TextField
                fullWidth
                label="Email address"
                required
                value={validation.errors[email]?.value}
                error={Boolean(validation.errors[email]?.error)}
                onChange={(event) => validation.setFieldValue(email, event.currentTarget.value)}
              />
              <FormErrorMessage>{validation.errors[email]?.error}</FormErrorMessage>
            </Box>
          )}
          {(authenticationAction === AuthenticationAction.LOGIN || registerStep === RegisterStep.REGISTER_STEP_1) && (
            <Box>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                required
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
          )}
          {registerStep === RegisterStep.REGISTER_STEP_1 && (
            <VisibilityAnimation>
              <TextField
                fullWidth
                label="First name"
                required
                value={validation.errors[firstName]?.value}
                error={Boolean(validation.errors[firstName]?.error)}
                onChange={(event) => validation.setFieldValue(firstName, event.currentTarget.value)}
              />
              <FormErrorMessage>{validation.errors[firstName]?.error}</FormErrorMessage>
            </VisibilityAnimation>
          )}
          {registerStep === RegisterStep.REGISTER_STEP_1 && (
            <VisibilityAnimation>
              <TextField
                fullWidth
                label="Last name"
                required
                value={validation.errors[lastName]?.value}
                error={Boolean(validation.errors[lastName]?.error)}
                onChange={(event) => validation.setFieldValue(lastName, event.currentTarget.value)}
              />
              <FormErrorMessage>{validation.errors[lastName]?.error}</FormErrorMessage>
            </VisibilityAnimation>
          )}
          {registerStep === RegisterStep.REGISTER_STEP_1 && (
            <VisibilityAnimation>
              <TextField
                fullWidth
                label="Username"
                required
                value={validation.errors[username]?.value}
                error={Boolean(validation.errors[username]?.error)}
                onChange={(event) => validation.setFieldValue(username, event.currentTarget.value)}
              />
              <FormErrorMessage>{validation.errors[username]?.error}</FormErrorMessage>
            </VisibilityAnimation>
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
          <VisibilityAnimation key={authenticationAction}>
            <Box sx={{ display: "flex", justifyContent: "center", gap: (theme) => theme.spacing(2) }}>
              {registerStep === RegisterStep.REGISTER_STEP_2 && (
                <Button
                  sx={{ width: "6rem" }}
                  variant="outlined"
                  onClick={(_) => setRegisterStep(RegisterStep.REGISTER_STEP_1)}
                >
                  Back
                </Button>
              )}
              <Button
                sx={{ width: "6rem" }}
                onClick={(_) => onSubmit()}
              >
                {authenticationAction === AuthenticationAction.LOGIN
                  ? "Login"
                  : registerStep === RegisterStep.REGISTER_STEP_1
                  ? "Next"
                  : "Register"}
              </Button>
            </Box>
          </VisibilityAnimation>
        </Box>
      </Box>
    </VisibilityAnimation>
  );
};
