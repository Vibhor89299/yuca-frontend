import axios from 'axios';

const axiosinstance = axios.create({
  baseURL: 'https://api.yucalifestyle.com',
  // baseURL: 'http://localhost:5001',
});

// Add token if it exists in localStorage
const token = localStorage.getItem('yuca_auth_token');
if (token) {
  axiosinstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axiosinstance;
