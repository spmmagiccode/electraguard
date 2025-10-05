import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert, Grid } from "@mui/material";

const ConfigurationPage = () => {
  const [voltageUpper, setVoltageUpper] = useState("");
  const [voltageLower, setVoltageLower] = useState("");
  const [currentLimits, setCurrentLimits] = useState(["", "", "", ""]);
  const [success, setSuccess] = useState(false);

  const handleCurrentChange = (index, value) => {
    const updated = [...currentLimits];
    updated[index] = value;
    setCurrentLimits(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    // Save logic here
  };

  const sharedTextFieldStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#00f0ff" },
      "&:hover fieldset": { borderColor: "#00f0ff" },
      "&.Mui-focused fieldset": {
        borderColor: "#00f0ff",
        boxShadow: "0 0 12px #00f0ff",
      },
    },
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 700,
        margin: "80px auto",
        padding: 4,
        borderRadius: 4,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 0 20px rgba(0,255,255,0.1)",
        fontFamily: "'Orbitron', sans-serif",
        color: "#fff",
        textShadow: "0 0 5px #00f0ff",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{
          color: "#00f0ff",
          textShadow: "0 0 10px #00f0ff",
          fontWeight: 550,
          letterSpacing: 2,
          fontFamily: "'Orbitron', sans-serif",
        }}
      >
        Configuration Settings
      </Typography>

      {/* Voltage Fields */}
      <Grid container spacing={2} sx={{ mt: 6 }}>
        <Grid item xs={6}>
          <TextField
            label="Voltage Upper Limit (V)"
            type="number"
            value={voltageUpper}
            onChange={(e) => setVoltageUpper(e.target.value)}
            required
            fullWidth
            InputProps={{
              sx: { color: "#00f0ff", fontFamily: "'Orbitron', sans-serif" },
            }}
            InputLabelProps={{
              sx: { color: "#00f0ff", fontFamily: "'Orbitron', sans-serif" },
            }}
            sx={sharedTextFieldStyle}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Voltage Lower Limit (V)"
            type="number"
            value={voltageLower}
            onChange={(e) => setVoltageLower(e.target.value)}
            required
            fullWidth
            InputProps={{
              sx: { color: "#00f0ff", fontFamily: "'Orbitron', sans-serif" },
            }}
            InputLabelProps={{
              sx: { color: "#00f0ff", fontFamily: "'Orbitron', sans-serif" },
            }}
            sx={sharedTextFieldStyle}
          />
        </Grid>
      </Grid>

      {/* Current Fields */}
      <Typography
        variant="subtitle1"
        sx={{
          mt: 4,
          mb: 1,
          color: "#00f0ff",
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: "bold",
          letterSpacing: 1,
        }}
      >
        Current Limits for 4 Slots (A)
      </Typography>

      <Grid container spacing={2}>
        {currentLimits.map((value, index) => (
          <Grid item xs={3} key={index}>
            <TextField
              label={`Slot ${index + 1}`}
              type="number"
              value={value}
              onChange={(e) => handleCurrentChange(index, e.target.value)}
              required
              fullWidth
              InputProps={{
                sx: { color: "#00f0ff", fontFamily: "'Orbitron', sans-serif" },
              }}
              InputLabelProps={{
                sx: { color: "#00f0ff", fontFamily: "'Orbitron', sans-serif" },
              }}
              sx={sharedTextFieldStyle}
            />
          </Grid>
        ))}
      </Grid>

      {/* Save Button */}
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={6}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#00f0ff",
              color: "#000",
              fontWeight: "bold",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 16,
              boxShadow: "0 0 20px #00f0ff",
              letterSpacing: 1,
              height: "56px", // match TextField height
              "&:hover": {
                backgroundColor: "#00d6e6",
                boxShadow: "0 0 15px #00f0ff",
              },
            }}
          >
            Save Settings
          </Button>
        </Grid>
        <Grid item xs={6} />
      </Grid>

      {/* Success Alert */}
      {success && (
        <Alert
          severity="success"
          sx={{
            mt: 2,
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: "bold",
            letterSpacing: 1,
            textShadow: "none",
          }}
        >
          Settings saved successfully!
        </Alert>
      )}
    </Box>
  );
};

export default ConfigurationPage;
