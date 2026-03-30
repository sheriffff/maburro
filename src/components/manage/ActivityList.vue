<script setup>
import { ref } from 'vue'
import { useActivitiesStore } from '../../stores/activities'
import { useAttributesStore } from '../../stores/attributes'
import ActivityForm from './ActivityForm.vue'
import ConfirmDialog from '../ui/ConfirmDialog.vue'

const activitiesStore = useActivitiesStore()
const attributesStore = useAttributesStore()

const editing = ref(null)
const creating = ref(false)
const deleteTarget = ref(null)

function getValueLabel(valueId) {
  for (const attr of attributesStore.attributesWithValues) {
    const found = attr.values.find(v => v.id === valueId)
    if (found) return { attr: attr.name, label: found.label }
  }
  return null
}

async function handleSave(data) {
  if (data.id) {
    await activitiesStore.updateActivity(data.id, data.name, data.attributeValueIds)
  } else {
    await activitiesStore.createActivity(data.name, data.attributeValueIds)
  }
  editing.value = null
  creating.value = false
}

async function handleDelete() {
  if (deleteTarget.value) {
    await activitiesStore.deleteActivity(deleteTarget.value)
    deleteTarget.value = null
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-800">Actividades</h2>
      <button
        v-if="!creating"
        class="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
        @click="creating = true; editing = null"
      >
        + Nueva
      </button>
    </div>

    <ActivityForm
      v-if="creating"
      @save="handleSave"
      @cancel="creating = false"
    />

    <div v-for="act in activitiesStore.activitiesWithValues" :key="act.id" class="mb-3">
      <ActivityForm
        v-if="editing === act.id"
        :activity="act"
        @save="handleSave"
        @cancel="editing = null"
      />
      <div v-else class="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between">
        <div>
          <p class="font-medium text-gray-800">{{ act.name }}</p>
          <div class="flex flex-wrap gap-1.5 mt-2">
            <span
              v-for="(valueId, attrId) in act.valuesByAttribute"
              :key="attrId"
              class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs"
            >
              {{ getValueLabel(valueId)?.attr }}: {{ getValueLabel(valueId)?.label }}
            </span>
          </div>
        </div>
        <div class="flex gap-2 ml-4 shrink-0">
          <button class="text-sm text-gray-500 hover:text-gray-800" @click="editing = act.id; creating = false">
            Editar
          </button>
          <button class="text-sm text-red-500 hover:text-red-700" @click="deleteTarget = act.id">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <p v-if="!activitiesStore.activitiesWithValues.length && !creating" class="text-gray-400 text-sm">
      No hay actividades.
    </p>

    <ConfirmDialog
      :open="!!deleteTarget"
      message="¿Eliminar esta actividad?"
      @confirm="handleDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
