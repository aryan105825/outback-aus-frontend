import React, { useState, useRef } from "react";
import { Box, Button, LinearProgress, Paper, Typography } from "@mui/material";

interface WildlifeUploadProps {
  onUpload: (animal: { lat: number; lon: number; species: string; confidence?: number }) => void;
}

const WildlifeUpload: React.FC<WildlifeUploadProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [species, setSpecies] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setSpecies(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/classify_wildlife`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setSpecies(data.species);

      // Add a temporary marker somewhere random for demo
      onUpload({
        lat: -25 + Math.random() * 5,
        lon: 133 + Math.random() * 5,
        species: data.species,
        confidence: data.confidence,
      });
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, minWidth: 250 }}>
      <Typography variant="subtitle1" gutterBottom>
        Upload & Classify Wildlife
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
          id="wildlife-file-input"
        />
        <Button
          variant="contained"
          onClick={() => fileInputRef.current?.click()}
        >
          Select Image
        </Button>

        <Button
          variant="contained"
          color="secondary"
          disabled={!file || loading}
          onClick={handleUpload}
        >
          {loading ? "Uploading..." : "Upload & Classify"}
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mt: 1 }} />}

      {species && (
        <Typography sx={{ mt: 1 }}>
          Predicted Species: <strong>{species}</strong>
        </Typography>
      )}
    </Paper>
  );
};

export default WildlifeUpload;
