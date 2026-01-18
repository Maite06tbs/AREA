<template>
  <div class="bg-onboarding flex items-center justify-center p-4">
    <!-- Back to Home Button -->
    <router-link to="/" class="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-white/50 dark:hover:bg-surface-800/50 backdrop-blur-sm">
      <ArrowLeft :size="20" />
      <span class="font-medium">Back to Home</span>
    </router-link>
    
    <!-- Background decorative shapes -->
    <div class="bg-onboarding-shapes">
      <div class="onboarding-shape onboarding-shape-1"></div>
      <div class="onboarding-shape onboarding-shape-2"></div>
      <div class="onboarding-shape onboarding-shape-3"></div>
    </div>
    
    <div class="card-area-elevated p-8 w-full max-w-md relative z-10 animate-fade-in-up shadow-premium">
      
      <!-- Logo et titre -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-primary mb-4">
          <Workflow :size="32" class="text-white" />
        </div>
        <h1 class="text-3xl font-bold text-surface-900 dark:text-white mb-2">Create Account</h1>
        <p class="text-surface-500 dark:text-surface-400">Join AREA to automate your workflow</p>
      </div>

      <!-- Success Message -->
      <div v-if="isSuccess" class="text-center animate-scale-in">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle :size="32" class="text-green-600" />
        </div>
        <h2 class="text-2xl font-bold text-surface-900 mb-2">Registration Successful!</h2>
        <p class="text-surface-500 mb-6">
          We've sent a verification email to <strong class="text-surface-700">{{ email }}</strong>.<br>
          Please check your inbox and click the link to activate your account.
        </p>
        <router-link 
          to="/login" 
          class="btn-area-primary w-full block text-center"
        >
          Go to Login
        </router-link>
      </div>

      <!-- Formulaire d'inscription -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">

        <!-- First Name Field -->
        <div>
          <label for="firstName" class="label">
            First Name
          </label>
          <div class="relative">
            <User class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              id="firstName"
              v-model="firstName"
              type="text"
              @input="clearFieldError('firstName')"
              :class="[
                'input-area pl-12',
                errors.firstName && 'input-area-error'
              ]"
              placeholder="John"
            />
          </div>
          <p v-if="errors.firstName" class="mt-2 text-sm text-red-500">
            {{ errors.firstName }}
          </p>
        </div>

        <!-- Last Name Field -->
        <div>
          <label for="lastName" class="label">
            Last Name
          </label>
          <div class="relative">
            <User class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              id="lastName"
              v-model="lastName"
              type="text"
              @input="clearFieldError('lastName')"
              :class="[
                'input-area pl-12',
                errors.lastName && 'input-area-error'
              ]"
              placeholder="Doe"
            />
          </div>
          <p v-if="errors.lastName" class="mt-2 text-sm text-red-500">
            {{ errors.lastName }}
          </p>
        </div>

        <!-- Email Field -->
        <div>
          <label for="email" class="label">
            Email
          </label>
          <div class="relative">
            <Mail class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              id="email"
              v-model="email"
              type="email"
              @input="clearFieldError('email')"
              :class="[
                'input-area pl-12',
                errors.email && 'input-area-error'
              ]"
              placeholder="you@example.com"
            />
          </div>
          <p v-if="errors.email" class="mt-2 text-sm text-red-500">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="label">
            Password
          </label>
          <div class="relative">
            <Lock class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              @input="clearFieldError('password')"
              :class="[
                'input-area pl-12 pr-12',
                errors.password && 'input-area-error'
              ]"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-primary-600 transition-colors"
            >
              <Eye v-if="!showPassword" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>
          <p v-if="errors.password" class="mt-2 text-sm text-red-500">
            {{ errors.password }}
          </p>
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label for="confirmPassword" class="label">
            Confirm Password
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
              placeholder="••••••••"
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

        <!-- General error message -->
        <div v-if="errors.general" class="p-4 bg-red-50 border border-red-100 rounded-xl">
          <p class="text-sm text-red-600">{{ errors.general }}</p>
        </div>

        <!-- Sign Up button -->
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
            Creating account...
          </span>
          <span v-else>Sign Up</span>
        </button>

        <!-- Séparateur OR -->
        <div class="divider-area">
          <span class="px-4 bg-white text-surface-400 text-sm font-medium">Or continue with</span>
        </div>

        <!-- Bouton Google Sign Up -->
        <button
          type="button"
          @click="handleGoogleSignup"
          class="btn-area-secondary w-full flex items-center justify-center gap-3"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>
      </form>

      <!-- Lien Sign In -->
      <p class="text-center text-sm text-surface-500 mt-6">
        Already have an account?
        <router-link to="/login" class="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { User, Mail, Lock, Eye, EyeOff, Workflow, CheckCircle, ArrowLeft } from 'lucide-vue-next';
import { googleTokenLogin } from 'vue3-google-login';
import { authAPI } from '@/services/api';

const router = useRouter();

// Reactive state
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errors = ref({});
const isLoading = ref(false);
const isSuccess = ref(false);

const validateForm = () => {
  const validationErrors = {};

  if (!firstName.value.trim()) {
    validationErrors.firstName = 'First name is required';
  }

  if (!lastName.value.trim()) {
    validationErrors.lastName = 'Last name is required';
  }

  if (!email.value.trim()) {
    validationErrors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      validationErrors.email = 'Please enter a valid email address';
    }
  }

  if (!password.value) {
    validationErrors.password = 'Password is required';
  } else if (password.value.length < 8) {
    validationErrors.password = 'Password must be at least 8 characters long';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password.value)) {
    validationErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
  }

  if (password.value !== confirmPassword.value) {
    validationErrors.confirmPassword = 'Passwords do not match';
  }

  return validationErrors;
};

const clearFieldError = (fieldName) => {
  if (errors.value[fieldName]) {
    delete errors.value[fieldName];
  }
};

const handleSubmit = async () => {
  errors.value = {};
  const validationErrors = validateForm();
  
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors;
    return;
  }

  try {
    isLoading.value = true;
    
    // Call API to register
    await authAPI.register({
      email: email.value.trim(),
      password: password.value,
      password_confirm: confirmPassword.value,
      first_name: firstName.value.trim(),
      last_name: lastName.value.trim()
    });
    
    // Show success message
    isSuccess.value = true;
    
  } catch (error) {
    console.error('Registration error:', error);
    errors.value.general = error.message || 'An error occurred during registration. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

/**
 * Handle Google Signup
 */
const handleGoogleSignup = () => {
  googleTokenLogin().then(async (response) => {
    try {
      isLoading.value = true;
      // Call backend with Google token
      const data = await authAPI.googleLogin(response.access_token);
      
      // Store tokens (if backend returns them directly for Google login)
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Google Signup Backend Error", error);
      errors.value.general = 'Google signup failed on server. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }).catch((error) => {
    console.error("Handle Google Signup Error", error)
    errors.value.general = 'Google signup failed. Please try again.';
  })
};

</script>
