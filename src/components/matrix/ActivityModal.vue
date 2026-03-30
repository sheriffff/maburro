<script setup>
import { ref, watch } from 'vue'
import { useAttributesStore } from '../../stores/attributes'
import { useActivitiesStore } from '../../stores/activities'

const props = defineProps({
  open: Boolean,
  activity: { type: Object, default: null },
})
const emit = defineEmits(['close'])

const attributesStore = useAttributesStore()
const activitiesStore = useActivitiesStore()

const name = ref('')
const selectedValues = ref({})
const saving = ref(false)

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    if (props.activity) {
      name.value = props.activity.name
      selectedValues.value = { ...(props.activity.valuesByAttribute || {}) }
    } else {
      name.value = ''
      selectedValues.value = {}
    }
  }
})

async function save() {
  if (!name.value.trim() || saving.value) return
  saving.value = true
  const valueIds = Object.values(selectedValues.value).filter(Boolean)
  if (props.activity) {
    await activitiesStore.updateActivity(props.activity.id, name.value.trim(), valueIds)
  } else {
    await activitiesStore.createActivity(name.value.trim(), valueIds)
  }
  saving.value = false
  emit('close')
}

async function handleDelete() {
  if (!props.activity || saving.value) return
  saving.value = true
  await activitiesStore.deleteActivity(props.activity.id)
  saving.value = false
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="emit('close')">
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div class="relative bg-surface-raised rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-900">
              {{ activity ? 'Editar actividad' : 'Nueva actividad' }}
            </h2>
          </div>

          <div class="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Nombre</label>
              <input
                ref="nameInput"
                v-model="name"
                type="text"
                class="w-full bg-surface border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
                placeholder="Ej: Pádel, Estudiar, Registro..."
                @keyup.enter="save"
              />
            </div>

            <div v-for="attr in attributesStore.attributesWithValues" :key="attr.id">
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                {{ attr.name }}
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="val in attr.values"
                  :key="val.id"
                  class="px-3 py-1.5 text-sm rounded-lg border transition-all"
                  :class="selectedValues[attr.id] === val.id
                    ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                    : 'bg-surface border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-700'"
                  @click="selectedValues[attr.id] = selectedValues[attr.id] === val.id ? null : val.id"
                >
                  {{ val.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 flex items-center" :class="activity ? 'justify-between' : 'justify-end'">
            <button
              v-if="activity"
              class="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
              :disabled="saving"
              @click="handleDelete"
            >
              Eliminar
            </button>
            <div class="flex gap-2">
              <button
                class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                @click="emit('close')"
              >
                Cancelar
              </button>
              <button
                class="px-5 py-2 text-sm font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-sm transition-all disabled:opacity-50"
                :disabled="!name.trim() || saving"
                @click="save"
              >
                {{ saving ? '...' : 'Guardar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
