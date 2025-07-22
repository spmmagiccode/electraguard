import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import ToggleWithData from "../components/DetailCard";
import { db, firestore, auth } from "../firebase";
import { ref, onValue, set } from "firebase/database";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Riple } from "react-loading-indicators";
import toast, { Toaster } from "react-hot-toast";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const SocketViewPage = () => {
  const [switchStates, setSwitchStates] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [userId, setUserId] = useState(null);
  const prevSwitchStates = useRef({});

  // 🔐 Get logged-in user ID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        toast.error("User not authenticated");
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔄 Fetch Realtime DB switch states for specific user
  useEffect(() => {
    if (!userId) return;

    const switchRef = ref(db, `users/${userId}/switch`);
    const unsubscribe = onValue(switchRef, (snapshot) => {
      const data = snapshot.val();

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
                  ? `✅ Socket ${pinId} is now ON`
                  : `❌ Socket ${pinId} is now OFF`}
              </Box>,
              { duration: 2500 }
            );
          }
        });
      }

      prevSwitchStates.current = data;
      setSwitchStates(data);
    });

    return () => unsubscribe();
  }, [userId]);

  // 📥 Fetch latest Firestore sensor data for user
  useEffect(() => {
    if (!userId) return;

    const fetchSensorData = async () => {
      try {
        const q = query(
          collection(firestore, `users/${userId}/sensor_data`),
          orderBy("timestamp", "desc"),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setSensorData(doc.data());
        } else {
          toast.error("📭 No sensor data found.");
        }
      } catch (err) {
        console.error("Firestore fetch error:", err);
        toast.error("❌ Failed to fetch sensor data.");
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleToggle = (pinId, newValue) => {
    if (!userId) return;
    const pinRef = ref(db, `users/${userId}/switch/${pinId}`);
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

  if (!switchStates || !sensorData) {
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

  const sortedData = Object.entries(switchStates)
    .map(([pinId, value]) => {
      const pinNum = parseInt(pinId.replace("Pin", ""));
      const power = sensorData?.[`power${pinNum}`] ?? 0;
      return { pinId, value, pinNum, power };
    })
    .sort((a, b) => a.pinNum - b.pinNum);

  const powerValues = sortedData.map((item) => item.power.toFixed(2));
  const totalPower = sortedData.reduce((sum, item) => sum + item.power, 0);

  const chartData = {
    labels: sortedData.map((item) => item.pinId),
    datasets: [
      {
        data: powerValues,
        backgroundColor: [
          "#00f0ff",
          "#006666",
          "#007788",
          "#00bcd4",
          "#006666",
          "#66ffff",
          "#00eeee",
        ],
        borderColor: "#001f1f",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#00f0ff",
          font: { family: "Orbitron", size: 14 },
          padding: 10,
          boxWidth: 20,
        },
      },
    },
  };

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
          flexDirection: "row",
        }}
      >
        {sortedData.map(({ pinId, value, pinNum, power }) => (
          <Box key={pinId} sx={{ flex: "0 0 auto" }}>
            <ToggleWithData
              data={{
                id: pinId,
                power: `${power.toFixed(2)} W`,
                current: `${
                  sensorData?.[`current${pinNum}`]?.toFixed(2) || 0
                } A`,
                voltage: `${sensorData?.voltage?.toFixed(1) || 0} V`,
                alarm:
                  power > 150
                    ? "Critical"
                    : power > 125
                    ? "Warning"
                    : "No alarm",
              }}
              pinId={pinId}
              switchValue={value}
              onToggle={handleToggle}
            />
          </Box>
        ))}
      </Box>

      {/* Doughnut Chart Section */}
      <Box
        sx={{
          mt: 5,
          px: 3,
          mx: "auto",
          width: 240,
          borderRadius: 3,
          background: "linear-gradient(145deg, #111, #1a1a1a)",
          boxShadow:
            "0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.2)",
          backdropFilter: "blur(6px)",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#00f0ff",
            fontFamily: "Orbitron",
            mb: 1,
            fontSize: "16px",
            textShadow: "0 0 6px #00f0ff",
          }}
        >
          Power Usage by Socket
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            textAlign: "center",
            color: "#b0e0e6",
            fontFamily: "Orbitron",
            mb: 2,
            fontSize: "13px",
          }}
        >
          Total Power: {totalPower.toFixed(2)} W
        </Typography>

        <Box sx={{ width: 180, height: 180 }}>
          <Doughnut data={chartData} options={chartOptions} />
        </Box>
      </Box>
    </>
  );
};

export default SocketViewPage;
