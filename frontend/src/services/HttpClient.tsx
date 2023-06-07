import axios from "axios";

const serverIP = import.meta.env.VITE_API_HOST;
const serverPort = import.meta.env.VITE_PORT;

const serverUrl = `http://${serverIP}:${serverPort}`;

export const httpClient = axios.create({
  baseURL: serverUrl,
});
