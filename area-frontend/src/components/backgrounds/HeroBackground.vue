<template>
  <div class="hero-background">
    <!-- Animated gradient orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    
    <!-- Flowing lines SVG -->
    <svg class="flowing-lines" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 800">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a855f7;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#c084fc;stop-opacity:0.1" />
        </linearGradient>
      </defs>
      
      <!-- Flowing paths -->
      <path class="flow-path" d="M0,200 Q360,100 720,200 T1440,200" 
            stroke="url(#grad1)" stroke-width="2" fill="none" opacity="0.4"/>
      <path class="flow-path" d="M0,300 Q360,400 720,300 T1440,300" 
            stroke="url(#grad1)" stroke-width="2" fill="none" opacity="0.3"/>
      <path class="flow-path" d="M0,500 Q360,400 720,500 T1440,500" 
            stroke="url(#grad1)" stroke-width="1.5" fill="none" opacity="0.2"/>
      
      <!-- Connection nodes -->
      <circle class="node" cx="360" cy="150" r="4" fill="#a855f7" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle class="node" cx="720" cy="200" r="4" fill="#c084fc" opacity="0.6">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle class="node" cx="1080" cy="180" r="4" fill="#a855f7" opacity="0.6">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite"/>
      </circle>
    </svg>
    
    <!-- Grid pattern overlay -->
    <div class="grid-overlay"></div>
  </div>
</template>

<style scoped>
.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%);
  top: -150px;
  right: -150px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(192, 132, 252, 0.3) 0%, transparent 70%);
  bottom: -100px;
  left: -100px;
  animation-delay: 7s;
}

.orb-3 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 14s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -30px) scale(1.05); }
  50% { transform: translate(-20px, 20px) scale(0.95); }
  75% { transform: translate(25px, 10px) scale(1.02); }
}

.flowing-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

.flow-path {
  stroke-dasharray: 10 5;
  animation: flow 20s linear infinite;
}

@keyframes flow {
  to { stroke-dashoffset: -100; }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(168, 85, 247, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(168, 85, 247, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%);
}
</style>
