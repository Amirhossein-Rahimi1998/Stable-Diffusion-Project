import express from "express";
import cors from "cors";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prefer loading local.env next to this file, fall back to default .env / environment
const localEnvPath = path.join(__dirname, "local.env");
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
  console.log("Loaded environment from:", localEnvPath);
} else {
  dotenv.config();
  console.log("Loaded environment from default .env or process environment");
}

console.log("=== API Key Debug ===");
console.log("API Key exists:", !!process.env.STABILITY_API_KEY);
console.log("API Key type:", typeof process.env.STABILITY_API_KEY);
console.log(
  "API Key starts with:",
  process.env.STABILITY_API_KEY ? process.env.STABILITY_API_KEY.substring(0, 10) + "..." : "none"
);
console.log("API Key length:", process.env.STABILITY_API_KEY ? process.env.STABILITY_API_KEY.length : 0);
console.log("=====================");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.STABILITY_API_KEY;

// بررسی API Key هنگام راه‌اندازی سرور
if (!API_KEY) {
  console.error("❌ ERROR: STABILITY_API_KEY is not set in .env file");
} else {
  console.log("✅ API Key is set (length:", API_KEY.length + ")");
}

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // بررسی API Key برای هر درخواست
  if (!API_KEY) {
    return res.status(500).json({ error: "API Key is not configured" });
  }

  try {
    const formData = new FormData();
    formData.append("prompt", prompt.trim());
    formData.append("output_format", "png");

    console.log("Sending request to Stability AI with prompt:", prompt.substring(0, 50) + "...");

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      formData,
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Accept": "image/*",
          ...formData.getHeaders()
        },
        responseType: 'arraybuffer',
        timeout: 30000 // 30 ثانیه timeout
      }
    );

    const base64Image = Buffer.from(response.data).toString('base64');
    
    console.log("✅ Image generated successfully");
    res.json({ 
      image: `data:image/png;base64,${base64Image}`,
      message: "Image generated successfully"
    });
    
  } catch (err) {
    console.error("❌ Error details:", {
      message: err.message,
      status: err.response?.status,
      headers: err.response?.headers
    });

    if (err.response?.status === 401) {
      return res.status(401).json({ 
        error: "Invalid API Key",
        details: "Please check your STABILITY_API_KEY in .env file"
      });
    }

    if (err.response) {
      const errorText = Buffer.from(err.response.data).toString();
      console.error("API error response:", errorText);
      return res.status(err.response.status).json({ 
        error: `Stability API error: ${err.response.status}`,
        details: errorText
      });
    }
    
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));

