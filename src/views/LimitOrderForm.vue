<!-- src/views/LimitOrderForm.vue -->
<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Place Limit Order</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Symbol -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Symbol</label>
          <select
            v-model="form.symbol"
            :disabled="isSubmitting"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="" disabled>Select a symbol</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>
        </div>

        <!-- Side -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Side</label>
          <select
            v-model="form.side"
            :disabled="isSubmitting"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="" disabled>Select side</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <!-- Price -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
          <input
            v-model.number="form.price"
            type="number"
            step="0.00000001"
            min="0.00000001"
            placeholder="e.g., 1000.50"
            :disabled="isSubmitting"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <!-- Amount -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input
            v-model.number="form.amount"
            type="number"
            step="0.00000001"
            min="0.00000001"
            placeholder="e.g., 0.5"
            :disabled="isSubmitting"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <button
            type="submit"
            :disabled="isSubmitting || !isFormValid"
            class="w-full py-4 rounded-lg text-white font-semibold text-lg transition-all duration-200
                   bg-indigo-600 hover:bg-indigo-700
                   disabled:bg-gray-400 disabled:cursor-not-allowed
                   cursor-pointer flex items-center justify-center"
          >
            <span v-if="isSubmitting">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Placing Order...
            </span>
            <span v-else>Place Order</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Toast Notifications -->
    <div
      v-if="toast.message"
      class="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-lg shadow-2xl text-white font-medium text-lg z-50 transition-all duration-300"
      :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
  symbol: '',
  side: '',
  price: null,
  amount: null,
});

const isSubmitting = ref(false);
const toast = ref({ message: '', type: '' }); // success or error

// Check if all required fields are filled and valid
const isFormValid = computed(() => {
  return (
    form.value.symbol &&
    form.value.side &&
    form.value.price > 0 &&
    form.value.amount > 0
  );
});

// Show toast message
const showToast = (message, type = 'success') => {
  toast.value = { message, type };
  setTimeout(() => {
    toast.value = { message: '', type: '' };
  }, 4000);
};

// Handle form submission
const handleSubmit = async () => {
  if (!isFormValid.value) return;

  isSubmitting.value = true;

  try {
    await axios.post('/api/orders', {
      symbol: form.value.symbol,
      side: form.value.side,
      price: form.value.price,
      amount: form.value.amount,
    });

    // Success
    showToast('Order placed successfully!', 'success');

    // Reset form
    form.value = {
      symbol: '',
      side: '',
      price: null,
      amount: null,
    };

    // Optional: redirect to My Orders after 2 seconds
    setTimeout(() => {
      router.push('/my-orders');
    }, 2000);
  } catch (error) {
    console.error('Failed to place order:', error);
    const msg = error.response?.data?.message || 'Failed to place order. Please try again.';
    showToast(msg, 'error');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Optional: Add smooth entrance for toast */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) translateX(-50%);
}
</style>