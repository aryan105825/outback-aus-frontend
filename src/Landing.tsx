// LandingPage.tsx
import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 15s ease infinite",
        "@keyframes gradientBG": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 6,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          textAlign: "center",
          maxWidth: 500,
          width: "90%",
          color: "white",
        }}
      >
        <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold" }}>
          Outback Guardian
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
          Protecting wildlife & preventing bushfires with AI-powered insights.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleStart}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderRadius: 3,
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            },
          }}
        >
          Start
        </Button>
        <Box sx={{ mt: 4 }}>
          {/* Optional mascot or icon */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
            alt="Wildlife Icon"
            style={{ width: 80, opacity: 0.8 }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default LandingPage;
