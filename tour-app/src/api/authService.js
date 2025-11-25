// tour-app/src/api/authService.js
import axios from "axios";
import { API_URL } from "@env";

export const loginUser = async (data) => {
  try {
    //console.log("API CALL TO:", `${API_URL}/login`);
    const res = await axios.post(`${API_URL}/login`, data);
    return res.data;
  } catch (err) {
    console.log("LOGIN ERROR:", err.message || err);
    return null;
  }
};

export const registerUser = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/register`, data);
    return res.data;
  } catch (err) {
    console.log("REGISTER ERROR:", err.response?.data || err);
    return null;
  }
};
