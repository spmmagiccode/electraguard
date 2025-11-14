import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

const ToggleWithData = ({ data, pinId, switchValue, onToggle }) => {
  const toggle = () => {
    onToggle(pinId, switchValue === 0 ? 1 : 0);
  };

  const hasAlarm = data.alarm !== "No alarm";

  return (
    <Box
      sx={{
        width: 240,
        p: 2.5,
        borderRadius: 3,
        background: hasAlarm
          ? "linear-gradient(145deg, #1a0000, #330000)"
          : "linear-gradient(145deg, #111, #1a1a1a)",
        boxShadow: hasAlarm
          ? "0 0 20px rgba(255, 0, 0, 0.3), inset 0 0 10px rgba(100, 0, 0, 0.5)"
          : "0 0 20px rgba(0,255,255,0.12), inset 0 0 10px rgba(0,0,0,0.6)",
        fontFamily: "'Orbitron', sans-serif",
        color: "#fff",
        transition: "all 0.3s ease-in-out",
        ":hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          textAlign: "center",
          mb: 2,
          color: hasAlarm ? "#ff4d4d" : "#00f0ff",
          textShadow: hasAlarm ? "0 0 10px #ff4d4d" : "0 0 10px #00f0ff",
          letterSpacing: 1,
          fontFamily: "'Orbitron', sans-serif",
        }}
      >
        Socket {pinId.replace(/\D/g, "")}
      </Typography>

      {/* Toggle */}
      <Box
        onClick={toggle}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          mb: 2.5,
          cursor: "pointer",
          userSelect: "none",
          fontFamily: "'Orbitron', sans-serif",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 60,
            height: 30,
            borderRadius: 15,
            backgroundColor: switchValue === 1 ? "#00f0ff" : "#444",
            transition: "all 0.4s",
            boxShadow:
              switchValue === 1 ? "0 0 10px #00f0ff" : "inset 0 0 6px #000",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 2.5,
              left: switchValue === 1 ? 32 : 2.5,
              width: 25,
              height: 25,
              borderRadius: "50%",
              backgroundColor: "#111",
              boxShadow: "0 0 6px #00f0ff",
              transition: "left 0.3s ease",
            }}
          />
        </Box>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: "bold",
            color: switchValue === 1 ? "#00f0ff" : "#777",
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          {switchValue === 1 ? "ON" : "OFF"}
        </Typography>
      </Box>

      <Divider
        sx={{
          mb: 2,
          backgroundColor: hasAlarm ? "#ff4d4d" : "#00f0ff",
          height: 2,
          borderRadius: 1,
        }}
      />

      {/* Data Display */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(6px)",
          border: hasAlarm
            ? "1px solid rgba(255, 0, 0, 0.3)"
            : "1px solid rgba(0,255,255,0.2)",
          boxShadow: hasAlarm
            ? "0 0 10px rgba(255, 0, 0, 0.3)"
            : "0 0 10px rgba(0,255,255,0.1)",
          fontFamily: "'Orbitron', sans-serif",
          color: "#fff",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            fontWeight: 700,
            mb: 2,
            color: hasAlarm ? "#ff4d4d" : "#00f0ff",
            textShadow: `0 0 6px ${hasAlarm ? "#ff4d4d" : "#00f0ff"}`,
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          {data.power}
        </Typography>

        {[
          { label: "Current", value: data.current },
          { label: "Voltage", value: data.voltage },
          { label: "Alarm", value: data.alarm },
        ].map(({ label, value }, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: i < 2 ? 1.2 : 0,
              color: label === "Alarm" && hasAlarm ? "#ff4d4d" : "#ccc",
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: 0.5,
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              {label}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: 14,
                letterSpacing: 0.5,
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default ToggleWithData;
