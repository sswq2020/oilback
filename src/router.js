import Vue from 'vue'
import Router from 'vue-router'
const CommodityManage = () => import('@/views/basicManage/commodityManage/index')
const MaterialManage = () => import('@/views/basicManage/materialManage/index')
const PilePositionManage = () => import('@/views/basicManage/pilePositionManage/index')
const OriginPlaceManage = () => import('@/views/basicManage/originPlaceManage/index')
const ProductNameManage = () => import('@/views/basicManage/productNameManage/index')
const SettlementStorageManage = () => import('@/views/basicManage/settlementStorageManage/index')
const ShipperManage = () => import('@/views/basicManage/shipperManage/index')
const SpecificationManage = () => import('@/views/basicManage/specificationManage/index')


// #region 仓储管理
/**入库明细*/
const EnterStorageDetail = () => import('@/views/warehouseManage/enterStorageDetail/index')
/**入库登记*/
const EnterStorageRegister = () => import('@/views/warehouseManage/enterStorageDetail/enterStorageRegister.vue')
/**待验收入库*/
const WaitCheckEnter = () => import('@/views/warehouseManage/waitCheckEnter/index')
/**验收入库*/
const CheckEnter = () => import('@/views/warehouseManage/waitCheckEnter/checkEnter')
/**验收出库*/
const CheckOuter = () => import('@/views/warehouseManage/waitCheckOuter/checkOuter')
/**待验收出库*/
const WaitCheckOuter = () => import('@/views/warehouseManage/waitCheckOuter/index')
/**出库申请*/
const ApplyCheckOut = () => import('@/views/warehouseManage/outerStorageDetail/applyCheckout')
/**出库明细*/
const OuterStorageDetail = () => import('@/views/warehouseManage/outerStorageDetail/index')
/**质押明细*/
const PledgeDetail = () => import('@/views/warehouseManage/pledgeDetail/index')
/**解押明细*/
const ReleasePledgeDetail = () => import('@/views/warehouseManage/releasePledgeDetail/index')
/**过户明细*/
const TransferOwnershipDetail = () => import('@/views/warehouseManage/transferOwnershipDetail/index')
/**过户管理*/
const TransferOwnershipManage = () => import('@/views/warehouseManage/transferOwnershipDetail/transferOwnershipManage')
/**库存表*/
const InventoryTable = () => import('@/views/warehouseManage/inventoryManage/inventoryTable.vue')
/**库存明细*/
const InventoryDetail = () => import('@/views/warehouseManage/inventoryManage/inventoryDetail.vue')
/**质解押管理*/
const TogglePledgeManage = () => import('@/views/warehouseManage/togglePledgeManage/index.vue')
/**质押管理*/
const PledgeManage = () => import('@/views/warehouseManage/togglePledgeManage/pledgeManage.vue')
/**解押管理*/
const ReleasePledgeManage = () => import('@/views/warehouseManage/togglePledgeManage/releasePledgeManage.vue')
// #endregion 仓储管理

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
        {
            path: '/web/yc/base/goods/listGoods',
            name: 'commodityManage',
            component: CommodityManage
        },
        {
            path: '/web/yc/base/material/listMaterials',
            name: 'materialManage',
            component: MaterialManage
        },
        {
            path: '/web/yc/base/pilePosition/listPilePositions',
            name: 'pilePositionManage',
            component: PilePositionManage
        },
        {
            path: '/web/yc/base/originPlace/listOriginPlaces',
            name: 'originPlaceManage',
            component: OriginPlaceManage
        },
        {
            path: '/web/yc/base/productName/listProductNames',
            name: 'productNameManage',
            component: ProductNameManage
        },  
        {
            path: '/web/yc/base/deliveryStoreManage/pageDeliveryStore',
            name: 'settlementStorageManage',
            component: SettlementStorageManage
        },
        {
            path: '/web/yc/base/cargoManage/pageCargo',
            name: 'shipperManage',
            component: ShipperManage
        },
        {
            path: '/web/yc/base/spec/listSpecs',
            name: 'specificationManage',
            component: SpecificationManage
        },  
        {
            path: '/web/settlement/pageList/print',
            name: 'print',
            component: () => import('@/views/basicManage/print/index')
        },  
        // #region  仓储信息      
        {
            path: '/web/yc/storage/stockRegisterDetail/page',
            name: 'enterStorageDetail',
            component: EnterStorageDetail
        }, 
        {
            path: '/web/yc/storage/stockRegisterDetail/page/register',
            name: 'enterStorageRegister',
            component: EnterStorageRegister
        },        
        {
            path: '/web/yc/storage/stockInventory/page',
            name: 'inventoryTable',
            component: InventoryTable
        },
        {
            path: '/web/yc/storage/stockInventory/page/inventoryDetail',
            name: 'inventoryDetail',
            component: InventoryDetail
        },
        {
            path: '/web/yc/storage/stockRegister/page',
            name: 'waitCheckEnter',
            component: WaitCheckEnter
        },  
        {
            path: '/web/yc/storage/stockRegister/page/checkEnter',
            name: 'checkEnter',
            component: CheckEnter
        },  
        {
            path: '/web/yc/storage/stockRemoval/page',
            name: 'waitCheckOuter',
            component: WaitCheckOuter
        },  
        {
            path: '/web/yc/storage/stockRemoval/page/CheckOuter',
            name: 'checkOuter',
            component: CheckOuter
        },  
        {
            path: '/web/yc/storage/stockRemovalDetail/page',
            name: 'outerStorageDetail',
            component: OuterStorageDetail
        },
        {
            path: '/web/yc/storage/stockRemovalDetail/page/applyCheckOut',
            name: 'applyCheckOut',
            component: ApplyCheckOut
        },        
        {
            path: '/web/yc/pledgeinfo/detail',
            name: 'pledgeDetail',
            component: PledgeDetail
        },  
        {
            path: '/web/yc/releaseinfo/detail',
            name: 'releasePledgeDetail',
            component: ReleasePledgeDetail
        },  
        {
            path: '/web/yc/pledgeinfo/page',
            name: 'togglePledgeManage',
            component: TogglePledgeManage
        },  
        {
            path: '/web/yc/pledgeinfo/page/pledgeManage',
            name: 'pledgeManage',
            component: PledgeManage
        },  
        {
            path: '/web/yc/pledgeinfo/page/releasePledgeManage',
            name: 'releasePledgeManage',
            component: ReleasePledgeManage
        },  
        {
            path: '/web/yc/inventory/transfer/detail',
            name: 'transferOwnershipDetail',
            component: TransferOwnershipDetail
        },
        {
            path: '/web/settlement/pageList/transferOwnershipManage',
            name: 'transferOwnershipManage',
            component: TransferOwnershipManage
        }
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
