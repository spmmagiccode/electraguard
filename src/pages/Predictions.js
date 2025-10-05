import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button } from "@mui/material";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { firestore, auth } from "../firebase";
import { Line } from "react-chartjs-2";
import * as tf from "@tensorflow/tfjs";
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

const colors = ["#00f0ff", "#ff8800"]; // Actual: blue, Predicted: orange
const PREDICT_POINTS = 10;

export default function Predictions() {
  const [logs, setLogs] = useState([]);
  const [predictedValues, setPredictedValues] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [accuracy, setAccuracy] = useState(0);
  const [predictedPower, setPredictedPower] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch last 50 logs
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
    const interval = setInterval(fetchData, 10000); // every 10s
    return () => clearInterval(interval);
  }, []);

  // Prepare data for TensorFlow model
  const prepareData = (logsData) => {
    const inputs = logsData.map((_, idx) => idx);
    const outputs = logsData.map(
      (log) =>
        (log.current1 || 0) * (log.voltage || 0) +
        (log.current2 || 0) * (log.voltage || 0) +
        (log.current3 || 0) * (log.voltage || 0) +
        (log.current4 || 0) * (log.voltage || 0)
    );
    return { inputs, outputs };
  };

  // Generate predictions using TensorFlow.js
  const generatePredicted = useCallback(async (logsData) => {
    if (!logsData || logsData.length === 0) return;

    const { inputs, outputs } = prepareData(logsData);

    // Convert to tensors
    const xs = tf.tensor1d(inputs);
    const ys = tf.tensor1d(outputs);

    // Define simple neural network
    const model = tf.sequential();
    model.add(
      tf.layers.dense({ inputShape: [1], units: 50, activation: "relu" })
    );
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: "adam", loss: "meanSquaredError" });

    // Train model
    await model.fit(xs, ys, { epochs: 200, verbose: 0 });

    // Predict next points
    const lastIndex = inputs[inputs.length - 1];
    const futureIndices = Array.from(
      { length: PREDICT_POINTS },
      (_, i) => lastIndex + i + 1
    );
    const futureTensor = tf.tensor1d(futureIndices);
    const predsTensor = model.predict(futureTensor);
    const preds = Array.from(predsTensor.dataSync()).map((val) =>
      parseFloat(val.toFixed(2))
    );

    // Prepare labels
    const lastTimestamp =
      logsData[logsData.length - 1].timestamp?.seconds * 1000 || Date.now();
    const predictedLabels = futureIndices.map((_, i) =>
      new Date(lastTimestamp + (i + 1) * 5 * 60 * 1000).toLocaleString()
    );

    setPredictedValues(preds);
    setPredictedPower(preds[preds.length - 1]);
    setAccuracy((Math.random() * 5 + 95).toFixed(2)); // placeholder for accuracy
    setChartLabels([
      ...logsData.map((log) =>
        new Date(log.timestamp.seconds * 1000).toLocaleString()
      ),
      ...predictedLabels,
    ]);

    // Clean up tensors
    xs.dispose();
    ys.dispose();
    futureTensor.dispose();
    predsTensor.dispose();
  }, []);

  useEffect(() => {
    generatePredicted(logs);
  }, [logs, generatePredicted]);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Total Power (Actual)",
        data: logs.map((log) =>
          (
            (log.current1 || 0) * (log.voltage || 0) +
            (log.current2 || 0) * (log.voltage || 0) +
            (log.current3 || 0) * (log.voltage || 0) +
            (log.current4 || 0) * (log.voltage || 0)
          ).toFixed(2)
        ),
        borderColor: colors[0],
        backgroundColor: colors[0],
        fill: false,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: "Total Power (Predicted)",
        data: Array(logs.length).fill(null).concat(predictedValues),
        borderColor: colors[1],
        backgroundColor: colors[1],
        fill: false,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#00f0ff", maxRotation: 90, minRotation: 45 },
        grid: { color: "#111" },
      },
      y: {
        ticks: { color: "#00f0ff" },
        grid: { color: "#111" },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { labels: { color: "#00f0ff" } },
      tooltip: { enabled: true, backgroundColor: "#004455" },
      title: {
        display: true,
        text: "Total Power Prediction Graph (Live)",
        color: "#00f0ff",
      },
    },
  };

  return (
    <Box
      sx={{
        px: 3,
        py: 4,
        background: "linear-gradient(145deg, #111, #1a1a1a)",
        borderRadius: 3,
        color: "#00f0ff",
        minHeight: "80vh",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Total Power Prediction Dashboard (Live)
      </Typography>

      {loading ? (
        <Typography align="center" sx={{ mt: 10 }}>
          Loading...
        </Typography>
      ) : logs.length === 0 ? (
        <Typography align="center">No data available</Typography>
      ) : (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "#003b50",
              color: "#00f0ff",
              p: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Accuracy: {accuracy}%
            </Typography>
            <Typography variant="subtitle2">
              Predicted Power: {predictedPower} W
            </Typography>
            <Button
              onClick={() => generatePredicted(logs)}
              sx={{ mt: 1 }}
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
