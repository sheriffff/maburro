<script setup>
import { ref } from 'vue'
import { useAttributesStore } from '../../stores/attributes'
import AttributeForm from './AttributeForm.vue'
import ConfirmDialog from '../ui/ConfirmDialog.vue'

const store = useAttributesStore()

const editing = ref(null)
const creating = ref(false)
const deleteTarget = ref(null)

async function handleSave(data) {
  if (data.id) {
    await store.updateAttribute(data.id, data.name)
    const existing = store.getAttributeById(data.id)
    if (existing) {
      const existingIds = new Set(existing.values.map(v => v.id))
      const newIds = new Set(data.values.filter(v => v.id).map(v => v.id))
      for (const v of existing.values) {
        if (!newIds.has(v.id)) await store.deleteAttributeValue(v.id)
      }
      for (const v of data.values) {
        if (v.id && existingIds.has(v.id)) {
          const old = existing.values.find(ev => ev.id === v.id)
          if (old && old.label !== v.label) await store.updateAttributeValue(v.id, v.label)
        } else if (!v.id) {
          await store.addAttributeValue(data.id, v.label)
        }
      }
    }
  } else {
    await store.createAttribute(data.name)
    const attrs = store.attributesWithValues
    const created = attrs[attrs.length - 1]
    if (created) {
      for (const v of data.values) {
        await store.addAttributeValue(created.id, v.label)
      }
    }
  }
  editing.value = null
  creating.value = false
}

async function handleDelete() {
  if (deleteTarget.value) {
    await store.deleteAttribute(deleteTarget.value)
    deleteTarget.value = null
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-lg font-bold text-gray-900">Atributos</h2>
      <button
        v-if="!creating"
        class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm transition-all"
        @click="creating = true; editing = null"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" d="M12 5v14m-7-7h14" />
        </svg>
        Nuevo
      </button>
    </div>

    <AttributeForm
      v-if="creating"
      class="mb-4"
      @save="handleSave"
      @cancel="creating = false"
    />

    <div v-for="attr in store.attributesWithValues" :key="attr.id" class="mb-3">
      <AttributeForm
        v-if="editing === attr.id"
        :attribute="attr"
        @save="handleSave"
        @cancel="editing = null"
      />
      <div v-else class="bg-surface-raised border border-gray-200/80 rounded-xl p-4 flex items-start justify-between shadow-sm hover:shadow transition-shadow">
        <div>
          <p class="font-semibold text-gray-900">{{ attr.name }}</p>
          <div class="flex flex-wrap gap-1.5 mt-2">
            <span
              v-for="val in attr.values"
              :key="val.id"
              class="bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-md text-xs font-medium"
            >
              {{ val.label }}
            </span>
          </div>
        </div>
        <div class="flex gap-3 ml-4 shrink-0">
          <button class="text-sm text-gray-400 hover:text-brand-600 transition-colors" @click="editing = attr.id; creating = false">
            Editar
          </button>
          <button class="text-sm text-gray-400 hover:text-red-500 transition-colors" @click="deleteTarget = attr.id">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <p v-if="!store.attributesWithValues.length && !creating" class="text-gray-400 text-sm text-center mt-8">
      No hay atributos. Crea uno para empezar.
    </p>

    <ConfirmDialog
      :open="!!deleteTarget"
      message="¿Eliminar este atributo y todos sus valores?"
      @confirm="handleDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
