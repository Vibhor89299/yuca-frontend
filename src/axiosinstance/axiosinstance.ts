import axios from  'axios'

const axiosinstance = axios.create({
  baseURL: 'https://api.yucalifestyle.com',
});

export default axiosinstance;
