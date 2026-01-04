<!-- src/views/DashboardHome.vue -->
<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-xl text-gray-600">Loading profile...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
      <p class="font-bold">Error</p>
      <p>{{ error }}</p>
    </div>

    <!-- Success: Profile Data -->
    <div v-else-if="profile" class="space-y-8">
      <h1 class="text-4xl font-bold text-gray-800">
        Welcome back, {{ profile.user.name }}!
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Profile Card -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-indigo-600 mb-4">Total Balance [ $ ]</h2>
          <ul class="space-y-3 text-gray-700">
            <li><strong>{{ profile.user.balance }} USD</strong></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const profile = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchProfile = async () => {
  try {
    const response = await axios.get('/api/profile');
    profile.value = response.data; // assuming your ProfileService returns an array/object with user data
  } catch (err) {
    console.error('Failed to fetch profile:', err);
    
    if (err.response?.status === 401) {
      // Token expired or invalid → force logout
      await authStore.logout();
      error.value = 'Session expired. Please log in again.';
    } else {
      error.value = err.response?.data?.message || 'Failed to load profile';
    }
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

onMounted(() => {
  fetchProfile();
});
</script>