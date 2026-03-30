<script setup>
import { ref, onMounted } from 'vue'
import { useAttributesStore } from '../stores/attributes'
import { useActivitiesStore } from '../stores/activities'
import DrawingView from '../components/drawing/DrawingView.vue'

const attributesStore = useAttributesStore()
const activitiesStore = useActivitiesStore()

const loaded = ref(false)
const showObligaciones = ref(false)

onMounted(async () => {
  await Promise.all([
    attributesStore.fetchAttributes(),
    activitiesStore.fetchActivities(),
  ])
  loaded.value = true
})
</script>

<template>
  <div>
    <div v-if="!loaded" class="text-center text-gray-400 mt-16 text-sm">Cargando...</div>
    <template v-else>
      <div class="flex items-center justify-end mb-4">
        <label class="flex items-center gap-2.5 cursor-pointer select-none">
          <span class="text-sm font-medium text-gray-600">Mostrar obligaciones</span>
          <button
            role="switch"
            :aria-checked="showObligaciones"
            class="relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            :class="showObligaciones ? 'bg-brand-500' : 'bg-gray-300'"
            @click="showObligaciones = !showObligaciones"
          >
            <span
              class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              :class="showObligaciones ? 'translate-x-4' : ''"
            />
          </button>
        </label>
      </div>
      <DrawingView :show-obligaciones="showObligaciones" />
    </template>
  </div>
</template>
