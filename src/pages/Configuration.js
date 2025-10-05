import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Alert, Grid } from "@mui/material";
import { ref, set, get, child } from "firebase/database";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

const ConfigurationPage = () => {
  const [voltageUpper, setVoltageUpper] = useState("");
  const [voltageLower, setVoltageLower] = useState("");
  const [currentLimits, setCurrentLimits] = useState(["", "", "", ""]);
  const [placeholders, setPlaceholders] = useState({
    voltageUpper: "",
    voltageLower: "",
    currentLimits: ["", "", "", ""],
  });
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else toast.error("User not authenticated");
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchConfig = async () => {
      try {
        const snapshot = await get(
          child(ref(db), `users/${userId}/configuration`)
        );
        if (snapshot.exists()) {
          const data = snapshot.val();
          setPlaceholders({
            voltageUpper: data.voltageUpper ?? "",
            voltageLower: data.voltageLower ?? "",
            currentLimits: [
              data.currentLimit1 ?? "",
              data.currentLimit2 ?? "",
              data.currentLimit3 ?? "",
              data.currentLimit4 ?? "",
            ],
          });
        }
      } catch (err) {
        console.error("Failed to fetch configuration:", err);
        toast.error("❌ Failed to load configuration");
      }
    };

    fetchConfig();
  }, [userId]);

  const handleCurrentChange = (index, value) => {
    const updated = [...currentLimits];
    updated[index] = value;
    setCurrentLimits(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("User not authenticated");

    const configRef = ref(db, `users/${userId}/configuration`);

    const configData = {
      voltageUpper: voltageUpper
        ? Number(voltageUpper)
        : Number(placeholders.voltageUpper),
      voltageLower: voltageLower
        ? Number(voltageLower)
        : Number(placeholders.voltageLower),
      currentLimit1: currentLimits[0]
        ? Number(currentLimits[0])
        : Number(placeholders.currentLimits[0]),
      currentLimit2: currentLimits[1]
        ? Number(currentLimits[1])
        : Number(placeholders.currentLimits[1]),
      currentLimit3: currentLimits[2]
        ? Number(currentLimits[2])
        : Number(placeholders.currentLimits[2]),
      currentLimit4: currentLimits[3]
        ? Number(currentLimits[3])
        : Number(placeholders.currentLimits[3]),
    };

    try {
      await set(configRef, configData);
      setSuccess(true);
      toast.success("✅ Settings saved successfully!");

      setPlaceholders({
        voltageUpper: configData.voltageUpper,
        voltageLower: configData.voltageLower,
        currentLimits: [
          configData.currentLimit1,
          configData.currentLimit2,
          configData.currentLimit3,
          configData.currentLimit4,
        ],
      });

      setVoltageUpper("");
      setVoltageLower("");
      setCurrentLimits(["", "", "", ""]);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save configuration:", err);
      toast.error("❌ Failed to save settings");
    }
  };

  const sharedTextFieldStyle = {
    fontFamily: "Orbitron",
    "& .MuiOutlinedInput-root": {
      fontFamily: "Orbitron",
      "& fieldset": { borderColor: "#00f0ff" },
      "&:hover fieldset": { borderColor: "#00f0ff" },
      "&.Mui-focused fieldset": {
        borderColor: "#00f0ff",
        boxShadow: "0 0 12px #00f0ff",
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "Orbitron",
      color: "#00f0ff",
    },
    "& .MuiInputBase-input": {
      color: "#00f0ff",
      fontFamily: "Orbitron",
    },
  };

  return (
    <>
      <Toaster position="top-right" />
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
          fontFamily: "Orbitron",
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
            fontFamily: "Orbitron",
          }}
        >
          Configuration Settings
        </Typography>

        <Grid container spacing={2} sx={{ mt: 6 }}>
          <Grid item xs={6}>
            <TextField
              label="Voltage Upper Limit (V)"
              type="number"
              value={voltageUpper}
              onChange={(e) => setVoltageUpper(e.target.value)}
              fullWidth
              placeholder={
                placeholders.voltageUpper || "Enter upper voltage limit"
              }
              sx={sharedTextFieldStyle}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Voltage Lower Limit (V)"
              type="number"
              value={voltageLower}
              onChange={(e) => setVoltageLower(e.target.value)}
              fullWidth
              placeholder={
                placeholders.voltageLower || "Enter lower voltage limit"
              }
              sx={sharedTextFieldStyle}
            />
          </Grid>
        </Grid>

        <Typography
          variant="subtitle1"
          sx={{
            mt: 4,
            mb: 1,
            color: "#00f0ff",
            fontWeight: "bold",
            letterSpacing: 1,
            fontFamily: "Orbitron",
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
                fullWidth
                placeholder={
                  placeholders.currentLimits[index] ||
                  `Slot ${index + 1} current`
                }
                sx={sharedTextFieldStyle}
              />
            </Grid>
          ))}
        </Grid>

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
                fontSize: 16,
                boxShadow: "0 0 20px #00f0ff",
                "&:hover": {
                  backgroundColor: "#00d6e6",
                  boxShadow: "0 0 15px #00f0ff",
                },
                height: "56px",
                fontFamily: "Orbitron",
              }}
            >
              Save Settings
            </Button>
          </Grid>
          <Grid item xs={6} />
        </Grid>

        {success && (
          <Alert
            severity="success"
            sx={{
              mt: 2,
              fontWeight: "bold",
              letterSpacing: 1,
              fontFamily: "Orbitron",
            }}
          >
            Settings saved successfully!
          </Alert>
        )}
      </Box>
    </>
  );
};

export default ConfigurationPage;
