<template>
  <div class="p-8 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Pending Match Orders</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading matches...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="matches.length === 0" class="text-center py-12">
      <p class="text-gray-600">No pending matches found.</p>
    </div>

    <!-- Matches Table -->
    <div v-else class="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">#</th>
            <th class="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Symbol</th>
            <th class="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Buy Price (USD)</th>
            <th class="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sell Price (USD)</th>
            <th class="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
            <th class="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">USD Volume</th>
            <th class="py-3 px-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(match, index) in matches" :key="`${match.buy_order_id}-${match.sell_order_id}`" class="border-b hover:bg-gray-50 transition">
            <td class="py-4 px-4 text-sm">{{ index + 1 }}</td>
            <td class="py-4 px-4 text-sm font-semibold text-indigo-600">{{ match.symbol }}</td>
            <td class="py-4 px-4 text-sm">${{ parseFloat(match.buy_order_price).toFixed(2) }}</td>
            <td class="py-4 px-4 text-sm">${{ parseFloat(match.sell_order_price).toFixed(2) }}</td>
            <td class="py-4 px-4 text-sm">{{ parseFloat(match.amount).toFixed(8) }}</td>
            <td class="py-4 px-4 text-sm font-medium">${{ parseFloat(match.usd_volume).toFixed(2) }}</td>
            <td class="py-4 px-4 text-center">
              <button
                @click="openConfirmDialog(match, index)"
                class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
              >
                Execute
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirmation Dialog -->
    <teleport to="body">
      <div v-if="confirmDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Confirm Trade Execution</h2>

          <div class="text-left space-y-4 text-gray-700">
            <p>
              Buyer placed a <strong>BUY</strong> order for
              <strong>{{ amount.toFixed(8) }} {{ selectedMatch.symbol }}</strong>
              @ <strong>${{ executionPrice.toFixed(2) }}</strong> USD<br />
              <strong class="text-lg">Total: ${{ usdTotal.toFixed(2) }} USD</strong>
            </p>

            <p>
              Seller placed a <strong>SELL</strong> order for
              <strong>{{ amount.toFixed(8) }} {{ selectedMatch.symbol }}</strong>
            </p>

            <hr class="my-4 border-gray-300" />

            <p>📤 {{ amount.toFixed(8) }} {{ selectedMatch.symbol }} will be deducted from seller and transferred to buyer</p>

            <p>📥 ${{ usdTotal.toFixed(2) }} USD will be deducted from buyer and transferred to seller</p>

            <p>
              💸 ${{ commission.toFixed(2) }} USD will be deducted from seller as trading commission ({{ commissionPercent }}%)
            </p>

            <p class="font-bold text-lg">
              Seller Net Amount: ${{ sellerNet.toFixed(2) }} USD
            </p>

            <p class="mt-6 text-red-600 font-semibold">
              ⚠️ This action is irreversible. Please confirm to execute the trade.
            </p>
          </div>

          <div class="flex justify-end gap-4 mt-8">
            <button
              @click="confirmDialog = null"
              class="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              @click="executeMatch"
              :disabled="executing"
              class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition disabled:opacity-70"
            >
              {{ executing ? 'Executing...' : 'Confirm & Execute' }}
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const matches = ref([])
const commissionPercent = ref(0)
const loading = ref(true)
const error = ref('')
const confirmDialog = ref(null) // { match, index }
const executing = ref(false)

onMounted(() => {
  fetchMatches()
})

const fetchMatches = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/match-orders')
    if (response.data.success) {
      matches.value = response.data.data
      commissionPercent.value = response.data.commissionPercent
    } else {
      error.value = 'Failed to load matches'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Error fetching matches'
  } finally {
    loading.value = false
  }
}

const selectedMatch = computed(() => confirmDialog.value?.match || {})
const amount = computed(() => parseFloat(selectedMatch.value.amount || 0))
const executionPrice = computed(() => parseFloat(selectedMatch.value.execution_price || 0))
const usdTotal = computed(() => amount.value * executionPrice.value)
const commission = computed(() => (usdTotal.value * commissionPercent.value) / 100)
const sellerNet = computed(() => usdTotal.value - commission.value)

const openConfirmDialog = (match, index) => {
  confirmDialog.value = { match, index }
}

const executeMatch = async () => {
  if (!confirmDialog.value) return

  const { match, index } = confirmDialog.value
  executing.value = true

  try {
    const response = await axios.post(`/api/match-orders/${match.buy_order_id}/${match.sell_order_id}`)

    if (response.data.success) {
      // Remove the executed match from the list
      matches.value.splice(index, 1)
      alert('Trade executed successfully!')
    } else {
      alert(response.data.message || 'Failed to execute trade')
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Error executing trade')
  } finally {
    executing.value = false
    confirmDialog.value = null
  }
}
</script>

<style scoped>
/* Optional: Add subtle animations */
tr {
  transition: background-color 0.2s;
}
</style>