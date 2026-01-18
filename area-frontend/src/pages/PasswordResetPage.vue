<template>
  <div class="bg-onboarding flex items-center justify-center p-4">
    <!-- Background decorative shapes -->
    <div class="bg-onboarding-shapes">
      <div class="onboarding-shape onboarding-shape-1"></div>
      <div class="onboarding-shape onboarding-shape-2"></div>
    </div>
    
    <div class="card-area-elevated p-8 w-full max-w-md relative z-10 shadow-premium animate-fade-in-up">
      
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-4 shadow-primary">
          <Key :size="32" color="white" />
        </div>
        <h1 class="text-3xl font-bold text-surface-900 mb-2">Reset Password</h1>
        <p class="text-surface-500">Enter your new password</p>
      </div>

      <!-- Success Message -->
      <div v-if="passwordReset" class="p-4 bg-green-50 border border-green-100 rounded-xl mb-6 animate-scale-in">
        <div class="flex items-center">
          <CheckCircle class="w-5 h-5 text-green-500 mr-3" />
          <div>
            <p class="text-sm text-green-700 font-medium">Password Reset Successful!</p>
            <p class="text-sm text-green-600 mt-1">
              Your password has been updated successfully. You can now login with your new password.
            </p>
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="goToLogin"
            class="btn-area-primary w-full bg-green-600 hover:bg-green-700"
          >
            Go to Login
          </button>
        </div>
      </div>

      <!-- Reset Form -->
      <form v-if="!passwordReset" @submit.prevent="handleSubmit" class="space-y-6">
        
        <!-- New Password Field -->
        <div>
          <label for="newPassword" class="label">
            New Password
          </label>
          <div class="relative">
            <Lock class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              id="newPassword"
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              @input="clearFieldError('newPassword')"
              :class="[
                'input-area pl-12 pr-12',
                errors.newPassword && 'input-area-error'
              ]"
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-primary-600 transition-colors"
            >
              <Eye v-if="!showNewPassword" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>
          <p v-if="errors.newPassword" class="mt-2 text-sm text-red-500">
            {{ errors.newPassword }}
          </p>
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label for="confirmPassword" class="label">
            Confirm New Password
          </label>
          <div class="relative">
            <Lock class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              @input="clearFieldError('confirmPassword')"
              :class="[
                'input-area pl-12 pr-12',
                errors.confirmPassword && 'input-area-error'
              ]"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-primary-600 transition-colors"
            >
              <Eye v-if="!showConfirmPassword" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-500">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- General Error -->
        <div v-if="errors.general" class="p-4 bg-red-50 border border-red-100 rounded-xl">
          <p class="text-sm text-red-600">{{ errors.general }}</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="btn-area-primary w-full"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating Password...
          </span>
          <span v-else>Update Password</span>
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Key, Lock, Eye, EyeOff, CheckCircle } from 'lucide-vue-next';
import { authAPI } from '@/services/api';

// Router
const route = useRoute();
const router = useRouter();

// Reactive state
const newPassword = ref('');
const confirmPassword = ref('');
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const errors = ref({});
const isLoading = ref(false);
const passwordReset = ref(false);
const uid = ref('');
const resetToken = ref('');

/**
 * Validate password
 */
const validatePassword = () => {
  const validationErrors = {};

  // New password validation
  if (!newPassword.value) {
    validationErrors.newPassword = 'New password is required';
  } else if (newPassword.value.length < 8) {
    validationErrors.newPassword = 'Password must be at least 8 characters long';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(newPassword.value)) {
    validationErrors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
  }

  // Confirm password validation
  if (!confirmPassword.value) {
    validationErrors.confirmPassword = 'Please confirm your password';
  } else if (newPassword.value !== confirmPassword.value) {
    validationErrors.confirmPassword = 'Passwords do not match';
  }

  return validationErrors;
};

/**
 * Clear field error
 */
const clearFieldError = (fieldName) => {
  if (errors.value[fieldName]) {
    delete errors.value[fieldName];
  }
};

/**
 * Send password reset request to backend
 */
const resetUserPassword = async (uidb64, token, password) => {
  try {
    const data = await authAPI.resetPassword(uidb64, token, password);

    return { success: true, data };
  } catch (err) {
    console.error('Password reset error:', err);
    throw new Error(err.message || 'Network error occurred');
  }
};

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  // Clear previous errors
  errors.value = {};
  
  // Validate passwords
  const validationErrors = validatePassword();
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors;
    return;
  }

  try {
    isLoading.value = true;
    
    // Send reset request to backend
    await resetUserPassword(uid.value, resetToken.value, newPassword.value);
    
    // Show success message
    passwordReset.value = true;
    
  } catch (err) {
    errors.value.general = err.message || 'Failed to reset password. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

/**
 * Navigate to login page
 */
const goToLogin = () => {
  router.push('/login');
};

/**
 * Get reset token from URL parameters
 */
onMounted(() => {
  // Get uid and token from URL parameters (e.g., /reset-password/:uid/:token)
  uid.value = route.params.uid || '';
  resetToken.value = route.params.token || '';
  
  if (!uid.value || !resetToken.value) {
    // If no uid or token, show error
    console.error('No reset uid or token provided');
    errors.value.general = 'Invalid or missing reset parameters. Please request a new password reset.';
  }
});
</script>

<style scoped>
/* Tailwind CSS handles all styling */
</style>