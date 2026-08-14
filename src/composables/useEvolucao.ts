import { computed, type Ref } from 'vue'
import type { Processo } from '../stores/processos'

export type Periodo = '3m' | '6m' | '1a' | '5a'

interface ClienteSimples {
  criadoEm?: any
}

function toDate(value: any): Date {
  if (!value) return new Date(NaN)
  if (value._seconds !== undefined) return new Date(value._seconds * 1000)
  return new Date(value)
}

const QUANTIDADE_MESES: Record<Periodo, number> = {
  '3m': 3,
  '6m': 6,
  '1a': 12,
  '5a': 60,
}

function mesesDoPeriodo(periodo: Periodo): Date[] {
  const agora = new Date()
  const quantidade = QUANTIDADE_MESES[periodo]
  const meses: Date[] = []
  for (let i = quantidade - 1; i >= 0; i--) {
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1)
    meses.push(d)
  }
  return meses
}

function chaveMes(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const NOMES_MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function formatarLabel(d: Date, periodo: Periodo): string {
  const nome = NOMES_MESES[d.getMonth()] ?? ''
  if (periodo === '5a' || periodo === '1a') {
    return `${nome}/${String(d.getFullYear()).slice(2)}`
  }
  return nome
}

export function useEvolucao(
  processos: Ref<Processo[]>,
  clientes: Ref<ClienteSimples[]>,
  periodo: Ref<Periodo>,
) {
  const labels = computed(() => {
    const meses = mesesDoPeriodo(periodo.value)
    return meses.map(m => formatarLabel(m, periodo.value))
  })

  const novosProcessos = computed(() => {
    const meses = mesesDoPeriodo(periodo.value)
    const buckets: Record<string, number> = {}
    for (const m of meses) buckets[chaveMes(m)] = 0

    for (const p of processos.value) {
      const d = toDate(p.criadoEm)
      if (isNaN(d.getTime())) continue
      const key = chaveMes(d)
      if (key in buckets) buckets[key]!++
    }
    return meses.map(m => buckets[chaveMes(m)] ?? 0)
  })

  const processosConcluidos = computed(() => {
    const meses = mesesDoPeriodo(periodo.value)
    const buckets: Record<string, number> = {}
    for (const m of meses) buckets[chaveMes(m)] = 0

    for (const p of processos.value) {
      if (!p.statusHistory) continue
      const concluido = p.statusHistory.find(s => s.status === 'Concluído / Registrado')
      if (!concluido) continue
      const d = toDate(concluido.data)
      if (isNaN(d.getTime())) continue
      const key = chaveMes(d)
      if (key in buckets) buckets[key]!++
    }
    return meses.map(m => buckets[chaveMes(m)] ?? 0)
  })

  const novosClientes = computed(() => {
    const meses = mesesDoPeriodo(periodo.value)
    const buckets: Record<string, number> = {}
    for (const m of meses) buckets[chaveMes(m)] = 0

    for (const c of clientes.value) {
      const d = toDate(c.criadoEm)
      if (isNaN(d.getTime())) continue
      const key = chaveMes(d)
      if (key in buckets) buckets[key]!++
    }
    return meses.map(m => buckets[chaveMes(m)] ?? 0)
  })

  return {
    labels,
    novosProcessos,
    processosConcluidos,
    novosClientes,
  }
}