// WEB - Document Signature App/SealFlow/client/src/utils/api.js

import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const uploadDocument = (formData) => axios.post(`${API_BASE}/docs/upload`, formData);
export const getDocuments = () => axios.get(`${API_BASE}/docs`);
export const loginUser = (credentials) => axios.post(`${API_BASE}/auth/login`, credentials);
