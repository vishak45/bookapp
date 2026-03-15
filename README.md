# BookApp

# BookHive
BookHive is a free, open-source platform built for book lovers. Our mission is to make discovering, exploring, and sharing books as enjoyable as reading them.

With BookHive, you can:

1. 📚 Discover new and fascinating books from all genres.

2. ✍️ Share your thoughts by adding reviews for books you’ve read.

3. 📖 Manage your Readlist — add books you’re excited about or remove ones you’ve finished.

4. 🤖 Chat with HiveBot, your personal reading companion, ready to guide you deeper into the world of literature.

Why wait? Step into the hive and let your reading journey take flight!

## Table of Contents

1. Features
2. Tech Stack
3. Project Structure
4. Prerequisites
5. Environment Variables
6. Installation
7. Running the App
8. API Overview
9. Authentication
10. Troubleshooting
11. Future Improvements

## Features

- User authentication (register, login, password update)
- Browse books with pagination
- Search and filter books by genre
- View specific book details
- Add and remove books from personal read list
- Add and delete reviews
- View all reviews submitted by the current user
- HiveBot (Gemini) chat with persisted chat history

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- Google Gemini API (`@google/generative-ai`)

### Frontend
- React
- Vite
- React Router
- Axios
- React Toastify

## Project Structure

```text
bookapp/
	backend/
		config/
		controller/
		middleware/
		model/
		routes/
		index.js
		package.json
	frontend/
		src/
		public/
		package.json
		vite.config.js
	README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas or local MongoDB instance
- Gemini API key

## Environment Variables

Create a `.env` file in `backend/`:

```env
PORT=3000
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Create a `.env` file in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Installation

From the project root, install backend and frontend dependencies.

### Backend install

```bash
cd backend
npm install
```

### Frontend install

```bash
cd ../frontend
npm install
```

## Running the App

Open two terminals.

### Terminal 1: Run backend

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:3000` by default.

### Terminal 2: Run frontend

```bash
cd frontend
npm run dev
```

Frontend runs on Vite default (usually `http://localhost:5173`).

## API Overview

Base API paths:
- `/api/user`
- `/api/book`
- `/api/hivebot`

Health checks:
- `GET /` -> `server is running!`
- `GET /ping` -> `pong`

### User routes

- `POST /api/user/register`
- `POST /api/user/login`
- `PUT /api/user/updatepassword` (protected)

### Book routes

- `GET /api/book/all?page=1&limit=20`
- `GET /api/book/specificbook/:bid`
- `GET /api/book/genre/:genre`
- `GET /api/book/search`
- `POST /api/book/review/:bid` (protected)
- `DELETE /api/book/review/:bid/:rid` (protected)
- `GET /api/book/reviews` (protected)
- `POST /api/book/readlist/:bid` (protected)
- `GET /api/book/readlist` (protected)
- `GET /api/book/checklist/:bid` (protected)
- `DELETE /api/book/readlist/:bid` (protected)

### HiveBot routes

- `POST /api/hivebot/askquestion` (protected)
- `GET /api/hivebot/checkhistory` (protected)

## Authentication

Protected routes require a JWT in the Authorization header:

```http
Authorization: Bearer <token>
```

Token is returned from:
- `POST /api/user/login`

## Example Requests

### Register

```bash
curl -X POST http://localhost:3000/api/user/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Alice","email":"alice@example.com","password":"Pass@123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/user/login \
	-H "Content-Type: application/json" \
	-d '{"email":"alice@example.com","password":"Pass@123"}'
```

### Ask HiveBot

```bash
curl -X POST http://localhost:3000/api/hivebot/askquestion \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <token>" \
	-d '{"prompt":"Suggest 5 sci-fi novels for beginners"}'
```

## Troubleshooting

- If MongoDB connection fails, verify `DB_URI` and network access.
- If auth fails on protected routes, make sure `Authorization` header is `Bearer <token>`.
- If frontend API calls fail, confirm `VITE_API_BASE_URL` points to the backend server.
- If Gemini requests fail, verify `GEMINI_API_KEY` and API quota.

## Future Improvements

- Add role-based authorization
- Add API validation layer (Joi/Zod)
- Add unit/integration tests
- Add Docker support
- Add CI pipeline for lint/test/build

