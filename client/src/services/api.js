import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  registerPatient: (data) => api.post('/auth/register-patient', data),
  registerPsychologist: (data) => api.post('/auth/register-psychologist', data),
  // Register with file upload (FormData)
  registerPatientWithFile: (formData) =>
    api.post('/auth/register-patient', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  registerPsychologistWithFile: (formData) =>
    api.post('/auth/register-psychologist', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  login: (data) => api.post('/auth/login', data),
  requestPasswordReset: (data) => api.post('/auth/request-password-reset', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Psychologist endpoints
export const psychologistAPI = {
  getAllPsychologists: (params) => api.get('/psychologists', { params }),
  getPsychologistById: (id) => api.get(`/psychologists/${id}`),
  updateProfile: (id, data) => api.put(`/psychologists/${id}`, data),
  uploadLicense: (id, file) => {
    const formData = new FormData();
    formData.append('license', file);
    return api.post(`/psychologists/${id}/upload-license`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  setAvailability: (id, data) => api.post(`/psychologists/${id}/availability`, data),
  getMyBookings: (id) => api.get(`/psychologists/${id}/bookings`),
  updateBookingStatus: (id, appointmentId, data) =>
    api.put(`/psychologists/${id}/bookings/${appointmentId}/status`, data),
};

// Appointment endpoints
export const appointmentAPI = {
  createAppointment: (data) => api.post('/appointments', data),
  getPatientAppointments: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getPsychologistAppointments: (psychologistId) =>
    api.get(`/appointments/psychologist/${psychologistId}`),
  updateAppointmentStatus: (id, data) => api.put(`/appointments/${id}/status`, data),
  cancelAppointment: (id) => api.put(`/appointments/${id}/cancel`),
};

// Payment endpoints
export const paymentAPI = {
  createPaymentOrder: (data) => api.post('/payment/create-order', data),
  verifyPayment: (data) => api.post('/payment/verify', data),
  getPaymentDetails: (appointmentId) => api.get(`/payment/${appointmentId}`),
};

// Profile endpoints
export const profileAPI = {
  getPatientProfile: () => api.get('/profile/patient'),
  updatePatientProfile: (data) => api.put('/profile/patient', data),
  uploadPatientProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return api.post('/profile/patient/upload-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getPsychologistProfile: () => api.get('/profile/psychologist'),
  updatePsychologistProfile: (data) => api.put('/profile/psychologist', data),
  uploadPsychologistProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return api.post('/profile/psychologist/upload-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Admin endpoints
export const adminAPI = {
  getPatients: () => api.get('/admin/patients'),
  createPatient: (data) => api.post('/admin/patients', data),
  updatePatient: (id, data) => api.put(`/admin/patients/${id}`, data),
  uploadPatientProfilePicture: (id, file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return api.post(`/admin/patients/${id}/upload-picture`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deletePatient: (id) => api.delete(`/admin/patients/${id}`),
  getPsychologists: () => api.get('/admin/psychologists'),
  createPsychologist: (data) => api.post('/admin/psychologists', data),
  updatePsychologist: (id, data) => api.put(`/admin/psychologists/${id}`, data),
  uploadPsychologistProfilePicture: (id, file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return api.post(`/admin/psychologists/${id}/upload-picture`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deletePsychologist: (id) => api.delete(`/admin/psychologists/${id}`),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
};

// Public endpoints
export const publicAPI = {
  sendContact: (data) => api.post('/public/contact', data),
  getSettings: () => api.get('/public/settings'),
};

export default api;
