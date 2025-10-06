import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Alert, Grid } from "@mui/material";
import { ref, set, get, child } from "firebase/database";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

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
      toast.success("Settings saved successfully!");

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
      "& fieldset": { borderColor: "#00f0ff", borderWidth: 2 },
      "&:hover fieldset": { borderColor: "#00f0ff" },
      "&.Mui-focused fieldset": {
        borderColor: "#00f0ff",
        boxShadow: "0 0 20px #00f0ff",
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "Orbitron",
      color: "#00f0ff",
      fontWeight: "bold",
    },
    "& .MuiInputBase-input": {
      color: "#00f0ff",
      fontFamily: "Orbitron",
      letterSpacing: 1,
    },
  };

  return (
    <>
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 700,
            margin: "80px auto",
            padding: 5,
            borderRadius: 4,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 40px rgba(0,255,255,0.2)",
            border: "1px solid #00f0ff",
            fontFamily: "Orbitron",
            color: "#00f0ff",
            textShadow: "0 0 8px #00f0ff",
            transition: "all 0.5s ease",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              color: "#00f0ff",
              textShadow: "0 0 20px #00f0ff",
              fontWeight: 600,
              letterSpacing: 3,
              fontFamily: "Orbitron",
              mb: 6,
            }}
          >
            Configuration
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                label="Voltage Upper Limit (V)"
                type="number"
                value={voltageUpper}
                onChange={(e) => setVoltageUpper(e.target.value)}
                fullWidth
                placeholder={placeholders.voltageUpper || "Enter upper voltage"}
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
                placeholder={placeholders.voltageLower || "Enter lower voltage"}
                sx={sharedTextFieldStyle}
              />
            </Grid>
          </Grid>

          <Typography
            variant="subtitle1"
            sx={{
              mt: 4,
              mb: 2,
              color: "#00f0ff",
              fontWeight: "bold",
              letterSpacing: 1,
              fontFamily: "Orbitron",
            }}
          >
            Current Limits (A) for 4 Slots
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
                    placeholders.currentLimits[index] || `Slot ${index + 1}`
                  }
                  sx={sharedTextFieldStyle}
                />
              </Grid>
            ))}
          </Grid>

          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "300",
              mt: 5,
              py: 1.8,
              fontSize: 13,
              fontWeight: 500,
              background: "linear-gradient(90deg, #00f0ff, #00d6e6)",
              color: "#000",
              boxShadow: "0 0 10px #00f0ff",
              borderRadius: 1,
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(90deg, #00d6e6, #00aabb)",
                boxShadow: "0 0 20px #00f0ff",
              },
              fontFamily: "Orbitron",
            }}
          >
            Save Settings
          </Button>

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Alert
                severity="success"
                sx={{
                  mt: 3,
                  fontWeight: "bold",
                  letterSpacing: 1,
                  fontFamily: "Orbitron",
                  background: "rgba(0, 255, 255, 0.1)",
                  border: "1px solid #00f0ff",
                  color: "#00f0ff",
                  textShadow: "0 0 5px #00f0ff",
                }}
              >
                Settings saved successfully!
              </Alert>
            </motion.div>
          )}
        </Box>
      </motion.div>
    </>
  );
};

export default ConfigurationPage;
