<!-- src/views/OrderBook.vue -->
<template>
  <div class="space-y-10">
    <h1 class="text-4xl font-bold text-gray-800 text-center mb-8">
      Order Book - {{ symbol }}
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Buy Orders (Bids) -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="px-6 py-4 bg-green-600 text-white">
          <h2 class="text-2xl font-semibold">Buy Orders</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-green-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Price ($)</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total ($)</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in buyOrders" :key="order.id" class="hover:bg-green-50">
                <td class="px-6 py-4 text-sm font-medium text-green-700">${{ Number(order.price).toFixed(2) }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ Number(order.amount).toFixed(8) }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  ${{ (Number(order.price) * Number(order.amount)).toFixed(2) }}
                </td>
              </tr>
              <tr v-if="buyOrders.length === 0">
                <td colspan="3" class="px-6 py-12 text-center text-gray-500">No buy orders</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Sell Orders (Asks) -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="px-6 py-4 bg-red-600 text-white">
          <h2 class="text-2xl font-semibold">Sell Orders</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-red-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Price ($)</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total ($)</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in sellOrders" :key="order.id" class="hover:bg-red-50">
                <td class="px-6 py-4 text-sm font-medium text-red-700">${{ Number(order.price).toFixed(2) }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ Number(order.amount).toFixed(8) }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  ${{ (Number(order.price) * Number(order.amount)).toFixed(2) }}
                </td>
              </tr>
              <tr v-if="sellOrders.length === 0">
                <td colspan="3" class="px-6 py-12 text-center text-gray-500">No sell orders</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Loading / Error -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-xl text-gray-600">Loading order book...</p>
    </div>
    <div v-if="error" class="text-center py-10 text-red-600">
      <p class="text-xl">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const symbol = computed(() => route.params.symbol.toUpperCase());

const orders = ref([]);
const loading = ref(true);
const error = ref(null);

const buyOrders = computed(() => {
  return orders.value
    .filter(o => o.side === 'buy' && o.status === 1) // only open orders
    .sort((a, b) => Number(b.price) - Number(a.price)); // highest bid first
});

const sellOrders = computed(() => {
  return orders.value
    .filter(o => o.side === 'sell' && o.status === 1) // only open orders
    .sort((a, b) => Number(a.price) - Number(b.price)); // lowest ask first
});

const fetchOrders = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('/api/orders', {
      params: { symbol: symbol.value },
    });
    orders.value = response.data.data;
  } catch (err) {
    console.error('Failed to load order book:', err);
    error.value = 'Failed to load order book data';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
});
</script>