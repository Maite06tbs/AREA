<template>
  <div class="workflow-background">
    <!-- Animated workflow paths -->
    <svg class="workflow-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 800">
      <defs>
        <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.3" />
          <stop offset="50%" style="stop-color:#a855f7;stop-opacity:0.5" />
          <stop offset="100%" style="stop-color:#c084fc;stop-opacity:0.3" />
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Workflow paths -->
      <path class="workflow-path" 
            d="M 50,200 C 250,150 350,250 550,200 S 850,150 1050,200 S 1350,250 1440,200"
            stroke="url(#pathGrad)" stroke-width="3" fill="none" filter="url(#glow)">
        <animate attributeName="stroke-dashoffset" from="0" to="50" dur="3s" repeatCount="indefinite"/>
      </path>
      
      <path class="workflow-path" 
            d="M 50,400 C 250,450 350,350 550,400 S 850,450 1050,400 S 1350,350 1440,400"
            stroke="url(#pathGrad)" stroke-width="2" fill="none" opacity="0.6">
        <animate attributeName="stroke-dashoffset" from="0" to="50" dur="4s" repeatCount="indefinite"/>
      </path>
      
      <path class="workflow-path" 
            d="M 50,600 C 250,550 350,650 550,600 S 850,550 1050,600 S 1350,650 1440,600"
            stroke="url(#pathGrad)" stroke-width="2" fill="none" opacity="0.4">
        <animate attributeName="stroke-dashoffset" from="0" to="50" dur="5s" repeatCount="indefinite"/>
      </path>
      
      <!-- Data flow nodes -->
      <g class="nodes">
        <circle cx="200" cy="200" r="6" fill="#a855f7" opacity="0.8">
          <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="550" cy="200" r="6" fill="#c084fc" opacity="0.8">
          <animate attributeName="r" values="6;10;6" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="900" cy="200" r="6" fill="#8b5cf6" opacity="0.8">
          <animate attributeName="r" values="5;9;5" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="1200" cy="200" r="6" fill="#a855f7" opacity="0.8">
          <animate attributeName="r" values="4;8;4" dur="2.2s" repeatCount="indefinite"/>
        </circle>
      </g>
      
      <!-- Moving data packets -->
      <circle class="data-packet" r="3" fill="#a855f7">
        <animateMotion dur="6s" repeatCount="indefinite"
          path="M 50,200 C 250,150 350,250 550,200 S 850,150 1050,200 S 1350,250 1440,200"/>
      </circle>
      <circle class="data-packet" r="3" fill="#c084fc" opacity="0.7">
        <animateMotion dur="8s" repeatCount="indefinite"
          path="M 50,400 C 250,450 350,350 550,400 S 850,450 1050,400 S 1350,350 1440,400"/>
      </circle>
    </svg>
    
    <!-- Directional arrows -->
    <div class="arrows">
      <svg class="arrow" v-for="i in 8" :key="i" :style="getArrowStyle(i)" 
           width="40" height="20" viewBox="0 0 40 20">
        <path d="M 0 10 L 30 10 M 25 5 L 35 10 L 25 15" 
              stroke="rgba(168, 85, 247, 0.2)" 
              stroke-width="2" 
              fill="none"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
const getArrowStyle = (index) => {
  const positions = [
    { top: '20%', left: '25%', rotate: '0deg' },
    { top: '35%', left: '60%', rotate: '15deg' },
    { top: '50%', left: '15%', rotate: '-10deg' },
    { top: '65%', left: '75%', rotate: '5deg' },
    { top: '25%', left: '80%', rotate: '-15deg' },
    { top: '70%', left: '40%', rotate: '20deg' },
    { top: '45%', left: '90%', rotate: '0deg' },
    { top: '80%', left: '20%', rotate: '10deg' },
  ]
  
  const pos = positions[index - 1]
  return {
    ...pos,
    transform: `rotate(${pos.rotate})`,
    animationDelay: `${index * 0.5}s`
  }
}
</script>

<style scoped>
.workflow-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  background: linear-gradient(135deg, #fafafa 0%, #faf5ff 50%, #f3e8ff 100%);
}

.workflow-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.workflow-path {
  stroke-dasharray: 20 10;
}

.data-packet {
  filter: drop-shadow(0 0 5px rgba(168, 85, 247, 0.6));
}

.arrows {
  position: absolute;
  inset: 0;
}

.arrow {
  position: absolute;
  animation: fade-pulse 3s ease-in-out infinite;
}

@keyframes fade-pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.5; }
}
</style>
