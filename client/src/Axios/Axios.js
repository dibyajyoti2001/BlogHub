import axios from "axios";
import config from "../config/config.js";

const Axios = axios.create({
  baseURL: config.serverUrl,
  withCredentials: true,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default Axios;
