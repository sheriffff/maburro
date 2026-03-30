<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <header class="bg-surface-raised border-b border-gray-200/60 px-6 py-3 flex items-center justify-between shadow-sm">
    <router-link to="/" class="flex items-center gap-2.5 group">
      <span class="text-2xl">🥱</span>
      <span class="text-lg font-bold tracking-tight text-brand-900 group-hover:text-brand-700 transition-colors">
        M'aburro
      </span>
    </router-link>
    <nav class="flex gap-1">
      <router-link
        to="/"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :class="route.name === 'matrix'
          ? 'bg-brand-500 text-white shadow-sm'
          : 'text-gray-500 hover:text-brand-700 hover:bg-brand-50'"
      >
        Inicio
      </router-link>
      <router-link
        to="/config"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :class="route.name === 'config'
          ? 'bg-brand-500 text-white shadow-sm'
          : 'text-gray-500 hover:text-brand-700 hover:bg-brand-50'"
      >
        Config
      </router-link>
    </nav>
  </header>
</template>
