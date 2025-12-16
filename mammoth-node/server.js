import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json({ limit: "50mb" }));

const STORAGE_DIR = path.resolve("./mammoth-node/storage");
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

app.post("/storeBlob", (req, res) => {
  const { hash, data } = req.body || {};
  if (!hash || !data) return res.status(400).json({ error: "Missing hash or data" });
  try {
    const buffer = Buffer.from(data, "base64");
    fs.writeFileSync(path.join(STORAGE_DIR, hash), buffer);
    res.json({ success: true, hash });
  } catch (e) {
    res.status(500).json({ error: "Failed to store blob" });
  }
});

app.get("/getBlob/:hash", (req, res) => {
  const filePath = path.join(STORAGE_DIR, req.params.hash);
  if (!fs.existsSync(filePath)) return res.sendStatus(404);
  const data = fs.readFileSync(filePath);
  res.send(data);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Mammoth node running on ${PORT}`));