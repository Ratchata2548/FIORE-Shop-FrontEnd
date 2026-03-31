import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000", // เปลี่ยนตาม port Express ของคุณ
  withCredentials: true
})

export default api