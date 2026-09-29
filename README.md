# 🎬 Netflix Full-Stack Application for DevOps Practice (Updated)

A complete, production-ready full-stack Netflix Clone application designed specifically for **DevOps Practice**. This version features a fully automated CI/CD pipeline, containerization, and AWS EC2 deployment.

---

## 🛠️ Application Architecture & Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, custom Netflix-style design system.
- **Backend:** Node.js, Express.js REST API, JWT Authentication, bcrypt password hashing.
- **Database:** MongoDB persistence for Users, Movies, and Watchlists.
- **DevOps & Web Server:** Docker multi-stage builds, Nginx reverse proxying `/api` requests, Docker Compose container orchestration.
- **CI/CD Pipeline (New):** GitHub Actions workflows completely automate the build and deployment process to Docker Hub and AWS EC2.

---

## 🚀 Phase 1: Running Locally (Local Development)

### Prerequisites
- Node.js v18+ installed.
- MongoDB running locally on port `27017` (OR use local Docker MongoDB image).

### 1. Setup & Start Backend API
```bash
cd backend
npm install
npm run seed # Seed database with rich sample movie catalog & demo user
npm start
```
> Backend API will start at: `http://localhost:5000`

### 2. Setup & Start Frontend UI
```bash
cd frontend
npm install
npm run dev
```
> Frontend Application will start at: `http://localhost:3000`

### 🔑 Demo Login Credentials
- **Email:** `devops@netflix.com`
- **Password:** `devops123`

---

## 🐳 Phase 2: Running with Docker Compose

Containerize the entire stack with a single command!

### 1. Build and Launch Containers
From the root directory:
```bash
docker compose up --build -d
```

### 2. Verify Running Containers
You should see 3 running containers:
1. `netflix-mongodb` (Port 27017)
2. `netflix-backend` (Port 5000)
3. `netflix-frontend` (Port 80 & 3000)

### 3. Access the Application
- Open your browser to: `http://localhost:8080` or `http://localhost:80`
- API Health Check: `http://localhost:5000/api/health`

---

## 🔄 Phase 3: CI/CD Pipeline (GitHub Actions & AWS EC2)

This repository includes a `.github/workflows/deploy.yml` pipeline that triggers on a push to the `master` branch.

### How it Works:
1. **Checkout & Auth**: Checks out the codebase and logs into Docker Hub using secrets.
2. **Build & Push**: Automatically builds the `frontend` and `backend` Docker images and pushes them directly to Docker Hub.
3. **AWS EC2 Deployment**: Uses SSH to connect securely to your AWS EC2 instance.
4. **Execute Deployment Plan**: Pulls the latest changes from `master`, forces a `docker compose build --no-cache`, and spins up the new containers with `docker compose up -d --force-recreate`.

### Required GitHub Secrets
To properly utilize the pipeline, configure these secrets in your GitHub repository:
- `DOCKERHUB_USERNAME` & `DOCKERHUB_TOKEN`
- `EC2_HOST`, `EC2_USERNAME`, and `EC2_SSH_KEY`

---

## 🧪 DevOps Troubleshooting Commands

```bash
# View Logs in Real-time
docker compose logs -f

# Specific container
docker compose logs -f backend

# Stop and Clean Container Stack
docker compose down -v
```

## 📁 Project Structure

```
netflix-clone-devops/
├── .github/workflows/     
│   └── deploy.yml         # CI/CD Pipeline Automation
├── backend/
│   ├── src/               # API Controllers & Models
│   ├── Dockerfile         # Node.js production Dockerfile
│   └── package.json
├── frontend/
│   ├── src/               # React Components & Contexts
│   ├── nginx.conf         # Nginx web server & reverse proxy
│   └── Dockerfile         # Multi-stage Nginx build Dockerfile
├── docker-compose.yml     # Orchestration for MongoDB, Backend, Frontend
└── README.md
```
