# Country Guesser

A modern, full-stack geography game where players guess countries and compete for high scores! Features a global leaderboard and comment section, all powered by a self-hosted Postgres database (Neon.tech) and a Node.js/Express backend.

## Features
- Guess countries using up-to-date REST Countries API
- Global leaderboard (scores saved to Postgres via backend API)
- Comment section with CAPTCHA (comments saved to Postgres)
- Pagination for leaderboard and comments
- Modern, responsive UI (React + Vite)
- Cloudflare Turnstile CAPTCHA for spam protection

## Tech Stack
- **Frontend:** React, Vite, Bootstrap
- **Backend:** Node.js, Express, pg (Postgres client)
- **Database:** Postgres (hosted on Neon.tech)

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/kristofer11/Country-Guesser.git
cd country-guesser
```

### 2. Install Frontend Dependencies
```sh
npm install
```

### 3. Setup the Backend
```sh
cd backend
npm install
```

#### Create a `.env` file in the `backend` directory:
```
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
```
(Use your Neon.tech connection string)

### 4. Create the Database Tables
Connect to your Neon database and run:
```sql
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  streak INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  dateString TEXT
);
```

### 5. Start the Backend
```sh
node index.js
```
The backend will run on [http://localhost:4000](http://localhost:4000)

### 6. Start the Frontend
```sh
cd ..
npm run dev
```
The frontend will run on [http://localhost:5173](http://localhost:5173) (or next available port)

## Environment Variables
- `DATABASE_URL` (in `backend/.env`): Your Neon.tech Postgres connection string
- (Optional) Cloudflare Turnstile site key in `src/config/captcha.js` for CAPTCHA

## Developer Credits
- © 2025, developed by [K. Hvattum](https://www.krishvattum.com/) and [Vn0 (Chris)](https://vn0.dev)

---

Enjoy playing and competing on Country Guesser! 