import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';
const WS_BASE_URL = 'ws://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getStatus = () => api.get('/status');
export const getClusters = () => api.get('/clusters');
export const semanticSearch = (query) => api.post('/search', { query });
export const askAI = (query) => api.post('/ask', { query });

export const getWebSocketUrl = () => `${WS_BASE_URL}/ws`;

export default api;
