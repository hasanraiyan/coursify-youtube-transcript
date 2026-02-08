# YouTube Transcript Service 📺📝

Lightweight Express service that fetches YouTube video transcripts using `youtube-transcript-plus`.

## Features ✅
- Health check endpoint (`GET /health`) to verify service is up
- Transcript endpoint (`GET` or `POST /youtube-transcript`) to fetch transcript by video ID or YouTube URL
- Minimal dependencies, no persistent storage

---

## Quick start 🔧

Requirements: Node 18+ and `pnpm` installed (or use `npm`/`yarn` if you prefer).

Install and run:

```bash
pnpm install
pnpm start
# or: node src/server.js
```

The server listens on `PORT` env var or defaults to `3000`.

---

## Endpoints

### Health

GET /health

Response:

```json
{ "status": "ok", "uptime": 123.45, "time": "2026-02-08T..." }
```

### Transcript

Supports both GET and POST:

- GET: /youtube-transcript?videoId=<id-or-url>
- POST: /youtube-transcript with JSON body `{ "videoId": "<id-or-url>" }`

Examples:

```bash
# GET by id
curl "http://localhost:3000/youtube-transcript?videoId=dQw4w9WgXcQ"

# GET by URL
curl "http://localhost:3000/youtube-transcript?videoId=https://youtu.be/dQw4w9WgXcQ"

# POST with JSON body
curl -X POST -H "Content-Type: application/json" -d '{"videoId":"dQw4w9WgXcQ"}' http://localhost:3000/youtube-transcript
```

Sample success response:

```json
{
  "videoId": "dQw4w9WgXcQ",
  "language": "en",
  "text": "First line of transcript... Second line...",
  "segments": [ { "text": "First line...", "start": 0.0, "duration": 3.2, "lang": "en" }, ... ]
}
```

Errors:

- 400 — Missing or invalid `videoId`
- 404 — Captions disabled or no transcript available
- 500 — Internal error fetching transcript

---

## Notes & tips 💡
- The route accepts raw video IDs and common YouTube URL formats (`v=`, `youtu.be/`, `/embed/`).
- No database or persistent cache is used — the service calls the upstream library on each request.
- Keep the server behind a rate-limit if exposing publicly to avoid hitting upstream limits.

---

If you want, I can add a small test file demonstrating the curl requests or a short `README` section with deployment tips. Which would you like next? ✨
