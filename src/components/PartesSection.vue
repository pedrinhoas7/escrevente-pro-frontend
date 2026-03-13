<script setup lang="ts">
import { useClientesStore } from '../stores/clientes';

const props = defineProps<{
  partes: {
    outorganteVendedor: string;
    outorganteComprador: string;
    escrevente: string;
    apresentante: string;
  };
}>();

const clientStore = useClientesStore()

const getClientName = (apresentanteId: string) => {
  const client = clientStore.clientes.find(c => c.id === apresentanteId)
  return client ? client.nome : apresentanteId
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-[#1B2A4A]/10 p-6">
    <h3 class="text-xl font-serif font-bold text-[#1B2A4A] mb-4 border-b border-[#C9A84C]/20 pb-2">
      Partes do Processo
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-xs uppercase tracking-wide text-[#6B7280] font-bold mb-1">Outorgante Vendedor</label>
        <p class="text-[#1B2A4A] font-medium">{{ props.partes.outorganteVendedor }}</p>
      </div>
      <div>
        <label class="block text-xs uppercase tracking-wide text-[#6B7280] font-bold mb-1">Outorgante Comprador</label>
        <p class="text-[#1B2A4A] font-medium">{{ props.partes.outorganteComprador }}</p>
      </div>
      <div>
        <label class="block text-xs uppercase tracking-wide text-[#6B7280] font-bold mb-1">Apresentante</label>
        <p class="text-[#1B2A4A] font-medium">{{ getClientName(props.partes.apresentante) }}</p>
      </div>
    </div>
  </div>
</template>
