import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export const constantRoutes = [
    // {
    //     path: '/',
    //     component: () => import('@/views/Home.vue'),
    // },
    // {
    //     path: '/form',
    //     component: () => import('@/views/form'),
    // },
    // {
    //     path: '/popup',
    //     component: () => import('@/views/popup'),
    // },
    // {
    //     path: '/section',
    //     component: () => import('@/views/section'),
    // },
    // {
    //     path: '/table',
    //     component: () => import('@/views/table'),
    // },
    // {
    //     path: '/button',
    //     component: () => import('@/views/button'),
    // },
];


const router = new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRoutes
});
export default router
