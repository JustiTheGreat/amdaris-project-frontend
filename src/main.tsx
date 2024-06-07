import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./components/App/App.tsx";
import "./index.css";
import theme from "./utils/APTheme.tsx";
import { AnimatePresence } from "framer-motion";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AnimatePresence mode="wait">
            <App />
          </AnimatePresence>
        </ThemeProvider>
      </BrowserRouter>
    </LocalizationProvider>
  </StrictMode>
);
