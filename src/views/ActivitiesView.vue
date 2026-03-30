<script setup>
import { ref, onMounted } from 'vue'
import { useAttributesStore } from '../stores/attributes'
import { useActivitiesStore } from '../stores/activities'
import ActivityModal from '../components/matrix/ActivityModal.vue'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'

const attributesStore = useAttributesStore()
const activitiesStore = useActivitiesStore()

const loaded = ref(false)
const modalOpen = ref(false)
const deleteTarget = ref(null)

function openNewActivity() {
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

async function handleDelete() {
  if (deleteTarget.value) {
    await activitiesStore.deleteActivity(deleteTarget.value)
    deleteTarget.value = null
  }
}

async function updateAttrValue(activityId, attrId, newValueId) {
  const act = activitiesStore.activitiesWithValues.find(a => a.id === activityId)
  if (!act) return
  const valueIds = []
  for (const attr of attributesStore.attributesWithValues) {
    if (attr.id === attrId) {
      if (newValueId) valueIds.push(newValueId)
    } else {
      const existing = act.valuesByAttribute?.[attr.id]
      if (existing) valueIds.push(existing)
    }
  }
  await activitiesStore.updateActivity(activityId, act.name, valueIds)
}

async function updateName(activityId, newName) {
  const act = activitiesStore.activitiesWithValues.find(a => a.id === activityId)
  if (!act || !newName.trim()) return
  const valueIds = Object.values(act.valuesByAttribute || {}).filter(Boolean)
  await activitiesStore.updateActivity(activityId, newName.trim(), valueIds)
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
        <h2 class="text-xl font-bold text-gray-900">Actividades</h2>
        <button
          class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-emerald-500 text-white text-base font-bold rounded-2xl hover:from-brand-600 hover:to-emerald-600 shadow-md hover:shadow-lg transition-all active:scale-[0.97]"
          @click="openNewActivity"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M12 5v14m-7-7h14" />
          </svg>
          Nueva actividad
        </button>
      </div>

      <div class="bg-surface-raised rounded-xl border border-gray-200/80 shadow-sm overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200/60 bg-gray-50/80">
              <th class="text-left px-4 py-3 text-sm font-bold text-gray-700">Nombre</th>
              <th class="px-4 py-3 w-20"></th>
              <th
                v-for="attr in attributesStore.attributesWithValues"
                :key="attr.id"
                class="text-left px-4 py-3 text-sm font-bold text-gray-700"
              >
                {{ attr.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="act in activitiesStore.activitiesWithValues"
              :key="act.id"
              class="border-b border-gray-100 hover:bg-brand-50/30 transition-colors"
            >
              <td class="px-4 py-2.5">
                <input
                  :value="act.name"
                  class="w-full bg-transparent text-base font-bold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/30 rounded-lg px-2 py-1 -mx-2 transition-shadow"
                  @blur="updateName(act.id, $event.target.value)"
                  @keyup.enter="$event.target.blur()"
                />
              </td>
              <td class="px-4 py-2.5 text-center">
                <button
                  class="text-gray-300 hover:text-red-500 transition-colors"
                  @click="deleteTarget = act.id"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
              <td
                v-for="attr in attributesStore.attributesWithValues"
                :key="attr.id"
                class="px-4 py-2.5"
              >
                <select
                  :value="act.valuesByAttribute?.[attr.id] || ''"
                  class="bg-transparent text-sm text-gray-700 border border-transparent rounded-lg px-2 py-1.5 cursor-pointer hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all w-full"
                  @change="updateAttrValue(act.id, attr.id, $event.target.value || null)"
                >
                  <option value="">–</option>
                  <option v-for="val in attr.values" :key="val.id" :value="val.id">
                    {{ val.label }}
                  </option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="!activitiesStore.activitiesWithValues.length" class="text-gray-400 text-sm text-center py-12">
          No hay actividades.
        </p>
      </div>
    </template>

    <ActivityModal :open="modalOpen" @close="closeModal" />
    <ConfirmDialog
      :open="!!deleteTarget"
      message="¿Eliminar esta actividad?"
      @confirm="handleDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
