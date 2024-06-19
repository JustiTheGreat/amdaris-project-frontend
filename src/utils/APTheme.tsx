import { alpha, createTheme } from "@mui/material";
import "../index.css";

declare module "@mui/materialstyles/createPalette" {
  interface Palette {
    page: {
      backgroundColor: Palette["primary"];
    };
  }
  interface PaletteOptions {
    page: {
      backgroundColor: PaletteOptions["primary"];
    };
  }
}
// const purple = "#8e24aa";
const purple = "#301934";
// const purple_light = "#c995d7";
const periwinkle = "#BBB6DF";
// const orange = "#ffb74d";
const oldRose = "#BD6B73";
const white = "#FFFFFF";
const red = "#FF0000";
// const green = "#4caf50";
const saffron = "#F3CA40";
const gamboge = "#F2A541";
const celestialBlue = "#0098D0";
const paleAzure = "#85DEFF";

const definedColors = {
  primary: {
    main: purple,
    light: periwinkle,
    contrastText: white,
  },
  secondary: {
    main: oldRose,
    contrastText: purple,
  },
  focus: {
    main: gamboge,
    contrastText: periwinkle,
    activatedOpacity: 0.4,
    hoverOpacity: 0.6,
  },
  error: {
    main: red,
  },
};

export default createTheme({
  palette: {
    primary: {
      main: definedColors.primary.main,
      light: definedColors.primary.light,
      contrastText: definedColors.primary.contrastText,
    },
    secondary: {
      main: definedColors.secondary.main,
    },
    error: {
      main: definedColors.error.main,
    },
    text: {
      primary: definedColors.secondary.contrastText,
      secondary: definedColors.secondary.contrastText,
      disabled: definedColors.primary.light,
    },
  },
  components: {
    MuiButton: {
      defaultProps: { variant: "contained" },
      styleOverrides: {
        root: {
          "&:hover": {
            color: definedColors.primary.main,
            backgroundColor: alpha(definedColors.focus.main, definedColors.focus.hoverOpacity),
          },
        },
      },
    },
    MuiTextField: { defaultProps: { variant: "outlined" } },
    MuiTab: {
      styleOverrides: {
        root: {
          color: definedColors.primary.contrastText,
          "&.Mui-selected": {
            color: definedColors.focus.contrastText,

            backgroundColor: alpha(definedColors.focus.main, definedColors.focus.activatedOpacity),
          },
          "&:hover": {
            backgroundColor: alpha(definedColors.focus.main, definedColors.focus.hoverOpacity),
          },
          "&.Mui-selected:hover": {
            color: definedColors.focus.contrastText,
            backgroundColor: alpha(definedColors.focus.main, definedColors.focus.hoverOpacity),
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: { color: definedColors.primary.main },
        h1: { fontWeight: "bold" },
        h2: { fontWeight: "bold" },
        h3: { fontWeight: "bold" },
        h4: { fontWeight: "bold" },
        h5: { fontWeight: "bold" },
        h6: { fontWeight: "bold" },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: definedColors.primary.main,
          color: definedColors.primary.contrastText,
          fontWeight: "bold",
          padding: "0 1rem 0 0.5rem",
          // "&hover": {
          //   color: definedColors.primary.contrastText,
          // },
          // "&$active": {
          //   color: definedColors.primary.contrastText,
          // },
          active: {
            color: definedColors.primary.contrastText,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: definedColors.focus.main,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: definedColors.focus.main,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: definedColors.focus.main,
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: alpha(definedColors.focus.main, definedColors.focus.activatedOpacity),
          },
          "&:hover": {
            backgroundColor: alpha(definedColors.focus.main, definedColors.focus.hoverOpacity),
          },
          "&.Mui-selected:hover": {
            backgroundColor: alpha(definedColors.focus.main, definedColors.focus.hoverOpacity),
          },
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: definedColors.primary.contrastText,
          "&:hover": {
            color: definedColors.primary.contrastText,
          },
          "&.Mui-active": {
            color: definedColors.primary.contrastText,
          },
          "&.Mui-active .MuiTableSortLabel-icon": {
            color: definedColors.primary.contrastText,
          },
        },
      },
    },
  },
});
