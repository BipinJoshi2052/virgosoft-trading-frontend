<!-- src/views/Wallet.vue -->
<template>
  <div class="space-y-8">
    <!-- Total Balance Card -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-xl text-gray-600">Loading wallet...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
      <p class="font-bold">Error</p>
      <p>{{ error }}</p>
    </div>

    <div v-else>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-indigo-600 mb-4">Total Balance [ $ ]</h2>
          <ul class="space-y-3 text-gray-700">
            <li><strong>{{ profile.user.balance }} USD</strong></li>
          </ul>
        </div>
      </div>

      <!-- Assets Table -->
      <div class="mt-10 bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b">
          <h3 class="text-xl font-semibold text-gray-800">Assets List</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Locked
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="asset in profile.assets" :key="asset.symbol" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-lg font-bold text-gray-900">{{ asset.symbol }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ Number(asset.amount).toFixed(8) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ Number(asset.locked_amount).toFixed(8) }}
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-if="profile.assets.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                  No assets found.
                </td>
              </tr>
            </tbody>
          </table>
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

const profile = ref({ user: {}, assets: [] });
const loading = ref(true);
const error = ref(null);

const fetchProfile = async () => {
  try {
    const response = await axios.get('/api/profile');
    profile.value = response.data; // { user: {...}, assets: [...] }
  } catch (err) {
    console.error('Failed to fetch wallet data:', err);

    if (err.response?.status === 401) {
      await authStore.logout();
      error.value = 'Session expired. Redirecting to login...';
    } else {
      error.value = err.response?.data?.message || 'Failed to load wallet data';
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProfile();
});
</script>