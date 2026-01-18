<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <!-- Base gradient with warm tones -->
    <div class="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/30 to-rose-50/50 dark:from-slate-900 dark:via-orange-950/20 dark:to-rose-950/10"></div>
    
    <!-- Circular pattern -->
    <svg class="absolute inset-0 w-full h-full opacity-20 dark:opacity-10">
      <defs>
        <pattern id="circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1.5" fill="rgb(251 146 60)" opacity="0.4"/>
        </pattern>
        <radialGradient id="spotGradient">
          <stop offset="0%" style="stop-color:rgb(251 146 60);stop-opacity:0.4" />
          <stop offset="100%" style="stop-color:rgb(251 146 60);stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#circles)" />
    </svg>
    
    <!-- Profile avatar ring animations -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="relative">
        <div class="absolute w-64 h-64 rounded-full border-2 border-orange-300/30 dark:border-orange-500/20 animate-ping" style="animation-duration: 3s;"></div>
        <div class="absolute w-48 h-48 rounded-full border-2 border-rose-300/30 dark:border-rose-500/20 animate-ping" style="animation-duration: 2.5s; animation-delay: 0.5s;"></div>
        <div class="absolute w-32 h-32 rounded-full border-2 border-amber-300/30 dark:border-amber-500/20 animate-ping" style="animation-duration: 2s; animation-delay: 1s;"></div>
      </div>
    </div>
    
    <!-- Stats visualization -->
    <svg class="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="statsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(251 146 60);stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:rgb(244 63 94);stop-opacity:0.1" />
        </linearGradient>
      </defs>
      
      <!-- Animated bars representing stats -->
      <g class="stats-bars">
        <rect x="10%" y="60%" width="3" :height="`${20 + Math.sin(Date.now() / 1000) * 10}%`" fill="url(#statsGradient)" class="animate-bar">
          <animate attributeName="height" values="20%;35%;20%" dur="3s" repeatCount="indefinite" />
        </rect>
        <rect x="20%" y="65%" width="3" :height="`${25 + Math.cos(Date.now() / 1000) * 10}%`" fill="url(#statsGradient)" class="animate-bar" style="animation-delay: 0.5s">
          <animate attributeName="height" values="25%;40%;25%" dur="3.5s" repeatCount="indefinite" />
        </rect>
        <rect x="30%" y="55%" width="3" :height="`${30 + Math.sin(Date.now() / 1000 + 1) * 10}%`" fill="url(#statsGradient)" class="animate-bar" style="animation-delay: 1s">
          <animate attributeName="height" values="30%;45%;30%" dur="3s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
    
    <!-- Floating achievement badges -->
    <div class="absolute inset-0">
      <div v-for="(badge, i) in badges" :key="i"
           class="absolute"
           :style="{
             left: badge.x,
             top: badge.y,
             animationDelay: `${badge.delay}s`,
           }"
           :class="`floating-badge`">
        <div class="w-8 h-8 rounded-full opacity-30 dark:opacity-20"
             :style="{ backgroundColor: badge.color }">
        </div>
      </div>
    </div>
    
    <!-- Radial highlights -->
    <div class="absolute top-10 left-10 w-96 h-96 bg-orange-400/20 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-10 right-10 w-96 h-96 bg-rose-400/20 dark:bg-rose-500/10 rounded-full blur-3xl"></div>
  </div>
</template>

<script setup>
const badges = [
  { x: '15%', y: '20%', color: 'rgb(251 146 60)', delay: 0 },
  { x: '85%', y: '25%', color: 'rgb(244 63 94)', delay: 1 },
  { x: '10%', y: '70%', color: 'rgb(251 191 36)', delay: 2 },
  { x: '90%', y: '75%', color: 'rgb(249 115 22)', delay: 1.5 },
  { x: '50%', y: '15%', color: 'rgb(236 72 153)', delay: 0.5 },
  { x: '45%', y: '85%', color: 'rgb(217 70 239)', delay: 2.5 },
];
</script>

<style scoped>
@keyframes floatBadge {
  0%, 100% { 
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% { 
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.5;
  }
}

.floating-badge {
  animation: floatBadge 6s ease-in-out infinite;
}

.stats-bars {
  filter: drop-shadow(0 0 10px rgba(251, 146, 60, 0.3));
}
</style>
