import express from "express";
import { getVideoTranscript } from "../services/youtubeService.js";

const router = express.Router();

// GET or POST /youtube-transcript
// - GET: supply ?videoId=...
// - POST: supply JSON body { "videoId": "..." }
/**
 * Accept either a raw videoId (e.g. "dQw4w9WgXcQ") or a YouTube URL
 * (e.g. "https://www.youtube.com/watch?v=dQw4w9WgXcQ" or "https://youtu.be/dQw4w9WgXcQ").
 */
const extractVideoId = (input) => {
  if (typeof input !== "string") return null;
  const s = input.trim();
  if (!s) return null;

  // Common URL patterns
  const vMatch = /[?&]v=([^&\s]+)/.exec(s);
  if (vMatch) return vMatch[1];
  const shortMatch = /youtu\.be\/([^?&\s/]+)/.exec(s);
  if (shortMatch) return shortMatch[1];
  const embedMatch = /embed\/([^?&\s/]+)/.exec(s);
  if (embedMatch) return embedMatch[1];

  // Otherwise assume the input is the id itself (no spaces)
  if (/\s/.test(s)) return null;
  return s;
};

const handleTranscriptRequest = async (req, res, next) => {
  const raw = req.query.videoId ?? req.body?.videoId;
  if (raw === undefined) return res.status(400).json({ error: "Missing required parameter: videoId" });

  const videoId = extractVideoId(raw);
  if (!videoId) return res.status(400).json({ error: "Invalid videoId or URL" });

  try {
    const result = await getVideoTranscript(videoId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

router.get("/", handleTranscriptRequest);
router.post("/", handleTranscriptRequest);

export default router;
