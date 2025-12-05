import axios from "axios";
import { API_URL } from "@env";

export const adminLogin = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/auth/admin/login`, data);
    return res.data;
  } catch (err) {
    console.log("ADMIN LOGIN ERROR:", err.response?.data || err);
    return null;
  }
};

export const createAdmin = async (body, token) => {
  return axios.post(`${API_URL}/auth/admin/admin/create`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchAdmins = async (token) => {
  return axios.get(`${API_URL}/auth/admin/admins`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createPlace = async (body, token) => {
  return axios.post(`${API_URL}/auth/admin/place/create`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchPlaces = async (token) => {
  return axios.get(`${API_URL}/auth/admin/places`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
