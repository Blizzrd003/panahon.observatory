//projection.vue
<template>
  <div class="page-container">
    <!-- Left 20% -->
    <div class="sidebar">
      <ListProvince :provinces="provinces" :models="models" @update-selection="handleUpdate" />
    </div>

    <!-- Right 80% (for future content) -->
    <div class="content">
      <h2>Graph / Projection Area</h2>
      <!-- You can add GraphProjection or other components here -->
      <GraphProjection
        :selectedProvince="selectedProvince"
        :selectedModel="selectedModel"
        :filteredData="filteredData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import GraphProjection from '@/components/projection/GraphProjection.vue'
  import ListProvince from '@/components/projection/ListProvince.vue'

  interface Props {
    provinces: string[]
    models: string[]
  }

  // Define props
  const props = defineProps<Props>()

  // Expose to template
  const provinces = props.provinces
  const models = props.models

  const selectedProvince = ref('')
  const selectedModel = ref('')
  const filteredData = ref<{ year: string; data: number; experiment: string }[]>([])

  // Handler
  function handleUpdate(data: { province: string; model: string }) {
    selectedProvince.value = data.province
    selectedModel.value = data.model
  }

  // Fetch function
  async function fetchFilteredData() {
    if (!selectedProvince.value || !selectedModel.value) return

    const params = new URLSearchParams({
      province: selectedProvince.value,
      model: selectedModel.value,
    })

    try {
      const res = await fetch(`/api/filtereddata?${params}`)
      filteredData.value = await res.json()
    } catch (err) {
      console.error('Failed to fetch filtered data:', err)
    }
  }

  // Initialize selection when props are ready
  watch(
    () => [props.provinces, props.models],
    ([newProvinces, newModels]) => {
      if (newProvinces.length && !selectedProvince.value) {
        selectedProvince.value = newProvinces[0]
      }
      if (newModels.length && !selectedModel.value) {
        selectedModel.value = newModels[0]
      }
      // Only fetch if both are set
      if (selectedProvince.value && selectedModel.value) {
        fetchFilteredData()
      }
    },
    { immediate: true },
  )
  // Watch selection changes
  watch([selectedProvince, selectedModel], () => {
    fetchFilteredData()
  })
</script>

<style scoped>
  .page-container {
    display: flex;
    height: 100vh; /* Full viewport height */
  }

  .sidebar {
    width: 20%;
    padding: 20px;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
  }

  .content {
    width: 80%;
    padding: 20px;
    box-sizing: border-box;
  }
</style>
