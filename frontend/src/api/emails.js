import axios from "axios";

const API = axios.create({
  baseURL: "https://email-automation-2-dmld.onrender.com",
});


export const fetchEmails = (params = {}) =>
  API.get("/emails", { params });

export const fetchStats = () =>
  API.get("/stats");

export const fetchEmailById = (id) =>
  API.get(`/emails/${id}`);
