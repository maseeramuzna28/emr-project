const BASE_URL = "http://127.0.0.1:8000";

export const api = {
  // Auth
  register: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  // Patients
  getPatients: async () => {
    const res = await fetch(`${BASE_URL}/patients/`);
    return res.json();
  },

  createPatient: async (data: object) => {
    const res = await fetch(`${BASE_URL}/patients/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Doctors
  getDoctors: async () => {
    const res = await fetch(`${BASE_URL}/doctors/`);
    return res.json();
  },

  // Appointments
  getAppointments: async () => {
    const res = await fetch(`${BASE_URL}/appointments/`);
    return res.json();
  },
};