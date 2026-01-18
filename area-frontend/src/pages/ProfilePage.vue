<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, Mail, Shield, Bell, Key, Camera, Edit2, Save, X, 
  ArrowLeft, Workflow, CheckCircle, AlertCircle, Clock, Activity,
  Calendar, MapPin, Globe, Loader2
} from 'lucide-vue-next'
import { apiService } from '@/services/api'
import ProfileBackground from '../components/backgrounds/ProfileBackground.vue'

const router = useRouter()

// User data
const user = ref({
  email: '',
  firstName: '',
  lastName: '',
  avatar: '',
  createdAt: '',
  lastLogin: '',
  timezone: 'Europe/Paris',
  language: 'en'
})

// Stats
const stats = ref({
  totalAreas: 0,
  activeAreas: 0,
  totalExecutions: 0,
  connectedServices: 0
})

// States
const isLoading = ref(true)
const isEditing = ref(false)
const isSaving = ref(false)
const error = ref('')
const successMessage = ref('')

// Edit form
const editForm = ref({
  firstName: '',
  lastName: '',
  timezone: '',
  language: ''
})

const timezones = [
  'Europe/Paris',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
]

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' }
]

const fullName = computed(() => {
  if (user.value.firstName && user.value.lastName) {
    return `${user.value.firstName} ${user.value.lastName}`
  }
  return user.value.email?.split('@')[0] || 'User'
})

const initials = computed(() => {
  if (user.value.firstName && user.value.lastName) {
    return `${user.value.firstName[0]}${user.value.lastName[0]}`.toUpperCase()
  }
  return user.value.email?.[0]?.toUpperCase() || 'U'
})

