<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  status: string;
}>();

const statusColors: Record<string, string> = {
  "Entrada": "bg-[#3B82F6]",
  "Em análise": "bg-[#F59E0B]",
  "Falta de documento": "bg-[#F97316]",
  "Indeferido": "bg-[#EF4444]",
  "Aguardando assinatura": "bg-[#8B5CF6]",
  "Documentação entregue ao cliente": "bg-[#14B8A6]",
  "Concluído / Registrado": "bg-[#22C55E]",
};

const badgeClass = computed(() => {
  return statusColors[props.status] || "bg-gray-500";
});
</script>

<template>
  <span :class="[badgeClass, 'text-white', 'rounded-full', 'px-3', 'py-1', 'text-sm', 'font-medium', 'whitespace-nowrap']">
    {{ status }}
  </span>
</template>
