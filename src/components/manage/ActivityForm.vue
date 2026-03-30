<script setup>
import { ref, watch } from 'vue'
import { useAttributesStore } from '../../stores/attributes'

const attributesStore = useAttributesStore()

const props = defineProps({
  activity: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])

const name = ref('')
const selectedValues = ref({})

watch(() => props.activity, (act) => {
  if (act) {
    name.value = act.name
    selectedValues.value = { ...(act.valuesByAttribute || {}) }
  } else {
    name.value = ''
    selectedValues.value = {}
  }
}, { immediate: true })

function save() {
  if (!name.value.trim()) return
  const attributeValueIds = Object.values(selectedValues.value).filter(Boolean)
  emit('save', {
    id: props.activity?.id || null,
    name: name.value.trim(),
    attributeValueIds,
  })
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
      <input
        v-model="name"
        type="text"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        placeholder="Ej: Pádel"
        @keyup.enter="save"
      />
    </div>
    <div
      v-for="attr in attributesStore.attributesWithValues"
      :key="attr.id"
      class="mb-3"
    >
      <label class="block text-sm font-medium text-gray-700 mb-1">{{ attr.name }}</label>
      <select
        :value="selectedValues[attr.id] || ''"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        @change="selectedValues[attr.id] = $event.target.value || null"
      >
        <option value="">Sin definir</option>
        <option v-for="val in attr.values" :key="val.id" :value="val.id">
          {{ val.label }}
        </option>
      </select>
    </div>
    <div class="flex justify-end gap-2">
      <button class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md" @click="emit('cancel')">
        Cancelar
      </button>
      <button class="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 rounded-md" @click="save">
        Guardar
      </button>
    </div>
  </div>
</template>
