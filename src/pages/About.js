import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <Box
      sx={{
        bgcolor: "#000",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column", // allow bottom content
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily: "Orbitron, sans-serif",
        p: 0,
        m: 0,
        pt: 15, // top padding
      }}
    >
      <Grid
        container
        rowSpacing={0}
        columnSpacing={2}
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ width: "100%", maxWidth: "100vw", mx: 0, px: 10 }}
      >
        {/* Left Image */}
        <Grid
          item
          xs={12}
          md={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            pt: 6,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={`${process.env.PUBLIC_URL}/app.png`}
              alt="App Preview"
              sx={{
                width: "100%",
                maxWidth: 160,
                borderRadius: 2,
                boxShadow: "0 0 25px #00FFFF",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "#00FFFF",
                fontFamily: "Orbitron",
                textAlign: "center",
                mt: 2,
              }}
            >
              Scan QR for mobile app
            </Typography>
          </motion.div>
        </Grid>

        {/* Center Text */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                lineHeight: 1.2,
                fontFamily: "Orbitron",
                textAlign: "center",
              }}
            >
              Powering{" "}
              <Box component="span" sx={{ color: "#00FFFF" }}>
                safety
              </Box>{" "}
              through{" "}
              <Box component="span" sx={{ color: "#39FF14" }}>
                smart energy control.
              </Box>
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#aaa",
                maxWidth: 600,
                mx: "auto",
                mb: 3,
                lineHeight: 1.6,
                fontWeight: 300,
                fontFamily: "Orbitron",
                textAlign: "center",
              }}
            >
              The Smart Power Guard with Monitoring and Alert System is designed
              to protect your electrical appliances and circuits with
              intelligent real-time monitoring. It instantly detects voltage
              fluctuations, overloads, and power failures — sending instant
              alerts to help you respond before damage occurs.
              <br />
              <br />
              Combining innovation and safety, our system ensures efficient
              power management, promotes energy savings, and provides complete
              control through advanced monitoring technology.
              <br />
              Stay smart. Stay safe. Stay connected.
            </Typography>

            <Box textAlign="center">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#00FFFF",
                  color: "#000",
                  fontWeight: 700,
                  borderRadius: "10px",
                  px: 4,
                  py: 1.2,
                  textTransform: "none",
                  fontFamily: "Orbitron",
                  boxShadow: "0 0 15px #00FFFF",
                  fontSize: "0.8rem",
                  "&:hover": {
                    backgroundColor: "#39FF14",
                    boxShadow: "0 0 25px #39FF14",
                  },
                }}
              >
                Download User Manual
              </Button>
            </Box>
          </motion.div>
        </Grid>

        {/* Right Image */}
        <Grid
          item
          xs={12}
          md={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            pt: 6,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={`${process.env.PUBLIC_URL}/manual.png`}
              alt="Manual Preview"
              sx={{
                width: "100%",
                maxWidth: 160,
                borderRadius: 2,
                boxShadow: "0 0 25px #00FFFF",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "#00FFFF",
                fontFamily: "Orbitron",
                textAlign: "center",
                mt: 2,
              }}
            >
              Scan QR for user manual
            </Typography>
          </motion.div>
        </Grid>
      </Grid>

      {/* Bottom "Project By" */}
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{ color: "#aaa", fontFamily: "Orbitron" }}
        >
          Project By: - 23SEA001 and 23SEA011
        </Typography>
      </Box>
    </Box>
  );
}
