# Chapter Performance Dashboard Backend

This project is a RESTful API backend for a Chapter Performance Dashboard, simulating real-world backend requirements such as API design, data filtering, caching, and performance optimization.

## Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- Redis (for caching & rate-limiting)

## Features

- **RESTful API Endpoints**
  - `GET /api/v1/chapters` — Returns all chapters with filters (`class`, `unit`, `status`, `weakChapters`, `subject`), pagination (`page`, `limit`), and total count. Results are cached in Redis for 1 hour.
  - `GET /api/v1/chapters/:id` — Returns a specific chapter by MongoDB ID.
  - `POST /api/v1/chapters` — Admin-only endpoint to upload chapters from a JSON file. Accepts a file upload, parses, validates, and inserts valid chapters. Returns any chapters that failed validation. Cache is invalidated on upload.
- **Rate Limiting**: 30 requests/minute per IP, enforced using Redis.
- **Admin Authentication**: Use the `x-admin-token` header with the value from `.env` (`ADMIN_TOKEN`) for uploading chapters.

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas cluster)
- Redis (local or cloud, e.g. Redis Cloud)

### Installation

1. Clone this repository
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables in `.env`:
   ```ini
   MONGO_URI=your_mongodb_uri
   REDIS_URL=your_redis_url
   PORT=5000
   ADMIN_TOKEN=your_admin_token
   ```
4. Start the server:
   ```sh
   node server.js
   ```

## API Endpoints

### 1. Get All Chapters

```
GET /api/v1/chapters
```

**Query Parameters:**

- `class`, `unit`, `status`, `weakChapters`, `subject` — Optional filters
- `page` (default: 1), `limit` (default: 10) — Pagination

**Response:**

```json
{
  "total": 100,
  "chapters": [ ... ]
}
```

### 2. Get Chapter by ID

```
GET /api/v1/chapters/:id
```

### 3. Upload Chapters (Admin Only)

```
POST /api/v1/chapters
```

- Upload a JSON file (array of chapters) with form-data key `file`
- Add header: `x-admin-token: <your_admin_token>`

**Response:**

```json
{
  "inserted": 10,
  "failed": [ { "chapter": { ... }, "error": "Validation error" } ]
}
```

## Notes

- The project uses Redis for both caching and rate limiting.
- Cache is automatically invalidated when new chapters are uploaded.
- Make sure MongoDB and Redis are running and accessible.
