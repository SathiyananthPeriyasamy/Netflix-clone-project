# 🎬 Prime Full-Stack Application for DevOps Practice

A complete, production-ready full-stack Prime Clone application designed specifically for **DevOps Practice** (Local Execution & Containerization using Docker & Docker Compose).

---

## 🛠️ Application Architecture

- **Frontend:** React 18, Vite, Tailwind-like custom Prime CSS design system (Hero banner, Movie Rows, Video Modal, Auth pages).
- **Backend:** Node.js, Express.js REST API, JWT Authentication, bcrypt password hashing, health check endpoint (`/api/health`), and automated database seed script.
- **Database:** MongoDB persistence for Users, Movies, and Watchlist.
- **DevOps & Web Server:** Docker multi-stage builds, Nginx reverse proxying `/api` requests, Docker Compose container orchestration.

---

## 🚀 Phase 1: Running Locally (Local Development)

### Prerequisites
- [Node.js v18+](https://nodejs.org/) installed on your machine.
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017` (OR use local Docker MongoDB image).

### 1. Start MongoDB (If running MongoDB via Docker locally)
```bash
docker run -d --name local-mongo -p 27017:27017 mongo:6.0
```

### 2. Setup & Start Backend API
```bash
cd backend

# Install backend dependencies
npm install

# Optional: Seed database with rich sample movie catalog & demo user
npm run seed

# Start Node.js Express server
npm start
```
> Backend API will start at: `http://localhost:5000`
> Health Check Endpoint: `http://localhost:5000/api/health`

### 3. Setup & Start Frontend UI
Open a new terminal window:
```bash
cd frontend

# Install frontend dependencies
npm install

# Start Vite React development server
npm run dev
```
> Frontend Application will start at: `http://localhost:3000`

### 🔑 Demo Login Credentials
- **Email:** `devops@prime.com`
- **Password:** `devops123`
*(Or click the **"Use DevOps Quick Demo Credentials"** button on the Login page)*

---

## 🐳 Phase 2: Running with Docker & Docker Compose

Containerize the entire stack (MongoDB + Express Backend + Nginx React Frontend) with a single command!

### 1. Build and Launch Containers
From the root directory (`prime-clone-devops`):
```bash
docker compose up --build -d
```

### 2. Verify Running Containers
```bash
docker compose ps
```
You should see 3 running containers:
1. `prime-mongodb` (Port 27017)
2. `prime-backend` (Port 5000)
3. `prime-frontend` (Port 80 & 3000)

### 3. Access the Application
- Open your browser to: `http://localhost` or `http://localhost:3000`
- API Health Check: `http://localhost:5000/api/health`

### 4. Seed MongoDB Inside Container Stack
```bash
docker exec -it prime-backend npm run seed
```

---

## 🧪 DevOps Practice Commands & Troubleshooting

### View Logs in Real-time
```bash
# All containers
docker compose logs -f

# Specific container
docker compose logs -f backend
docker compose logs -f frontend
```

### Stop and Clean Container Stack
```bash
# Stop containers
docker compose down

# Stop containers and remove persistent volume data
docker compose down -v
```

### Inspect Container Health
```bash
docker inspect --format='{{json .State.Health}}' prime-backend
```

---

## 📁 Project Structure

```
prime-clone-devops/
├── backend/
│   ├── src/
│   │   ├── config/db.js           # Mongoose MongoDB connection
│   │   ├── models/User.js         # User schema & password hashing
│   │   ├── models/Movie.js        # Movie catalog schema
│   │   ├── routes/authRoutes.js   # Register, Login, Profile API
│   │   ├── routes/movieRoutes.js  # Catalog & Watchlist API
│   │   ├── middleware/authMiddleware.js
│   │   ├── seed/seedData.js       # Auto-seeder script
│   │   └── server.js              # Express app entrypoint
│   ├── package.json
│   ├── .env
│   ├── .dockerignore
│   └── Dockerfile                 # Node.js production Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/            # Navbar, HeroBanner, MovieRow, MovieModal
│   │   ├── pages/                 # Login, Register, Home
│   │   ├── context/AuthContext.jsx# Auth token state & health status
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css              # Prime UI Design System
│   ├── nginx.conf                 # Nginx web server & reverse proxy
│   ├── package.json
│   ├── vite.config.js
│   ├── .dockerignore
│   └── Dockerfile                 # Multi-stage Nginx build Dockerfile
├── docker-compose.yml             # Orchestration for MongoDB, Backend, Frontend
└── README.md
```
