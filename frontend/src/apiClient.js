import axios from 'axios';

// Use env var for deployed backend; fallback to Render backend URL, then same origin for local dev
const API_BASE =
  process.env.REACT_APP_API_BASE || 'https://tech-mecha-task.onrender.com' || '';

const apiClient = axios.create({
  baseURL: API_BASE,
});

export default apiClient;
