import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import ToggleWithData from "../components/DetailCard";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";
import { Riple } from "react-loading-indicators";
import toast, { Toaster } from "react-hot-toast";

const SocketViewPage = () => {
  const [switchStates, setSwitchStates] = useState(null);
  const prevSwitchStates = useRef({}); // 🧠 Store previous state

  // 🔄 Realtime Firebase Sync
  useEffect(() => {
    const switchRef = ref(db, "switch");
    const unsubscribe = onValue(switchRef, (snapshot) => {
      const data = snapshot.val();

      // 🕵️ Compare with previous state to detect updates
      if (data && prevSwitchStates.current) {
        Object.entries(data).forEach(([pinId, newValue]) => {
          const oldValue = prevSwitchStates.current[pinId];
          if (oldValue !== undefined && oldValue !== newValue) {
            toast.custom(
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: newValue ? "#00f0ff" : "#ff4d4d",
                  backgroundColor: newValue ? "#001f1f" : "#2b0000",
                  boxShadow: newValue
                    ? "0 0 10px #00f0ff"
                    : "0 0 10px rgba(255, 0, 0, 0.6)",
                  fontFamily: "'Orbitron', sans-serif",
                  border: `1px solid ${newValue ? "#00f0ff" : "#ff4d4d"}`,
                }}
              >
                {newValue
                  ? `🔌 DEVICE ${pinId} is now ON`
                  : `💤 DEVICE ${pinId} is now OFF`}
              </Box>,
              { duration: 2500 }
            );
          }
        });
      }

      prevSwitchStates.current = data; // 🔁 Update previous state
      setSwitchStates(data);
    });

    return () => unsubscribe();
  }, []);

  // ⬆️ Local Toggle Handler
  const handleToggle = (pinId, newValue) => {
    const pinRef = ref(db, `switch/${pinId}`);
    set(pinRef, newValue).catch(() => {
      toast.error(`❌ Failed to update DEVICE ${pinId}`, {
        style: {
          background: "#330000",
          color: "#fff",
          fontFamily: "'Orbitron', sans-serif",
        },
      });
    });
  };

  // 🌀 Loading Spinner
  if (!switchStates) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          color: "#fff",
        }}
      >
        <Riple color="#00f0ff" size="large" />
      </Box>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Box
        sx={{
          mt: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "nowrap",
          gap: 3,
          px: 2,
        }}
      >
        {Object.entries(switchStates).map(([pinId, value], index) => (
          <Box key={pinId} sx={{ flex: "0 0 auto" }}>
            <ToggleWithData
              data={{
                id: pinId,
                power: `${1000 + index * 100} W`,
                current: `${10 + index} A`,
                voltage: `${220 + (index % 3) * 5} V`,
                alarm:
                  index % 3 === 0
                    ? "No alarm"
                    : index % 3 === 1
                    ? "Warning"
                    : "Critical",
              }}
              pinId={pinId}
              switchValue={value}
              onToggle={handleToggle}
            />
          </Box>
        ))}
      </Box>
    </>
  );
};

export default SocketViewPage;
