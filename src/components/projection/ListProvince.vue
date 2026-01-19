//ListProvince.vue
<template>
  <div class="dropdown-cell">
    <label class="dropdown-label">
      Province:
      <select v-model="selectedProvince" class="dropdown-select">
        <option v-for="province in provinces" :key="province" :value="province">
          {{ province }}
        </option>
      </select>
    </label>

    <label class="dropdown-label">
      Model:
      <select v-model="selectedModel" class="dropdown-select">
        <option v-for="model in models" :key="model" :value="model">
          {{ model }}
        </option>
      </select>
    </label>

    <p>Selected Province: {{ selectedProvince }}</p>
    <p>Selected Model: {{ selectedModel }}</p>
  </div>
</template>

<script setup lang="ts">
  import { ref, watchEffect, watch } from 'vue'

  // Props
  interface Props {
    provinces: string[]
    models: string[]
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    (e: 'update-selection', payload: { province: string; model: string }): void
  }>()

  // Reactive selected values
  const selectedProvince = ref('')
  const selectedModel = ref('')

  // Update defaults if props change (optional)
  watchEffect(() => {
    if (!selectedProvince.value && props.provinces.length > 0) selectedProvince.value = props.provinces[0]
    if (!selectedModel.value && props.models.length > 0) selectedModel.value = props.models[0]
  })

  // Emit whenever selection changes
  watch([selectedProvince, selectedModel], () => {
    emit('update-selection', {
      province: selectedProvince.value,
      model: selectedModel.value,
    })
  })
</script>

<style scoped>
  .dropdown-cell {
    display: flex;
    flex-direction: column;
    gap: 1rem; /* space between rows */
  }

  .dropdown-label {
    display: flex;
    flex-direction: column;
    font-weight: bold;
    font-family: sans-serif;
    gap: 0.5rem;
  }

  /* Styled dropdown similar to your button style */
  .dropdown-select {
    background-color: #e5e7eb; /* bg-gray-200 */
    color: #111827; /* text-gray-900 */
    width: 10rem; /* ~w-40 */
    text-align: center;
    font-weight: bold;
    padding: 0.5rem 1rem; /* py-2 px-4 */
    border-radius: 0.5rem; /* rounded */
    border: 1px solid #d1d5db; /* optional border */
    appearance: none; /* remove default arrow style */
    cursor: pointer;
    transition:
      background-color 0.2s,
      transform 0.1s;
  }

  /* Hover effect similar to a button */
  .dropdown-select:hover {
    background-color: #d1d5db; /* slightly darker */
    transform: scale(1.02);
  }

  .dropdown-select:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6; /* optional blue focus ring */
  }
</style>
