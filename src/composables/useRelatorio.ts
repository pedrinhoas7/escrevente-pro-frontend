import { computed, type Ref } from 'vue'
import type { Processo } from '../stores/processos'

export type FiltroPeriodo = '3m' | '6m' | '1a' | '5a' | 'personalizado'

function toDate(value: any): Date {
  if (!value) return new Date(NaN)
  if (value._seconds !== undefined) return new Date(value._seconds * 1000)
  return new Date(value)
}

const MESES_PRESET: Record<Exclude<FiltroPeriodo, 'personalizado'>, number> = {
  '3m': 3,
  '6m': 6,
  '1a': 12,
  '5a': 60,
}

function obterRange(periodo: FiltroPeriodo, dataInicio?: string, dataFim?: string): { inicio: Date; fim: Date } {
  const agora = new Date()
  agora.setHours(23, 59, 59, 999)

  if (periodo === 'personalizado') {
    const inicio = dataInicio ? new Date(dataInicio + 'T00:00:00') : new Date(0)
    const fim = dataFim ? new Date(dataFim + 'T23:59:59') : agora
    return { inicio, fim }
  }

  const meses = MESES_PRESET[periodo]
  const inicio = new Date(agora.getFullYear(), agora.getMonth() - meses + 1, 1, 0, 0, 0, 0)
  return { inicio, fim: agora }
}

export function useRelatorio(
  processos: Ref<Processo[]>,
  periodo: Ref<FiltroPeriodo>,
  dataInicio: Ref<string | undefined>,
  dataFim: Ref<string | undefined>,
) {
  const range = computed(() => obterRange(periodo.value, dataInicio.value, dataFim.value))

  const processosFiltrados = computed(() =>
    processos.value.filter(p => {
      const d = toDate(p.criadoEm)
      if (isNaN(d.getTime())) return false
      return d >= range.value.inicio && d <= range.value.fim
    }),
  )

  const totalValorProcessos = computed(() =>
    processosFiltrados.value.reduce((sum, p) => sum + (p.valorProcesso || 0), 0),
  )

  const totalComissaoApresentante = computed(() =>
    processosFiltrados.value.reduce((sum, p) => sum + (p.comissaoApresentante || 0), 0),
  )

  const totalComissaoEscrevente = computed(() =>
    processosFiltrados.value.reduce((sum, p) => sum + (p.comissaoEscrevente || 0), 0),
  )

  const totalEmolumentos = computed(() =>
    processosFiltrados.value.reduce((sum, p) => sum + (p.valorEmolumentos || 0), 0),
  )

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  function formatarData(date: any): string {
    const d = toDate(date)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const periodLabel = computed(() => {
    const { inicio, fim } = range.value
    const fmt = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    return `${fmt(inicio)} — ${fmt(fim)}`
  })

  return {
    range,
    processosFiltrados,
    totalValorProcessos,
    totalComissaoApresentante,
    totalComissaoEscrevente,
    totalEmolumentos,
    formatarMoeda,
    formatarData,
    periodLabel,
  }
}