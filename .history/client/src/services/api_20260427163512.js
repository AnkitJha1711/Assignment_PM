import axios from "axios";

export const getEvents = async () => {
  const res = await axios.get("http://localhost:5000/api/events");
  return res.data;
};

export const getStats = async () => {
  const res = await axios.get("http://localhost:5000/api/events/stats");
  return res.data;
};