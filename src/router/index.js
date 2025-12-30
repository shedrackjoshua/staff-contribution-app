import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import StaffList from '../views/StaffList.vue'
import StaffCreate from '../views/StaffCreate.vue'
import StaffDetails from '../views/StaffDetails.vue'
import StaffEdit from '../views/StaffEdit.vue'
import ContributionCreate from '../views/ContributionCreate.vue'
import ContributionEdit from '../views/ContributionEdit.vue'
import ContributionDetails from '../views/ContributionDetails.vue'
import ContributionList from '../views/ContributionList.vue'
import StaffContribution from '../views/StaffContribution.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/staffs',
        name: 'StaffList',
        component: StaffList
    },
    {
        path: '/staffs/create',
        name: 'StaffCreate',
        component: StaffCreate
    },
    {
        path: '/staffs/:id',
        name: 'StaffDetails',
        component: StaffDetails
    },
    {
        path: '/staffs/:id/edit',
        name: 'StaffEdit',
        component: StaffEdit
    },
    {
        path: '/contributions',
        name: 'ContributionList',
        component: ContributionList
    },
    {
        path: '/contributions/create',
        name: 'ContributionCreate',
        component: ContributionCreate
    },
    {
        path: '/contributions/:id/edit',
        name: 'ContributionEdit',
        component: ContributionEdit
    },
    {
        path: '/contributions/:id',
        name: 'ContributionDetails',
        component: ContributionDetails
    },
    {
        path: '/staffs/:staffid/contributions',
        name: 'StaffContribution',
        component: StaffContribution
    }
]

const router = createRouter ({
    history: createWebHistory(),
    routes
})

// runtime debug: list registered routes to help track down no-match warnings
// (remove this log after debugging)
if (typeof window !== 'undefined') {
    // print minimal route paths to avoid noisy objects
    console.info('Registered routes:', router.getRoutes().map(r => r.path))
}

export default router