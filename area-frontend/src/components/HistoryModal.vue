<template>
  <div 
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="close"
  >
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div 
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-up"
        @click.stop
      >
        <!-- Header -->
        <div class="sticky top-0 z-10 bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <History :size="20" class="text-white" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">Execution History</h2>
              <p class="text-primary-100 text-sm">{{ areaName }}</p>
            </div>
          </div>
          <button 
            @click="close"
            class="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <X :size="20" />
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>

        <!-- Content -->
        <div v-else class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <!-- Statistics -->
          <div v-if="statistics" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div class="text-2xl font-bold text-green-700">{{ statistics.success_runs }}</div>
              <div class="text-xs text-green-600 font-medium">Success</div>
            </div>
            <div class="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-200">
              <div class="text-2xl font-bold text-red-700">{{ statistics.failed_runs }}</div>
              <div class="text-xs text-red-600 font-medium">Failed</div>
            </div>
            <div class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
              <div class="text-2xl font-bold text-yellow-700">{{ statistics.retrying_runs }}</div>
              <div class="text-xs text-yellow-600 font-medium">Retrying</div>
            </div>
            <div class="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-200">
              <div class="text-2xl font-bold text-primary-700">{{ statistics.success_rate }}%</div>
              <div class="text-xs text-primary-600 font-medium">Success Rate</div>
            </div>
          </div>

          <!-- History List -->
          <div class="space-y-3">
            <h3 class="text-sm font-bold text-surface-400 uppercase tracking-wider mb-4">Recent Executions</h3>
            
            <div v-if="history.length === 0" class="text-center py-12 text-surface-500">
              <Activity :size="48" class="mx-auto mb-3 opacity-20" />
              <p>No execution history yet</p>
            </div>

            <div 
              v-for="run in history" 
              :key="run.id"
              class="bg-surface-50 rounded-xl p-4 border border-surface-200 hover:border-surface-300 transition-all"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <!-- Status Badge -->
                  <div 
                    class="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
                    :class="getStatusClass(run.status)"
                  >
                    <component :is="getStatusIcon(run.status)" :size="14" />
                    {{ run.status.toUpperCase() }}
                  </div>
                  
                  <!-- Retry Count -->
                  <span v-if="run.retry_count > 0" class="text-xs text-surface-500 flex items-center gap-1">
                    <RotateCw :size="12" />
                    Retry {{ run.retry_count }}
                  </span>
                </div>

                <div class="text-xs text-surface-500">
                  {{ formatDate(run.created_at) }}
                </div>
              </div>

              <!-- Event ID -->
              <div class="text-xs text-surface-600 mb-2 font-mono bg-white px-2 py-1 rounded-lg border border-surface-200">
                {{ run.event_id }}
              </div>

              <!-- Error Message -->
              <div v-if="run.error_message" class="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                <div class="flex items-start gap-2">
                  <AlertCircle :size="16" class="text-red-600 flex-shrink-0 mt-0.5" />
                  <div class="text-xs text-red-800">{{ run.error_message }}</div>
                </div>
              </div>

              <!-- Executed At -->
              <div v-if="run.executed_at" class="mt-2 text-xs text-surface-500 flex items-center gap-1">
                <Clock :size="12" />
                Completed: {{ formatDate(run.executed_at) }}
              </div>

              <!-- Expandable Details -->
              <button 
                @click="toggleDetails(run.id)"
                class="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                <component :is="expandedRuns.includes(run.id) ? ChevronUp : ChevronDown" :size="14" />
                {{ expandedRuns.includes(run.id) ? 'Hide' : 'Show' }} Details
              </button>

              <!-- Details Section -->
              <div v-if="expandedRuns.includes(run.id)" class="mt-3 space-y-3 animate-slide-down">
                <!-- Event Data -->
                <div v-if="run.event_data && Object.keys(run.event_data).length > 0">
                  <div class="text-xs font-semibold text-slate-700 mb-1">Event Data:</div>
                  <pre class="text-xs bg-white p-3 rounded border border-slate-200 overflow-x-auto">{{ JSON.stringify(run.event_data, null, 2) }}</pre>
                </div>

                <!-- Reaction Result -->
                <div v-if="run.reaction_result && Object.keys(run.reaction_result).length > 0">
                  <div class="text-xs font-semibold text-slate-700 mb-1">Reaction Result:</div>
                  <pre class="text-xs bg-white p-3 rounded border border-slate-200 overflow-x-auto">{{ JSON.stringify(run.reaction_result, null, 2) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { areasAPI } from '@/services/api';
import { 
  X, History, Activity, CheckCircle, XCircle, Clock as ClockIcon, 
  AlertCircle, RotateCw, ChevronDown, ChevronUp, Loader 
} from 'lucide-vue-next';

const Clock = ClockIcon;

const props = defineProps<{
  isOpen: boolean;
  areaId: string | null;
  areaName: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const loading = ref(false);
const statistics = ref<any>(null);
const history = ref<any[]>([]);
const expandedRuns = ref<string[]>([]);

// Watch for modal open
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen && props.areaId) {
    await loadHistory();
  }
});

const loadHistory = async () => {
  if (!props.areaId) return;
  
  loading.value = true;
  try {
    const response = await areasAPI.getAreaHistory(props.areaId);
    statistics.value = response.statistics;
    history.value = response.history;
  } catch (error) {
    console.error('Failed to load history:', error);
  } finally {
    loading.value = false;
  }
};

const close = () => {
  expandedRuns.value = [];
  emit('close');
};

const toggleDetails = (runId: string) => {
  const index = expandedRuns.value.indexOf(runId);
  if (index > -1) {
    expandedRuns.value.splice(index, 1);
  } else {
    expandedRuns.value.push(runId);
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-700 border border-green-300';
    case 'failed':
      return 'bg-red-100 text-red-700 border border-red-300';
    case 'retrying':
      return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
    case 'pending':
      return 'bg-blue-100 text-blue-700 border border-blue-300';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return CheckCircle;
    case 'failed':
      return XCircle;
    case 'retrying':
      return RotateCw;
    case 'pending':
      return Loader;
    default:
      return Clock;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
</script>

<style scoped>
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-down {
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 1000px; }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}
</style>
