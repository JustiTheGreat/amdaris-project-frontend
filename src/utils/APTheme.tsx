import { alpha, createTheme } from "@mui/material";
import "../index.css";

declare module "@mui/material/styles" {
  interface Palette {
    focus: Palette["primary"];
  }
  interface PaletteOptions {
    focus: PaletteOptions["primary"];
  }
}
// const purple = "#8e24aa";
const purple = "#301934";
const purple_light = "#c995d7";
const periwinkle = "#BBB6DF";
const orange = "#ffb74d";
const oldRose = "#BD6B73";
const white = "#FFFFFF";
const red = "#FF0000";
const green = "#4caf50";
const saffron = "#F3CA40";
const gamboge = "#F2A541";
const celestialBlue = "#0098D0";
const paleAzure = "#85DEFF";
const darkGamboge = "#E49B0F";
const lapisLazuli = "#1A659E";
const ecru = "#5C6B73";
const purpureus = "#A641A4";

const definedColors = {
  primary: {
    main: purple,
    light: periwinkle,
    contrastText: white,
  },
  secondary: {
    main: oldRose,
    light: alpha(oldRose, 0.4),
    contrastText: purple,
  },
  focus: {
    main: purpureus,
    contrastText: periwinkle,
    selected: alpha(purpureus, 0.4),
    hover: alpha(purpureus, 0.6),
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
      light: definedColors.secondary.light,
    },
    focus: {
      main: definedColors.focus.main,
      light: definedColors.focus.hover,
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
            backgroundColor: definedColors.focus.hover,
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

            backgroundColor: definedColors.focus.selected,
          },
          "&:hover": {
            backgroundColor: definedColors.focus.hover,
          },
          "&.Mui-selected:hover": {
            color: definedColors.focus.contrastText,
            backgroundColor: definedColors.focus.hover,
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
            backgroundColor: definedColors.focus.selected,
          },
          "&:hover": {
            backgroundColor: definedColors.focus.hover,
          },
          "&.Mui-selected:hover": {
            backgroundColor: definedColors.focus.hover,
          },
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: definedColors.primary.contrastText,
          "&:hover": {
            color: definedColors.secondary.main,
          },
          "&.Mui-active": {
            color: definedColors.secondary.main,
          },
          "&.Mui-active .MuiTableSortLabel-icon": {
            color: definedColors.secondary.main,
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: definedColors.secondary.main,
          "&:hover": {
            backgroundColor: definedColors.focus.main,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: definedColors.secondary.main,
        },
      },
    },
  },
});
