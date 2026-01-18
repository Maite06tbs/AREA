<template>
  <Transition name="slide-down">
    <div 
      v-if="visible"
      class="fixed top-4 right-4 z-50 max-w-md animate-slide-in"
    >
      <div 
        class="bg-white dark:bg-surface-800 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden"
        :class="notificationClass"
      >
        <div class="p-4 flex items-start gap-3">
          <!-- Icon -->
          <div 
            class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
            :class="iconBgClass"
          >
            <component :is="icon" :size="20" :class="iconColorClass" />
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-surface-900 dark:text-white mb-1">
              {{ title }}
            </h4>
            <p class="text-sm text-surface-600 dark:text-surface-300">
              {{ message }}
            </p>
            <div v-if="areaName" class="text-xs text-surface-500 dark:text-surface-400 mt-1 font-medium">
              Area: {{ areaName }}
            </div>
          </div>
          
          <!-- Close Button -->
          <button 
            @click="close"
            class="flex-shrink-0 p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded transition-colors"
          >
            <X :size="16" class="text-surface-400" />
          </button>
        </div>
        
        <!-- Progress Bar -->
        <div class="h-1 bg-surface-100 dark:bg-surface-700">
          <div 
            class="h-full transition-all duration-100 ease-linear"
            :class="progressBarClass"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-vue-next';

const props = defineProps<{
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  areaName?: string;
  duration?: number;
}>();

const emit = defineEmits<{
  close: [];
}>();

const visible = ref(false);
const progress = ref(100);
let progressInterval: number | null = null;
let closeTimeout: number | null = null;

const icon = computed(() => {
  switch (props.type) {
    case 'success': return CheckCircle;
    case 'error': return XCircle;
    case 'warning': return AlertCircle;
    case 'info': return Info;
    default: return Info;
  }
});

const notificationClass = computed(() => {
  switch (props.type) {
    case 'success': return 'border-l-4 border-l-green-500';
    case 'error': return 'border-l-4 border-l-red-500';
    case 'warning': return 'border-l-4 border-l-yellow-500';
    case 'info': return 'border-l-4 border-l-blue-500';
    default: return '';
  }
});

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-100 dark:bg-green-900/30';
    case 'error': return 'bg-red-100 dark:bg-red-900/30';
    case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30';
    case 'info': return 'bg-blue-100 dark:bg-blue-900/30';
    default: return 'bg-slate-100';
  }
});

const iconColorClass = computed(() => {
  switch (props.type) {
    case 'success': return 'text-green-600 dark:text-green-400';
    case 'error': return 'text-red-600 dark:text-red-400';
    case 'warning': return 'text-yellow-600 dark:text-yellow-400';
    case 'info': return 'text-blue-600 dark:text-blue-400';
    default: return 'text-slate-600';
  }
});

const progressBarClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-500';
    case 'error': return 'bg-red-500';
    case 'warning': return 'bg-yellow-500';
    case 'info': return 'bg-blue-500';
    default: return 'bg-slate-500';
  }
});

const close = () => {
  visible.value = false;
  if (progressInterval) {
    clearInterval(progressInterval);
  }
  if (closeTimeout) {
    clearTimeout(closeTimeout);
  }
  emit('close');
};

onMounted(() => {
  visible.value = true;
  
  const duration = props.duration || 5000;
  const interval = 50;
  const decrement = (100 * interval) / duration;
  
  progressInterval = window.setInterval(() => {
    progress.value = Math.max(0, progress.value - decrement);
  }, interval);
  
  closeTimeout = window.setTimeout(() => {
    close();
  }, duration);
});

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval);
  }
  if (closeTimeout) {
    clearTimeout(closeTimeout);
  }
});
</script>

<style scoped>
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
