import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("لطفاً یک متن وارد کنید");
      return;
    }

    setLoading(true);
    setImage(null);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در تولید تصویر");
      }

      setImage(data.image);
    } catch (err) {
      setError(err.message);
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      generateImage();
    }
  };

  const downloadImage = () => {
    if (!image) return;
    try {
      const link = document.createElement("a");
      // create a safe filename from prompt or timestamp
      const safePrompt = prompt
        ? prompt.replace(/\s+/g, "_").slice(0, 30)
        : "stable_image";
      const filename = `${safePrompt}_${Date.now()}.png`;
      link.href = image; // data URL
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      <h2>🎨 تولید تصویر با Stable Diffusion (API)</h2>

      <input
        type="text"
        placeholder="مثلاً: a cat in a space suit"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{
          width: "60%",
          padding: "10px",
          margin: "20px 0",
          fontSize: "1rem",
          border: error ? "2px solid red" : "2px solid #ddd",
          borderRadius: "5px",
        }}
      />

      <br />

      <button
        onClick={generateImage}
        disabled={loading || !prompt.trim()}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {loading ? "در حال تولید..." : "تولید تصویر"}
      </button>

      {error && (
        <div
          style={{
            color: "red",
            marginTop: "1rem",
            padding: "10px",
            backgroundColor: "#ffe6e6",
            borderRadius: "5px",
          }}
        >
          {error}
        </div>
      )}

      {image && (
        <div style={{ marginTop: "2rem" }}>
          <img
            src={image}
            alt="generated"
            style={{
              maxWidth: "512px",
              maxHeight: "512px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />

          <div style={{ marginTop: "0.75rem" }}>
            <button
              onClick={downloadImage}
              style={{
                padding: "8px 14px",
                fontSize: "0.95rem",
                cursor: "pointer",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
              title="دانلود تصویر"
            >
              دانلود تصویر
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
