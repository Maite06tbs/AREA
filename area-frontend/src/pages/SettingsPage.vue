<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Settings, ArrowLeft, Workflow, Key, Shield, Bell, Trash2, 
  Eye, EyeOff, Save, AlertTriangle, CheckCircle, Loader2,
  Lock, Smartphone, Mail, Moon, Sun, Globe
} from 'lucide-vue-next'
import { apiService } from '@/services/api'
import SettingsBackground from '../components/backgrounds/SettingsBackground.vue'

const router = useRouter()

// States
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref('')
const successMessage = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const showDeleteConfirm = ref(false)
const isDarkMode = ref(false)

// Password change form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Notification settings
const notifications = ref({
  emailOnAreaTrigger: true,
  emailOnError: true,
  emailWeeklyDigest: false,
  emailNewFeatures: true
})

// 2FA settings
const twoFactorEnabled = ref(false)

const validatePassword = () => {
  if (passwordForm.value.newPassword.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return false
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return false
  }
  return true
}

const changePassword = async () => {
  error.value = ''
  successMessage.value = ''
  
  if (!validatePassword()) return
  
  isSaving.value = true
  
  try {
    await apiService.post('/api/auth/change-password/', {
      current_password: passwordForm.value.currentPassword,
      new_password: passwordForm.value.newPassword
    })
    
    successMessage.value = 'Password changed successfully!'
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    
    setTimeout(() => successMessage.value = '', 3000)
  } catch (err: any) {
    error.value = err.response?.data?.message || err.response?.data?.detail || 'Failed to change password'
  } finally {
    isSaving.value = false
  }
}

