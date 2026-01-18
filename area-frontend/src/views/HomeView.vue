<script setup lang="ts">
import { Workflow, ArrowRight, Play, Sparkles, Shield, Clock, ChevronRight, Check, Star, TrendingUp } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import HeroBackground from '../components/backgrounds/HeroBackground.vue'
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-purple-100/20">
    <!-- Animated Background -->
    <HeroBackground />
    
    <!-- Navigation -->
    <nav class="relative z-50 py-6 backdrop-blur-sm bg-white/50 border-b border-purple-100/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3 group">
            <div class="relative">
              <div class="absolute inset-0 bg-primary-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div class="relative w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-xl">
                <Workflow :size="24" class="text-white" />
              </div>
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">AREA</span>
          </div>
          
          <div class="flex items-center gap-4">
            <RouterLink to="/about" class="hidden md:inline-flex text-surface-600 hover:text-primary-600 font-medium transition-colors px-4 py-2">
              About
            </RouterLink>
            <RouterLink to="/services" class="hidden md:inline-flex text-surface-600 hover:text-primary-600 font-medium transition-colors px-4 py-2">
              Services
            </RouterLink>
            <RouterLink to="/help" class="hidden md:inline-flex text-surface-600 hover:text-primary-600 font-medium transition-colors px-4 py-2">
              Help
            </RouterLink>
            <div class="h-6 w-px bg-surface-200 hidden md:block"></div>
            <RouterLink to="/login" class="text-surface-700 hover:text-surface-900 font-medium transition-colors px-4 py-2">
              Sign In
            </RouterLink>
            <RouterLink to="/signup" class="btn-area-primary shadow-xl hover:shadow-2xl hover:scale-105">
              Get Started
              <ArrowRight :size="18" class="ml-2" />
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
      <div class="text-center animate-fade-in-up">
        <!-- Badge with animation -->
        <div class="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-purple-100 backdrop-blur-sm px-5 py-2.5 rounded-full text-primary-700 text-sm font-semibold mb-8 border border-primary-200/50 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-default">
          <Sparkles :size="16" class="animate-pulse" />
          <span>Automation Made Simple</span>
          <Star :size="14" class="text-yellow-500 fill-yellow-500" />
        </div>
        
        <!-- Main Headline with gradient -->
        <h1 class="text-6xl md:text-8xl font-extrabold mb-8 leading-tight">
          <span class="block text-surface-900">Connect.</span>
          <span class="block text-surface-900">Automate.</span>
          <span class="block bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Transform.
          </span>
        </h1>
        
        <p class="text-xl md:text-2xl text-surface-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          Create powerful automations between your favorite services. 
          When <strong class="text-primary-600">this</strong> happens, automatically do <strong class="text-purple-600">that</strong>.
        </p>
        
        <!-- CTA Buttons with enhanced styling -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <RouterLink to="/signup" class="group relative">
            <div class="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div class="relative btn-area-primary text-lg px-10 py-5 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700">
              <Play :size="20" class="mr-2" />
              Start Automating Free
            </div>
          </RouterLink>
          <RouterLink to="/services" class="btn-area-outline text-lg px-10 py-5 group">
            Explore Services
            <ChevronRight :size="20" class="ml-2 group-hover:translate-x-1 transition-transform" />
          </RouterLink>
        </div>
        
        <!-- Social Proof -->
        <div class="flex items-center justify-center gap-8 text-sm text-surface-500">
          <div class="flex items-center gap-2">
            <Check :size="16" class="text-green-500" />
            <span>Free to use</span>
          </div>
          <div class="flex items-center gap-2">
            <Check :size="16" class="text-green-500" />
            <span>No credit card</span>
          </div>
          <div class="flex items-center gap-2">
            <Check :size="16" class="text-green-500" />
            <span>Unlimited areas</span>
          </div>
        </div>
      </div>
      
      <!-- Feature Preview Cards with enhanced design -->
      <div class="grid md:grid-cols-3 gap-8 mt-32 animate-fade-in" style="animation-delay: 0.3s;">
        <!-- Card 1 - Enhanced with hover effects -->
        <div class="group relative">
          <div class="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <div class="relative card-area-elevated p-8 text-center group-hover:-translate-y-4 transition-all duration-500 border-2 border-transparent group-hover:border-primary-200">
            <div class="relative mx-auto mb-6">
              <div class="absolute inset-0 bg-primary-500 rounded-2xl blur-lg opacity-20"></div>
              <div class="relative w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg">
                <Workflow :size="36" class="text-primary-600" />
              </div>
            </div>
            <h3 class="text-2xl font-bold text-surface-900 mb-4">Instant Triggers</h3>
            <p class="text-surface-600 leading-relaxed">React to events in real-time with powerful triggers from Gmail, Discord, GitHub and more.</p>
            <div class="mt-6 pt-6 border-t border-surface-100">
              <div class="flex items-center justify-center gap-2 text-primary-600 font-medium">
                <TrendingUp :size="18" />
                <span class="text-sm">Lightning fast</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Card 2 -->
        <div class="group relative">
          <div class="absolute inset-0 bg-gradient-to-br from-secondary-500 to-pink-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <div class="relative card-area-elevated p-8 text-center group-hover:-translate-y-4 transition-all duration-500 border-2 border-transparent group-hover:border-secondary-200">
            <div class="relative mx-auto mb-6">
              <div class="absolute inset-0 bg-secondary-500 rounded-2xl blur-lg opacity-20"></div>
              <div class="relative w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-50 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg">
                <Shield :size="36" class="text-secondary-600" />
              </div>
            </div>
            <h3 class="text-2xl font-bold text-surface-900 mb-4">Secure & Private</h3>
            <p class="text-surface-600 leading-relaxed">Your data stays protected with OAuth 2.0 authentication and encrypted connections.</p>
            <div class="mt-6 pt-6 border-t border-surface-100">
              <div class="flex items-center justify-center gap-2 text-secondary-600 font-medium">
                <Shield :size="18" />
                <span class="text-sm">Bank-level security</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Card 3 -->
        <div class="group relative">
          <div class="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <div class="relative card-area-elevated p-8 text-center group-hover:-translate-y-4 transition-all duration-500 border-2 border-transparent group-hover:border-green-200">
            <div class="relative mx-auto mb-6">
              <div class="absolute inset-0 bg-green-500 rounded-2xl blur-lg opacity-20"></div>
              <div class="relative w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg">
                <Clock :size="36" class="text-green-600" />
              </div>
            </div>
            <h3 class="text-2xl font-bold text-surface-900 mb-4">Save Hours</h3>
            <p class="text-surface-600 leading-relaxed">Automate repetitive tasks and focus on what matters most to you.</p>
            <div class="mt-6 pt-6 border-t border-surface-100">
              <div class="flex items-center justify-center gap-2 text-green-600 font-medium">
                <Clock :size="18" />
                <span class="text-sm">Effortless automation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="relative z-10 py-12 border-t border-surface-200/50 bg-white/30 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-surface-600 mb-2">&copy; 2026 AREA. Built with 💜 by Epitech students.</p>
        <div class="flex items-center justify-center gap-6 text-sm">
          <RouterLink to="/about" class="text-surface-500 hover:text-primary-600 transition-colors">About</RouterLink>
          <RouterLink to="/help" class="text-surface-500 hover:text-primary-600 transition-colors">Help</RouterLink>
          <RouterLink to="/services" class="text-surface-500 hover:text-primary-600 transition-colors">Services</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>
