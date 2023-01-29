import axios from 'axios';

export default axios.create({
  baseURL: window.electron.env.apiBaseUrl,
  timeout: 10000,
});
