<script setup lang="ts">
import type { Periodo } from '../composables/useEvolucao'

defineProps<{
  modelValue: Periodo
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Periodo]
}>()

const opcoes: { value: Periodo; label: string }[] = [
  { value: '3m', label: '3 meses' },
  { value: '6m', label: '6 meses' },
  { value: '1a', label: '1 ano' },
  { value: '5a', label: '5 anos' },
]

function selecionar(value: Periodo) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="period-selector">
    <button
      v-for="opcao in opcoes"
      :key="opcao.value"
      class="period-option"
      :class="{ 'period-option-active': modelValue === opcao.value }"
      @click="selecionar(opcao.value)"
    >
      {{ opcao.label }}
    </button>
  </div>
</template>

<style scoped>
.period-selector {
  display: inline-flex;
  gap: 4px;
  background: rgba(17, 39, 82, 0.06);
  border-radius: 10px;
  padding: 4px;
}

.period-option {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #44464f;
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.period-option:hover:not(.period-option-active) {
  color: #112752;
  background: rgba(255, 255, 255, 0.6);
}

.period-option-active {
  background: #112752;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(17, 39, 82, 0.25);
}

@media (max-width: 767px) {
  .period-selector {
    width: 100%;
    justify-content: space-between;
  }

  .period-option {
    flex: 1;
    text-align: center;
    padding: 8px 4px;
    font-size: 12px;
  }
}
</style>