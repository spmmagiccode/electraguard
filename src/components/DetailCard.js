import React, { useState } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

const ToggleWithData = ({ data }) => {
  const [isOn, setIsOn] = useState(false);

  const toggle = () => {
    setIsOn((prev) => !prev);
  };

  return (
    <Box
      sx={{
        width: 220, // increased width
        margin: "50px auto",
        p: 3,
        boxShadow: 6, // stronger shadow
        borderRadius: 4, // smoother corners
        backgroundColor: "#fefefe",
        fontFamily: "'Roboto', sans-serif",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          textAlign: "center",
          mb: 3,
          color: "#333",
          letterSpacing: 1,
        }}
      >
        Device Monitor
      </Typography>

      {/* Toggle row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 3,
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={toggle}
      >
        {/* Toggle switch */}
        <Box
          sx={{
            position: "relative",
            width: 60,
            height: 30,
            borderRadius: 15,
            backgroundColor: isOn ? "#1976d2" : "#ccc",
            transition: "background-color 0.3s",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 3,
              left: isOn ? 33 : 3,
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: "#fff",
              transition: "left 0.3s",
            }}
          />
        </Box>

        {/* Label */}
        <Typography
          sx={{
            color: isOn ? "#1976d2" : "#888",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          On
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Data display */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 2, color: "#1976d2" }}
        >
          {data.power}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, color: "#444" }}>
            Current
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            {data.current}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, color: "#444" }}>
            Voltage
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            {data.voltage}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" sx={{ fontWeight: 500, color: "#444" }}>
            Alarm
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: data.alarm !== "No alarm" ? "red" : "#666" }}
          >
            {data.alarm}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ToggleWithData;
