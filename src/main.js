import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Import Toastification
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

import './index.css';
import echo from './plugins/echo';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const pinia = createPinia();
const app = createApp(App);

// Install Toastification with options
const toastOptions = {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  transition: "Vue-Toastification__bounce",
}

app.use(Toast, toastOptions)

app.config.globalProperties.$echo = echo;
app.use(pinia);
app.use(router);
app.mount('#app');