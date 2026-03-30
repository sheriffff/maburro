import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useActivityLogStore = defineStore('activityLog', () => {
  const error = ref(null)

  async function logActivity(activityId) {
    error.value = null
    const { error: err } = await supabase
      .from('activity_log')
      .insert({ activity_id: activityId })
    if (err) {
      error.value = err.message
    }
  }

  return { error, logActivity }
})
