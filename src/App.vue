<script setup>
import AppHeader from './components/ui/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-surface font-sans">
    <AppHeader />
    <main class="px-6 py-5 max-w-[1400px] mx-auto">
      <router-view />
    </main>
  </div>
</template>
