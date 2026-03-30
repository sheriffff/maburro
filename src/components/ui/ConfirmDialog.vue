<script setup>
defineProps({
  open: Boolean,
  message: { type: String, default: '¿Seguro?' },
})
const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="emit('cancel')">
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div class="relative bg-surface-raised rounded-2xl shadow-2xl p-6 max-w-sm w-full">
          <p class="text-gray-800 mb-6 text-sm">{{ message }}</p>
          <div class="flex justify-end gap-2">
            <button
              class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              @click="emit('cancel')"
            >
              Cancelar
            </button>
            <button
              class="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm transition-all"
              @click="emit('confirm')"
            >
              Eliminar
            </button>
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
