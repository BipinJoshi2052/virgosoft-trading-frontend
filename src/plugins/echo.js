import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: '/api/broadcasting/auth',  // Your Laravel broadcast auth route
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,  // Assuming token-based auth
        },
    },
});

export default echo;