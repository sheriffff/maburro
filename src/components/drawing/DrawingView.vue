<script setup>
import { computed, ref } from 'vue'
import { useActivitiesStore } from '../../stores/activities'
import { useAttributesStore } from '../../stores/attributes'
import { useActivityLogStore } from '../../stores/activityLog'

const props = defineProps({
  showObligaciones: { type: Boolean, default: false },
})

const activitiesStore = useActivitiesStore()
const attributesStore = useAttributesStore()
const logStore = useActivityLogStore()

const recentlyLogged = ref(new Set())

const ubicacionAttr = computed(() =>
  attributesStore.attributesWithValues.find(a => a.name.toLowerCase().includes('ubicaci'))
)

const duracionAttr = computed(() =>
  attributesStore.attributesWithValues.find(a => a.name.toLowerCase().includes('duraci'))
)

const obligacionAttr = computed(() =>
  attributesStore.attributesWithValues.find(a => a.name.toLowerCase().includes('obligaci'))
)

const obligacionSiValueId = computed(() => {
  if (!obligacionAttr.value) return null
  const v = obligacionAttr.value.values.find(v =>
    v.label.toLowerCase() === 'sí' || v.label.toLowerCase() === 'si' || v.label.toLowerCase() === 'obligación'
  )
  return v?.id || null
})

const colValues = computed(() => {
  if (!ubicacionAttr.value) return [{ id: 'all', label: 'Todas' }]
  return ubicacionAttr.value.values
})

const rowValues = computed(() => {
  if (!duracionAttr.value) return [{ id: 'all', label: 'Todas' }]
  return duracionAttr.value.values
})

function isObligacion(activity) {
  if (!obligacionAttr.value || !obligacionSiValueId.value) return false
  return activity.valuesByAttribute?.[obligacionAttr.value.id] === obligacionSiValueId.value
}

function getActivitiesForCell(colVal, rowVal) {
  const all = activitiesStore.activitiesWithValues.filter(a => {
    if (isObligacion(a) && !props.showObligaciones) return false
    return true
  })

  return all.filter(a => {
    const matchCol = colVal.id === 'all' || (
      ubicacionAttr.value
        ? a.valuesByAttribute?.[ubicacionAttr.value.id] === colVal.id
        : true
    )
    const matchRow = rowVal.id === 'all' || (
      duracionAttr.value
        ? a.valuesByAttribute?.[duracionAttr.value.id] === rowVal.id
        : true
    )
    return matchCol && matchRow
  })
}

function pseudoRandom(str, salt = 0) {
  let hash = salt
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return (hash & 0x7fffffff) / 0x7fffffff
}

function getXInZone(activity, zoneIndex, totalZones) {
  const zoneWidth = 100 / totalZones
  const start = zoneIndex * zoneWidth
  return start + 8 + pseudoRandom(activity.id, 2) * (zoneWidth - 16)
}

function getYInBand(activity, bandIndex, totalBands) {
  const bandHeight = 100 / totalBands
  const start = bandIndex * bandHeight
  return start + 12 + pseudoRandom(activity.id, 1) * (bandHeight - 24)
}

async function handleClick(activityId) {
  await logStore.logActivity(activityId)
  recentlyLogged.value.add(activityId)
  setTimeout(() => {
    recentlyLogged.value.delete(activityId)
    recentlyLogged.value = new Set(recentlyLogged.value)
  }, 1500)
  recentlyLogged.value = new Set(recentlyLogged.value)
}
</script>

<template>
  <div class="relative w-full bg-surface-raised rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden" style="height: calc(100vh - 12rem);">

    <!-- Column headers (top) -->
    <div class="absolute top-0 left-[6rem] right-0 h-12 flex z-10">
      <div
        v-for="col in colValues"
        :key="col.id"
        class="flex-1 flex items-center justify-center"
      >
        <span class="text-2xl font-bold uppercase tracking-wide text-brand-800">
          {{ col.label }}
        </span>
      </div>
    </div>

    <!-- Header / content dividers -->
    <div class="absolute top-12 left-0 right-0 border-t border-gray-300/70 z-[5]" />
    <div class="absolute top-12 bottom-0 left-[6rem] border-l border-gray-300/70 z-[5]" />

    <!-- Row headers (left) -->
    <div class="absolute top-12 left-0 bottom-0 w-[6rem] z-10">
      <div
        v-for="row in rowValues"
        :key="row.id"
        class="flex items-center justify-center"
        :style="{ height: (100 / rowValues.length) + '%' }"
      >
        <span class="text-2xl font-bold uppercase tracking-wide text-brand-800 text-center leading-tight">
          {{ row.label }}
        </span>
      </div>
    </div>

    <!-- Column dividers (vertical) -->
    <template v-for="ci in (colValues.length - 1)" :key="'vdiv-'+ci">
      <div
        class="absolute top-12 bottom-0 border-l border-dashed border-gray-300/70 z-[5]"
        :style="{ left: 'calc(6rem + ' + (ci * (100 / colValues.length)) + '%)' }"
      />
    </template>

    <!-- Row dividers (horizontal) -->
    <template v-for="ri in (rowValues.length - 1)" :key="'hdiv-'+ri">
      <div
        class="absolute left-0 right-0 border-t border-dashed border-gray-300/70 z-[5]"
        :style="{ top: 'calc(3rem + ' + (ri * ((100 - 6) / rowValues.length)) + '%)' }"
      />
    </template>

    <!-- Activity words -->
    <div class="absolute top-12 bottom-0 left-[6rem] right-0 z-10">
      <template v-for="(col, ci) in colValues" :key="'col-'+col.id">
        <template v-for="(row, ri) in rowValues" :key="'row-'+row.id">
          <button
            v-for="act in getActivitiesForCell(col, row)"
            :key="act.id"
            class="absolute font-bold whitespace-nowrap cursor-pointer transition-all duration-300 hover:scale-110 hover:opacity-80"
            :class="recentlyLogged.has(act.id) ? 'opacity-40' : ''"
            :style="{
              left: getXInZone(act, ci, colValues.length) + '%',
              top: getYInBand(act, ri, rowValues.length) + '%',
              color: recentlyLogged.has(act.id) ? '#16a34a' : '#1a1a1a',
              fontSize: '1.35rem',
            }"
            @click="handleClick(act.id)"
          >
            {{ act.name }}
          </button>
        </template>
      </template>
    </div>
  </div>
</template>
