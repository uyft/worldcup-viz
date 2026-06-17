<template>
  <Transition name="splash-fade">
    <div v-if="visible" class="splash-overlay">
      <canvas ref="canvasRef" class="three-canvas"></canvas>

      <div class="hud" :class="{ 'hud-show': showUI }">
        <div class="goal-text">⚽</div>
        <div class="title">世界杯，盛夏</div>
        <div class="sub-title">2026 美加墨 · 欢迎来到世界之巅</div>
        <button class="enter-btn" @click="closeSplash">进入平台</button>
      </div>

      <button v-if="showUI" class="close-btn" @click="closeSplash">×</button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const emit = defineEmits(['done'])

const visible = ref(true)
const showUI = ref(false)
const canvasRef = ref(null)

let renderer = null
let scene = null
let camera = null
let football = null
let goalNet = null
let goalLight = null
let animationId = null
let startTime = 0
let resizeHandler = null

// 这里放你的 glb 足球模型路径
// 推荐放在：public/models/football.glb
const FOOTBALL_GLB_PATH = '/models/football.glb'

onMounted(() => {
  initThree()
  loadFootballModel()
  startTime = performance.now()
  animate()

  setTimeout(() => {
    showUI.value = true
  }, 3400)
})

onBeforeUnmount(() => {
  destroyThree()
})

function initThree() {
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x050b18, 8, 26)

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.set(0, 1.8, 8.5)
  camera.lookAt(0, 1.1, -3.2)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  addLights()
  addStadiumBackground()
  addField()
  addGoal()
  addParticles()

  resizeHandler = () => {
    if (!camera || !renderer) return
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', resizeHandler)
}

function addLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 1.2)
  scene.add(ambient)

  const mainLight = new THREE.DirectionalLight(0xffffff, 3.2)
  mainLight.position.set(-3, 6, 6)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 1024
  mainLight.shadow.mapSize.height = 1024
  scene.add(mainLight)

  const cyanLight = new THREE.PointLight(0x22d3ee, 3.5, 18)
  cyanLight.position.set(3.5, 2.5, 3)
  scene.add(cyanLight)

  const goldLight = new THREE.PointLight(0xfacc15, 2.8, 16)
  goldLight.position.set(-4, 3.2, 1.5)
  scene.add(goldLight)

  goalLight = new THREE.PointLight(0x00e5ff, 0, 9)
  goalLight.position.set(0, 1.6, -4.1)
  scene.add(goalLight)
}

function addStadiumBackground() {
  const bg = new THREE.Mesh(
    new THREE.SphereGeometry(34, 48, 32),
    new THREE.MeshBasicMaterial({
      color: 0x061326,
      side: THREE.BackSide
    })
  )
  scene.add(bg)

  // 顶部球场灯带
  const lightGroup = new THREE.Group()
  for (let i = 0; i < 48; i++) {
    const angle = (-130 + i * (260 / 47)) * Math.PI / 180
    const x = Math.sin(angle) * 12
    const z = -5 + Math.cos(angle) * 5
    const y = 5.1 + Math.sin(i * 0.6) * 0.25
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x9defff })
    )
    bulb.position.set(x, y, z)
    lightGroup.add(bulb)
  }
  scene.add(lightGroup)

  // 大型 2026 背景，用简单透明面片模拟光幕
  const ringGeo = new THREE.RingGeometry(3.8, 4.2, 96)
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide
  })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.position.set(0, 2.4, -8)
  ring.rotation.x = Math.PI / 2
  scene.add(ring)
}

function addField() {
  const field = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 22, 1, 1),
    new THREE.MeshStandardMaterial({
      color: 0x0f5f36,
      roughness: 0.85,
      metalness: 0.05
    })
  )
  field.rotation.x = -Math.PI / 2
  field.position.set(0, -1.05, -2)
  field.receiveShadow = true
  scene.add(field)

  // 草地条纹
  for (let i = 0; i < 8; i++) {
    const stripe = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 1.25),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x1a7f45 : 0x116633,
        transparent: true,
        opacity: 0.18
      })
    )
    stripe.rotation.x = -Math.PI / 2
    stripe.position.set(0, -1.035, -11 + i * 2.5)
    scene.add(stripe)
  }

  // 场地线
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xbff7ff,
    transparent: true,
    opacity: 0.35
  })
  const points = [
    new THREE.Vector3(-6, -1.0, -8),
    new THREE.Vector3(6, -1.0, -8),
    new THREE.Vector3(6, -1.0, 5),
    new THREE.Vector3(-6, -1.0, 5),
    new THREE.Vector3(-6, -1.0, -8)
  ]
  const fieldLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMat)
  scene.add(fieldLine)
}

