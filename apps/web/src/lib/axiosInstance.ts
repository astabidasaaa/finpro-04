import axios, { AxiosInstance } from 'axios';

const axiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: process.env.API_URL,
    withCredentials: true,
  });
};

export default axiosInstance;
