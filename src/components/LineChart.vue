<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
)

interface Dataset {
  label: string
  data: number[]
  color: string
}

const props = defineProps<{
  labels: string[]
  datasets: Dataset[]
}>()

const isMobile = ref(false)

function updateMobile() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  updateMobile()
  window.addEventListener('resize', updateMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateMobile)
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map(ds => ({
    label: ds.label,
    data: ds.data,
    borderColor: ds.color,
    backgroundColor: ds.color + '15',
    pointBackgroundColor: ds.color,
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6,
    borderWidth: 2.5,
    tension: 0.35,
    fill: true,
  })),
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      labels: {
        font: {
          family: 'Inter',
          size: isMobile.value ? 11 : 12,
        },
        color: '#44464f',
        usePointStyle: true,
        pointStyle: 'circle' as const,
        padding: isMobile.value ? 12 : 16,
        boxWidth: 8,
      },
    },
    tooltip: {
      backgroundColor: '#112752',
      titleFont: { family: 'Inter', size: 13, weight: 600 as const },
      bodyFont: { family: 'Inter', size: 12 },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 4,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        font: { family: 'Inter', size: isMobile.value ? 9 : 11 },
        color: '#6B7280',
        maxRotation: isMobile.value ? 45 : 0,
        minRotation: isMobile.value ? 45 : 0,
        autoSkip: true,
        maxTicksLimit: isMobile.value ? 6 : 12,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(117, 119, 128, 0.1)',
        borderDash: [4, 4],
      },
      border: {
        display: false,
      },
      ticks: {
        font: { family: 'Inter', size: isMobile.value ? 9 : 11 },
        color: '#6B7280',
        precision: 0,
      },
    },
  },
}))
</script>

<template>
  <Line :data="chartData" :options="chartOptions" />
</template>