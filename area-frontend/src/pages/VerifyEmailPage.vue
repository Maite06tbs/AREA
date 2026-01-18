<template>
  <div class="bg-onboarding flex items-center justify-center p-4">
    <!-- Background decorative shapes -->
    <div class="bg-onboarding-shapes">
      <div class="onboarding-shape onboarding-shape-1"></div>
      <div class="onboarding-shape onboarding-shape-2"></div>
    </div>
    
    <div class="card-area-elevated p-8 w-full max-w-md text-center relative z-10 shadow-premium animate-fade-in-up">
      
      <!-- Loading State -->
      <div v-if="isLoading">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4 animate-pulse">
          <Mail :size="32" class="text-primary-600" />
        </div>
        <h2 class="text-2xl font-bold text-surface-900 mb-2">Verifying Email...</h2>
        <p class="text-surface-500">Please wait while we verify your account.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="isSuccess" class="animate-scale-in">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
          <CheckCircle :size="32" class="text-green-600" />
        </div>
        <h2 class="text-2xl font-bold text-surface-900 mb-2">Email Verified!</h2>
        <p class="text-surface-500 mb-6">
          Your account has been successfully activated. You can now log in.
        </p>
        <router-link 
          to="/login" 
          class="btn-area-primary w-full inline-block"
        >
          Go to Login
        </router-link>
      </div>

      <!-- Error State -->
      <div v-else>
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
          <XCircle :size="32" class="text-red-600" />
        </div>
        <h2 class="text-2xl font-bold text-surface-900 mb-2">Verification Failed</h2>
        <p class="text-surface-500 mb-6">
          {{ errorMessage || 'The verification link is invalid or has expired.' }}
        </p>
        <router-link 
          to="/login" 
          class="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
        >
          Back to Login
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Mail, CheckCircle, XCircle } from 'lucide-vue-next';
import { authAPI } from '@/services/api';

const route = useRoute();
const isLoading = ref(true);
const isSuccess = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  const token = route.params.token;
  
  if (!token) {
    isLoading.value = false;
    errorMessage.value = 'No verification token provided.';
    return;
  }

  try {
    await authAPI.verifyEmail(token);
    isSuccess.value = true;
  } catch (error) {
    console.error('Verification error:', error);
    errorMessage.value = error.message || 'Verification failed.';
  } finally {
    isLoading.value = false;
  }
});
</script>
