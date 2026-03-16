import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import type { AuthResponse } from '../types/auth'
import type { IncidentReport } from '../types/incidentReport'
import type { IncidentType } from '../types/incidentType'
import type { User } from '../types/user'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attaches auth token and handles FormData
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

function createCrudApi<T>(endpoint: string) {
  return {
    get: (params?: Record<string, string | number | string[]>) =>
      apiClient.get<T[]>(endpoint, { params }).then((res) => res.data),
    getOne: (uid: string) =>
      apiClient.get<T>(`${endpoint}/${uid}`).then((res) => res.data),
    create: (data: Partial<T>) =>
      apiClient.post<T>(endpoint, data).then((res) => res.data),
    updateOne: (uid: string, data: Partial<T>) =>
      apiClient.put<T>(`${endpoint}/${uid}`, data).then((res) => res.data),
    deleteOne: (uid: string) =>
      apiClient.delete<T>(`${endpoint}/${uid}`).then((res) => res.data),
  }
}

const usersApi = {
  ...createCrudApi<User>('users'),
  uploadPhoto: (uid: string, formData: FormData) =>
    apiClient.put<User>(`users/${uid}/photo`, formData).then((res) => res.data),
  deletePhoto: (uid: string) =>
    apiClient.delete<User>(`users/${uid}/photo`).then((res) => res.data),
}

const incidentTypesApi = createCrudApi<IncidentType>('incident-types')
const incidentReportsApi = createCrudApi<IncidentReport>('incident-reports')

const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('auth/login', data).then((res) => res.data),
  signup: (data: { email: string; password: string; name: string }) =>
    apiClient.post<AuthResponse>('auth/signup', data).then((res) => res.data),
  logout: () =>
    apiClient.post('auth/logout').then((res) => res.data),
  loginGoogle: () =>
    apiClient.get('auth/google/login').then((res) => res.data),
  requestPasswordReset: (data: { email: string }) =>
    apiClient.post('auth/request-password-reset', data).then((res) => res.data),
  resetPassword: (data: { token: string; new_password: string }) =>
    apiClient.post('auth/reset-password', data).then((res) => res.data),
}

const api = {
  users: usersApi,
  incidentTypes: incidentTypesApi,
  incidentReports: incidentReportsApi,
  auth: authApi,
}

export { apiClient, usersApi, incidentTypesApi, incidentReportsApi, authApi }
export default api
