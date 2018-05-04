import Vue from 'vue'
import Router from 'vue-router'

import publicRoute from './middleware/public-route'
import protectedRoute from './middleware/protected-route'

import Index from '../pages/public/Index'
import Dashboard from '../pages/dashboard/Dashboard'
import UserProfile from '../pages/profile/UserProfile'

import ComplaintsDashboard from '../pages/complaints/ComplaintsDashboard'
import ComplaintsList from '../pages/complaints/ComplaintsList'

import PresentationVideoIndex from '../pages/content-management/PresentationVideoIndex'
import SliderIndex from '../pages/content-management/SliderIndex'
import ReportsIndex from '../pages/reports/ReportsIndex'
import EventsIndex from '../pages/events/EventsIndex'

import UsersIndex from '../pages/users/UsersIndex'

import ThemesIndex from '../pages/settings/ThemesIndex'
import MunicipalitiesIndex from '../pages/settings/MunicipalitiesIndex'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      beforeEnter: publicRoute,
      meta: {
        layout: 'public',
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard:index',
      component: Dashboard,
      beforeEnter: protectedRoute,
    },
    {
      path: '/profile',
      name: 'profile:index',
      component: UserProfile,
      beforeEnter: protectedRoute,
    },
    {
      path: '/complaints/dashboard',
      name: 'complaints:dashboard',
      component: ComplaintsDashboard,
      beforeEnter: protectedRoute,
    },
    {
      path: '/complaints/list',
      name: 'complaints:list',
      component: ComplaintsList,
      beforeEnter: protectedRoute,
    },
    {
      path: '/content-management/presentation-video',
      name: 'content-management:presentation-video',
      component: PresentationVideoIndex,
      beforeEnter: protectedRoute,
    },
    {
      path: '/content-management/slider',
      name: 'content-management:slider',
      component: SliderIndex,
      beforeEnter: protectedRoute,
    },
    {
      path: '/reports',
      name: 'reports:index',
      component: ReportsIndex,
      beforeEnter: protectedRoute,
    },
    {
      path: '/events-management',
      name: 'events:index',
      component: EventsIndex,
      beforeEnter: protectedRoute,
    },
    {
      path: '/users',
      name: 'users:index',
      component: UsersIndex,
      beforeEnter: protectedRoute,
    },
    {
      path: '/settings/themes',
      name: 'settings:themes',
      component: ThemesIndex,
      beforeEnter: protectedRoute,
    },
    {
      path: '/settings/municipalities',
      name: 'settings:municipalities',
      component: MunicipalitiesIndex,
      beforeEnter: protectedRoute,
    },
  ]
})
