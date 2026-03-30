import { createRouter, createWebHistory } from 'vue-router'
import HazView from '../views/HazView.vue'
import ActivitiesView from '../views/ActivitiesView.vue'
import AttributesView from '../views/AttributesView.vue'

const routes = [
  { path: '/', name: 'haz', component: HazView },
  { path: '/actividades', name: 'actividades', component: ActivitiesView },
  { path: '/atributos', name: 'atributos', component: AttributesView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
