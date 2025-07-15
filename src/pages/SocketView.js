import { Grid, Container } from "@mui/material";
import ToggleWithData from "../components/DetailCard";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";

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
    return <p style={{ textAlign: "center" }}>Loading switch states...</p>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        {Object.entries(switchStates).map(([pinId, value], index) => (
          <Grid item key={pinId} xs={12} sm={6} md={3} sx={{ display: "flex", justifyContent: "center" }}>
            <ToggleWithData
              data={{
                id: pinId,
                power: `${1000 + index * 100} W`,
                current: `${10 + index} A`,
                voltage: `${220 + (index % 3) * 5} V`,
                alarm: index % 3 === 0 ? "No alarm" : index % 3 === 1 ? "Warning" : "Critical",
              }}
              pinId={pinId}
              switchValue={value}
              onToggle={handleToggle}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SocketViewPage;
