<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <!-- Base gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/50 dark:from-slate-900 dark:via-blue-950/30 dark:to-purple-950/20"></div>
    
    <!-- Hexagonal grid pattern -->
    <svg class="absolute inset-0 w-full h-full opacity-30 dark:opacity-20">
      <defs>
        <pattern id="hexagons" x="0" y="0" width="50" height="43.4" patternUnits="userSpaceOnUse">
          <path d="M25,5 L45,16 L45,37 L25,48 L5,37 L5,16 Z" fill="none" stroke="rgb(99 102 241)" stroke-width="0.5" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagons)" />
    </svg>
    
    <!-- Floating service icons -->
    <div class="absolute inset-0">
      <div v-for="i in 15" :key="i" 
           class="absolute"
           :style="{
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100}%`,
             animationDelay: `${Math.random() * 5}s`,
             animationDuration: `${15 + Math.random() * 10}s`
           }"
           :class="`floating-icon-${i % 3 + 1}`">
        <div class="w-12 h-12 rounded-xl opacity-20 dark:opacity-10"
             :style="{
               background: `linear-gradient(135deg, ${getRandomColor()}, ${getRandomColor()})`
             }">
        </div>
      </div>
    </div>
    
    <!-- Connection lines animation -->
    <svg class="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(99 102 241);stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:rgb(139 92 246);stop-opacity:0.1" />
        </linearGradient>
      </defs>
      
      <!-- Animated connection lines -->
      <g class="connection-lines">
        <path d="M 100 200 Q 300 100 500 300" stroke="url(#lineGradient)" stroke-width="2" fill="none" class="animate-draw" />
        <path d="M 800 150 Q 600 250 700 450" stroke="url(#lineGradient)" stroke-width="2" fill="none" class="animate-draw" style="animation-delay: 1s" />
        <path d="M 200 600 Q 400 500 600 650" stroke="url(#lineGradient)" stroke-width="2" fill="none" class="animate-draw" style="animation-delay: 2s" />
      </g>
    </svg>
    
    <!-- Radial highlights -->
    <div class="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
  </div>
</template>

<script setup>
const colors = [
  'rgb(59 130 246)', // blue
  'rgb(139 92 246)', // purple
  'rgb(99 102 241)', // indigo
  'rgb(168 85 247)', // violet
  'rgb(14 165 233)', // sky
  'rgb(236 72 153)', // pink
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
</script>

<style scoped>
@keyframes floating1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -10px) rotate(5deg); }
  50% { transform: translate(20px, 10px) rotate(-5deg); }
  75% { transform: translate(-10px, 20px) rotate(3deg); }
}

@keyframes floating2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
  33% { transform: translate(-15px, 15px) rotate(-5deg) scale(1.1); }
  66% { transform: translate(15px, -15px) rotate(5deg) scale(0.9); }
}

@keyframes floating3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(0, -20px) scale(1.2); }
}

@keyframes draw {
  0% { stroke-dashoffset: 1000; opacity: 0; }
  50% { opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}

.floating-icon-1 { animation: floating1 ease-in-out infinite; }
.floating-icon-2 { animation: floating2 ease-in-out infinite; }
.floating-icon-3 { animation: floating3 ease-in-out infinite; }

.animate-draw {
  stroke-dasharray: 1000;
  animation: draw 8s ease-in-out infinite;
}

.connection-lines {
  filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.3));
}
</style>
