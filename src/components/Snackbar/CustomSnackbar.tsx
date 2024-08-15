// components/CustomSnackbar.tsx
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Alert, AlertProps, Snackbar } from "@mui/material";

const StyledAlert = styled(Alert)<AlertProps>(({ theme, severity }) => ({
  backgroundColor:
    severity === "success"
      ? theme.palette.success.main
      : theme.palette.error.main,
  color:
    severity === "success"
      ? theme.palette.success.contrastText
      : theme.palette.error.contrastText,
  "& .MuiAlert-icon": {
    color:
      severity === "success"
        ? theme.palette.success.contrastText
        : theme.palette.error.contrastText,
  },
  width: "100%",
  maxWidth: "600px", // 알림의 최대 너비 설정
}));

export type SnackbarSeverity = "success" | "error";

interface CustomSnackbarProps {
  isOpen: boolean;
  message: string;
  severity: SnackbarSeverity;
  onClose: () => void;
}

export const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  isOpen,
  message,
  severity,
  onClose,
}) => {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{
        width: "100%",
        maxWidth: "600px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <StyledAlert onClose={onClose} severity={severity} variant="filled">
        {message}
      </StyledAlert>
    </Snackbar>
  );
};

export const useCustomSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    severity: "success" as SnackbarSeverity,
  });

  const showSnackbar = (message: string, severity: SnackbarSeverity) => {
    setSnackbar({ isOpen: true, message, severity });
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
  };
};
