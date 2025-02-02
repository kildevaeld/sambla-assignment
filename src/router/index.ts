import RootView from '@/views/RootView.vue'
import { Empty } from 'ant-design-vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RootView,
      children: [
        {
          path: '',
          component: Empty,
          props: {
            title: 'No form',
          },
        },
        {
          path: ':id',
          component: () => import('../views/FormEditorView.vue'),
        },
        {
          path: ':id/edit',
          component: () => import('../views/FormView.vue'),
        },
      ],
    },
  ],
})

export default router
