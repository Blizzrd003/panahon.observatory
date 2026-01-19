<template>
  <div class="graph-container">
    <h3>Graph Projection</h3>

    <p><strong>Province:</strong> {{ selectedProvince }}</p>
    <p><strong>Model:</strong> {{ selectedModel }}</p>
    <button @click="updateChartData">Show Graph</button>
    <div style="width: 100%; height: 400px; position: relative">
      <canvas id="myChart"></canvas>
    </div>
    <table v-if="filteredData && filteredData.length" class="data-table">
      <thead>
        <tr>
          <th>Year</th>
          <th>Anomaly</th>
          <th>Experiment</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredData" :key="index">
          <td>{{ item.year }}</td>
          <td>{{ item.data }}</td>
          <td>{{ item.experiment }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>No data available</p>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import Chart from 'chart.js/auto'

  // Define props
  interface FilteredDataItem {
    year: string
    data: number
    experiment: string
  }

  const props = defineProps<{
    selectedProvince: string
    selectedModel: string
    filteredData: FilteredDataItem[]
  }>()

  function renderChart() {
    const ssp126Data = props.filteredData.filter((item) => item.experiment === 'ssp126')
    const labels = ssp126Data.map((item) => item.year)
    const datasetData = ssp126Data.map((item) => Number(item.data))
    console.log('RenderChart called')

    if (myChart.value) {
      // Update existing chart
      console.log('myChart has a value')
      myChart.value.data.labels = labels
      myChart.value.data.datasets[0].data = datasetData
      myChart.value.data.datasets[0].label = props.selectedProvince
      myChart.value.update('none') // <-- smoothly update the chart
      console.log('updated chart value')
      return
    }
    console.log('myChart has no value')
    // Create chart for the first time
    const data = {
      labels,
      datasets: [
        {
          label: props.selectedProvince,
          backgroundColor: 'rgb(255,99,132)',
          borderColor: 'rgb(255,99,132)',
          data: datasetData,
          fill: false,
          tension: 0.2,
          pointRadius: 4,
        },
      ],
    }

    const config = {
      type: 'line' as const,
      data,
      options: {
        animation: {
          duration: 500, // smooth animation on update
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    }

    const canvas = document.getElementById('myChart') as HTMLCanvasElement
    if (canvas) {
      myChart.value = new Chart(canvas, config)
      console.log('Created new chart')
    }
  }

  // On mounted, render chart
  onMounted(() => {
    if (props.filteredData.length) renderChart()
  })

  // Watch for reactive updates
  watch(
    () => props.filteredData,
    (newData) => {
      if (newData.length) renderChart()
    },
    { deep: true },
  )
</script>

<style scoped>
  #myChart {
    background-color: #ffffff;
  }
  .graph-container {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    color: #111827; /* text-gray-900 */
  }

  /* Body cells */
  .data-table td {
    background-color: transparent; /* transparent */
    color: #ffffff; /* white text */
    border: 1px solid #ccc;
    padding: 0.5rem 1rem;
    text-align: center;
  }
  /* Header */
  .data-table th {
    background-color: #ffffff; /* white */
    color: #000000; /* black text */
    font-weight: bold;
    border: 1px solid #ccc;
    padding: 0.5rem 1rem;
    text-align: center;
  }
</style>
