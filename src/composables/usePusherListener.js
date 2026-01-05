import { onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'
import echo from '../plugins/echo'
import { useToast } from 'vue-toastification'

export function usePusherListener() {
  const store = useUserStore()
  const toast = useToast()

  let channel = null

  onMounted(() => {
    if (!store.userId) {
      console.warn('User ID not set. Cannot listen to private channel.')
      return
    }

    channel = echo.private(`user.${store.userId}`)

    channel.listen('.order.matched', (data) => {
      console.log('Order matched received:', data)

      // Update store
      store.updateFromTrade(data)

      // Show toast notification
      const amount = parseFloat(data.buyOrder.amount).toFixed(8)
      const symbol = data.buyOrder.symbol
      const price = parseFloat(data.buyOrder.price).toFixed(2)

      const action = data.buyOrder.user_id === store.userId ? 'bought' : 'sold'

      toast.success(
        `Trade Executed! You ${action} ${amount} ${symbol} @ $${price}`,
        {
          timeout: 6000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          draggable: true,
        }
      )
    })
  })

  onUnmounted(() => {
    if (channel) {
      channel.stopListening('.order.matched')
      echo.leave(`user.${store.userId}`)
    }
  })
}