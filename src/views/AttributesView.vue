<script setup>
import { onMounted } from 'vue'
import { useAttributesStore } from '../stores/attributes'
import AttributeList from '../components/manage/AttributeList.vue'

const attributesStore = useAttributesStore()

onMounted(async () => {
  await attributesStore.fetchAttributes()
})
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div v-if="attributesStore.loading" class="text-center text-gray-400 mt-16 text-sm">
      Cargando...
    </div>
    <div v-else class="mt-2">
      <AttributeList />
    </div>
  </div>
</template>
