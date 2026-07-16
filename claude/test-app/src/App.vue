<template>
  <div class="app">
    <h1 class="title">Resistor Decoder</h1>

    <!-- Band count toggle -->
    <div class="band-count-toggle">
      <button
        v-for="n in [4, 5]"
        :key="n"
        class="toggle-btn"
        :class="{ active: bandCount === n }"
        @click="setBandCount(n)"
      >
        {{ n }}-band
      </button>
    </div>

    <!-- Resistor SVG -->
    <div class="visual-wrapper">
      <ResistorVisual :bands="bands" :bandCount="bandCount" />
    </div>

    <!-- Band selectors -->
    <div class="bands-row">
      <BandSelector
        v-for="(band, i) in bands"
        :key="i"
        :index="i"
        :modelValue="band"
        :validColors="validColorsForPosition(i)"
        :roleLabel="roleLabel(i)"
        @update:modelValue="(color) => setBand(i, color)"
      />
    </div>

    <!-- Result -->
    <div class="result-wrapper">
      <ResultDisplay :result="result" />
    </div>
  </div>
</template>

<script setup>
import { useResistorDecoder } from './composables/useResistorDecoder.js'
import BandSelector from './components/BandSelector.vue'
import ResistorVisual from './components/ResistorVisual.vue'
import ResultDisplay from './components/ResultDisplay.vue'

const { bandCount, bands, result, setBand, setBandCount, validColorsForPosition } = useResistorDecoder()

function roleLabel(index) {
  const digitCount = bandCount.value === 4 ? 2 : 3
  const multiplierIdx = bandCount.value === 4 ? 2 : 3
  const toleranceIdx = bandCount.value === 4 ? 3 : 4
  if (index < digitCount) return 'digit'
  if (index === multiplierIdx) return 'multiplier'
  if (index === toleranceIdx) return 'tolerance'
  return ''
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  width: 100%;
}

.title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f9fafb;
}

.band-count-toggle {
  display: flex;
  gap: 8px;
  background: #1f2937;
  border-radius: 8px;
  padding: 4px;
}

.toggle-btn {
  padding: 6px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #9ca3af;
  transition: background 0.15s, color 0.15s;
}

.toggle-btn.active {
  background: #374151;
  color: #f9fafb;
}

.toggle-btn:hover:not(.active) {
  color: #d1d5db;
}

.visual-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.bands-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.result-wrapper {
  width: 100%;
  background: #1f2937;
  border-radius: 12px;
  border: 1px solid #374151;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
