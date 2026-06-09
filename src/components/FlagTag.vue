<template>
  <span class="flag-tag" :class="{ large, small }">
    <img
      :src="`https://flagcdn.com/${size}/${code}.png`"
      :alt="name"
      class="flag-img"
      loading="lazy"
      @error="showFallback = true"
      v-show="!showFallback"
    />
    <span v-if="showFallback" class="flag-fallback">{{ code.toUpperCase() }}</span>
    <span v-if="name" class="flag-name">{{ name }}</span>
  </span>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  code: { type: String, required: true },
  name: { type: String, default: '' },
  large: { type: Boolean, default: false },
  small: { type: Boolean, default: false },
})

const showFallback = ref(false)
const size = computed(() => props.small ? '24x18' : (props.large ? '48x36' : '32x24'))
</script>

<style scoped>
.flag-tag {
  display: inline-flex; align-items: center; gap: 6px;
}
.flag-img {
  border-radius: 3px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  object-fit: cover;
}
.flag-tag.small .flag-img { width: 20px; height: 15px; border-radius: 2px; }
.flag-tag:not(.small):not(.large) .flag-img { width: 26px; height: 19px; }
.flag-tag.large .flag-img { width: 40px; height: 30px; border-radius: 4px; }
.flag-fallback {
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 19px;
  background: #1A2340; border-radius: 3px;
  font-size: 9px; font-weight: 700; color: #8892A6;
}
.flag-name {
  font-size: 14px; font-weight: 500;
  color: #E8ECF1;
}
.flag-tag.small .flag-name { font-size: 12px; }
.flag-tag.large .flag-name { font-size: 16px; font-weight: 600; }
</style>
