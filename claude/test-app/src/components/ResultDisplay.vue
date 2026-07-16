<template>
  <div class="result-display">
    <!-- Idle -->
    <div v-if="result.state === 'idle'" class="result-idle">
      Select all bands to decode
    </div>

    <!-- Error -->
    <div v-else-if="result.state === 'error'" class="result-error">
      <span class="result-icon">⚠</span>
      {{ result.message }}
    </div>

    <!-- Valid -->
    <div v-else-if="result.state === 'valid'" class="result-valid">
      <span class="result-value">{{ result.display }}</span>
      <span class="result-unit">{{ result.unit }}</span>
      <span class="result-tolerance">±{{ result.tolerance }}%</span>
    </div>

    <!-- Ambiguous -->
    <div v-else-if="result.state === 'ambiguous'" class="result-ambiguous">
      <div class="ambiguous-label">Ambiguous — both directions are valid</div>
      <div class="ambiguous-cards">
        <div class="ambiguous-card">
          <div class="card-direction">Forward</div>
          <div class="card-value">
            <span class="result-value">{{ result.forward.display }}</span>
            <span class="result-unit">{{ result.forward.unit }}</span>
          </div>
          <div class="card-tolerance">±{{ result.forward.tolerance }}%</div>
        </div>
        <div class="ambiguous-divider">or</div>
        <div class="ambiguous-card">
          <div class="card-direction">Reversed</div>
          <div class="card-value">
            <span class="result-value">{{ result.reversed.display }}</span>
            <span class="result-unit">{{ result.reversed.unit }}</span>
          </div>
          <div class="card-tolerance">±{{ result.reversed.tolerance }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  result: { type: Object, required: true },
})
</script>

<style scoped>
.result-display {
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.result-idle {
  color: #6b7280;
  font-size: 15px;
}

.result-error {
  color: #f87171;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-icon {
  font-size: 18px;
}

.result-valid {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.result-value {
  font-size: 48px;
  font-weight: 700;
  color: #f0f0f0;
  line-height: 1;
}

.result-unit {
  font-size: 28px;
  font-weight: 500;
  color: #d1d5db;
}

.result-tolerance {
  font-size: 18px;
  color: #9ca3af;
  margin-left: 8px;
  align-self: center;
}

.result-ambiguous {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.ambiguous-label {
  font-size: 13px;
  color: #f59e0b;
}

.ambiguous-cards {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ambiguous-card {
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 8px;
  padding: 12px 20px;
  text-align: center;
  min-width: 120px;
}

.card-direction {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
  margin-bottom: 6px;
}

.card-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 3px;
}

.card-value .result-value {
  font-size: 28px;
}

.card-value .result-unit {
  font-size: 18px;
}

.card-tolerance {
  font-size: 13px;
  color: #9ca3af;
  margin-top: 4px;
}

.ambiguous-divider {
  color: #6b7280;
  font-size: 14px;
  font-style: italic;
}
</style>
