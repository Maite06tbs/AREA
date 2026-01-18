<script setup lang="ts">
import { Workflow, Users, Code, Heart, ArrowLeft } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="bg-neutral">
    <!-- Navigation -->
    <nav class="relative z-50 py-6 border-b border-surface-200/50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <RouterLink to="/" class="flex items-center gap-3 text-surface-600 hover:text-surface-900 transition-colors">
            <ArrowLeft :size="20" />
            <span class="font-medium">Back to Home</span>
          </RouterLink>
          
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-primary">
              <Workflow :size="20" class="text-white" />
            </div>
            <span class="text-xl font-bold text-surface-900">AREA</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-16 animate-fade-in-up">
        <h1 class="text-4xl md:text-5xl font-bold text-surface-900 mb-6">About AREA</h1>
        <p class="text-xl text-surface-600 max-w-2xl mx-auto">
          AREA is an automation platform that connects your favorite services and makes them work together seamlessly.
        </p>
      </div>

      <!-- Mission Section -->
      <div class="card-area-elevated p-8 mb-8">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Heart :size="24" class="text-primary-600" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-surface-900 mb-3">Our Mission</h2>
            <p class="text-surface-600 leading-relaxed">
              We believe automation should be accessible to everyone. AREA empowers users to create powerful workflows 
              without writing a single line of code. Connect Gmail, Discord, GitHub, Trello, and more to build 
              automations that save you time and reduce manual work.
            </p>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div class="card-area-elevated p-8 mb-8">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users :size="24" class="text-secondary-600" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-surface-900 mb-3">The Team</h2>
            <p class="text-surface-600 leading-relaxed">
              AREA is built by a team of passionate Epitech students as part of the third year curriculum.
              We're dedicated to creating a reliable, user-friendly automation platform that showcases 
              modern web development practices.
            </p>
          </div>
        </div>
      </div>

      <!-- Tech Stack Section -->
      <div class="card-area-elevated p-8">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Code :size="24" class="text-green-600" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-surface-900 mb-3">Technology Stack</h2>
            <p class="text-surface-600 leading-relaxed mb-4">
              AREA is built with modern technologies for performance and reliability:
            </p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-surface-50 rounded-lg p-3 text-center">
                <span class="text-sm font-medium text-surface-700">Vue.js 3</span>
              </div>
              <div class="bg-surface-50 rounded-lg p-3 text-center">
                <span class="text-sm font-medium text-surface-700">Django</span>
              </div>
              <div class="bg-surface-50 rounded-lg p-3 text-center">
                <span class="text-sm font-medium text-surface-700">PostgreSQL</span>
              </div>
              <div class="bg-surface-50 rounded-lg p-3 text-center">
                <span class="text-sm font-medium text-surface-700">Docker</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="relative z-10 py-8 border-t border-surface-200/50">
      <div class="max-w-4xl mx-auto px-4 text-center text-surface-500 text-sm">
        <p>&copy; 2026 AREA. Built with 💜 by Epitech students.</p>
      </div>
    </footer>
  </div>
</template>
