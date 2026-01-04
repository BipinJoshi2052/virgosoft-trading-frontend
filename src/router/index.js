import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Layouts
import DashboardLayout from '../views/layouts/DashboardLayout.vue';

// Views
import MyOrders from '../views/MyOrders.vue';
import LimitOrderForm from '../views/LimitOrderForm.vue';
import MatchOrders from '../views/MatchOrders.vue';
import Dashboard from '../views/Dashboard.vue';
import MyWallet from '../views/MyWallet.vue';
import OrderBook from '../views/OrderBook.vue';

// Lazy-load components
const Login = () => import('../views/Login.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard,
        },
        {
          path: 'my-wallet',
          name: 'my-wallet',
          component: MyWallet,
        },
        {
          path: 'my-orders',
          name: 'my-orders',
          component: MyOrders,
        },
        {
          path: 'limit-order',
          name: 'limit-order',
          component: LimitOrderForm,
        },
        {
          path: 'match-orders',
          name: 'match-orders',
          component: MatchOrders,
        },
        {
          path: 'order-book/:symbol',
          name: 'order-book',
          component: () => OrderBook,
          props: true,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;