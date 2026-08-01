import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_BASE}/api`,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const uploadImage = async (file, scope = 'general') => {
    const formData = new FormData();
    formData.append('scope', scope);
    formData.append('image', file);

    const response = await api.post(`/uploads/image?scope=${encodeURIComponent(scope)}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export default api;