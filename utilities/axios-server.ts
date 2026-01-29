import axios from "axios";

/**
 * axios instance for server components
 */
const axiosServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export { axiosServer };
