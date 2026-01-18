<template>
  <div class="card-area p-4 sm:p-5 hover:shadow-lg transition-all duration-200 hover:border-primary-300 dark:hover:border-primary-600">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <!-- Service Info -->
      <div class="flex items-center space-x-4 flex-1 min-w-0">
        <!-- Service Logo/Icon -->
        <div class="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center"
             :style="{ backgroundColor: getServiceBgColor(service.name) }">
          <component 
            v-if="!getServiceLogo(service.name)"
            :is="getServiceIcon(service.name)" 
            class="w-7 h-7 sm:w-8 sm:h-8"
            :class="getServiceColor(service.name)"
          />
          <div v-else v-html="getServiceLogo(service.name)" class="w-7 h-7 sm:w-8 sm:h-8"></div>
        </div>
        
        <!-- Service Details -->
        <div class="flex-1 min-w-0">
          <h3 class="text-base sm:text-lg font-semibold text-surface-900 dark:text-white truncate">
            {{ service.display_name }}
          </h3>
          <p class="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            {{ service.requires_oauth ? 'OAuth Required' : 'No Authentication Required' }}
          </p>
        </div>
      </div>
      
      <!-- Status and Action -->
      <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
        <!-- Connection Status -->
        <div class="flex items-center space-x-2">
          <div 
            class="w-2.5 h-2.5 rounded-full"
            :class="connectionStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-surface-300 dark:bg-surface-600'"
          ></div>
          <span class="text-xs sm:text-sm font-medium whitespace-nowrap" 
                :class="connectionStatus.connected ? 'text-green-700 dark:text-green-400' : 'text-surface-500 dark:text-surface-400'">
            {{ connectionStatus.connected ? 'Connected' : 'Not Connected' }}
          </span>
        </div>

        <!-- Action Button -->
        <button
          v-if="service.requires_oauth"
          @click="handleOAuthAction"
          :disabled="isLoading"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          :class="connectionStatus.connected 
            ? 'text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50' 
            : 'text-white bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg'"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
          <template v-else>
            <template v-if="connectionStatus.connected">
              <Unlink class="w-4 h-4 mr-2" />
              Disconnect
            </template>
            <template v-else>
              <Link class="w-4 h-4 mr-2" />
              Connect
            </template>
          </template>
        </button>

        <!-- No Auth Indicator -->
        <span
          v-else
          class="badge-area-success inline-flex items-center px-3 py-1.5"
        >
          <CheckCircle class="w-4 h-4 mr-1.5" />
          Ready
        </span>
      </div>
    </div>

    <!-- OAuth Details for connected services -->
    <div v-if="service.requires_oauth && connectionStatus.connected && connectionStatus.details" class="mt-3 p-2 bg-surface-50 rounded-lg">
      <div class="flex items-center justify-between text-xs">
        <span class="text-surface-500">Connected as:</span>
        <span class="font-medium text-surface-900">{{ connectionStatus.details.name}}</span>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="mt-2 p-2 bg-red-50 border border-red-100 rounded-lg">
      <div class="flex">
        <AlertCircle class="w-4 h-4 text-red-400 mr-1.5 flex-shrink-0" />
        <span class="text-red-800 text-xs">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  Link, 
  Unlink, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Clock,
  Github,
  Mail,
  MessageCircle,
  TrendingUp,
  Cloud
} from 'lucide-vue-next'; 
import { oauthAPI } from '@/services/api';
import { startOAuthFlow, getOAuthConnectionStatus, disconnectOAuthService } from '@/services/oauth';
import type { Service } from '@/types/areas';

// Props
interface Props {
  service: Service;
}
const props = defineProps<Props>();

// Reactive state
const isLoading = ref(false);
const error = ref('');
const connectionStatus = ref({
  connected: false,
  details: null as any
});

// Service icon mapping
const getServiceIcon = (serviceName: string) => {
  const iconMap: Record<string, any> = {
    'timer': Clock,
    'github': Github,
    'google': Mail,
    'gmail': Mail,
    'discord': MessageCircle,
    'coingecko': TrendingUp,
    'openweather': Cloud,
    'weather': Cloud,
    'trello': CheckCircle
  };
  return iconMap[serviceName.toLowerCase()] || CheckCircle;
};

