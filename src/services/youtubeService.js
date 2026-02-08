import { fetchTranscript } from "youtube-transcript-plus";
import ApiError from "../errors/ApiError.js";
import logger from "../lib/logger.js";
import { logUsage } from "../lib/logUsage.js";

export const getVideoTranscript = async (videoId) => {
  const startTime = Date.now();
  const method = "transcript.fetch";

  logger.info(
    `[YouTube] Starting transcript fetch for videoId: "${videoId}" (len: ${videoId?.length})`
  );

    try {
      let transcript;
      let language = "auto";

      try {
        logger.debug(`[YouTube] Fetching transcript for ${videoId} (direct)...`);
        transcript = await fetchTranscript(videoId);
        language = transcript?.[0]?.lang || "auto";
      } catch (err) {
        // Try to map common errors from the library to 404 ApiError
        const name = err?.name || "";
        const message = String(err?.message || "").toLowerCase();

        logger.warn(`[YouTube] Error fetching transcript for ${videoId}: ${message}`);

        if (name.includes("YoutubeTranscriptDisabledError") || message.includes("captions disabled")) {
          throw new ApiError(404, "Captions are disabled for this video");
        } else if (
          name.includes("YoutubeTranscriptNotAvailableError") ||
          name.includes("YoutubeTranscriptNotAvailableLanguageError") ||
          message.includes("not available") ||
          message.includes("no transcript")
        ) {
          throw new ApiError(404, "No transcript available for this video");
        }

        // Re-throw other errors
        throw err;
      }

      const text = transcript.map((t) => t.text).join(" ");

      logger.info(
        `[YouTube] Transcript fetch successful for ${videoId}. Language: ${language}, Segments: ${transcript.length}`
      );

      await logUsage({
        method,
        resourceId: videoId,
        quotaUsed: 0,
        startTime,
        status: "SUCCESS",
        metadata: { language, lines: transcript.length },
      });

      return {
        videoId,
        language,
        text,
        segments: transcript,
      };
    } catch (error) {
      logger.error(`[YouTube] Transcript fetch failed entirely for ${videoId}: ${error.message}`);

      await logUsage({
        method,
        resourceId: videoId,
        quotaUsed: 0,
        startTime,
        status: "FAILED",
        error,
      });

      if (error instanceof ApiError) throw error;

      throw new ApiError(500, "Failed to fetch video transcript");
    }
};
