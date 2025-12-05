// tour-app/src/api/weatherService.js
import axios from "axios";
import { OPENWEATHER_KEY } from "@env";

export const getWeather = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}`;
  const res = await axios.get(url);
  return res.data;
};
