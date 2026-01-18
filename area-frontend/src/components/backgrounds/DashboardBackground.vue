<template>
  <div class="dashboard-background">
    <!-- Subtle dot pattern -->
    <div class="dot-pattern"></div>
    
    <!-- Minimal waves -->
    <svg class="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path fill="rgba(168, 85, 247, 0.02)" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z">
      </path>
    </svg>
    
    <!-- Floating particles -->
    <div class="particles">
      <div class="particle" v-for="i in 12" :key="i" :style="getParticleStyle(i)"></div>
    </div>
  </div>
</template>

<script setup>
const getParticleStyle = (index) => {
  const positions = [
    { top: '10%', left: '15%' },
    { top: '25%', left: '85%' },
    { top: '40%', left: '25%' },
    { top: '55%', left: '70%' },
    { top: '70%', left: '40%' },
    { top: '15%', left: '60%' },
    { top: '80%', left: '20%' },
    { top: '35%', left: '90%' },
    { top: '60%', left: '10%' },
    { top: '90%', left: '75%' },
    { top: '50%', left: '50%' },
    { top: '5%', left: '35%' },
  ]
  
  const pos = positions[index - 1] || { top: '50%', left: '50%' }
  return {
    ...pos,
    animationDelay: `${index * 0.8}s`,
    animationDuration: `${15 + index * 2}s`
  }
}
</script>

<style scoped>
.dashboard-background {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.dot-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(168, 85, 247, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.5;
}

.waves {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  opacity: 0.3;
}

.particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent);
  border-radius: 50%;
  animation: float-particle linear infinite;
}

@keyframes float-particle {
  0%, 100% { 
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% { 
    transform: translateY(-20px) scale(1.5);
    opacity: 0.6;
  }
}
</style>
