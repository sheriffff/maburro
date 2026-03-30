<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  attribute: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])

const name = ref('')
const values = ref([])
const newValue = ref('')

watch(() => props.attribute, (attr) => {
  if (attr) {
    name.value = attr.name
    values.value = attr.values.map(v => ({ ...v }))
  } else {
    name.value = ''
    values.value = []
  }
}, { immediate: true })

function addValue() {
  const label = newValue.value.trim()
  if (!label) return
  values.value.push({ id: null, label, position: values.value.length })
  newValue.value = ''
}

function removeValue(index) {
  values.value.splice(index, 1)
}

function save() {
  if (!name.value.trim()) return
  emit('save', {
    id: props.attribute?.id || null,
    name: name.value.trim(),
    values: values.value.map((v, i) => ({ ...v, position: i })),
  })
}
</script>

<template>
  <div class="bg-surface-raised border border-brand-200 rounded-xl p-5 shadow-sm">
    <div class="mb-4">
      <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Nombre del atributo</label>
      <input
        v-model="name"
        type="text"
        class="w-full bg-surface border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
        placeholder="Ej: Duración"
        @keyup.enter="save"
      />
    </div>
    <div class="mb-4">
      <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Valores</label>
      <div class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="(val, i) in values"
          :key="i"
          class="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-1 rounded-lg text-sm font-medium"
        >
          {{ val.label }}
          <button class="text-brand-400 hover:text-red-500 transition-colors" @click="removeValue(i)">&times;</button>
        </span>
      </div>
      <div class="flex gap-2">
        <input
          v-model="newValue"
          type="text"
          class="flex-1 bg-surface border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
          placeholder="Nuevo valor..."
          @keyup.enter="addValue"
        />
        <button
          class="px-4 py-2.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          @click="addValue"
        >
          Añadir
        </button>
      </div>
    </div>
    <div class="flex justify-end gap-2 pt-2 border-t border-gray-100">
      <button class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors" @click="emit('cancel')">
        Cancelar
      </button>
      <button class="px-5 py-2 text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 rounded-lg shadow-sm transition-all" @click="save">
        Guardar
      </button>
    </div>
  </div>
</template>
