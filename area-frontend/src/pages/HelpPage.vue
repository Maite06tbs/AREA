<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  HelpCircle, ArrowLeft, Workflow, Search, Book, MessageCircle, 
  Mail, ChevronDown, ChevronUp, ExternalLink, Lightbulb,
  PlayCircle, Shield, Settings, Users, Sparkles
} from 'lucide-vue-next'

const router = useRouter()
const searchQuery = ref('')
const expandedFaq = ref<number | null>(0)

const faqs = [
  {
    question: 'What is AREA?',
    answer: 'AREA (Action-REAction) is an automation platform that connects your favorite services together. When something happens in one service (Action), AREA automatically triggers something in another service (Reaction). Think of it as "If This Then That" for your digital life.'
  },
  {
    question: 'How do I create my first automation?',
    answer: 'Go to the Dashboard and click "Create Area". Choose a trigger (Action) from a service like Gmail or Discord, then select what should happen (Reaction) in another service. Configure the parameters and save your Area. It will start running automatically!'
  },
  {
    question: 'Which services are supported?',
    answer: 'AREA currently supports Gmail, Discord, GitHub, Trello, and Timer services. We\'re constantly adding more integrations. Check the Services page to see all available actions and reactions for each service.'
  },
  {
    question: 'How do I connect a service?',
    answer: 'Visit the OAuth Management page from the Dashboard. Click "Connect" next to the service you want to use. You\'ll be redirected to the service\'s login page to authorize AREA. Once connected, you can use that service in your automations.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes! We use OAuth 2.0 for all service connections, which means we never see or store your passwords. All data is encrypted in transit and at rest. We only access the minimum permissions required for each integration.'
  },
  {
    question: 'Why isn\'t my Area triggering?',
    answer: 'Check that: 1) The Area is set to "Active", 2) Your OAuth tokens are still valid (reconnect if needed), 3) The trigger conditions are being met. You can view the execution history for each Area to debug issues.'
  },
  {
    question: 'Can I have multiple reactions for one action?',
    answer: 'Currently, each Area supports one action and one reaction. However, you can create multiple Areas with the same action trigger to achieve multiple reactions. We\'re working on multi-reaction support!'
  },
  {
    question: 'How often do Areas check for triggers?',
    answer: 'AREA polls for new events every 30 seconds. Some services like webhooks trigger instantly. The frequency depends on the service and action type.'
  }
]

const guides = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of creating your first automation',
    icon: PlayCircle,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Connecting Services',
    description: 'How to authenticate with Gmail, Discord, and more',
    icon: Shield,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Advanced Configurations',
    description: 'Use parameters and filters in your Areas',
    icon: Settings,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    title: 'Team Collaboration',
    description: 'Share and manage Areas with your team',
    icon: Users,
    color: 'bg-purple-100 text-purple-600'
  }
]

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs
  const query = searchQuery.value.toLowerCase()
  return faqs.filter(faq => 
    faq.question.toLowerCase().includes(query) ||
    faq.answer.toLowerCase().includes(query)
  )
})

const toggleFaq = (index: number) => {
  expandedFaq.value = expandedFaq.value === index ? null : index
}