const saveNotifications = async () => {
  isSaving.value = true
  error.value = ''
  
  try {
    await apiService.patch('/api/auth/profile/', {
      notification_settings: notifications.value
    })
    successMessage.value = 'Notification settings saved!'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (err: any) {
    error.value = 'Failed to save notification settings'
  } finally {
    isSaving.value = false
  }
}

const toggle2FA = async () => {
  try {
    if (twoFactorEnabled.value) {
      await apiService.post('/api/auth/2fa/disable/')
      twoFactorEnabled.value = false
      successMessage.value = '2FA disabled'
    } else {
      await apiService.post('/api/auth/2fa/enable/')
      twoFactorEnabled.value = true
      successMessage.value = '2FA enabled'
    }
    setTimeout(() => successMessage.value = '', 3000)
  } catch (err) {
    error.value = 'Failed to toggle 2FA'
  }
}

const deleteAccount = async () => {
  try {
    await apiService.delete('/api/auth/account/')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/login')
  } catch (err) {
    error.value = 'Failed to delete account'
  }
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  localStorage.setItem('darkMode', String(isDarkMode.value))
}

const goBack = () => {
  router.push('/dashboard')
}

onMounted(() => {
  isDarkMode.value = document.documentElement.classList.contains('dark')
})
</script>

<template>
  <div class="min-h-screen relative">
    <!-- Background Component -->
    <SettingsBackground />
    
    <!-- Navigation -->
    <nav class="nav-area relative z-10">
      <div class="container-area">
        <div class="flex justify-between h-16 items-center">
          <button @click="goBack" class="flex items-center gap-2 text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white transition-colors">
            <ArrowLeft :size="20" />
            <span class="font-medium">Back to Dashboard</span>
          </button>
          
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-primary">
              <Workflow :size="20" class="text-white" />
            </div>
            <span class="text-xl font-bold text-surface-900 dark:text-white">AREA</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container-area py-12 max-w-3xl">
      <!-- Header -->
      <div class="mb-8 animate-fade-in-up">
        <h1 class="text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
          <Settings :size="32" class="text-primary-600" />
          Settings
        </h1>
        <p class="text-surface-500 dark:text-surface-400 mt-2">Manage your account security and preferences</p>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-xl flex items-center gap-3 animate-fade-in">
        <CheckCircle :size="20" class="text-green-600" />
        <span class="text-green-700 dark:text-green-400">{{ successMessage }}</span>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-3 animate-fade-in">
        <AlertTriangle :size="20" class="text-red-600" />
        <span class="text-red-700 dark:text-red-400">{{ error }}</span>
      </div>

      <!-- Change Password Section -->
      <div class="card-area-elevated dark:bg-surface-800 p-8 mb-6">
        <h2 class="text-xl font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
          <Key :size="20" class="text-orange-600" />
          Change Password
        </h2>
        
        <form @submit.prevent="changePassword" class="space-y-5">
          <!-- Current Password -->
          <div>
            <label class="label dark:text-surface-300">Current Password</label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                v-model="passwordForm.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                class="input-area pl-12 pr-12 dark:bg-surface-700 dark:border-surface-600 dark:text-white"
                placeholder="Enter current password"
              />
              <button 
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                <Eye v-if="!showCurrentPassword" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
          </div>

          <!-- New Password -->
          <div>
            <label class="label dark:text-surface-300">New Password</label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                v-model="passwordForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                class="input-area pl-12 pr-12 dark:bg-surface-700 dark:border-surface-600 dark:text-white"
                placeholder="Enter new password"
              />
              <button 
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                <Eye v-if="!showNewPassword" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
            <p class="text-xs text-surface-400 mt-1">Minimum 8 characters</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="label dark:text-surface-300">Confirm New Password</label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input 
                v-model="passwordForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="input-area pl-12 pr-12 dark:bg-surface-700 dark:border-surface-600 dark:text-white"
                placeholder="Confirm new password"
              />
              <button 
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                <Eye v-if="!showConfirmPassword" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
          </div>

          <button type="submit" :disabled="isSaving" class="btn-area-primary">
            <Loader2 v-if="isSaving" :size="18" class="mr-2 animate-spin" />
            <Save v-else :size="18" class="mr-2" />
            {{ isSaving ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </div>

      <!-- Two-Factor Authentication -->
      <div class="card-area-elevated dark:bg-surface-800 p-8 mb-6">
        <h2 class="text-xl font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
          <Smartphone :size="20" class="text-primary-600" />
          Two-Factor Authentication
        </h2>
        
        <div class="flex items-center justify-between">
          <div>
            <p class="text-surface-600 dark:text-surface-300">
              Add an extra layer of security to your account
            </p>
            <p class="text-sm text-surface-400 mt-1">
              {{ twoFactorEnabled ? 'Currently enabled via email verification' : 'Currently disabled' }}
            </p>
          </div>
          <button 
            @click="toggle2FA"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              twoFactorEnabled ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
            ]"
          >
            <span 
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="card-area-elevated dark:bg-surface-800 p-8 mb-6">
        <h2 class="text-xl font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
          <Bell :size="20" class="text-secondary-600" />
          Notifications
        </h2>
        
        <div class="space-y-4">
          <label class="flex items-center justify-between cursor-pointer group">
            <div>
              <span class="text-surface-900 dark:text-white font-medium">Area Triggers</span>
              <p class="text-sm text-surface-400">Get notified when an area is triggered</p>
            </div>
            <input type="checkbox" v-model="notifications.emailOnAreaTrigger" class="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" />
          </label>

          <label class="flex items-center justify-between cursor-pointer group">
            <div>
              <span class="text-surface-900 dark:text-white font-medium">Error Alerts</span>
              <p class="text-sm text-surface-400">Get notified when an area fails</p>
            </div>
            <input type="checkbox" v-model="notifications.emailOnError" class="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" />
          </label>

          <label class="flex items-center justify-between cursor-pointer group">
            <div>
              <span class="text-surface-900 dark:text-white font-medium">Weekly Digest</span>
              <p class="text-sm text-surface-400">Receive a summary of your automation activity</p>
            </div>
            <input type="checkbox" v-model="notifications.emailWeeklyDigest" class="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" />
          </label>

          <label class="flex items-center justify-between cursor-pointer group">
            <div>
              <span class="text-surface-900 dark:text-white font-medium">Product Updates</span>
              <p class="text-sm text-surface-400">Learn about new features and improvements</p>
            </div>
            <input type="checkbox" v-model="notifications.emailNewFeatures" class="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" />
          </label>
        </div>

        <button @click="saveNotifications" class="btn-area-secondary mt-6">
          <Save :size="18" class="mr-2" />
          Save Preferences
        </button>
      </div>

      <!-- Appearance -->
      <div class="card-area-elevated dark:bg-surface-800 p-8 mb-6">
        <h2 class="text-xl font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
          <Globe :size="20" class="text-cyan-600" />
          Appearance
        </h2>
        
        <div class="flex items-center justify-between">
          <div>
            <p class="text-surface-900 dark:text-white font-medium">Dark Mode</p>
            <p class="text-sm text-surface-400">Switch between light and dark theme</p>
          </div>
          <button 
            @click="toggleDarkMode"
            class="p-3 rounded-xl bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
          >
            <Sun v-if="isDarkMode" :size="20" class="text-yellow-500" />
            <Moon v-else :size="20" class="text-surface-600" />
          </button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card-area-elevated dark:bg-surface-800 p-8 border-2 border-red-200 dark:border-red-900">
        <h2 class="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
          <AlertTriangle :size="20" />
          Danger Zone
        </h2>
        
        <div class="flex items-center justify-between">
          <div>
            <p class="text-surface-900 dark:text-white font-medium">Delete Account</p>
            <p class="text-sm text-surface-400">Permanently delete your account and all data</p>
          </div>
          <button 
            @click="showDeleteConfirm = true"
            class="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <Trash2 :size="18" class="inline mr-2" />
            Delete
          </button>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-surface-800 rounded-2xl p-8 max-w-md w-full animate-fade-in-up">
            <div class="text-center">
              <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle :size="32" class="text-red-600" />
              </div>
              <h3 class="text-xl font-bold text-surface-900 dark:text-white mb-2">Delete Account?</h3>
              <p class="text-surface-500 mb-6">
                This action cannot be undone. All your data, areas, and connections will be permanently deleted.
              </p>
              <div class="flex gap-4">
                <button 
                  @click="showDeleteConfirm = false"
                  class="flex-1 btn-area-ghost"
                >
                  Cancel
                </button>
                <button 
                  @click="deleteAccount"
                  class="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
