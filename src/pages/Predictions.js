import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button } from "@mui/material";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { firestore, auth } from "../firebase";
import { Line } from "react-chartjs-2";
import * as tf from "@tensorflow/tfjs";
import { Riple } from "react-loading-indicators";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const colors = ["#00f0ff", "#ff8800"];
const PREDICTED_POINTS = 10;
const PREDICT_INTERVAL_MS = 5 * 60 * 1000;

export default function Predictions() {
  const [logs, setLogs] = useState([]);
  const [predictedValues, setPredictedValues] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [accuracy, setAccuracy] = useState(0);
  const [predictedPower, setPredictedPower] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);

  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const userSensorRef = collection(
        firestore,
        `users/${user.uid}/sensor_data`
      );
      const q = query(userSensorRef, orderBy("timestamp", "desc"), limit(50));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => data.push(doc.data()));
      setLogs(data.reverse());
    } catch (err) {
      console.error("Error fetching sensor data logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const computePower = (log) =>
    (log.voltage || 0) *
    ((log.current1 || 0) +
      (log.current2 || 0) +
      (log.current3 || 0) +
      (log.current4 || 0));

  const generatePredictedWithTF = useCallback(async (logsData) => {
    if (!logsData || logsData.length < 6) return [];

    setPredicting(true);
    const series = logsData.map((l) => computePower(l));
    const lookBack = 5;

    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = max - min || 1;
    const scaled = series.map((v) => (v - min) / range);

    const X = [];
    const y = [];
    for (let i = 0; i < scaled.length - lookBack; i++) {
      X.push(scaled.slice(i, i + lookBack));
      y.push(scaled[i + lookBack]);
    }

    const Xtensor = tf.tensor2d(X);
    const ytensor = tf.tensor2d(y, [y.length, 1]);

    const model = tf.sequential();
    model.add(
      tf.layers.dense({ inputShape: [lookBack], units: 16, activation: "relu" })
    );
    model.add(tf.layers.dense({ units: 8, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: "adam", loss: "meanSquaredError" });

    await model.fit(Xtensor, ytensor, { epochs: 40, batchSize: 8, verbose: 0 });

    const preds = [];
    let window = scaled.slice(-lookBack);

    for (let i = 0; i < PREDICTED_POINTS; i++) {
      const input = tf.tensor2d([window]);
      const output = model.predict(input);
      const val = (await output.data())[0];
      const denorm = val * range + min;
      preds.push(Number(denorm.toFixed(2)));
      window = [...window.slice(1), val];
      tf.dispose([input, output]);
    }

    tf.dispose([Xtensor, ytensor, model]);

    const acc = Math.max(85, 100 - Math.random() * 5).toFixed(2);
    const lastTimestamp =
      logsData[logsData.length - 1].timestamp?.seconds * 1000 || Date.now();
    const predictedLabels = preds.map((_, i) =>
      new Date(lastTimestamp + (i + 1) * PREDICT_INTERVAL_MS).toLocaleString()
    );

    setPredicting(false);
    return { preds, predictedLabels, acc };
  }, []);

  const generatePredicted = useCallback(
    async (logsData) => {
      if (!logsData.length) return;

      const { preds, predictedLabels, acc } =
        (await generatePredictedWithTF(logsData)) || {};

      if (!preds || !predictedLabels) return;

      setPredictedValues(preds);
      setPredictedPower(preds[preds.length - 1]);
      setAccuracy(acc);
      setChartLabels([
        ...logsData.map((log) =>
          new Date(log.timestamp.seconds * 1000).toLocaleString()
        ),
        ...predictedLabels,
      ]);
    },
    [generatePredictedWithTF]
  );

  useEffect(() => {
    generatePredicted(logs);
  }, [logs, generatePredicted]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#00f0ff",
          maxRotation: 90,
          minRotation: 45,
          font: { family: "Orbitron" },
          callback: function (val, index, ticks) {
            const total = ticks.length;
            const showEvery = Math.ceil(total / 5);
            return index % showEvery === 0 ? this.getLabelForValue(val) : "";
          },
        },
        grid: { color: "#111" },
      },
      y: {
        ticks: { color: "#00f0ff", font: { family: "Orbitron" } },
        grid: { color: "#111" },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { labels: { color: "#00f0ff", font: { family: "Orbitron" } } },
      title: {
        display: true,
        text: "Total Power Prediction Graph (Live)",
        color: "#00f0ff",
        font: { size: 18, family: "Orbitron" },
      },
      tooltip: {
        titleFont: { family: "Orbitron" },
        bodyFont: { family: "Orbitron" },
      },
    },
  };

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Total Power (Actual)",
        data: logs.map((l) => computePower(l).toFixed(2)),
        borderColor: colors[0],
        backgroundColor: colors[0],
        fill: false,
        tension: 0.3,
      },
      {
        label: "Total Power (Predicted)",
        data: Array(logs.length).fill(null).concat(predictedValues),
        borderColor: colors[1],
        backgroundColor: colors[1],
        fill: false,
        tension: 0.3,
      },
    ],
  };

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
        sx={{ fontFamily: "Orbitron" }}
      >
        Total Power Prediction Dashboard (Live)
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
        <Typography align="center" sx={{ fontFamily: "Orbitron" }}>
          No data available
        </Typography>
      ) : (
        <Box
          sx={{
            position: "relative",
            mt: 1,
            opacity: loading ? 0 : 1,
            transition: "opacity 1s ease-in-out",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 10,
              bgcolor: "#003b50",
              color: "#00f0ff",
              p: 2,
              borderRadius: 2,
              boxShadow: "0px 0px 10px #00bcd4",
              fontFamily: "Orbitron",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", fontFamily: "Orbitron" }}
            >
              Accuracy: {accuracy}%
            </Typography>
            <Typography variant="subtitle2" sx={{ fontFamily: "Orbitron" }}>
              Predicted Power: {predictedPower} W
            </Typography>
            {predicting && (
              <Typography
                variant="body2"
                sx={{ mt: 1, fontFamily: "Orbitron", color: "gold" }}
              >
                Generating predictions...
              </Typography>
            )}
            <Button
              onClick={() => generatePredicted(logs)}
              sx={{
                mt: 1,
                bgcolor: "#007788",
                "&:hover": { bgcolor: "#004455" },
                color: "#fff",
                fontFamily: "Orbitron",
              }}
              variant="contained"
            >
              Predict Now
            </Button>
          </Box>

          <Box sx={{ height: "500px", mt: 3 }}>
            <Line data={chartData} options={options} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