const goBack = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="bg-neutral">
    <!-- Navigation -->
    <nav class="nav-area">
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
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <div class="inline-flex items-center gap-2 bg-primary-100/80 px-4 py-2 rounded-full text-primary-700 text-sm font-medium mb-6">
          <Sparkles :size="16" />
          Help Center
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-surface-900 mb-4">How can we help?</h1>
        <p class="text-xl text-surface-600">Find answers, guides, and support resources</p>
      </div>

      <!-- Search -->
      <div class="max-w-xl mx-auto mb-12">
        <div class="relative">
          <Search :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for help..."
            class="input-area pl-12 text-lg shadow-lg"
          />
        </div>
      </div>

      <!-- Quick Links -->
      <div class="grid md:grid-cols-2 gap-4 mb-12">
        <div v-for="guide in guides" :key="guide.title" class="card-area-interactive p-6 group">
          <div class="flex items-start gap-4">
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform', guide.color]">
              <component :is="guide.icon" :size="24" />
            </div>
            <div>
              <h3 class="font-semibold text-surface-900 mb-1">{{ guide.title }}</h3>
              <p class="text-sm text-surface-500">{{ guide.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-surface-900 mb-6 flex items-center gap-3">
          <HelpCircle :size="24" class="text-primary-600" />
          Frequently Asked Questions
        </h2>
        
        <div class="space-y-4">
          <div 
            v-for="(faq, index) in filteredFaqs" 
            :key="index"
            class="card-area overflow-hidden"
          >
            <button 
              @click="toggleFaq(index)"
              class="w-full p-5 flex items-center justify-between text-left hover:bg-surface-50 transition-colors"
            >
              <span class="font-medium text-surface-900 pr-4">{{ faq.question }}</span>
              <component 
                :is="expandedFaq === index ? ChevronUp : ChevronDown" 
                :size="20" 
                class="text-surface-400 flex-shrink-0"
              />
            </button>
            
            <div 
              v-if="expandedFaq === index" 
              class="px-5 pb-5 text-surface-600 border-t border-surface-100 pt-4 animate-fade-in"
            >
              {{ faq.answer }}
            </div>
          </div>

          <div v-if="filteredFaqs.length === 0" class="text-center py-8 text-surface-500">
            <Search :size="48" class="mx-auto mb-4 text-surface-300" />
            <p>No results found for "{{ searchQuery }}"</p>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="card-area-elevated p-8 mb-12">
        <h2 class="text-xl font-bold text-surface-900 mb-6 flex items-center gap-3">
          <Lightbulb :size="24" class="text-yellow-500" />
          Pro Tips
        </h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div class="flex gap-3">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-yellow-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h4 class="font-medium text-surface-900">Start Simple</h4>
              <p class="text-sm text-surface-500">Create a basic Area first, then add complexity as you learn.</p>
            </div>
          </div>
          
          <div class="flex gap-3">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-yellow-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h4 class="font-medium text-surface-900">Test Your Areas</h4>
              <p class="text-sm text-surface-500">Use the test feature to verify your automation works correctly.</p>
            </div>
          </div>
          
          <div class="flex gap-3">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-yellow-600 font-bold text-sm">3</span>
            </div>
            <div>
              <h4 class="font-medium text-surface-900">Check Execution History</h4>
              <p class="text-sm text-surface-500">Review logs to understand how your Areas are performing.</p>
            </div>
          </div>
          
          <div class="flex gap-3">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-yellow-600 font-bold text-sm">4</span>
            </div>
            <div>
              <h4 class="font-medium text-surface-900">Keep Tokens Fresh</h4>
              <p class="text-sm text-surface-500">Reconnect services periodically to avoid authentication issues.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Support -->
      <div class="grid md:grid-cols-2 gap-6">
        <div class="card-area p-8 text-center">
          <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Book :size="32" class="text-primary-600" />
          </div>
          <h3 class="text-xl font-bold text-surface-900 mb-2">Documentation</h3>
          <p class="text-surface-500 mb-4">Read our detailed documentation for in-depth guides.</p>
          <a href="#" class="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center gap-1">
            View Docs <ExternalLink :size="16" />
          </a>
        </div>

        <div class="card-area p-8 text-center">
          <div class="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail :size="32" class="text-secondary-600" />
          </div>
          <h3 class="text-xl font-bold text-surface-900 mb-2">Contact Support</h3>
          <p class="text-surface-500 mb-4">Can't find what you need? We're here to help.</p>
          <a href="mailto:support@area.com" class="text-secondary-600 font-medium hover:text-secondary-700 inline-flex items-center gap-1">
            Email Us <Mail :size="16" />
          </a>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-8 border-t border-surface-200/50">
      <div class="container-area text-center text-surface-500 text-sm">
        <p>&copy; 2026 AREA. Built with 💜 by Epitech students.</p>
      </div>
    </footer>
  </div>
</template>
