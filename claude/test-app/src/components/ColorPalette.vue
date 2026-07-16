<template>
  <div class="palette">
    <button
      v-for="color in COLORS"
      :key="color.name"
      class="swatch"
      :class="{ disabled: !validColors.includes(color.name), selected: selected === color.name }"
      :style="{ backgroundColor: color.hex }"
      :title="color.name"
      :disabled="!validColors.includes(color.name)"
      @click="emit('select', color.name)"
    >
      <span class="swatch-label">{{ color.name }}<span class="swatch-value">{{ valueLabel(color) }}</span></span>
    </button>
  </div>
</template>

<script setup>
import { COLORS } from '../data/colorCode.js'

const props = defineProps({
  validColors: { type: Array, required: true },
  selected: { type: String, default: null },
  role: { type: String, default: 'digit' }, // 'digit' | 'multiplier' | 'tolerance'
})

const emit = defineEmits(['select'])

function formatMultiplier(m) {
  if (m >= 1e9) return `x${m / 1e9}G`
  if (m >= 1e6) return `x${m / 1e6}M`
  if (m >= 1e3) return `x${m / 1e3}K`
  return `x${m}`
}

function valueLabel(color) {
  if (props.role === 'digit') {
    return color.digit !== null ? ` (${color.digit})` : ''
  }
  if (props.role === 'multiplier') {
    return color.multiplier !== null ? ` (${formatMultiplier(color.multiplier)})` : ''
  }
  if (props.role === 'tolerance') {
    return color.tolerance !== null ? ` (${color.tolerance}%)` : ''
  }
  return ''
}
</script>

<style scoped>
.palette {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  padding: 10px;
  background: #2a2a2a;
  border-radius: 8px;
  border: 1px solid #444;
  min-width: 200px;
}

.swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-radius: 6px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.15s, opacity 0.15s;
  padding: 2px;
}

.swatch:hover:not(.disabled) {
  border-color: #fff;
}

.swatch.selected {
  border-color: #60a5fa;
}

.swatch.disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.swatch-value {
  text-transform: none;
}

.swatch-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 0 3px rgba(0,0,0,0.9);
  margin-top: 2px;
  pointer-events: none;
}
</style>
