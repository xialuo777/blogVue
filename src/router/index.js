import VueRouter from 'vue-router'

import UserLogin from '../views/login/UserLogin';
import Register from "../views/register/UserRegister.vue";
import Home from '../views/home/UserHome.vue';
import Index from '../views/index/UserIndex.vue'
import BlogDetail from "@/views/blog/BlogDetail.vue";
import { Message } from "element-ui";
import EditUserInfo from "@/views/user/EditUserInfo.vue";
import EditArticle from "@/views/blog/EditArticle.vue";


const router =  new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',         //路径
            redirect: '/login'    //跳转到组件
        },
        {
            path:'/'
        },
        {
            path: '/login',         //路径
            component: UserLogin    //跳转到组件
        },
        {
            path: '/register',     //路径
            component: Register   //跳转到组件
        },
        {
            path:'/home',
            component:Home,
            name:'home'
        },
        {
            path:'/index',
            component: Index
        },
        {
            path: '/blogs/:id',  // 动态路由，`:id` 是一个动态段
            name: 'BlogDetail',
            component: BlogDetail

        },
        {
            path: '/edit-user-info',
            name: 'EditUserInfo',
            component: EditUserInfo,
        },
        {
            path: '/edit-article/:id', // 动态路由，用于编辑博客
            name: 'EditArticle',
            component: EditArticle,
        },

    ]
})

router.beforeEach((to, from, next) => {
    let isAuthenticated = !!sessionStorage.getItem('token')
    // 如果路由要跳转到除了登录和注册的界面的话就判断是否已经登录，如果没有登录就强制跳到登录界面
    if (to.path !== '/login' && to.path !== '/register' && !isAuthenticated) {
        next({ path: '/login' })
        Message({
            message: '请先登录！',
            type: "warning",
        });
    } else next()
})
export default router;