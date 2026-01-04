<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            :disabled="isLoggingIn"
          />
        </div>

        <div class="mb-6">
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            :disabled="isLoggingIn"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoggingIn"
          class="w-full py-3 rounded-lg text-white font-medium transition-all duration-200 
                 bg-indigo-600 hover:bg-indigo-700 
                 disabled:bg-indigo-400 disabled:cursor-not-allowed
                 cursor-pointer"
        >
          {{ isLoggingIn ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p v-if="errorMessage" class="mt-4 text-center text-red-600">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  email: '',
  password: '',
});

const isLoggingIn = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  isLoggingIn.value = true;
  errorMessage.value = '';

  try {
    await authStore.login(form.value);
    router.push('/');
  } catch (error) {
    console.error('Login failed:', error);
    errorMessage.value = 'Login failed. Please check your email and password.';
  } finally {
    isLoggingIn.value = false;
  }
};
</script>

<style scoped>
button:disabled {
  opacity: 0.8;
}
</style>