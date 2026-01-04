<!-- src/layouts/DashboardLayout.vue -->
<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar Menu (Global for all authenticated routes) -->
    <nav class="w-64 bg-white shadow-lg flex-shrink-0">
      <div class="p-6">
        <h2 class="text-2xl font-bold text-indigo-600">Trading App</h2>
      </div>
      <ul class="mt-4">
        <li>
          <router-link
            to="/"
            class="block px-6 py-3 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 font-medium"
            active-class="bg-indigo-100 text-indigo-600 border-l-4 border-indigo-600"
          >
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link
            to="/my-wallet"
            class="block px-6 py-3 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 font-medium"
            active-class="bg-indigo-100 text-indigo-600 border-l-4 border-indigo-600"
          >
            My Wallet
          </router-link>
        </li>
        <li>
          <router-link
            to="/my-orders"
            class="block px-6 py-3 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 font-medium"
            active-class="bg-indigo-100 text-indigo-600 border-l-4 border-indigo-600"
          >
            My Orders
          </router-link>
        </li>
        <li>
          <router-link
            to="/limit-order"
            class="block px-6 py-3 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 font-medium"
            active-class="bg-indigo-100 text-indigo-600 border-l-4 border-indigo-600"
          >
            Limit Order Form
          </router-link>
        </li>
        <li>
          <router-link
            to="/match-orders"
            class="block px-6 py-3 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 font-medium"
            active-class="bg-indigo-100 text-indigo-600 border-l-4 border-indigo-600"
          >
            Match Orders
          </router-link>
        </li>
        <li class="border-t border-gray-200 mt-8 pt-4">
          <button
            @click="handleLogout"
            class="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 font-medium"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>

    <!-- Main Content Area (Changes per route) -->
    <main class="flex-1 overflow-y-auto">
      <div class="p-8">
        <router-view /> <!-- This is where page-specific content goes -->
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>