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

    return () => unsubscribe();
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
    { label: "Configurations", path: "/Configuration" },
    { label: "About", path: "/About" },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 0 25px rgba(0,255,255,0.25)",
        height: "100px",
        fontFamily: "'Orbitron', sans-serif",
      }}
    >
      {/* Remove horizontal padding by not using disableGutters and set px=0 */}
      <Container maxWidth="xl" sx={{ px: 0 }}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: 0, // remove horizontal padding here
            minHeight: "100px !important",
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          {/* 🔵 Logo & Navigation */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/logo.png`}
                alt="Logo"
                style={{ width: 56, height: 56, marginRight: 12 }}
              />
              <Typography
                variant="h6" // smaller heading than h5
                sx={{
                  color: "#00f0ff",
                  fontWeight: "bold",
                  letterSpacing: 1.5,
                  textShadow: "0 0 8px #00f0ff",
                  fontFamily: "'Orbitron', sans-serif",
                }}
              >
                ElectraGuard
              </Typography>
            </Box>

            {/* Navigation Links */}
            {user &&
              links.map(({ label, path }) => (
                <Button
                  key={label}
                  component={RouterLink}
                  to={path}
                  sx={{
                    textTransform: "none",
                    fontSize: 16, // smaller font size
                    color: "#00f0ff",
                    fontWeight: currentPath === path ? "bold" : "normal",
                    position: "relative",
                    px: 1, // reduce horizontal padding
                    fontFamily: "'Orbitron', sans-serif",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -6,
                      left: 0,
                      width: "100%",
                      height: "3px",
                      backgroundColor:
                        currentPath === path ? "#FFD700" : "transparent",
                      boxShadow:
                        currentPath === path
                          ? "0 0 10px #FFD700, 0 0 20px #FFD700"
                          : "none",
                      transition: "all 0.3s ease",
                    },
                    "&:hover": {
                      color: "#fff",
                      textShadow: "0 0 6px #00f0ff",
                    },
                  }}
                >
                  {label}
                </Button>
              ))}
          </Box>

          {/* 🔒 Auth Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user ? (
              <>
                <Avatar
                  sx={{
                    bgcolor: "#00f0ff",
                    color: "#000",
                    width: 36,
                    height: 36,
                    boxShadow: "0 0 8px #00f0ff",
                    fontSize: 16,
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                >
                  {user.email?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ddd",
                    fontWeight: 500,
                    fontSize: 14,
                    fontFamily: "'Orbitron', sans-serif",
                    maxWidth: 180,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={user.email} // tooltip on hover
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
                    boxShadow: "0 0 10px #FFD700",
                    fontSize: 14,
                    paddingX: 2,
                    fontFamily: "'Orbitron', sans-serif",
                    "&:hover": {
                      backgroundColor: "#e6c200",
                    },
                    whiteSpace: "nowrap",
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                {["/login", "/signup"].map((path) => (
                  <Button
                    key={path}
                    component={RouterLink}
                    to={path}
                    sx={{
                      textTransform: "none",
                      fontSize: 16,
                      color: "#00f0ff",
                      fontWeight: currentPath === path ? "bold" : "normal",
                      position: "relative",
                      px: 1,
                      fontFamily: "'Orbitron', sans-serif",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: -6,
                        left: 0,
                        width: "100%",
                        height: "3px",
                        backgroundColor:
                          currentPath === path ? "#FFD700" : "transparent",
                        boxShadow:
                          currentPath === path
                            ? "0 0 10px #FFD700, 0 0 20px #FFD700"
                            : "none",
                        transition: "all 0.3s ease",
                      },
                      "&:hover": {
                        color: "#fff",
                        textShadow: "0 0 6px #00f0ff",
                      },
                      whiteSpace: "nowrap",
                    }}
                  >
                    {path === "/login" ? "Login" : "Signup"}
                  </Button>
                ))}
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
