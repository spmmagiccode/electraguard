import { Box, Typography } from "@mui/material";
import ToggleWithData from "../components/DetailCard";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";
import { Riple   } from "react-loading-indicators";

const SocketViewPage = () => {
  const [switchStates, setSwitchStates] = useState(null);

  // 🔄 Fetch Realtime Switch Data
  useEffect(() => {
    const switchRef = ref(db, "switch");
    const unsubscribe = onValue(switchRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSwitchStates(data);
      }
    });

    return () => unsubscribe();
  }, []);

  // ⬆️ Handle Toggle
  const handleToggle = (pinId, newValue) => {
    const pinRef = ref(db, `switch/${pinId}`);
    set(pinRef, newValue);
  };

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
         <Riple  
        
          color="#00f0ff"
          size="large"
          
  />
       
      </Box>
    );
  }

  return (
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
  );
};

export default SocketViewPage;
