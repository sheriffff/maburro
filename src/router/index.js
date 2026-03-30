import { createRouter, createWebHistory } from 'vue-router'
import MatrixView from '../views/MatrixView.vue'
import ConfigView from '../views/ConfigView.vue'

const routes = [
  { path: '/', name: 'matrix', component: MatrixView },
  { path: '/config', name: 'config', component: ConfigView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
