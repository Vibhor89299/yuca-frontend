import axios from 'axios';

const axiosinstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  // baseURL: 'https://api.yucalifestyle.com', // Production URL
});

// Add token if it exists in localStorage
const token = localStorage.getItem('yuca_auth_token');
if (token) {
  axiosinstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axiosinstance;
