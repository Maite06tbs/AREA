<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Workflow, ArrowLeft, Search, ExternalLink, Check, X, 
  Mail, MessageSquare, Github, Trello, Clock, Cloud,
  ChevronDown, ChevronUp, Sparkles, ArrowRight
} from 'lucide-vue-next'
import { apiService } from '@/services/api'
import ServicesBackground from '../components/backgrounds/ServicesBackground.vue'

interface Action {
  name: string
  description: string
}

interface Reaction {
  name: string
  description: string
}

interface Service {
  name: string
  description?: string
  actions: Action[]
  reactions: Reaction[]
}

const router = useRouter()
const services = ref<Service[]>([])
const isLoading = ref(true)
const error = ref('')
const searchQuery = ref('')
const expandedServices = ref<Set<string>>(new Set())

// Service icons mapping
const serviceIcons: Record<string, any> = {
  'Gmail': Mail,
  'Discord': MessageSquare,
  'GitHub': Github,
  'Trello': Trello,
  'Timer': Clock,
  'Weather': Cloud,
}

// Service colors mapping
const serviceColors: Record<string, string> = {
  'Gmail': 'from-red-500 to-red-600',
  'Discord': 'from-indigo-500 to-indigo-600',
  'GitHub': 'from-gray-700 to-gray-900',
  'Trello': 'from-blue-500 to-blue-600',
  'Timer': 'from-orange-500 to-orange-600',
  'Weather': 'from-cyan-500 to-cyan-600',
}

const filteredServices = computed(() => {
  if (!searchQuery.value) return services.value
  const query = searchQuery.value.toLowerCase()
  return services.value.filter(service => 
    service.name.toLowerCase().includes(query) ||
    service.actions.some(a => a.name.toLowerCase().includes(query)) ||
    service.reactions.some(r => r.name.toLowerCase().includes(query))
  )
})

const totalActions = computed(() => 
  services.value.reduce((sum, s) => sum + s.actions.length, 0)
)

const totalReactions = computed(() => 
  services.value.reduce((sum, s) => sum + s.reactions.length, 0)
)

const toggleService = (serviceName: string) => {
  if (expandedServices.value.has(serviceName)) {
    expandedServices.value.delete(serviceName)
  } else {
    expandedServices.value.add(serviceName)
  }
}

const getServiceIcon = (serviceName: string) => {
  return serviceIcons[serviceName] || Workflow
}

const getServiceColor = (serviceName: string) => {
  return serviceColors[serviceName] || 'from-primary-500 to-primary-600'
}

const fetchServices = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await apiService.get('/api/core/about.json')
    if (response.data?.server?.services) {
      services.value = response.data.server.services
      // Expand first service by default
      if (services.value.length > 0) {
        const firstService = services.value[0]
        if (firstService) {
          expandedServices.value.add(firstService.name)
        }
      }
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load services'
    console.error('Error fetching services:', err)
  } finally {
    isLoading.value = false
  }
}

const goToDashboard = () => {
  router.push('/dashboard')
}

onMounted(() => {
  fetchServices()
})
</script>

