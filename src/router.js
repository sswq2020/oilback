import Vue from 'vue'
import Router from 'vue-router'


// #region 商品管理
/**发布新商品*/
const ReleaseNewCommodity = () => import('views/commodityManage/releaseNewCommodity.vue')
/**编辑商品*/
const EditOldCommodity = () => import('views/commodityManage/editOldCommodity.vue')
/**出售中的商品*/
const CommodityOnSale = () => import('views/commodityManage/commodityOnSale.vue')
/**待售中的商品*/
const CommodityForSale = () => import('views/commodityManage/commodityForSale.vue')
/**订单管理*/
const OrderManage = () => import('views/commodityManage/orderManage.vue')
/**回收站*/
const RecycleManage = () => import('views/commodityManage/recycleManage.vue')
/**库存发布*/
const ReleaseInventory = () => import('views/commodityManage/releaseInventory.vue')
// #endregion

// #region 会员管理
/**交易会员管理列表*/
const VipManage = () => import('views/vipManage/index.vue')
/**新增会员表单模块*/
const AddMemberForm = () => import('views/vipManage/addMemberForm.vue')
/**者编辑会员表单模块*/
const EditMemberForm = () => import('views/vipManage/editMemberForm.vue')
// #endregion

// #region 审核管理
/**入会审核*/
const InitiateAudit = () => import('views/auditManage/initiateAudit.vue')
// #endregion

// #region 预警管理
/**协议到期预警*/
const DealDueforeWarn = () => import('views/foreWarnManage/dealDueforeWarn.vue')
// #endregion


Vue.use(Router)

let globelRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index')
    }
]

let commonRoutes = {
	path:'/main',
	name:'main',
	component:() => import(/* webpackChunkName: "about" */ '@/views/main/main'),
	children:[
        {
            path: '/test',
            name: 'test',
            component: () => import(/* webpackChunkName: "demo" */ '@/views/test/index'),
        },
        {
            path: '/personal',
            name: 'personal',
            component: () => import(/* webpackChunkName: "avatar" */ '@/views/personal/index'),
        },
        // #region  商品管理      
        {
            path: '/web/hyw/product/product/deploy',
            name: 'releaseNewCommodity',
            component: ReleaseNewCommodity
        },
        {
            path: '/web/hyw/product/product/update',
            name: 'editOldCommodity',
            component: EditOldCommodity
        },           
        {
            path: '/web/hyw/product/product/pageOnSale',
            name: 'commodityOnSale',
            component: CommodityOnSale
        },
        {
            path: '/web/hyw/product/product/pageForSale',
            name: 'commodityForSale',
            component: CommodityForSale
        },
        {
            path: '/web/hyw/shopping/order/seller',
            name: 'orderManage',
            component: OrderManage
        },
        {
            path: '/web/hyw/product/product/pageForRecycle',
            name: 'recycleManage',
            component: RecycleManage
        },
        {
            path: '/web/hyw/product/product/pageForYc',
            name: 'releaseInventory',
            component: ReleaseInventory
        },
        // #endregion           

        // #region  会员管理  
        {
            path: '/web/hyw/member/page',
            name: 'vipManage',
            component: VipManage
        },
        {
            path: '/web/hyw/member/member/addmemberForm',
            name: 'addMemberForm',
            component: AddMemberForm
        },      
        {
            path: '/web/hyw/member/member/editmemberForm',
            name: 'editMemberForm',
            component: EditMemberForm
        },
        // #endregion     
        
        // #region  审核管理      
        {
            path: '/admissionAudit/page',
            name: 'initiateAudit',
            component: InitiateAudit
        },
        // #endregion      

        // #region  预警管理      
        {
            path: '/web/hyw/agreement/pageWarn',
            name: 'dealDueforeWarn',
            component: DealDueforeWarn
        },
        // #endregion      


    ]
}

export const router = new Router({
    routes: [
        ...globelRoutes,
        commonRoutes
    ]
})

//留取一份普通路由的name集合
let commonRoutesCluster = commonRoutes.children.map(target => target.name)
let globalRoutesCluster = globelRoutes.map(target => target.name)

router.beforeEach((to, from, next) => {
    if (commonRoutesCluster.includes(to.name) || globalRoutesCluster.includes(to.name)) {
        next()
    } else {
        next({name: 'test'})
    }
})
