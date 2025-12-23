# TechMecha Notes App

Minimal setup for running locally and deploying.

## Prerequisites
- Node.js 18+
- MongoDB (local or cloud URI)

## Environment
Create `backend/.env`:
```
MONGODB_URI=your_mongo_uri
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret
JWT_EXPIRE=7d
```

## Install
```
# backend
yarn install  # or npm install

# frontend
yarn install  # or npm install
```

## Run (local dev)
```
# backend
cd backend
npm run dev

# frontend (default dev port)
cd ../frontend
npm start
```

- Backend: http://localhost:5000
- Frontend: auto-prompts a new port if 3000 is busy (e.g., 3001)

## Deploy URLs
- Backend (Render): https://tech-mecha-task.onrender.com
- Frontend (Vercel): https://tech-mecha-task.vercel.app

Set `REACT_APP_API_BASE` on the frontend to the deployed backend URL when needed.
