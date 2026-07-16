<template>
  <svg
    viewBox="0 0 300 80"
    xmlns="http://www.w3.org/2000/svg"
    class="resistor-svg"
    aria-label="Resistor diagram"
  >
    <!-- Lead wires -->
    <line x1="0" y1="40" x2="55" y2="40" stroke="#aaa" stroke-width="2.5" />
    <line x1="245" y1="40" x2="300" y2="40" stroke="#aaa" stroke-width="2.5" />

    <!-- Body -->
    <rect x="55" y="20" width="190" height="40" rx="6" ry="6" fill="#d4a96a" />

    <!-- Color bands -->
    <rect
      v-for="(band, i) in bandRects"
      :key="i"
      :x="band.x"
      y="20"
      :width="band.width"
      height="40"
      :fill="band.fill"
      :opacity="band.fill === '#1a1a1a' ? 1 : 0.92"
    />

    <!-- Body outline -->
    <rect x="55" y="20" width="190" height="40" rx="6" ry="6" fill="none" stroke="#a07840" stroke-width="1.5" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { COLOR_MAP } from '../data/colorCode.js'

const props = defineProps({
  bands: { type: Array, required: true },   // array of color name strings or null
  bandCount: { type: Number, required: true },
})

// Layout: body spans x=55 to x=245 (width=190)
// For 4 bands: evenly spaced with gap from edges
// Tolerance band is offset slightly right (wider gap before it)
const bandRects = computed(() => {
  const bodyStart = 55
  const bodyWidth = 190
  const bandW = 14
  const count = props.bandCount

  // x positions for each band
  let positions
  if (count === 4) {
    positions = [75, 103, 131, 210]
  } else {
    positions = [70, 96, 122, 148, 210]
  }

  return props.bands.map((name, i) => ({
    x: positions[i],
    width: bandW,
    fill: name ? (COLOR_MAP[name]?.hex ?? '#333') : '#333',
  }))
})
</script>

<style scoped>
.resistor-svg {
  width: 100%;
  max-width: 360px;
}
</style>
