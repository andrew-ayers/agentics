<template>
  <div class="band-selector" ref="containerRef">
    <div class="band-label">Band {{ index + 1 }}</div>
    <div class="band-role">{{ roleLabel }}</div>
    <button
      class="band-button"
      :style="selectedColor ? { backgroundColor: selectedColor.hex } : {}"
      :class="{ empty: !selectedColor }"
      @click="togglePalette"
    >
      <span v-if="!selectedColor" class="band-placeholder">?</span>
      <span v-else class="band-color-name">{{ modelValue }}</span>
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        class="palette-popover"
        :style="popoverStyle"
        ref="popoverRef"
      >
        <ColorPalette
          :validColors="validColors"
          :selected="modelValue"
          :role="roleLabel"
          @select="onSelect"
        />
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { COLOR_MAP } from '../data/colorCode.js'
import ColorPalette from './ColorPalette.vue'

const props = defineProps({
  index: { type: Number, required: true },
  modelValue: { type: String, default: null },
  validColors: { type: Array, required: true },
  roleLabel: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const containerRef = ref(null)
const popoverRef = ref(null)
const popoverStyle = ref({})

const selectedColor = computed(() => props.modelValue ? COLOR_MAP[props.modelValue] : null)

async function togglePalette() {
  open.value = !open.value
  if (open.value) {
    await nextTick()
    positionPopover()
  }
}

function positionPopover() {
  if (!containerRef.value || !popoverRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const popRect = popoverRef.value.getBoundingClientRect()
  let top = rect.bottom + 8
  let left = rect.left + rect.width / 2 - popRect.width / 2

  // Keep within viewport
  if (left < 8) left = 8
  if (left + popRect.width > window.innerWidth - 8) {
    left = window.innerWidth - popRect.width - 8
  }
  if (top + popRect.height > window.innerHeight - 8) {
    top = rect.top - popRect.height - 8
  }

  popoverStyle.value = { top: `${top + window.scrollY}px`, left: `${left}px` }
}

function onSelect(colorName) {
  emit('update:modelValue', colorName)
  open.value = false
}

function onClickOutside(e) {
  if (
    containerRef.value && !containerRef.value.contains(e.target) &&
    popoverRef.value && !popoverRef.value.contains(e.target)
  ) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<style scoped>
.band-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.band-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
}

.band-role {
  font-size: 10px;
  color: #6b7280;
  text-transform: capitalize;
}

.band-button {
  width: 52px;
  height: 64px;
  border-radius: 6px;
  border: 2px dashed #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, transform 0.1s;
}

.band-button:not(.empty) {
  border-style: solid;
  border-color: rgba(255,255,255,0.2);
}

.band-button:hover {
  border-color: #60a5fa;
  transform: scale(1.05);
}

.band-placeholder {
  font-size: 20px;
  color: #555;
  font-weight: 700;
}

.band-color-name {
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255,255,255,0.85);
  text-shadow: 0 0 4px rgba(0,0,0,0.9);
  text-align: center;
  word-break: break-word;
  padding: 2px;
}

.palette-popover {
  position: absolute;
  z-index: 1000;
}
</style>
