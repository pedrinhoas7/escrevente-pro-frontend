<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { FiltroPeriodo } from '../composables/useRelatorio'

const props = defineProps<{
  modelValue: FiltroPeriodo
  dataInicio?: string
  dataFim?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: FiltroPeriodo]
  'update:dataInicio': [value: string]
  'update:dataFim': [value: string]
}>()

const presets: { value: FiltroPeriodo; label: string }[] = [
  { value: '3m', label: '3 meses' },
  { value: '6m', label: '6 meses' },
  { value: '1a', label: '1 ano' },
  { value: '5a', label: '5 anos' },
  { value: 'personalizado', label: 'Personalizado' },
]

const mostrarCalendario = computed(() => props.modelValue === 'personalizado')

const inicioLocal = ref(props.dataInicio ?? '')
const fimLocal = ref(props.dataFim ?? '')

watch(() => props.dataInicio, (v) => { inicioLocal.value = v ?? '' })
watch(() => props.dataFim, (v) => { fimLocal.value = v ?? '' })

watch(inicioLocal, (v) => emit('update:dataInicio', v))
watch(fimLocal, (v) => emit('update:dataFim', v))

function selecionar(value: FiltroPeriodo) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="period-filter">
    <div class="filter-presets">
      <button
        v-for="preset in presets"
        :key="preset.value"
        class="preset-option"
        :class="{ 'preset-option-active': modelValue === preset.value }"
        @click="selecionar(preset.value)"
      >
        {{ preset.label }}
      </button>
    </div>

    <Transition name="calendario">
      <div v-if="mostrarCalendario" class="calendario-row">
        <div class="calendario-field">
          <label class="calendario-label">Data inicial</label>
          <input
            type="date"
            v-model="inicioLocal"
            class="calendario-input"
          />
        </div>
        <span class="calendario-separator">até</span>
        <div class="calendario-field">
          <label class="calendario-label">Data final</label>
          <input
            type="date"
            v-model="fimLocal"
            class="calendario-input"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.period-filter {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-presets {
  display: inline-flex;
  gap: 4px;
  background: rgba(17, 39, 82, 0.06);
  border-radius: 10px;
  padding: 4px;
  flex-wrap: wrap;
}

.preset-option {
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

.preset-option:hover:not(.preset-option-active) {
  color: #112752;
  background: rgba(255, 255, 255, 0.6);
}

.preset-option-active {
  background: #112752;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(17, 39, 82, 0.25);
}

.calendario-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.calendario-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.calendario-label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.calendario-input {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #112752;
  background: #ffffff;
  border: 1px solid rgba(117, 119, 128, 0.25);
  border-radius: 8px;
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.calendario-input:focus {
  border-color: #112752;
  box-shadow: 0 0 0 3px rgba(17, 39, 82, 0.1);
}

.calendario-separator {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #6B7280;
  padding-bottom: 12px;
}

.calendario-enter-active,
.calendario-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.calendario-enter-from,
.calendario-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: -16px;
}

.calendario-enter-to,
.calendario-leave-from {
  opacity: 1;
  max-height: 80px;
}

@media (max-width: 767px) {
  .filter-presets {
    width: 100%;
    justify-content: space-between;
  }

  .preset-option {
    flex: 1;
    text-align: center;
    padding: 8px 4px;
    font-size: 11px;
  }

  .calendario-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .calendario-separator {
    display: none;
  }
}
</style>