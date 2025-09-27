import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import FireRiskForm from "./FireRiskForm";
import WildlifeUpload from "./WildlifeUpload";
import { Box, Paper, Typography } from "@mui/material";

// Custom fire risk icons
const fireIcons: Record<string, L.Icon> = {
  High: L.icon({
    iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  Medium: L.icon({
    iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/orange-dot.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  Low: L.icon({
    iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
};

// Wildlife marker icon
const wildlifeIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const App: React.FC = () => {
  const [fireZones, setFireZones] = useState<
    { lat: number; lon: number; fire_risk: string }[]
  >([]);
  const [wildlife, setWildlife] = useState<
    { lat: number; lon: number; species: string; confidence?: number }[]
  >([]);

  // Fetch initial map data
  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/get_map_data`)
      .then((res) => res.json())
      .then((data) => {
        setFireZones(data.fire_zones || []);
        setWildlife(data.wildlife || []);
      })
      .catch((err) => console.error("Error fetching map data", err));
  }, []);

  const handleNewWildlife = (animal: {
    lat: number;
    lon: number;
    species: string;
    confidence?: number;
  }) => {
    setWildlife((prev) => [...prev, animal]);
  };

  return (
    <Box sx={{ height: "100vh", width: "100vw", position: "relative" }}>
      {/* Left Panel */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: `3vw`,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Paper elevation={4} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Fire Risk Predictor
          </Typography>
          <FireRiskForm onResult={(risk, location) => {
            setFireZones(prev => [...prev, { fire_risk: risk, ...location }]);
          }} />        </Paper>

        <Paper elevation={4} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Wildlife Upload
          </Typography>
          <WildlifeUpload onUpload={handleNewWildlife} />
        </Paper>
      </Box>

      {/* Map */}
      <MapContainer
        center={[-25, 133]}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Fire markers */}
        {fireZones.map((fire, idx) => (
          <Marker
            key={idx}
            position={[fire.lat, fire.lon]}
            icon={fireIcons[fire.fire_risk] || fireIcons["Low"]}
          >
            <Popup>🔥 Fire Risk: {fire.fire_risk}</Popup>
            <Tooltip>Risk: {fire.fire_risk}</Tooltip>
          </Marker>
        ))}

        {/* Wildlife markers */}
        {wildlife.map((animal, idx) => (
          <Marker
            key={idx}
            position={[animal.lat, animal.lon]}
            icon={wildlifeIcon}
          >
            <Popup>
              🐾 {animal.species}
              {animal.confidence && (
                <div>Confidence: {(animal.confidence * 100).toFixed(1)}%</div>
              )}
            </Popup>
            <Tooltip>{animal.species}</Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default App;
