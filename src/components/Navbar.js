import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const links = [
    { label: "Socket Overview", path: "/SocketView" },
    { label: "Data Logs", path: "/dataLogs" },
    { label: "Predictions", path: "/Predictions" },
    { label: "AboutPage", path: "/About" },
  ];

  return (
    <AppBar
      position="static"
      elevation={4}
      sx={{ backgroundColor: "#000", height: "80px", justifyContent: "center" }}
    >
      <Container maxWidth="xl" disableGutters>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: 4,
            minHeight: "80px !important",
          }}
        >
          {/* Left - Navigation Links */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user &&
              links.map(({ label, path }) => (
                <Button
                  key={label}
                  component={RouterLink}
                  to={path}
                  sx={{
                    textTransform: "none",
                    color: "#fff",
                    fontWeight: currentPath === path ? "bold" : "normal",
                    borderBottom:
                      currentPath === path ? "2px solid #FFD700" : "none",
                    borderRadius: 0,
                    "&:hover": { color: "#fff" },
                  }}
                >
                  {label}
                </Button>
              ))}
          </Box>

          {/* Right - Auth Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user ? (
              <>
                <Avatar
                  sx={{ bgcolor: "#fff", color: "#000", width: 36, height: 36 }}
                >
                  {user.email?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  variant="body1"
                  sx={{ color: "#ddd", fontWeight: 500 }}
                >
                  {user.email}
                </Typography>
                <Button
                  onClick={handleLogout}
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    backgroundColor: "#FFD700",
                    color: "#000",
                    "&:hover": {
                      backgroundColor: "#e6c200",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{
                    textTransform: "none",
                    color: "#fff",
                    fontWeight: currentPath === "/login" ? "bold" : "normal",
                    borderBottom:
                      currentPath === "/login" ? "2px solid #FFD700" : "none",
                    borderRadius: 0,
                    "&:hover": { color: "#fff" },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    textTransform: "none",
                    color: "#fff",
                    fontWeight: currentPath === "/signup" ? "bold" : "normal",
                    borderBottom:
                      currentPath === "/signup" ? "2px solid #FFD700" : "none",
                    borderRadius: 0,
                    "&:hover": { color: "#fff" },
                  }}
                >
                  Signup
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