<template>
  <div class="min-h-screen relative">
    <!-- Background Component -->
    <ServicesBackground />
    
    <!-- Navigation -->
    <nav class="nav-area relative z-10">
      <div class="container-area">
        <div class="flex justify-between h-16 items-center">
          <button @click="goToDashboard" class="flex items-center gap-2 text-surface-600 hover:text-surface-900 transition-colors">
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
    <main class="container-area py-12">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <div class="inline-flex items-center gap-2 bg-primary-100/80 backdrop-blur px-4 py-2 rounded-full text-primary-700 text-sm font-medium mb-6">
          <Sparkles :size="16" />
          Available Integrations
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-surface-900 mb-4">Services Catalog</h1>
        <p class="text-xl text-surface-600 max-w-2xl mx-auto">
          Discover all the services you can connect to automate your workflows
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
        <div class="card-area-elevated p-6 text-center">
          <div class="text-3xl font-bold text-primary-600 mb-1">{{ services.length }}</div>
          <div class="text-sm text-surface-500">Services</div>
        </div>
        <div class="card-area-elevated p-6 text-center">
          <div class="text-3xl font-bold text-secondary-600 mb-1">{{ totalActions }}</div>
          <div class="text-sm text-surface-500">Actions</div>
        </div>
        <div class="card-area-elevated p-6 text-center">
          <div class="text-3xl font-bold text-green-600 mb-1">{{ totalReactions }}</div>
          <div class="text-sm text-surface-500">Reactions</div>
        </div>
      </div>

      <!-- Search -->
      <div class="max-w-xl mx-auto mb-10">
        <div class="relative">
          <Search :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search services, actions, or reactions..."
            class="input-area pl-12 text-lg"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="card-area p-6 max-w-xl mx-auto text-center">
        <X :size="48" class="text-red-500 mx-auto mb-4" />
        <p class="text-red-600">{{ error }}</p>
        <button @click="fetchServices" class="btn-area-primary mt-4">
          Retry
        </button>
      </div>

      <!-- Services Grid -->
      <div v-else class="space-y-6">
        <div 
          v-for="service in filteredServices" 
          :key="service.name"
          class="card-area-elevated overflow-hidden animate-fade-in"
        >
          <!-- Service Header -->
          <button 
            @click="toggleService(service.name)"
            class="w-full p-6 flex items-center justify-between hover:bg-surface-50 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div 
                class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                :class="`bg-gradient-to-br ${getServiceColor(service.name)}`"
              >
                <component :is="getServiceIcon(service.name)" :size="28" class="text-white" />
              </div>
              <div class="text-left">
                <h3 class="text-xl font-bold text-surface-900">{{ service.name }}</h3>
                <p class="text-surface-500 text-sm">
                  {{ service.actions.length }} actions · {{ service.reactions.length }} reactions
                </p>
              </div>
            </div>
            <component 
              :is="expandedServices.has(service.name) ? ChevronUp : ChevronDown" 
              :size="24" 
              class="text-surface-400"
            />
          </button>

          <!-- Expanded Content -->
          <div v-if="expandedServices.has(service.name)" class="border-t border-surface-100">
            <div class="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-surface-100">
              <!-- Actions -->
              <div class="p-6">
                <h4 class="flex items-center gap-2 text-sm font-semibold text-secondary-700 uppercase tracking-wider mb-4">
                  <div class="w-6 h-6 bg-secondary-100 rounded flex items-center justify-center">
                    <span class="text-xs font-bold">IF</span>
                  </div>
                  Triggers (Actions)
                </h4>
                <div class="space-y-3">
                  <div 
                    v-for="action in service.actions" 
                    :key="action.name"
                    class="p-4 bg-secondary-50/50 rounded-xl border border-secondary-100"
                  >
                    <div class="font-medium text-surface-900 mb-1">{{ action.name }}</div>
                    <p class="text-sm text-surface-500">{{ action.description }}</p>
                  </div>
                  <div v-if="service.actions.length === 0" class="text-surface-400 text-sm italic">
                    No actions available
                  </div>
                </div>
              </div>

              <!-- Reactions -->
              <div class="p-6">
                <h4 class="flex items-center gap-2 text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">
                  <div class="w-6 h-6 bg-primary-100 rounded flex items-center justify-center">
                    <span class="text-xs font-bold">THEN</span>
                  </div>
                  Actions (Reactions)
                </h4>
                <div class="space-y-3">
                  <div 
                    v-for="reaction in service.reactions" 
                    :key="reaction.name"
                    class="p-4 bg-primary-50/50 rounded-xl border border-primary-100"
                  >
                    <div class="font-medium text-surface-900 mb-1">{{ reaction.name }}</div>
                    <p class="text-sm text-surface-500">{{ reaction.description }}</p>
                  </div>
                  <div v-if="service.reactions.length === 0" class="text-surface-400 text-sm italic">
                    No reactions available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="filteredServices.length === 0 && !isLoading" class="text-center py-12">
          <Search :size="48" class="text-surface-300 mx-auto mb-4" />
          <p class="text-surface-500">No services found matching "{{ searchQuery }}"</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center mt-16">
        <p class="text-surface-500 mb-4">Ready to create your first automation?</p>
        <button @click="goToDashboard" class="btn-area-primary">
          Go to Dashboard
          <ArrowRight :size="18" class="ml-2" />
        </button>
      </div>
    </main>
  </div>
</template>
