import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:4000",
});


export const fetchEmails = (params = {}) =>
  API.get("/emails", { params });

export const fetchStats = () =>
  API.get("/stats");

export const fetchEmailById = (id) =>
  API.get(`/emails/${id}`);
