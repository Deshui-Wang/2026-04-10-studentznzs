import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Study from '../views/Study.vue'
import Schedule from '../views/Schedule.vue'
import Services from '../views/Services.vue'
import Navigation from '../views/Navigation.vue'

const routes = [
    { path: '/', component: Dashboard },
    { path: '/study', component: Study },
    { path: '/schedule', component: Schedule },
    { path: '/services', component: Services },
    { path: '/navigation', component: Navigation }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
