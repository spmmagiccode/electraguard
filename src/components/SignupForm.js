import { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Riple } from "react-loading-indicators";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (password !== confirm) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      navigate("/SocketView");
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Riple color="#00f0ff" size="large" />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        margin: "60px auto",
        padding: 4,
        borderRadius: 3,
        background: "linear-gradient(145deg, #121212, #0d0d0d)",
        boxShadow: "0 0 20px rgba(0, 255, 255, 0.25), inset 0 0 10px #000",
        fontFamily: "'Orbitron', sans-serif",
        color: "#00f0ff",
        textShadow: "0 0 5px #00f0ff",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: "#00f0ff",
          textShadow: "0 0 12px #00f0ff",
          letterSpacing: 2,
          mb: 3,
          fontFamily: "'Orbitron', sans-serif",
        }}
      >
        Signup
      </Typography>

      <TextField
        label="Email"
        type="email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        InputLabelProps={{
          sx: { color: "#00f0ff", fontFamily: "'Orbitron', sans-serif" },
        }}
        InputProps={{
          sx: { color: "#00f0ff", fontFamily: "'Orbitron', sans-serif" },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            fontFamily: "'Orbitron', sans-serif",
            "& fieldset": {
              borderColor: "#00f0ff",
            },
            "&:hover fieldset": {
              borderColor: "#66ffff",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00f0ff",
              boxShadow: "0 0 12px #00f0ff",
            },
          },
          mb: 2,
        }}
      />

      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        InputLabelProps={{
          sx: { color: "#00f0ff", fontFamily: "'Orbitron', sans-serif" },
        }}
        InputProps={{
          sx: { color: "#00f0ff", fontFamily: "'Orbitron', sans-serif" },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            fontFamily: "'Orbitron', sans-serif",
            "& fieldset": {
              borderColor: "#00f0ff",
            },
            "&:hover fieldset": {
              borderColor: "#66ffff",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00f0ff",
              boxShadow: "0 0 12px #00f0ff",
            },
          },
          mb: 2,
        }}
      />

      <TextField
        label="Confirm Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        InputLabelProps={{
          sx: { color: "#00f0ff", fontFamily: "'Orbitron', sans-serif" },
        }}
        InputProps={{
          sx: { color: "#00f0ff", fontFamily: "'Orbitron', sans-serif" },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            fontFamily: "'Orbitron', sans-serif",
            "& fieldset": {
              borderColor: "#00f0ff",
            },
            "&:hover fieldset": {
              borderColor: "#66ffff",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00f0ff",
              boxShadow: "0 0 12px #00f0ff",
            },
          },
          mb: 3,
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLoading}
        sx={{
          backgroundColor: "#00f0ff",
          color: "#000",
          fontWeight: "bold",
          fontSize: 18,
          py: 1.5,
          boxShadow: "0 0 15px #00f0ff",
          letterSpacing: 1,
          fontFamily: "'Orbitron', sans-serif",
          "&:hover": {
            backgroundColor: "#66ffff",
            boxShadow: "0 0 20px #66ffff",
          },
        }}
      >
        Sign Up
      </Button>

      {error && (
        <Alert
          severity="error"
          sx={{
            mt: 3,
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 600,
            fontSize: 16,
            textShadow: "none",
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{
            mt: 3,
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 600,
            fontSize: 16,
            color: "#00f0ff",
            backgroundColor: "rgba(0, 255, 255, 0.1)",
            border: "1px solid #00f0ff",
            textShadow: "0 0 8px #00f0ff",
          }}
        >
          Signup successful!
        </Alert>
      )}
    </Box>
  );
};

export default SignupForm;