function addGoal() {
  const goalGroup = new THREE.Group()
  goalGroup.position.set(0, -0.6, -4.8)

  const postMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.15,
    roughness: 0.25,
    emissive: 0x3aa6ff,
    emissiveIntensity: 0.12
  })

  const createPost = (x, y, z, sx, sy, sz) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), postMat)
    post.position.set(x, y, z)
    post.castShadow = true
    goalGroup.add(post)
  }

  // 正面门框
  createPost(-2.35, 1.25, 0, 0.08, 2.5, 0.08)
  createPost(2.35, 1.25, 0, 0.08, 2.5, 0.08)
  createPost(0, 2.5, 0, 4.8, 0.08, 0.08)

  // 后方纵深门框
  createPost(-2.35, 1.25, -0.95, 0.06, 2.35, 0.06)
  createPost(2.35, 1.25, -0.95, 0.06, 2.35, 0.06)
  createPost(0, 2.5, -0.95, 4.65, 0.06, 0.06)

  // 连接杆
  createPost(-2.35, 2.5, -0.48, 0.06, 0.06, 1.0)
  createPost(2.35, 2.5, -0.48, 0.06, 0.06, 1.0)
  createPost(-2.35, 0.02, -0.48, 0.05, 0.05, 1.0)
  createPost(2.35, 0.02, -0.48, 0.05, 0.05, 1.0)

  // 球网线条
  const netMat = new THREE.LineBasicMaterial({
    color: 0xbcefff,
    transparent: true,
    opacity: 0.38
  })
  const netGroup = new THREE.Group()

  // 后网竖线
  for (let i = 0; i <= 12; i++) {
    const x = -2.25 + i * (4.5 / 12)
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, 0.05, -0.95),
      new THREE.Vector3(x, 2.45, -0.95)
    ])
    netGroup.add(new THREE.Line(geo, netMat))
  }

  // 后网横线
  for (let i = 0; i <= 8; i++) {
    const y = 0.05 + i * (2.4 / 8)
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2.25, y, -0.95),
      new THREE.Vector3(2.25, y, -0.95)
    ])
    netGroup.add(new THREE.Line(geo, netMat))
  }

  // 左右侧网
  for (let i = 0; i <= 8; i++) {
    const y = 0.05 + i * (2.4 / 8)
    ;[-2.35, 2.35].forEach((x) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, y, 0),
        new THREE.Vector3(x, y, -0.95)
      ])
      netGroup.add(new THREE.Line(geo, netMat))
    })
  }

  goalNet = netGroup
  goalGroup.add(netGroup)
  scene.add(goalGroup)
}

function addParticles() {
  const particleGeo = new THREE.BufferGeometry()
  const count = 220
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18
    positions[i * 3 + 1] = Math.random() * 6
    positions[i * 3 + 2] = -8 + Math.random() * 12
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const particleMat = new THREE.PointsMaterial({
    color: 0x85f3ff,
    size: 0.025,
    transparent: true,
    opacity: 0.55,
    depthWrite: false
  })

  const particles = new THREE.Points(particleGeo, particleMat)
  scene.add(particles)
}

function loadFootballModel() {
  const loader = new GLTFLoader()

  loader.load(
    FOOTBALL_GLB_PATH,
    (gltf) => {
      football = gltf.scene
      football.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          if (child.material) {
            child.material.roughness = 0.38
            child.material.metalness = 0.05
          }
        }
      })
      football.scale.set(0.72, 0.72, 0.72)
      football.position.set(-7, -0.2, 4.5)
      scene.add(football)
    },
    undefined,
    () => {
      // 没有 glb 文件时的备用 3D 球，避免页面空白
      football = createFallbackFootball()
      football.scale.set(0.82, 0.82, 0.82)
      football.position.set(-7, -0.2, 4.5)
      scene.add(football)
      console.warn('football.glb 加载失败，已使用 Three.js 备用球体。请确认 public/models/football.glb 是否存在。')
    }
  )
}

function createFallbackFootball() {
  const group = new THREE.Group()

  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 64, 64),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.32,
      metalness: 0.04
    })
  )
  ball.castShadow = true
  group.add(ball)

  const blackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.42 })
  const patchPositions = [
    [0, 0, 0.735],
    [0.42, 0.32, 0.48],
    [-0.42, 0.32, 0.48],
    [0.45, -0.35, 0.45],
    [-0.45, -0.35, 0.45],
    [0, 0.58, 0.34],
    [0, -0.58, 0.34]
  ]

  patchPositions.forEach(([x, y, z]) => {
    const patch = new THREE.Mesh(new THREE.CircleGeometry(0.16, 5), blackMat)
    patch.position.set(x, y, z)
    patch.lookAt(0, 0, 0)
    patch.rotateY(Math.PI)
    group.add(patch)
  })

  return group
}

function animate() {
  animationId = requestAnimationFrame(animate)
  const now = performance.now()
  const elapsed = (now - startTime) / 1000

  updateFootball(elapsed)
  updateGoalEffect(elapsed)

  renderer.render(scene, camera)
}

