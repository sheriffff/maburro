import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAttributesStore = defineStore('attributes', () => {
  const attributes = ref([])
  const loading = ref(false)
  const error = ref(null)

  const attributesWithValues = computed(() =>
    attributes.value.map(attr => ({
      ...attr,
      values: (attr.attribute_values || []).sort((a, b) => a.position - b.position),
    }))
  )

  function getAttributeById(id) {
    return attributesWithValues.value.find(a => a.id === id)
  }

  async function fetchAttributes() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('attributes')
      .select('*, attribute_values(*)')
      .order('created_at')
    if (err) {
      error.value = err.message
    } else {
      attributes.value = data
    }
    loading.value = false
  }

  async function createAttribute(name) {
    const { error: err } = await supabase.from('attributes').insert({ name })
    if (err) { error.value = err.message; return }
    await fetchAttributes()
  }

  async function updateAttribute(id, name) {
    const { error: err } = await supabase.from('attributes').update({ name }).eq('id', id)
    if (err) { error.value = err.message; return }
    await fetchAttributes()
  }

  async function deleteAttribute(id) {
    const { error: err } = await supabase.from('attributes').delete().eq('id', id)
    if (err) { error.value = err.message; return }
    await fetchAttributes()
  }

  async function addAttributeValue(attributeId, label) {
    const attr = getAttributeById(attributeId)
    const position = attr ? attr.values.length : 0
    const { error: err } = await supabase
      .from('attribute_values')
      .insert({ attribute_id: attributeId, label, position })
    if (err) { error.value = err.message; return }
    await fetchAttributes()
  }

  async function updateAttributeValue(id, label) {
    const { error: err } = await supabase.from('attribute_values').update({ label }).eq('id', id)
    if (err) { error.value = err.message; return }
    await fetchAttributes()
  }

  async function deleteAttributeValue(id) {
    const { error: err } = await supabase.from('attribute_values').delete().eq('id', id)
    if (err) { error.value = err.message; return }
    await fetchAttributes()
  }

  return {
    attributes,
    loading,
    error,
    attributesWithValues,
    getAttributeById,
    fetchAttributes,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    addAttributeValue,
    updateAttributeValue,
    deleteAttributeValue,
  }
})
