import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export function registerUser(payload) {
  return api.post("/register", payload);
}

export function loginUser(payload) {
  return api.post("/login", payload);
}

export function addExpense(payload, token) {
  return api.post("/expense", payload, {
    headers: {
      authorization: token
    }
  });
}

export function getExpenses(token) {
  return api.get("/expenses", {
    headers: {
      authorization: token
    }
  });
}
