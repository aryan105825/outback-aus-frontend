import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, LinearProgress } from "@mui/material";

interface FireRiskFormProps {
  onResult?: (risk: string, location: { lat: number; lon: number }) => void;
}

const FireRiskForm: React.FC<FireRiskFormProps> = ({ onResult }) => {
  const [ndvi, setNdvi] = useState<number>(0.5);
  const [temperature, setTemperature] = useState<number>(35);
  const [humidity, setHumidity] = useState<number>(10);
  const [windSpeed, setWindSpeed] = useState<number>(5);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Generate random location within Australia
  const getRandomAustraliaLocation = () => {
  const latMin = -39; // southern limit (Tasmania excluded)
  const latMax = -12; // northern tip
  const lonMin = 130; // western edge
  const lonMax = 150; // eastern edge

  const lat = latMin + Math.random() * (latMax - latMin);
  const lon = lonMin + Math.random() * (lonMax - lonMin);

  return { lat, lon };
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/predict_fire_risk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ndvi, temperature, humidity, wind_speed: windSpeed }),
      });

      const data = await response.json();
      setResult(data.risk);

      if (onResult) {
        // For demo: random nearby location
        const demoLocation = getRandomAustraliaLocation();
        onResult(data.risk, demoLocation);
      }
    } catch (err) {
      console.error("Error predicting fire risk", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Fire Risk Predictor</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField type="number" label="NDVI" value={ndvi} onChange={(e) => setNdvi(Number(e.target.value))} inputProps={{ step: 0.01, min: 0, max: 1 }} required />
        <TextField type="number" label="Temperature (°C)" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} required />
        <TextField type="number" label="Humidity (%)" value={humidity} onChange={(e) => setHumidity(Number(e.target.value))} required />
        <TextField type="number" label="Wind Speed (km/h)" value={windSpeed} onChange={(e) => setWindSpeed(Number(e.target.value))} required />
        <Button type="submit" variant="contained" color="error" disabled={loading}>
          {loading ? "Predicting..." : "Predict Risk"}
        </Button>
      </Box>
      {loading && <LinearProgress sx={{ mt: 1 }} />}
      {result && (
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Prediction: <strong>{result}</strong>
        </Typography>
      )}
    </Paper>
  );
};

export default FireRiskForm;
