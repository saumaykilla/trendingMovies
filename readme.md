# 🎬 Movie Explorer 

This project consists of a **frontend (Next.js)** and a **backend (Express)** that work together to display movie data fetched from **The Movie Database (TMDB) API**.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone 
cd trendingMovie
```

## ⚙️ Environment Setup

### Backend

Create a .env.local file inside the backend folder with the following content:

```bash
    api_key=your-tmdb-api-key
    TMDB_BASE_URL=https://api.themoviedb.org/3
```

### Frontend

Create a .env.local file inside the frontend folder:

```bash
    NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Update the URL if your backend is running on a different port.

## 🧩 Running the Project

### Option 1: Using Yarn (recommended)

If you’re using Yarn as your package manager, simply run:

```bash
        chmod +x run.sh && ./run.sh
```

This script will:

Install all dependencies for both frontend and backend

Start both servers automatically

### Option 2: Using another package manager (e.g., npm or pnpm)

#### Frontend setup

```bash
    cd frontend
    npm install
    npm run dev
```

#### Backend setup

In a separate terminal:

```bash
    cd backend
    npm install
    npm run dev
```
