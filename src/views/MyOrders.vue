<!-- src/views/MyOrders.vue -->
<template>
  <div class="space-y-8">
    <!-- Loading / Error states unchanged -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-xl text-gray-600">Loading orders...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
      <p class="font-bold">Error</p>
      <p>{{ error }}</p>
    </div>

    <!-- Filters -->
    <div v-else class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-indigo-600 mb-4">Filter Orders</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Symbol as Select -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
          <select
            v-model="filters.symbol"
            class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Symbols</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>
        </div>

        <!-- Side -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Side</label>
          <select
            v-model="filters.side"
            class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="filters.status"
            class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="1">Open</option>
            <option value="2">Filled</option>
            <option value="3">Cancelled</option>
          </select>
        </div>
      </div>

      <div class="mt-6">
        <button
          @click="resetPageAndFetch"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Apply Filters
        </button>
      </div>
    </div>

    <!-- Table unchanged (same as before) -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 bg-gray-50 border-b">
        <h3 class="text-xl font-semibold text-gray-800">My Orders</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Side</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price ($)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(order, index) in orders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ (currentPage - 1) * perPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold">
                <router-link
                  :to="{ name: 'order-book', params: { symbol: order.symbol } }"
                  class="text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  {{ order.symbol }}
                </router-link>
              </td>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{{ order.symbol }}</td> -->
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="order.side === 'buy' ? 'text-green-600' : 'text-red-600'">{{ order.side.toUpperCase() }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ Number(order.price).toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ Number(order.amount).toFixed(8) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span :class="{
                  'text-blue-600': order.status === 1,
                  'text-green-600': order.status === 2,
                  'text-gray-600': order.status === 3
                }">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  v-if="order.status === 1"
                  @click="confirmCancel(order.id)"
                  class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </td>
            </tr>

            <tr v-if="orders.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-gray-500">No orders found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
        <button
          :disabled="!hasPrev"
          @click="changePage(currentPage - 1)"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span class="text-sm text-gray-700">
          Page {{ currentPage }} of {{ lastPage }}
        </span>

        <button
          :disabled="!hasNext"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const orders = ref([]);
const currentPage = ref(1);
const lastPage = ref(1);
const perPage = ref(10);
const loading = ref(true);
const error = ref(null);

const filters = ref({
  symbol: '',
  side: '',
  status: '',
});

const fetchOrders = async (page = 1) => {
  loading.value = true;
  error.value = null;

  try {
    const params = {
      page,
      symbol: filters.value.symbol || undefined,
      side: filters.value.side || undefined,
      status: filters.value.status || undefined,
    };

    const response = await axios.get('/api/orders', { params });

    orders.value = response.data.data;
    currentPage.value = response.data.current_page;
    lastPage.value = response.data.last_page;
    perPage.value = response.data.per_page;
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    if (err.response?.status === 401) {
      await authStore.logout();
    }
    error.value = err.response?.data?.message || 'Failed to load orders';
  } finally {
    loading.value = false;
  }
};

const resetPageAndFetch = () => {
  currentPage.value = 1;
  fetchOrders(1);
};

const changePage = (page) => {
  if (page >= 1 && page <= lastPage.value) {
    fetchOrders(page);
  }
};

const hasPrev = computed(() => currentPage.value > 1);
const hasNext = computed(() => currentPage.value < lastPage.value);

const getStatusLabel = (status) => {
  switch (status) {
    case 1: return 'Open';
    case 2: return 'Filled';
    default: return 'Cancelled';
  }
};

const confirmCancel = async (orderId) => {
  if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
    try {
      await axios.post(`/api/orders/${orderId}/cancel`);
      // Refresh current page
      fetchOrders(currentPage.value);
    } catch (err) {
      alert('Failed to cancel order: ' + (err.response?.data?.message || 'Unknown error'));
    }
  }
};

onMounted(() => {
  fetchOrders();
});
</script>