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
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";

const Navbar = () => {
  const [user, setUser] = useState(null);

  const [isOnline, setIsOnline] = useState(false);
  const [lastUpdatedDate, setLastUpdatedDate] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const parseFirebaseDate = (str) => {
    try {
      if (!str) return null;
      const [datePart, timePart] = str.split(" at ");
      const cleanTime = timePart.slice(0, -2) + " " + timePart.slice(-2);
      const finalString = `${datePart} ${cleanTime}`;
      const parsed = new Date(finalString);
      return isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
  };

  const formatDisplayDate = (date) => {
    if (!date) return "—";
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
  };

  useEffect(() => {
    let unsubscribeValue = null;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const lastUpdatedRef = ref(db, `users/${currentUser.uid}/lastupdated`);

        unsubscribeValue = onValue(lastUpdatedRef, (snapshot) => {
          const rawTimestamp = snapshot.val();
          const parsed = parseFirebaseDate(rawTimestamp);
          setLastUpdatedDate(parsed);
        });
      }
    });

    return () => {
      if (unsubscribeValue) unsubscribeValue();
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastUpdatedDate) {
        setIsOnline(false);
        return;
      }

      const diff = Date.now() - lastUpdatedDate.getTime();
      setIsOnline(diff <= 30000);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdatedDate]);

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
    { label: "Dashboard", path: "/SocketView" },
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
      <Container maxWidth="xl" sx={{ px: 3 }}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: 1,
            minHeight: "100px !important",
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
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
                variant="h6"
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

            {user &&
              links.map(({ label, path }) => (
                <Button
                  key={label}
                  component={RouterLink}
                  to={path}
                  sx={{
                    textTransform: "none",
                    fontSize: 16,
                    color: "#00f0ff",
                    fontWeight: currentPath === path ? "bold" : "normal",
                    position: "relative",
                    px: 1,
                    whiteSpace: "nowrap", // 🔥 FIXED: no line-wrapping
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            {user ? (
              <>
                <Box
                  sx={{
                    textAlign: "right",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    mr: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: isOnline ? "#00ff9d" : "#ff4d4d",
                        animation: "blink 3s infinite",
                      }}
                    />
                    <Typography
                      sx={{
                        color: isOnline ? "#00ff9d" : "#ff4d4d",
                        fontWeight: "bold",
                        fontSize: 14,
                        fontFamily: "'Orbitron', sans-serif",
                        textShadow: isOnline
                          ? "0 0 6px #00ff9d"
                          : "0 0 6px #ff4d4d",
                      }}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: "#aaa",
                      fontSize: 9,
                      mt: 0.2,
                      fontFamily: "'Orbitron', sans-serif",
                    }}
                  >
                    Last Updated: {formatDisplayDate(lastUpdatedDate)}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    bgcolor: "#00f0ff",
                    color: "#000",
                    width: 36,
                    height: 36,
                    boxShadow: "0 0 8px #00f0ff",
                    fontSize: 16,
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
                    maxWidth: 180,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                  title={user.email}
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
                      whiteSpace: "nowrap", // ensure login/signup never wrap
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
                    {path === "/login" ? "Login" : "Signup"}
                  </Button>
                ))}
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      <style>
        {`
          @keyframes blink {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0.3; }
          }
        `}
      </style>
    </AppBar>
  );
};

export default Navbar;
