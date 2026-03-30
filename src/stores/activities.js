import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useActivitiesStore = defineStore('activities', () => {
  const activities = ref([])
  const loading = ref(false)
  const error = ref(null)

  const activitiesWithValues = computed(() =>
    activities.value.map(activity => {
      const valuesByAttribute = {}
      for (const aav of activity.activity_attribute_values || []) {
        if (aav.attribute_value) {
          valuesByAttribute[aav.attribute_value.attribute_id] = aav.attribute_value.id
        }
      }
      return { ...activity, valuesByAttribute }
    })
  )

  async function fetchActivities() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('activities')
      .select('*, activity_attribute_values(attribute_value_id, attribute_value:attribute_values(id, attribute_id, label))')
      .order('created_at')
    if (err) {
      error.value = err.message
    } else {
      activities.value = data
    }
    loading.value = false
  }

  async function createActivity(name, attributeValueIds = []) {
    const { data, error: err } = await supabase
      .from('activities')
      .insert({ name })
      .select()
      .single()
    if (err) { error.value = err.message; return }
    if (attributeValueIds.length > 0) {
      const rows = attributeValueIds.map(avId => ({
        activity_id: data.id,
        attribute_value_id: avId,
      }))
      const { error: err2 } = await supabase.from('activity_attribute_values').insert(rows)
      if (err2) { error.value = err2.message; return }
    }
    await fetchActivities()
  }

  async function updateActivity(id, name, attributeValueIds = []) {
    const { error: err } = await supabase.from('activities').update({ name }).eq('id', id)
    if (err) { error.value = err.message; return }
    await supabase.from('activity_attribute_values').delete().eq('activity_id', id)
    if (attributeValueIds.length > 0) {
      const rows = attributeValueIds.map(avId => ({
        activity_id: id,
        attribute_value_id: avId,
      }))
      const { error: err2 } = await supabase.from('activity_attribute_values').insert(rows)
      if (err2) { error.value = err2.message; return }
    }
    await fetchActivities()
  }

  async function deleteActivity(id) {
    const { error: err } = await supabase.from('activities').delete().eq('id', id)
    if (err) { error.value = err.message; return }
    await fetchActivities()
  }

  function getActivitiesForCell(attrAId, valAId, attrBId, valBId) {
    return activitiesWithValues.value.filter(activity => {
      const matchA = valAId === 'sin-definir'
        ? !activity.valuesByAttribute[attrAId]
        : activity.valuesByAttribute[attrAId] === valAId
      const matchB = !attrBId || (valBId === 'sin-definir'
        ? !activity.valuesByAttribute[attrBId]
        : activity.valuesByAttribute[attrBId] === valBId)
      return matchA && matchB
    })
  }

  return {
    activities,
    loading,
    error,
    activitiesWithValues,
    fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivitiesForCell,
  }
})
