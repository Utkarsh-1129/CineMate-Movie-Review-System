#CINEMATE: Movie Review System 🎬

**Overview**

A simple full-stack Movie Review application built with:

- Backend: Spring Boot (Java 21), Spring Data MongoDB, Spring Web, Actuator
- Frontend: React + Vite, TailwindCSS
- Database: MongoDB (Atlas or local)

This README covers quick start, environment configuration, API endpoints, security & operational recommendations, and developer notes. ✅

---

## Table of contents

1. [Quick start](#quick-start) ⚡
2. [Requirements](#requirements) 📦
3. [Configuration / Environment variables](#configuration--environment-variables) 🔧
4. [Run & build instructions](#run--build-instructions) 🏃
5. [API reference (main endpoints)](#api-reference-main-endpoints) 🔗
6. [Security & operational measures](#security--operational-measures) 🔒
7. [Development notes & improvements](#development-notes--improvements) 💡
8. [Testing & linting](#testing--linting) 🧪
9. [License & author](#license--author) 📄

---

## Quick start ✅

1. Set up a MongoDB instance (Atlas or local).
2. Add environment variables (see `Backend/src/main/resources/.env.sample`).
3. Run the backend (port 8080) and frontend (port 5173).

---

## Requirements 📦

- Java 21 (JDK 21)
- Maven (or use the included `mvnw` wrapper)
- Node.js (>= 18) and npm
- MongoDB (Atlas or running locally)

---

## Configuration & environment variables 🔧

Backend expects the following environment variables (example in `Backend/src/main/resources/.env.sample`):

```env
# Backend/src/main/resources/.env.sample
MONGODB_DB=MoviesDB
MONGODB_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>/MoviesDB?retryWrites=true&w=majority
```

Important: Do NOT commit credentials or `.env` containing secrets. Use environment-specific secret stores or CI/CD secret mechanisms for production deployments.

Notes:
- The project uses `spring-dotenv` to load `.env` files. In this repository a `.env` is present under `Backend/src/main/resources/` (do not commit secrets there).
- Frontend currently uses hard-coded backend URLs like `http://localhost:8080` — consider moving these into a `.env` for the front-end or using a proxy.

---

## Run & build instructions 🏃

Backend (Windows):

```powershell
# From Backend/ folder
# Using wrapper
.\mvnw.cmd spring-boot:run
# or build
.\mvnw.cmd -DskipTests package
java -jar target/demo-0.0.1-SNAPSHOT.jar
# Run tests
.\mvnw.cmd test
```

Backend (Unix/macOS):

```bash
./mvnw spring-boot:run
./mvnw -DskipTests package
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

Frontend:

```bash
# From Frontend/ folder
npm install
npm run dev   # starts Vite (default port 5173)
npm run build # production build
npm run lint  # linter
```

Open the frontend at http://localhost:5173 and Backend at http://localhost:8080 by default.

---

## API reference (main endpoints) 🔗

Base URL: http://localhost:8080

### Root
- GET `/` — simple health / message endpoint.

### Movies
- GET `/api/movies/` — returns list of movies (Movie objects).
- GET `/api/movies/{id}` — returns movie by Mongo ObjectId.
- GET `/api/movies/find/{id}` — returns movie **title** for given ObjectId (or 404).
- GET `/api/movies/findbyname/{name}` — returns movie by title.
- GET `/api/movies/imdb/{id}` — returns movie by `imdbId`.

Movie schema (partial):
```json
{
  "id": "<ObjectId>",
  "imdbId": "tt1234567",
  "title": "Movie Title",
  "releaseDate": "YYYY-MM-DD",
  "genres": ["Action"],
  "reviewIds": [ /* doc refs */ ]
}
```

### Users
- POST `/api/user/signin` — create account
  - Body (JSON): `{ name, email, mobile, password, confirmPassword }`
  - Returns: created user and sets cookies (`user_id`, `name`, `email`, `mobile`) HttpOnly
- POST `/api/user/login` — login
  - Body: `{ userId, password }` (userId is email or mobile)
  - Returns: user and sets cookies
- GET `/api/user/data` — reads cookies to return user data
- GET `/api/user/logout` — clears stored cookies

### Reviews
- POST `/api/review/` — create review
  - Body: `{ imdbId, body }` — requires `user_id` and `name` cookies (set after login)
- GET `/api/review/viewreview` — accepts a JSON body `{ imdbId }` and returns reviews for that imdbId
- GET `/api/review/delete` — accepts a JSON body `{ id }` to delete a review

Notes:
- Some review endpoints use `GET` with a request body (non-standard). Consider changing these to POST/DELETE to be RESTful and compatible with proxies/clients.

---

## Security & operational measures 🔒

Current security behavior and recommended improvements:

- Password hashing: the project uses a SHA-256 based hash (`Util.hashPassword`). This is insecure by modern standards because there is no per-user salt and no slow hashing (e.g., bcrypt/argon2). **Recommendation:** Use bcrypt or Argon2 with per-user salt and appropriate work factor.

- Authentication: uses HttpOnly cookies set from server. Cookie **HttpOnly** is set, but **Secure** and **SameSite** flags are not configured. **Recommendation:** In production, set Secure (HTTPS), a restrictive SameSite policy, and consider session expirations and server-side session management or JWTs if appropriate.

- CSRF: since cookies are used for auth, add CSRF protection for state-changing endpoints (or use same-site cookies + CSRF tokens). Right now CSRF protection isn't visible in the code.

- Input validation: controllers do some validation but more robust validation should be added (DTOs with validation annotations) to avoid malformed data and injection attacks.

- Secrets: Do **not** commit `.env` with credentials. Use secret managers (Vault, cloud provider secrets) in production.

- CORS: currently restricted to `http://localhost:5173` in `WebConfig`. Update to your deployed frontend origin(s) in production.

- Logging / Monitoring: Actuator dependency is included; ensure production actuator endpoints are secured (disable `env`/`heap` exposure publicly) and configure a monitoring stack.

- Backups & disaster recovery: ensure MongoDB backups and database indexes as needed.

---

## Development notes & improvements 💡

- `WebConfig` sets endpoints to be case-insensitive (intended) — be mindful that routes are matched case-insensitively.
- `ObjectId` is serialized via custom `ObjectIdSerializer` so frontend sees readable IDs.
- Reviews are stored as document references inside Movie documents (`reviewIds`) — consider performance on large counts and whether pagination is needed.
- Replace non-standard GET-with-body endpoints with proper POST/DELETE for clarity and compatibility.
- Improve password hashing and cookie security for production readiness.

---

## Testing & linting 🧪

Backend unit tests: `mvn test` (only basic context load test exists).

Frontend lint: `npm run lint`

Consider adding more unit and integration tests (controller/service tests with in-memory Mongo or Testcontainers for DB).

---


## License & author

All rights are reserved to Utkarsh-1129

---
