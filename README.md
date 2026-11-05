# MERN Authentication with Google Login

A full-stack authentication app built with MongoDB, Express, React, and Node.js. It supports email/password registration and login, Google sign-in, email verification, password reset, and JWT authentication stored in an HTTP cookie.

## Features

- Register and sign in with email and password
- Sign in with Google
- Verify an account by email OTP
- Request an OTP to reset a password
- Protected routes and a user dashboard
- Cookie-based JWT authentication
- Responsive React interface with toast notifications

## Tech stack

- **Frontend:** React, Vite, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs
- **Authentication and email:** Google OAuth, Nodemailer
- **Database:** MongoDB

## Project structure

```text
.
├── backend/
│   ├── src/
│   │   ├── configs/          # Google OAuth, mail transport, email templates
│   │   ├── controllers/      # Authentication request handlers
│   │   ├── middleware/       # JWT authentication middleware
│   │   ├── models/           # Mongoose user model
│   │   ├── routes/           # Authentication API routes
│   │   ├── utils/            # Cookie options and shared utilities
│   │   ├── app.js            # Express app and middleware setup
│   │   ├── db.js             # MongoDB connection
│   │   └── server.js         # Server entry point
│   └── package.json
├── frontend/
│   ├── public/                # Static images and public assets
│   ├── src/
│   │   ├── api/               # Axios API client
│   │   ├── components/        # Shared UI and protected route
│   │   ├── context/           # Authentication context
│   │   ├── pages/             # App pages
│   │   ├── utils/             # Frontend utilities
│   │   ├── App.jsx            # Routes and app providers
│   │   └── main.jsx           # React entry point
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js and npm
- A MongoDB connection string (local MongoDB or MongoDB Atlas)
- A Google OAuth 2.0 client configured for the app
- SMTP credentials for sending verification and password-reset emails

## Getting started

### 1. Configure the backend

Create `backend/.env` with the following variables:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173

JWT_SECRET=replace_with_a_long_random_secret
JWT_TIMEOUT=24h
NODE_ENV=development

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SENDER_EMAIL=your_verified_sender_email
```

Use your own MongoDB database name in `MONGODB_URI`. Configure Google OAuth credentials for your local frontend origin (`http://localhost:5173`) and use the same Google client ID in both the backend and frontend configuration. The backend exchanges the authorization code through its `/api/auth/google` endpoint.

### 2. Configure the frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

The Google client ID must match `GOOGLE_CLIENT_ID` in `backend/.env`. Vite exposes `VITE_` variables to the browser, so do not put secrets (such as the Google client secret) in the frontend environment file.

### 3. Install dependencies

Run these commands from the project root:

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 4. Start the app

Open two terminals from the project root.

Terminal 1 — backend:

```bash
cd backend
npm start
```

The backend listens on port `8000` by default. Its health endpoint is `http://localhost:8000/`.

Terminal 2 — frontend:

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal (by default, `http://localhost:5173`).

## Authentication API

All authentication endpoints are prefixed with `/api/auth`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/google?code=...` | Complete Google sign-in using an authorization code |
| `POST` | `/register` | Register with username, email, and password |
| `POST` | `/login` | Sign in with email and password |
| `GET` | `/me` | Get the current authenticated user |
| `POST` | `/logout` | Clear the authentication cookie |
| `POST` | `/send-verify-otp` | Send an account-verification OTP (authenticated) |
| `POST` | `/verify-account` | Verify an account with an OTP (authenticated) |
| `POST` | `/send-reset-otp` | Send a password-reset OTP |
| `POST` | `/verify-reset-otp` | Check a password-reset OTP |
| `POST` | `/reset-password` | Set a new password using the email and OTP |

The frontend API client uses `withCredentials` so the browser sends and receives the authentication cookie.

## Available scripts

### Backend (`backend/`)

- `npm start` — start the API server
- `npm run dev` — start the API server with Nodemon (requires Nodemon to be available)

### Frontend (`frontend/`)

- `npm run dev` — start the Vite development server
- `npm run build` — create a production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Security notes

- Keep `.env` files out of version control and never publish real credentials.
- Use a unique, long `JWT_SECRET` and rotate credentials if they have been exposed.
- Configure production CORS origins, Google OAuth origins, and cookie settings for your deployed domains.
- Only frontend variables prefixed with `VITE_` should be considered public.
