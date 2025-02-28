import React, { useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import exportGraph from "../utils/exportGraph";
import importGraph from "../utils/importGraph";
import theme from "../theme";
import { ThemeProvider } from "@emotion/react";

export default function ButtonAppBar() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" } }}>
              ЧаВошка
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton size="large" color="inherit" onClick={exportGraph}>
                <DownloadIcon />
              </IconButton>
              <IconButton size="large" color="inherit" onClick={handleUploadClick}>
                <UploadIcon />
              </IconButton>
              <input type="file" accept=".json" ref={fileInputRef} onChange={importGraph} style={{ display: "none" }} />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
