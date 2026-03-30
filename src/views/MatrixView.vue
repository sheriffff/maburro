<script setup>
import { ref, onMounted } from 'vue'
import { useAttributesStore } from '../stores/attributes'
import { useActivitiesStore } from '../stores/activities'
import DrawingView from '../components/drawing/DrawingView.vue'
import ActivityModal from '../components/matrix/ActivityModal.vue'

const attributesStore = useAttributesStore()
const activitiesStore = useActivitiesStore()

const loaded = ref(false)
const modalOpen = ref(false)
const editingActivity = ref(null)
const showObligaciones = ref(false)

function openNewActivity() {
  editingActivity.value = null
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editingActivity.value = null
}

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
      <div class="flex items-center justify-between mb-4">
        <button
          class="flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-xl hover:bg-brand-600 shadow-sm hover:shadow-md transition-all active:scale-[0.97]"
          @click="openNewActivity"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M12 5v14m-7-7h14" />
          </svg>
          Nueva actividad
        </button>

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

    <ActivityModal :open="modalOpen" :activity="editingActivity" @close="closeModal" />
  </div>
</template>
