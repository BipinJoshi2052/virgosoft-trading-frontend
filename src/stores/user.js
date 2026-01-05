import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userId = ref(null) // Will be set after login
  const balance = ref(0)
  const assets = ref([]) // [{ symbol, amount, ... }]
  const orders = ref([]) // Full list of user's orders

  function setUserId(id) {
    userId.value = id
  }

  function updateFromTrade(payload) {
    // payload comes from OrderMatched event
    const isBuyer = payload.buyOrder.user_id === userId.value
    const role = isBuyer ? 'buyer' : 'seller'
    const updates = payload.updatedData[role]

    if (updates) {
      balance.value = updates.balance
      assets.value = updates.assets
      orders.value = updates.orders
    }
  }

  function updateOrdersOnly(newOrders) {
    orders.value = newOrders
  }

  function updateBalanceAndAssets(newBalance, newAssets) {
    balance.value = newBalance
    assets.value = newAssets
  }

  return {
    userId,
    balance,
    assets,
    orders,
    setUserId,
    updateFromTrade,
    updateOrdersOnly,
    updateBalanceAndAssets,
  }
})