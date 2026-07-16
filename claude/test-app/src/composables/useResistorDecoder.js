import { ref, computed } from 'vue'
import { COLORS, COLOR_MAP, isValidForPosition } from '../data/colorCode.js'
import { eSeriesScore } from '../data/eSeries.js'

export function useResistorDecoder() {
  const bandCount = ref(4)
  const bands = ref([null, null, null, null]) // null = not yet selected

  function setBandCount(n) {
    const prev = bands.value.slice()
    bands.value = Array.from({ length: n }, (_, i) => prev[i] ?? null)
    bandCount.value = n
  }

  function setBand(index, colorName) {
    const next = bands.value.slice()
    next[index] = colorName
    bands.value = next
  }

  // Decode a specific ordering of color names → { value, tolerance } or null if invalid
  function decodeOrdered(colorNames, count) {
    const digitCount = count === 4 ? 2 : 3
    const multiplierIdx = count === 4 ? 2 : 3
    const toleranceIdx = count === 4 ? 3 : 4

    // Validate all positions
    for (let i = 0; i < count; i++) {
      const name = colorNames[i]
      if (!name) return null
      const color = COLOR_MAP[name]
      if (!color) return null
      if (!isValidForPosition(color, i, count)) return null
    }

    // Compute value
    let digits = 0
    for (let i = 0; i < digitCount; i++) {
      digits = digits * 10 + COLOR_MAP[colorNames[i]].digit
    }
    const multiplier = COLOR_MAP[colorNames[multiplierIdx]].multiplier
    const tolerance = COLOR_MAP[colorNames[toleranceIdx]].tolerance
    const value = digits * multiplier

    return { value, tolerance }
  }

  function formatValue(ohms) {
    if (ohms === 0) return { display: '0', unit: 'Ω' }

    const thresholds = [
      { limit: 1e9, divisor: 1e9, unit: 'GΩ' },
      { limit: 1e6, divisor: 1e6, unit: 'MΩ' },
      { limit: 1e3, divisor: 1e3, unit: 'kΩ' },
      { limit: 1,   divisor: 1,   unit: 'Ω'  },
    ]

    for (const { limit, divisor, unit } of thresholds) {
      if (ohms >= limit) {
        const scaled = ohms / divisor
        // Remove unnecessary trailing zeros
        const display = parseFloat(scaled.toPrecision(3)).toString()
        return { display, unit }
      }
    }

    // Sub-ohm (gold/silver multiplier)
    const display = parseFloat(ohms.toPrecision(3)).toString()
    return { display, unit: 'Ω' }
  }

  const result = computed(() => {
    const count = bandCount.value
    const selected = bands.value

    // Check all bands are selected
    if (selected.some(b => b === null)) {
      return { state: 'idle' }
    }

    const forward = decodeOrdered(selected, count)
    const reversed = decodeOrdered([...selected].reverse(), count)

    if (!forward && !reversed) {
      return { state: 'error', message: 'No valid reading in either direction.' }
    }

    if (forward && !reversed) {
      return { state: 'valid', ...formatValue(forward.value), tolerance: forward.tolerance }
    }

    if (!forward && reversed) {
      return { state: 'valid', ...formatValue(reversed.value), tolerance: reversed.tolerance }
    }

    // Both valid — use E-series to disambiguate
    const fScore = eSeriesScore(forward.value)
    const rScore = eSeriesScore(reversed.value)

    if (fScore > rScore) {
      return { state: 'valid', ...formatValue(forward.value), tolerance: forward.tolerance }
    }
    if (rScore > fScore) {
      return { state: 'valid', ...formatValue(reversed.value), tolerance: reversed.tolerance }
    }

    // Still tied — return both
    return {
      state: 'ambiguous',
      forward: { ...formatValue(forward.value), tolerance: forward.tolerance },
      reversed: { ...formatValue(reversed.value), tolerance: reversed.tolerance },
    }
  })

  // Valid colors for a given band position (used to gray out palette entries)
  function validColorsForPosition(position) {
    return COLORS.filter(c => isValidForPosition(c, position, bandCount.value)).map(c => c.name)
  }

  return { bandCount, bands, result, setBand, setBandCount, validColorsForPosition }
}
