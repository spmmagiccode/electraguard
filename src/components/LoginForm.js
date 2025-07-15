import { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      navigate("/SocketView");
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
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
          textShadow: "0 0 12px #00f0ff",
          fontWeight: 700,
          letterSpacing: 2,
          fontFamily: "'Orbitron', sans-serif",
        }}
      >
        Login
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
        InputProps={{
          sx: {
            color: "#00f0ff",
            fontFamily: "'Orbitron', sans-serif",
          },
        }}
        InputLabelProps={{
          sx: {
            color: "#00f0ff",
            fontFamily: "'Orbitron', sans-serif",
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            fontFamily: "'Orbitron', sans-serif",
            "& fieldset": {
              borderColor: "#00f0ff",
            },
            "&:hover fieldset": {
              borderColor: "#00f0ff",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00f0ff",
              boxShadow: "0 0 12px #00f0ff",
            },
          },
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
        InputProps={{
          sx: {
            color: "#00f0ff",
            fontFamily: "'Orbitron', sans-serif",
          },
        }}
        InputLabelProps={{
          sx: {
            color: "#00f0ff",
            fontFamily: "'Orbitron', sans-serif",
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            fontFamily: "'Orbitron', sans-serif",
            "& fieldset": {
              borderColor: "#00f0ff",
            },
            "&:hover fieldset": {
              borderColor: "#00f0ff",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00f0ff",
              boxShadow: "0 0 12px #00f0ff",
            },
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLoading}
        sx={{
          mt: 3,
          backgroundColor: "#00f0ff",
          color: "#000",
          fontWeight: "bold",
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 18,
          boxShadow: "0 0 20px #00f0ff",
          letterSpacing: 1,
          "&:hover": {
            backgroundColor: "#00d6e6",
            boxShadow: "0 0 25px #00f0ff",
          },
        }}
      >
        {isLoading ? "Logging in..." : "Log In"}
      </Button>

      {error && (
        <Alert
          severity="error"
          sx={{
            mt: 2,
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: "bold",
            letterSpacing: 1,
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
            mt: 2,
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: "bold",
            letterSpacing: 1,
            textShadow: "none",
          }}
        >
          Login successful!
        </Alert>
      )}
    </Box>
  );
};

export default LoginForm;
