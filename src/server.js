import express from "express";
import dotenv from "dotenv";
import healthRouter from "./routes/health.js";
import youtubeRouter from "./routes/youtubeTranscript.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/health", healthRouter);
app.use("/youtube-transcript", youtubeRouter);

// Generic error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const body = { error: err.message || "Internal Server Error" };
  res.status(status).json(body);
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
