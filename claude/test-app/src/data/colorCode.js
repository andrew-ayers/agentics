// null means "not valid in this role"
export const COLORS = [
  { name: 'black',  hex: '#1a1a1a', digit: 0, multiplier: 1,       tolerance: null, tempCoeff: 250 },
  { name: 'brown',  hex: '#8B4513', digit: 1, multiplier: 10,      tolerance: 1,    tempCoeff: 100 },
  { name: 'red',    hex: '#CC0000', digit: 2, multiplier: 100,     tolerance: 2,    tempCoeff: 50  },
  { name: 'orange', hex: '#FF6600', digit: 3, multiplier: 1000,    tolerance: null, tempCoeff: 15  },
  { name: 'yellow', hex: '#FFCC00', digit: 4, multiplier: 10000,   tolerance: null, tempCoeff: 25  },
  { name: 'green',  hex: '#007700', digit: 5, multiplier: 100000,  tolerance: 0.5,  tempCoeff: 20  },
  { name: 'blue',   hex: '#0000CC', digit: 6, multiplier: 1000000, tolerance: 0.25, tempCoeff: 10  },
  { name: 'violet', hex: '#7F00FF', digit: 7, multiplier: 1e7,     tolerance: 0.1,  tempCoeff: 5   },
  { name: 'gray',   hex: '#888888', digit: 8, multiplier: 1e8,     tolerance: 0.05, tempCoeff: 1   },
  { name: 'white',  hex: '#f0f0f0', digit: 9, multiplier: 1e9,     tolerance: null, tempCoeff: null },
  { name: 'gold',   hex: '#FFD700', digit: null, multiplier: 0.1,  tolerance: 5,    tempCoeff: null },
  { name: 'silver', hex: '#C0C0C0', digit: null, multiplier: 0.01, tolerance: 10,   tempCoeff: null },
]

export const COLOR_MAP = Object.fromEntries(COLORS.map(c => [c.name, c]))

// Aliases for color name input normalization
export const ALIASES = {
  purple: 'violet',
  grey: 'gray',
  pink: 'violet', // sometimes used colloquially
}

export function resolveColor(name) {
  const lower = name.toLowerCase()
  return COLOR_MAP[ALIASES[lower] ?? lower] ?? null
}

// Validity rules by band position
export function isValidForPosition(color, position, bandCount) {
  // position is 0-indexed
  const digitPositions = bandCount === 4 ? [0, 1] : [0, 1, 2]
  const multiplierPosition = bandCount === 4 ? 2 : 3
  const tolerancePosition = bandCount === 4 ? 3 : 4

  if (digitPositions.includes(position)) {
    // Band 1 cannot be black (leading zero) or gold/silver (no digit)
    if (position === 0) return color.digit !== null && color.name !== 'black'
    return color.digit !== null
  }
  if (position === multiplierPosition) return color.multiplier !== null
  if (position === tolerancePosition) return color.tolerance !== null
  return false
}
