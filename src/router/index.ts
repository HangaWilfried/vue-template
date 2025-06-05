import { createRouter, createWebHistory } from 'vue-router'

import loginProvider from '@/plugins/authProvider'

import DefaultLayout from '@/layouts/DefaultLayout.vue'

declare module 'vue-router' {
  interface RouteMeta {
    roles?: string[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import("@/views/HomeView.vue"),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },
      ]
    },
    {
      path: '/auth/keycloak',
      name: 'console',
      component: () => import('@/views/KeycloakRedirectPage.vue'),
    },
    {
      path: '/403',
      name: 'unauthorized',
      component: () => import('@/views/error/ResourceNotAllowed.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not_found',
      component: () => import('@/views/error/ResourceNotAllowed.vue'),
    },
  ],
})

const keycloakAuth = loginProvider()

router.beforeEach(async (to, from, next) => {
  const requiredRoles = to.meta.roles;

  if (!requiredRoles) {
    return next()
  }

  if (!keycloakAuth.isAuthenticated()) {
    localStorage.setItem('next-route-cache', to.fullPath)
    return keycloakAuth.login()
  }

  const userRoles = keycloakAuth.getRoles()
  const hasAccess = requiredRoles.some((role) => userRoles.includes(role))

  if (hasAccess) {
    return next()
  } else {
    return next('/unauthorized')
  }
})

export default router
