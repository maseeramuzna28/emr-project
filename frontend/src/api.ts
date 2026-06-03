import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  register: async (email: string, password: string) => {
    const res = await apiClient.post("/auth/register", { email, password });
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await apiClient.post("/auth/login", { email, password });
    return res.data;
  },

  // Patients
  getPatients: async () => {
    const res = await apiClient.get("/patients/");
    return res.data;
  },

  createPatient: async (data: any) => {
    const res = await apiClient.post("/patients/", data);
    return res.data;
  },

  updatePatient: async (id: number, data: any) => {
    const res = await apiClient.put(`/patients/${id}`, data);
    return res.data;
  },

  deletePatient: async (id: number) => {
    const res = await apiClient.delete(`/patients/${id}`);
    return res.data;
  },

  // Doctors
  getDoctors: async () => {
    const res = await apiClient.get("/doctors/");
    return res.data;
  },

  createDoctor: async (data: any) => {
    const res = await apiClient.post("/doctors/", data);
    return res.data;
  },

  deleteDoctor: async (id: number) => {
    const res = await apiClient.delete(`/doctors/${id}`);
    return res.data;
  },

  // Appointments
  getAppointments: async () => {
    const res = await apiClient.get("/appointments/");
    return res.data;
  },

  createAppointment: async (data: any) => {
    const res = await apiClient.post("/appointments/", data);
    return res.data;
  },

  deleteAppointment: async (id: number) => {
    const res = await apiClient.delete(`/appointments/${id}`);
    return res.data;
  },

  updateAppointment: async (id: number, data: any) => {
    const res = await apiClient.put(`/appointments/${id}`, data);
    return res.data;
  },

  // AI Disease Detection
  detectDisease: async (symptoms: string) => {
    const res = await apiClient.post("/ai-detection/detect", { symptoms });
    return res.data;
  },

  // Emergency Contacts
  getEmergencyContacts: async () => {
    const res = await apiClient.get("/emergency/contacts");
    return res.data;
  },

  sendEmergencyAlert: async (data: { senderName: string; phone: string; message: string; isCritical?: boolean }) => {
    const res = await apiClient.post("/emergency/alerts", data);
    return res.data;
  },

  // Medical Records CRUD
  getMedicalRecords: async () => {
    const res = await apiClient.get("/medical-records/");
    return res.data;
  },

  createMedicalRecord: async (data: any) => {
    const res = await apiClient.post("/medical-records/", data);
    return res.data;
  },

  updateMedicalRecord: async (id: number, data: any) => {
    const res = await apiClient.put(`/medical-records/${id}`, data);
    return res.data;
  },

  deleteMedicalRecord: async (id: number) => {
    const res = await apiClient.delete(`/medical-records/${id}`);
    return res.data;
  },

  // Billing CRUD
  getBillingRecords: async () => {
    const res = await apiClient.get("/billing/");
    return res.data;
  },

  createBillingRecord: async (data: any) => {
    const res = await apiClient.post("/billing/", data);
    return res.data;
  },

  updateBillingRecord: async (id: number, data: any) => {
    const res = await apiClient.put(`/billing/${id}`, data);
    return res.data;
  },

  deleteBillingRecord: async (id: number) => {
    const res = await apiClient.delete(`/billing/${id}`);
    return res.data;
  },

  // Analytics
  getAnalytics: async () => {
    const res = await apiClient.get("/analytics/");
    return res.data;
  },
};