// Service color mapping
const getServiceColor = (serviceName: string) => {
  const colorMap: Record<string, string> = {
    'timer': 'text-purple-600 dark:text-purple-400',
    'github': 'text-gray-900 dark:text-white',
    'google': 'text-red-600 dark:text-red-400',
    'gmail': 'text-red-600 dark:text-red-400',
    'discord': 'text-indigo-600 dark:text-indigo-400',
    'coingecko': 'text-yellow-600 dark:text-yellow-400',
    'openweather': 'text-sky-600 dark:text-sky-400',
    'weather': 'text-sky-600 dark:text-sky-400',
    'trello': 'text-blue-600 dark:text-blue-400'
  };
  return colorMap[serviceName.toLowerCase()] || 'text-gray-600 dark:text-gray-400';
};

// Get service background color
const getServiceBgColor = (serviceName: string) => {
  const colorMap: Record<string, string> = {
    'gmail': 'rgba(234, 67, 53, 0.1)',
    'google': 'rgba(66, 133, 244, 0.1)',
    'discord': 'rgba(88, 101, 242, 0.1)',
    'github': 'rgba(24, 23, 23, 0.1)',
    'trello': 'rgba(0, 82, 204, 0.1)',
    'timer': 'rgba(139, 92, 246, 0.1)',
    'weather': 'rgba(56, 189, 248, 0.1)',
    'openweather': 'rgba(56, 189, 248, 0.1)',
    'coingecko': 'rgba(234, 179, 8, 0.1)'
  };
  return colorMap[serviceName.toLowerCase()] || 'rgba(168, 85, 247, 0.1)';
};

// Get SVG logo for services (real logos)
const getServiceLogo = (serviceName: string) => {
  const logos: Record<string, string> = {
    'gmail': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/></svg>`,
    'discord': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" fill="#5865F2"/></svg>`,
    'github': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" fill="#181717"/></svg>`,
    'trello': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v7.62z" fill="#0052CC"/></svg>`,
  };
  return logos[serviceName.toLowerCase()] || '';
};

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Load connection status
const loadConnectionStatus = async () => {
  if (!props.service.requires_oauth) {
    connectionStatus.value = { connected: true, details: null };
    return;
  }

  // Check if service is already active (user already authenticated)
  if (props.service.is_active === true) {
    connectionStatus.value = { connected: true, details: null };
    return;
  }

  try {
    // When backend OAuth status endpoint is ready
    // Get all services connection status
    const allServicesStatus = await getOAuthConnectionStatus();
    
    // Extract the status for this specific service
    const serviceStatus = allServicesStatus[props.service.name];
    
    // Update connection status for this service
    if (serviceStatus) {
      connectionStatus.value = {
        connected: serviceStatus.connected,
        details: serviceStatus.details
      };
    } else {
      // Service not found in status response
      connectionStatus.value = { connected: false, details: null };
    }
    
    // test case
    // const allServicesStatus = await getOAuthConnectionStatus();
    // const serviceStatus = allServicesStatus[props.service.name];
    // connectionStatus.value = serviceStatus || { connected: false, details: null };
  } catch (err) {
    console.warn(`Failed to load connection status for ${props.service.name}:`, err);
    connectionStatus.value = { connected: false, details: null };
  }
};

// Handle OAuth connect/disconnect
const handleOAuthAction = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  error.value = '';

  try {
    if (connectionStatus.value.connected) {
      // Disconnect service
      const result = await disconnectOAuthService(props.service.name);
      if (result.success) {
        connectionStatus.value = { connected: false, details: null };
      } else {
        error.value = result.error || 'Failed to disconnect service';
      }
    } else {
      // Start OAuth flow
      const result = await startOAuthFlow(props.service.name);
      if (result.success) {
        // Reload connection status after successful OAuth
        await loadConnectionStatus();
        
        // Check if we should redirect back to Dashboard
        const returnTo = localStorage.getItem('oauth_return_to');
        if (returnTo === 'dashboard_create') {
          // Redirect to dashboard
          window.location.href = '/dashboard';
        }
      } else {
        error.value = result.error || 'OAuth connection failed';
      }
    }
  } catch (err: any) {
    console.warn('OAuth operation error (may be backend unavailable):', err);
    error.value = err.message || 'OAuth operation failed - backend may be unavailable';
  } finally {
    isLoading.value = false;
  }
};

// Load status on mount
onMounted(() => {
  loadConnectionStatus();
});
</script>