function updateFootball(elapsed) {
  if (!football) return

  const duration = 3.0
  const t = Math.min(elapsed / duration, 1)
  const ease = easeOutCubic(t)

  // 三点贝塞尔曲线：左前方起脚 → 高弧线 → 射入球门
  const p0 = new THREE.Vector3(-7.2, -0.45, 4.8)
  const p1 = new THREE.Vector3(-2.6, 4.0, 1.0)
  const p2 = new THREE.Vector3(0, 1.1, -4.95)
  const pos = quadraticBezier(p0, p1, p2, ease)

  football.position.copy(pos)

  // 前半段逐渐放大，后半段进入球门略变小，形成景深
  const scale = 0.42 + Math.sin(Math.min(t, 0.75) / 0.75 * Math.PI) * 0.55 + t * 0.22
  const finalScale = t > 0.78 ? scale * (1 - (t - 0.78) * 0.9) : scale
  football.scale.setScalar(Math.max(finalScale, 0.52))

  // 真实 3D 旋转：三个轴一起转
  football.rotation.x += 0.12
  football.rotation.y += 0.18
  football.rotation.z -= 0.1

  // 临近球门时轻微镜头震动
  if (t > 0.84 && t < 0.98) {
    const shake = Math.sin(elapsed * 70) * 0.015
    camera.position.x = shake
    camera.position.y = 1.8 + Math.cos(elapsed * 55) * 0.01
  } else {
    camera.position.x += (0 - camera.position.x) * 0.08
    camera.position.y += (1.8 - camera.position.y) * 0.08
  }
}

function updateGoalEffect(elapsed) {
  if (!goalNet || !goalLight) return

  if (elapsed > 2.55 && elapsed < 3.35) {
    const k = Math.sin((elapsed - 2.55) * Math.PI * 8) * 0.045
    goalNet.position.z = k
    goalLight.intensity = 6.5 * (1 - (elapsed - 2.55) / 0.8)
  } else {
    goalNet.position.z *= 0.86
    goalLight.intensity *= 0.9
  }
}

function quadraticBezier(p0, p1, p2, t) {
  const oneMinusT = 1 - t
  return new THREE.Vector3(
    oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
    oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y,
    oneMinusT * oneMinusT * p0.z + 2 * oneMinusT * t * p1.z + t * t * p2.z
  )
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3)
}

function closeSplash() {
  showUI.value = false
  setTimeout(() => {
    visible.value = false
    emit('done')
    destroyThree()
  }, 320)
}

function destroyThree() {
  if (animationId) cancelAnimationFrame(animationId)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)

  if (scene) {
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose && m.dispose())
        } else {
          obj.material.dispose && obj.material.dispose()
        }
      }
    })
  }

  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss && renderer.forceContextLoss()
  }
}
</script>

<style scoped>
.splash-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 45%, rgba(34, 211, 238, 0.13), transparent 32%),
    linear-gradient(135deg, #020817 0%, #071426 48%, #020617 100%);
}

.three-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

.hud {
  position: absolute;
  left: 50%;
  bottom: 9%;
  transform: translateX(-50%) translateY(24px);
  z-index: 5;
  width: min(520px, 86vw);
  padding: 24px 28px 26px;
  text-align: center;
  border-radius: 24px;
  background: rgba(6, 18, 38, 0.62);
  border: 1px solid rgba(34, 211, 238, 0.28);
  box-shadow: 0 0 35px rgba(34, 211, 238, 0.18);
  backdrop-filter: blur(12px);
  opacity: 0;
  pointer-events: none;
  transition: all 0.55s ease;
}

.hud-show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}

.goal-text {
  font-size: 72px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: 8px;
  color: #facc15;
  text-shadow:
    0 0 18px rgba(250, 204, 21, 0.9),
    0 0 50px rgba(250, 204, 21, 0.4),
    0 0 80px rgba(34, 211, 238, 0.2);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { text-shadow: 0 0 18px rgba(250, 204, 21, 0.9), 0 0 50px rgba(250, 204, 21, 0.4), 0 0 80px rgba(34, 211, 238, 0.2); }
  50% { text-shadow: 0 0 28px rgba(250, 204, 21, 1), 0 0 70px rgba(250, 204, 21, 0.6), 0 0 110px rgba(34, 211, 238, 0.35); }
}

.title {
  margin-top: 14px;
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 6px;
  background: linear-gradient(135deg, #22d3ee 0%, #facc15 50%, #22d3ee 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer-text 3s linear infinite;
}

@keyframes shimmer-text {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

.sub-title {
  margin-top: 10px;
  font-size: 18px;
  font-weight: 600;
  color: rgba(159, 183, 216, 0.9);
  letter-spacing: 3px;
}

.enter-btn {
  margin-top: 20px;
  width: 172px;
  height: 44px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 800;
  color: #03111f;
  background: linear-gradient(135deg, #22d3ee, #60a5fa);
  box-shadow: 0 0 26px rgba(34, 211, 238, 0.42);
  transition: all 0.25s ease;
}

.enter-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 0 38px rgba(34, 211, 238, 0.68);
}

.close-btn {
  position: absolute;
  top: 28px;
  right: 32px;
  z-index: 6;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(8, 20, 40, 0.55);
  color: #fff;
  font-size: 30px;
  line-height: 38px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.25s ease;
}

.close-btn:hover {
  background: rgba(34, 211, 238, 0.22);
  transform: rotate(90deg) scale(1.06);
}

.splash-fade-leave-active {
  transition: opacity 0.45s ease;
}
.splash-fade-leave-to {
  opacity: 0;
}
</style>
