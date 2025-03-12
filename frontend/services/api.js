import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' }); // Update with your backend URL

export const fetchModules = () => API.get('/modules');
export const fetchQuiz = (moduleId) => API.get(`/quizzes/${moduleId}`);
export const submitQuiz = (quizId, answers) => API.post(`/quizzes/${quizId}/submit`, answers);
export const fetchProgress = (userId) => API.get(`/users/${userId}/progress`);
export const fetchAdminReports = () => API.get('/admin/reports');