const memberSince = computed(() => {
  if (!user.value.createdAt) return 'N/A'
  return new Date(user.value.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const lastLoginFormatted = computed(() => {
  if (!user.value.lastLogin) return 'N/A'
  return new Date(user.value.lastLogin).toLocaleString()
})

const fetchProfile = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    // Check if token exists
    const token = localStorage.getItem('access_token')
    if (!token) {
      error.value = 'Not authenticated. Please login again.'
      router.push('/login')
      return
    }
    
    // Fetch user profile
    const response = await apiService.get('/api/auth/profile/')
    if (response.data) {
      user.value = {
        email: response.data.email || '',
        firstName: response.data.first_name || '',
        lastName: response.data.last_name || '',
        avatar: response.data.avatar || '',
        createdAt: response.data.date_joined || response.data.created_at || '',
        lastLogin: response.data.last_login || '',
        timezone: response.data.timezone || 'Europe/Paris',
        language: response.data.language || 'en'
      }
    }
    
    // Fetch stats
    try {
      const areasResponse = await apiService.get('/api/areas/')
      if (areasResponse.data) {
        const areas = Array.isArray(areasResponse.data) ? areasResponse.data : areasResponse.data.results || []
        stats.value.totalAreas = areas.length
        stats.value.activeAreas = areas.filter((a: any) => a.is_active).length
      }
    } catch (e) {
      console.log('Could not fetch areas stats')
    }
    
    // Fetch connected services count
    try {
      const oauthResponse = await apiService.get('/api/oauth/status/')
      if (oauthResponse.data) {
        stats.value.connectedServices = Object.values(oauthResponse.data).filter((v: any) => v.connected).length
      }
    } catch (e) {
      console.log('Could not fetch oauth stats')
    }
    
  } catch (err: any) {
    console.error('Error fetching profile:', err)
    
    // Check if it's an authentication error
    if (err.response?.status === 401 || err.message?.includes('401')) {
      error.value = 'Session expired. Please login again.'
      setTimeout(() => {
        localStorage.removeItem('access_token')
        router.push('/login')
      }, 2000)
    } else {
      error.value = err.response?.data?.message || err.message || 'Failed to load profile. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const startEditing = () => {
  editForm.value = {
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    timezone: user.value.timezone,
    language: user.value.language
  }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  error.value = ''
}

const saveProfile = async () => {
  isSaving.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    await apiService.patch('/api/auth/profile/', {
      first_name: editForm.value.firstName,
      last_name: editForm.value.lastName,
      timezone: editForm.value.timezone,
      language: editForm.value.language
    })
    
    user.value.firstName = editForm.value.firstName
    user.value.lastName = editForm.value.lastName
    user.value.timezone = editForm.value.timezone
    user.value.language = editForm.value.language
    
    isEditing.value = false
    successMessage.value = 'Profile updated successfully!'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to update profile'
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/dashboard')
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="min-h-screen relative">
    <!-- Background Component -->
    <ProfileBackground />
    
    <!-- Navigation -->
    <nav class="nav-area relative z-10">
      <div class="container-area">
        <div class="flex justify-between h-16 items-center">
          <button @click="goBack" class="flex items-center gap-2 text-surface-600 hover:text-surface-900 transition-colors">
            <ArrowLeft :size="20" />
            <span class="font-medium">Back to Dashboard</span>
          </button>
          
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-primary">
              <Workflow :size="20" class="text-white" />
            </div>
            <span class="text-xl font-bold text-surface-900">AREA</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container-area py-12 max-w-4xl">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <template v-else>
        <!-- Profile Header -->
        <div class="card-area-elevated p-8 mb-8 animate-fade-in-up">
          <div class="flex flex-col md:flex-row items-center gap-6">
            <!-- Avatar -->
            <div class="relative group">
              <div class="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {{ initials }}
              </div>
              <button class="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-surface-600 hover:text-primary-600 transition-colors opacity-0 group-hover:opacity-100">
                <Camera :size="18" />
              </button>
            </div>

            <!-- Info -->
            <div class="flex-1 text-center md:text-left">
              <h1 class="text-3xl font-bold text-surface-900 mb-2">{{ fullName }}</h1>
              <p class="text-surface-500 flex items-center justify-center md:justify-start gap-2">
                <Mail :size="16" />
                {{ user.email }}
              </p>
              <p class="text-surface-400 text-sm mt-2 flex items-center justify-center md:justify-start gap-2">
                <Calendar :size="14" />
                Member since {{ memberSince }}
              </p>
            </div>

            <!-- Edit Button -->
            <button 
              v-if="!isEditing"
              @click="startEditing"
              class="btn-area-outline"
            >
              <Edit2 :size="18" class="mr-2" />
              Edit Profile
            </button>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
            <CheckCircle :size="20" class="text-green-600" />
            <span class="text-green-700">{{ successMessage }}</span>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
            <AlertCircle :size="20" class="text-red-600" />
            <span class="text-red-700">{{ error }}</span>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="card-area p-5 text-center">
            <Activity :size="24" class="text-primary-600 mx-auto mb-2" />
            <div class="text-2xl font-bold text-surface-900">{{ stats.totalAreas }}</div>
            <div class="text-sm text-surface-500">Total Areas</div>
          </div>
          <div class="card-area p-5 text-center">
            <CheckCircle :size="24" class="text-green-600 mx-auto mb-2" />
            <div class="text-2xl font-bold text-surface-900">{{ stats.activeAreas }}</div>
            <div class="text-sm text-surface-500">Active</div>
          </div>
          <div class="card-area p-5 text-center">
            <Clock :size="24" class="text-orange-600 mx-auto mb-2" />
            <div class="text-2xl font-bold text-surface-900">{{ stats.totalExecutions }}</div>
            <div class="text-sm text-surface-500">Executions</div>
          </div>
          <div class="card-area p-5 text-center">
            <Shield :size="24" class="text-secondary-600 mx-auto mb-2" />
            <div class="text-2xl font-bold text-surface-900">{{ stats.connectedServices }}</div>
            <div class="text-sm text-surface-500">Connected</div>
          </div>
        </div>

        <!-- Edit Form -->
        <div v-if="isEditing" class="card-area-elevated p-8 mb-8 animate-fade-in">
          <h2 class="text-xl font-bold text-surface-900 mb-6 flex items-center gap-2">
            <Edit2 :size="20" class="text-primary-600" />
            Edit Profile
          </h2>
          
          <form @submit.prevent="saveProfile" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <!-- First Name -->
              <div>
                <label class="label">First Name</label>
                <input 
                  v-model="editForm.firstName"
                  type="text"
                  class="input-area"
                  placeholder="Enter your first name"
                />
              </div>
              
              <!-- Last Name -->
              <div>
                <label class="label">Last Name</label>
                <input 
                  v-model="editForm.lastName"
                  type="text"
                  class="input-area"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Timezone -->
              <div>
                <label class="label">
                  <MapPin :size="14" class="inline mr-1" />
                  Timezone
                </label>
                <select v-model="editForm.timezone" class="input-area">
                  <option v-for="tz in timezones" :key="tz" :value="tz">{{ tz }}</option>
                </select>
              </div>
              
              <!-- Language -->
              <div>
                <label class="label">
                  <Globe :size="14" class="inline mr-1" />
                  Language
                </label>
                <select v-model="editForm.language" class="input-area">
                  <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                    {{ lang.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex justify-end gap-4 pt-4 border-t border-surface-100">
              <button type="button" @click="cancelEditing" class="btn-area-ghost">
                <X :size="18" class="mr-2" />
                Cancel
              </button>
              <button type="submit" :disabled="isSaving" class="btn-area-primary">
                <Loader2 v-if="isSaving" :size="18" class="mr-2 animate-spin" />
                <Save v-else :size="18" class="mr-2" />
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Account Details -->
        <div v-if="!isEditing" class="card-area-elevated p-8 mb-8">
          <h2 class="text-xl font-bold text-surface-900 mb-6 flex items-center gap-2">
            <User :size="20" class="text-primary-600" />
            Account Details
          </h2>
          
          <div class="space-y-4">
            <div class="flex justify-between py-3 border-b border-surface-100">
              <span class="text-surface-500">Email</span>
              <span class="font-medium text-surface-900">{{ user.email }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-surface-100">
              <span class="text-surface-500">First Name</span>
              <span class="font-medium text-surface-900">{{ user.firstName || 'Not set' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-surface-100">
              <span class="text-surface-500">Last Name</span>
              <span class="font-medium text-surface-900">{{ user.lastName || 'Not set' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-surface-100">
              <span class="text-surface-500">Timezone</span>
              <span class="font-medium text-surface-900">{{ user.timezone }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-surface-100">
              <span class="text-surface-500">Language</span>
              <span class="font-medium text-surface-900">
                {{ languages.find(l => l.code === user.language)?.name || user.language }}
              </span>
            </div>
            <div class="flex justify-between py-3">
              <span class="text-surface-500">Last Login</span>
              <span class="font-medium text-surface-900">{{ lastLoginFormatted }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="grid md:grid-cols-3 gap-4">
          <router-link to="/oauth" class="card-area-interactive p-6 text-center group">
            <Shield :size="32" class="text-secondary-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-surface-900">Connected Services</h3>
            <p class="text-sm text-surface-500 mt-1">Manage OAuth connections</p>
          </router-link>
          
          <router-link to="/settings" class="card-area-interactive p-6 text-center group">
            <Key :size="32" class="text-orange-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-surface-900">Security Settings</h3>
            <p class="text-sm text-surface-500 mt-1">Password & 2FA</p>
          </router-link>
          
          <router-link to="/help" class="card-area-interactive p-6 text-center group">
            <Bell :size="32" class="text-primary-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 class="font-semibold text-surface-900">Notifications</h3>
            <p class="text-sm text-surface-500 mt-1">Email preferences</p>
          </router-link>
        </div>
      </template>
    </main>
  </div>
</template>
