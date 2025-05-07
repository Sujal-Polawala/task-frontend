import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

export const registerUser = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, data);
  return res.data;
};

export const getUsers = async (token) => {
  const res = await axios.get(`${API_BASE_URL}/auth/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};