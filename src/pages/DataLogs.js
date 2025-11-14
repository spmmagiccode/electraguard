import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { firestore, auth } from "../firebase";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Riple } from "react-loading-indicators";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DataLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("User not logged in");
        setLoading(false);
        return;
      }

      const userSensorRef = collection(
        firestore,
        `users/${user.uid}/sensor_data`
      );
      const q = query(userSensorRef, orderBy("timestamp", "desc"), limit(50));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setLogs(data.reverse());
    } catch (err) {
      console.error("Error fetching sensor data logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 UPDATED — show Date + Time
  const labels = logs.map((log) => {
    if (!log.timestamp) return "";
    const d = new Date(log.timestamp.seconds * 1000);
    const date = d.toLocaleDateString();
    const time = d.toLocaleTimeString();
    return `${date} ${time}`;
  });

  const colors = ["#00f0ff", "#00bcd4", "#007788", "#004455"];

  const makeCurrentDatasets = () => {
    const datasets = [];
    for (let i = 1; i <= 4; i++) {
      datasets.push({
        label: `Current ${i} (A)`,
        data: logs.map(
          (log) => parseFloat(log[`current${i}`]?.toFixed(3)) || 0
        ),
        borderColor: colors[i - 1],
        backgroundColor: colors[i - 1],
        fill: false,
        tension: 0.2,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2,
      });
    }
    return datasets;
  };

  const makePowerDatasets = () => {
    const datasets = [];
    for (let i = 1; i <= 4; i++) {
      datasets.push({
        label: `Power ${i} (W)`,
        data: logs.map((log) => {
          const voltage = log.voltage || 0;
          const current = log[`current${i}`] || 0;
          return parseFloat((voltage * current).toFixed(3));
        }),
        borderColor: colors[i - 1],
        backgroundColor: colors[i - 1],
        fill: false,
        tension: 0.2,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2,
      });
    }
    return datasets;
  };

  const makeEnergyDatasets = () => {
    const datasets = [];
    for (let i = 1; i <= 4; i++) {
      let lastTimestamp = null;
      let cumulativeEnergy = 0;
      const energyPoints = [];

      logs.forEach((log) => {
        const currentTimestamp = log.timestamp?.seconds || 0;
        const voltage = log.voltage || 0;
        const current = log[`current${i}`] || 0;

        if (lastTimestamp !== null) {
          const interval = currentTimestamp - lastTimestamp; // seconds
          const energy = (voltage * current * interval) / 3600000; // Wh to kWh
          cumulativeEnergy += energy;
        }
        lastTimestamp = currentTimestamp;
        energyPoints.push(parseFloat(cumulativeEnergy.toFixed(4)));
      });

      datasets.push({
        label: `Units ${i} (kWh)`,
        data: energyPoints,
        borderColor: colors[i - 1],
        backgroundColor: colors[i - 1],
        fill: false,
        tension: 0.2,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2,
      });
    }
    return datasets;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          color: "#00f0ff",
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 3,
          font: { family: "Orbitron", size: 10 },
        },
        grid: { color: "#111" },
      },
      y: {
        ticks: { color: "#00f0ff" },
        grid: { color: "#111" },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        labels: { color: "#00f0ff", font: { family: "Orbitron", size: 12 } },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#004455",
        titleFont: { family: "Orbitron", size: 14 },
        bodyFont: { family: "Orbitron", size: 12 },
        cornerRadius: 4,
      },
    },
  };

  const voltageData = {
    labels,
    datasets: [
      {
        label: "Voltage (V)",
        data: logs.map((log) => parseFloat(log.voltage?.toFixed(1)) || 0),
        borderColor: colors[0],
        backgroundColor: colors[0],
        fill: false,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const currentData = { labels, datasets: makeCurrentDatasets() };
  const powerData = { labels, datasets: makePowerDatasets() };
  const unitsData = { labels, datasets: makeEnergyDatasets() };

  return (
    <Box
      sx={{
        px: 3,
        py: 4,
        background: "linear-gradient(145deg, #111, #1a1a1a)",
        borderRadius: 3,
        color: "#00f0ff",
        fontFamily: "Orbitron",
        minHeight: "80vh",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        style={{ fontFamily: "Orbitron" }}
      >
        Sensor Data Logs (Last 50)
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Riple color="#00f0ff" size="large" />
        </Box>
      ) : logs.length === 0 ? (
        <Typography align="center">No data available</Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 4,
            height: "calc(100vh - 200px)",
          }}
        >
          {[
            { title: "Voltage", data: voltageData },
            { title: "Current", data: currentData },
            { title: "Power", data: powerData },
            { title: "Units Graph", data: unitsData },
          ].map(({ title, data }) => (
            <Box
              key={title}
              sx={{
                height: 320,
                p: 2,
                borderRadius: 1,
                background: "linear-gradient(145deg, #222, #111)",
                boxShadow:
                  "0 4px 8px rgba(0, 255, 255, 0.2), inset 0 0 10px rgba(0, 255, 255, 0.1)",
                transition: "transform 0.9s ease",
                "&:hover": {
                  transform: "scale(1.001)",
                  boxShadow:
                    "0 6px 15px rgba(0, 255, 255, 0.6), inset 0 0 15px rgba(0, 255, 255, 0.15)",
                },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ mb: 1, fontFamily: "Orbitron" }}
              >
                {title}
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Line data={data} options={options} />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DataLogsPage;
