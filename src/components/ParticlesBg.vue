<template>
  <canvas ref="canvasRef" class="particles-bg"></canvas>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvasRef = ref(null)

let ctx = null
let width = 0
let height = 0
let particles = []
let animationId = null

const PARTICLE_COUNT = 90
const LINE_DISTANCE = 130

function random(min, max) {
  return Math.random() * (max - min) + min
}

function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return

  ctx = canvas.getContext('2d')

  width = window.innerWidth
  height = window.innerHeight

  canvas.width = width * window.devicePixelRatio
  canvas.height = height * window.devicePixelRatio
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)

  particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: random(0, width),
    y: random(0, height),
    vx: random(-0.25, 0.25),
    vy: random(-0.25, 0.25),
    r: random(1, 2.4),
    alpha: random(0.35, 0.9),
    colorType: Math.random()
  }))
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#050b18')
  gradient.addColorStop(0.45, '#07152f')
  gradient.addColorStop(1, '#0b1f46')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // 大面积柔光
  const glow1 = ctx.createRadialGradient(width * 0.18, height * 0.18, 0, width * 0.18, height * 0.18, 420)
  glow1.addColorStop(0, 'rgba(34, 211, 238, 0.13)')
  glow1.addColorStop(1, 'rgba(34, 211, 238, 0)')
  ctx.fillStyle = glow1
  ctx.fillRect(0, 0, width, height)

  const glow2 = ctx.createRadialGradient(width * 0.82, height * 0.32, 0, width * 0.82, height * 0.32, 460)
  glow2.addColorStop(0, 'rgba(251, 191, 36, 0.08)')
  glow2.addColorStop(1, 'rgba(251, 191, 36, 0)')
  ctx.fillStyle = glow2
  ctx.fillRect(0, 0, width, height)
}

function drawGrid() {
  ctx.save()
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.035)'
  ctx.lineWidth = 1

  const gridSize = 80

  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  ctx.restore()
}

function drawParticles() {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]

    p.x += p.vx
    p.y += p.vy

    if (p.x < -20) p.x = width + 20
    if (p.x > width + 20) p.x = -20
    if (p.y < -20) p.y = height + 20
    if (p.y > height + 20) p.y = -20

    const color =
      p.colorType > 0.82
        ? `rgba(251, 191, 36, ${p.alpha})`
        : `rgba(34, 211, 238, ${p.alpha})`

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.shadowBlur = 14
    ctx.shadowColor = color
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i]
      const p2 = particles[j]

      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < LINE_DISTANCE) {
        const opacity = (1 - dist / LINE_DISTANCE) * 0.18

        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
  }
}

function animate() {
  if (!ctx) return

  ctx.clearRect(0, 0, width, height)

  drawBackground()
  drawGrid()
  drawLines()
  drawParticles()

  animationId = requestAnimationFrame(animate)
}

function handleResize() {
  cancelAnimationFrame(animationId)
  initCanvas()
  animate()
}

onMounted(() => {
  initCanvas()
  animate()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.particles-bg {
  position: fixed;
  inset: 0;
  z-index: -10;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
</style>