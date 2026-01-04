import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
  },
  actions: {
    async login(credentials) {
        try {
            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.post('/api/login', credentials);

            this.token = response.data.token;
            this.user = response.data.user;
            localStorage.setItem('token', this.token);

            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

            return response;
        } catch (error) {
            console.error('Login error:', error.response?.data || error);
            throw error;
        }
    },
    async logout() {
        try {
            await axios.post('/api/logout');
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } catch (error) {
            console.error('Logout failed:', error);
        }
    },
  },
});