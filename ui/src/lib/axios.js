import axios from 'axios';

// const BASE_URL = 'http://127.0.0.1:5000/api/v1';
// const BASE_URL = process.env.BASE_URL;

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});

// Add a request interceptor
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default instance;
