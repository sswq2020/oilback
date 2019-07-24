import pathToRegexp from "path-to-regexp";
import mockjs from "mockjs";

const hostList = {
    default: ""
};

const IS_MOCK = false;
const storageURL = ""

const dict = { 'SUCCESS': "000000" }

const body = {
    "code": dict.SUCCESS,
    "mesg": "处理成功",
    "timestamp": new Date().getTime(),
    "data": {},

}

const body_fail = {
    "code": "HL070002000",
    "data": {
        "failMap": {
            "key1": "系统错误1",
            "key2": "系统错误2",
            "key3": "系统错误3",
            "key4": "系统错误4",
        },
        successList: [],
    },
    "mesg": "系统错误"
}

const shipperManageList = {
    "id|+1": "@INTEGER(1,2019690999)",
    "mock1": "12344435", //业务单号
    "mock2": "CYJY@INTEGER(2019690000,2019690999)", //业务单号
    "mock3": "@PICK('盖蓬费', '超损费','车船运费')", // 款项
    "mock4": "@float(200,999)", // 金额(元)
    "mock5": "@PICK(1,0)", // 数据来源
    "mock6": "集配货运", // 数据来源 名称
    "mock7": "惠龙易通@CITY()公司", // 转出账户名
    "mock8": "65521464564654987654", // 转出账户号
    "mock9": "@CNAME()", // 转入账户名 
    "mock10": "65521464564654987654", // 转入账户号
    "mock11": "@PICK('中国','中信')银行", // 转入账户开户机构名称
}

const InventoryTableList = {
    "id|+1": "@INTEGER(1,2019690999)",
    "availableNumInventory": 0,
    "availableWeightInventory": 0,
    "createdBy": "",
    "createdTime": "",
    "disableNumInventory": 0,
    "disableWeightInventory": 0,
    "incomingId": "CYJY@INTEGER(2019690000,2019690999)", //入库单号
    "incomingTime": '@DATE("yyyy-MM-dd HH:mm:ss")', // 入库时间
    "incomingType": "1",
    "isDeleted": 0,
    "measuring": "1",
    "remark": "",
    "updatedBy": "",
    "updatedTime": "",
    "version": 0,
    "volumeNumSold": 0,
    "volumeWeightSold": 0,
    "deliveryStoreId": "",
    "deliveryStore": "@PICK('仓库一','仓库二')", // 仓库
    "cargoId": "@PICK('1','2')",
    "cargoName": "@PICK('货主1','货主2')", // 货主
    "pilePositionId": "",
    "pilePosition": "A",// 区桩位
    "piles": '054', // 层数
    "productNameId": "",
    "productName": "H型钢", // 品名
    "materialId": "",
    "materialName": "Q235", // 材质
    "specificationsId": "",
    "specificationsName": "350*175", // 规格
    "originPlaceId": "",
    "originPlaceName": "江苏镇江沙钢", // 产地
    "totalNumInventory": 96, // 库存数量
    "numUnit": "支", // 数量单位
    "totalWeightInventory": 6, // 库存重量
    "weightUnit": "吨", // 重量单位
    "measuringTypeEnum": { code: "1", text: "理算" }, // 计量方式
    "wareHousingTypeEnum": { code: "1", text: "过货入库" }, //入库类型
    "incomingDays": 0 //入库天数
}

const InventoryDetailList = {
    "id|+1": "@INTEGER(1,2019690999)", // 主键
    "createdBy": "",
    "createdTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "isDeleted": 0,
    "remark": "",
    "state": "@PICK('0','1','2','3')",
    "updatedBy": "",
    "updatedTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "version": 0,
    "totalNumInventory": 96, // 库存数量
    "numUnit": "支", // 数量单位
    "totalWeightInventory": 6, // 库存重量
    "weightUnit": "吨", // 重量单位
    "operateNum": 34, // 操作数量
    "operateWeight": 185, // 操作重量
    "stockInventoryId|+1": "@INTEGER(1,2019690999)" // 库存id
}

const StockRegisterDetailList = {
    ...InventoryTableList,
    "num": 23,
    "weight": 243,
    "registerId": "SH1905060002"
}

const StockRegisterList = {
    ...InventoryTableList,
    "num": 23, // 实收数量
    "weight": 243,//实收重量
    "supposedNum": 56, // 应收数量
    "supposedWeight": 130, // 应收重量
    "registerTime": '@DATE("yyyy-MM-dd HH:mm:ss")'
}

const StockRemovalDetailList = {
    ...InventoryTableList,
    "removalId|+1": "@INTEGER(1,2019690999)",
    "actualRemovalNum": 65,
    "actualRemovalWeight": 99,
    "applyRemovalTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "supposedRemovalNum": 65,
    "supposedRemovalWeight": 84,
    "consignee": '@CNAME()',
    'pickUpPassword': 12323,
    'outsideType': '库存发货'
}


const StockRemovalList = {
    ...InventoryTableList,
    "removalId|+1": "@INTEGER(1,2019690999)",
    "actualRemovalNum": 65,
    "actualRemovalWeight": 99,
    "applyRemovalTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "supposedRemovalNum": 65,
    "supposedRemovalWeight": 84,
}

const TransferinfoList = {
    ...InventoryTableList,
    availableNumInventory: "@INTEGER(100,250)",
    availableWeightInventory: "@INTEGER(100,250)"
}

const TransferDetailList = {
    ...InventoryTableList,
    newShipperName: "@CNAME()", // 新货主
    originalShipperName: "@CNAME()", // 原货主
    realTransferNums: 34, // 实际过户数量
    realTransferWeights: 168, // 实际过户重量
    transferNums: 65, // 过户数量
    transferWeights: 897, // 过户重量
    transferTime: '@DATE("yyyy-MM-dd HH:mm:ss")', // 过户时间
    transferType: "@PICK('收货入库','过货入库')" // 过户类型
}

const RetrievalList = {
    ...InventoryTableList,
    "removalId|+1": "@INTEGER(1,2019690999)",
    "actualRemovalNum": 65,
    "actualRemovalWeight": 99,
    "applyRemovalTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "supposedRemovalNum": 65,
    "supposedRemovalWeight": 84,
    "pickUpPassword": "",
}

const PledgeinfolIST = {
    "id|+1": "@INTEGER(1,2019690999)",
    "cargoName": "@CNAME()",
    "cargoId": "@INTEGER(1,2019690999)",
    "createdBy": "system",
    "createdTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "pledgeCode": "@INTEGER(34345656546,99345656546)",
    "inventoryTotalNums": "@INTEGER(2,1000)",
    "inventoryTotalWeight": "@INTEGER(11,100)",
    "isDeleted": "@PICK(0,1)",
    "remark": "@CTITLE(2,10)",
    "inventoryAvailableWeight": "@PICK(0,67,100,150)",
    "totalPledgeNums": "@INTEGER(1000,2000)",
    "totalPledgeWeight": "@INTEGER(100,200)",
    "updatedBy": "admin",
    "updatedTime": '@DATE("yyyy-MM-dd HH:mm:ss")'
}

const PledgeDetailList = {
    "id|+1": "@INTEGER(1,2019690999)",
    "cargoName": "@CNAME()",
    "cargoId": "@INTEGER(1,2019690999)",
    "createdBy": "system",
    "createdTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "inventoryTotalNums": "@INTEGER(2,1000)",
    "inventoryTotalWeight": "@INTEGER(11,100)",
    "pledgeCargo": "@CNAME()",
    "pledgeCode": "@INTEGER(34345656546,99345656546)",
    "pledgeNums": "@INTEGER(1000,2000)",
    "pledgeType": "@PICK(0,1)",
    "pledgeWeight": "@INTEGER(100,200)",
    "pledgeTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "updatedBy": "admin",
    "updatedTime": '@DATE("yyyy-MM-dd HH:mm:ss")'
}

const ReleasePledgeDetailList = {
    "id|+1": "@INTEGER(1,2019690999)",
    "cargoName": "@CNAME()",
    "cargoId": "@INTEGER(1,2019690999)",
    "createdBy": "system",
    "createdTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "inventoryTotalNums": "@INTEGER(2,1000)",
    "inventoryTotalWeight": "@INTEGER(11,100)",
    "pledgeCargo": "@CNAME()",
    "releaseCode": "@INTEGER(34345656546,99345656546)",
    "releaseNums": "@INTEGER(1000,2000)",
    "pledgeType": "@PICK(0,1)",
    "releaseWeight": "@INTEGER(100,200)",
    "releaseTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "updatedBy": "admin",
    "updatedTime": '@DATE("yyyy-MM-dd HH:mm:ss")'
}

const stockRemovalBill = {
    ...InventoryTableList,
    "removalId|+1": "@INTEGER(1,2019690999)", // 出库单号
    "actualRemovalNum": 65,
    "actualRemovalWeight": 99,
    "applyRemovalTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "consignee": '@CNAME()',
    'pickUpPassword': 12323,
    'outsideType': '库存发货'
}


const cargoMap = { "1": "小红", "2": "熊安明", "c8254b4eb6154d9d91992acdf0df248a": "1", "fba7fb0eabc64ee882233e85d9b62d26": "kkkkkyinkai", "95105a94a7c5487c93616d505958c850": "test1" }
const specificationsMap = { "5d9992cab42840138a35b585e637b5e1": "25mm*20mm*30mm", "8810851ea47c414db9129f14aba557ed": "1", "b609063bb007469ab52cccc5f930c685": "11", "cc1926c4da1448739ddd8a0d3e1f82eb": "30*20*30" }
const materialMap = { "8293674dcc74426e97983b85f5bfd305": "ABC1" }
const productNameMap = { "0b8b112b5eb34d8b824c6cb5dcb5a686": "粗石油222", "b2fd07bb44d94647a7731f6cac488f62": "粗石油222", "ce78797629a448c89f2e0330de4c1ce1": "H型钢" }
const originPlaceMap = { "bc5ecc7158f44eccae90cada6e986165": "测试1" }
const deliveryStoreMap = { "bc5ecc7158f44eccae90cada6e986165": "仓库1", "bc5ecc7158f44ecc56": "仓库2" }
const pilePositionMap = { "bc5ecc7158f44eccae90cada6e986165": "区桩A", "bc5ecc7158f44ecc56": "区桩B" }

const MockRole = {
    role: "@PICK('1','2')"  // 货主 1,仓管员 2
}

const mockRouterMap = {
    [hostList.default]: [
        // #region 基础信息

        // #region  查询货主管理列表
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: storageURL + '/web/settlement/pageList/shipperManage',
            result(params) {
                return {
                    ...body,
                    ...{
                        data: {
                            'list|1-10': [shipperManageList],
                            "paginator": {
                                "currentPage": params.page,
                                "pageSize": params.pageSize,
                                "totalCount": 1000,
                                "totalPage": 1000 / params.pageSize
                            }
                        },
                    },
                };
            }
        },
        // #endregion 

        // #region  删除货主
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/Shipper/delete',
            result(params) {
                return {
                    ...body,
                };
            }
        },
        // #endregion    

        // #region  编辑货主
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/Shipper/update',
            result() {
                return {
                    ...body,
                };
            }
        },
        // #endregion    

        // #region  新增货主
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/Shipper/create',
            result() {
                return {
                    ...body,
                };
            }
        },
        // #endregion    

        // #endregion

        // #region 仓储信息

        // #region  入库登记
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/base/stockRegister/add',
            result(params) {
                return {
                    ...body
                };
            }
        },
        // #endregion 

        // #region  获取库存表列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/cm/commodity/commodityOnSale/page',
            result(params) {
                return {
                    ...body,
                    ...{
                        data: {
                            'list|10-20': [InventoryTableList],
                            "paginator": {
                                "currentPage": params.page,
                                "pageSize": params.pageSize,
                                "totalCount": 1000,
                                "totalPage": 1000 / params.pageSize
                            }
                        },
                    },
                };
            }
        },
        // #endregion 

        // #region  获取库存明细分页
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/base/stockInventoryDetail/page',
            result(params) {
                return {
                    ...body,
                    ...{
                        data: {
                            'list|10-20': [InventoryDetailList],
                            "paginator": {
                                "currentPage": params.page,
                                "pageSize": params.pageSize,
                                "totalCount": 1000,
                                "totalPage": 1000 / params.pageSize
                            }
                        },
                    },
                };
            }
        },
        // #endregion 

        // #region  查询选中的是否还有余量
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/InventoryTable/surplus',
            result() {
                return {
                    ...body,
                    ...{
                        data: {
                            HasSurPlus: Math.random() > 0.0001 ? true : false
                        },
                    },
                };
            }
        },
        // #endregion 

        // #region  选中的进行冻结
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/inventory/frozen',
            result() {
                return {
                    ...body,
                };
            }
        },
        // #endregion 

        // #region  选中的进行解冻
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/inventory/unfrozen',
            result() {
                return {
                    ...body,
                };
            }
        },
        // #endregion 

        // #region  取消出库
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/base/stockInventoryDetail/cancelRemoval',
            result() {
                return {
                    ...body,
                };
            }
        },
        // #endregion 

        // #region  待验收出库选中某一仓库,根据申请出库重量，给出详细的列表信息
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/base/stockRemoval/list',
            result() {
                return {
                    ...body,
                    'data|1-2': [RetrievalList]

                };
            }
        },
        // #endregion 

        // #region 获取过户信息
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/inventory/transferinfo',
            result() {
                return {
                    ...body,
                    "data|1-2": [TransferinfoList]
                };
            }
        },
        // #endregion 

        // #region  过户的最大可用量量
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: storageURL + '/web/yc/inventory/transfer/available',
            result() {
                return {
                    ...body,
                    data: '55'
                };
            }
        },
        // #endregion 

        // #region 操作过户
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/inventory/transfer',
            result() {
                return {
                    ...body,
                };
            }
        },
        // #endregion 

        // #region  待验收出库列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/storage/stockRemoval/page',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10-20': [StockRemovalList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },

                };
            }
        },
        // #endregion 

        // #region  验收出库
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/base/stockRemoval/removal',
            result() {
                return {
                    ...body,
                };
            }
        },
        // #endregion 

        // #region  出库申请
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/base/stockRemoval/apply',
            result() {
                return {
                    ...body,
                };
            }
        },
        // #endregion 

        // #region  待验收入库列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/storage/stockRegister/page',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10-20': [StockRegisterList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },

                };
            }
        },
        // #endregion 

        // #region  验收入库
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/base/stockRegister/examine',
            result() {
                return {
                    ...body,
                };
            }
        },
        // #endregion 

        // #region  获取质押解押管理列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/pledgeinfo/page',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10-20': [PledgeinfolIST],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },

                };
            }
        },
        // #endregion 

        // #region  解押管理页面专门获取质押信息
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: storageURL + '/web/yc/pledgeinfo/cargo/info',
            result(params) {
                return {
                    ...body,
                    data: {
                        "bankId": "1", //质权方id(银行id)
                        "bankName": "中国银行", // 质权方名称
                    },

                };
            }
        },
        // #endregion 

        // #region  获取质押总量
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: storageURL + '/web/yc/pledgeinfo/pledgeNum',
            result() {
                return {
                    ...body,
                    data: {
                        totalPledgeNums: 78,
                        totalPledgeWeight: 200
                    },

                };
            }
        },
        // #endregion 

        // #region  获取可用总量
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: storageURL + '/web/yc/pledgeinfo/available',
            result() {
                return {
                    ...body,
                    data: 185
                };
            }
        },
        // #endregion 

        // #region  质押操作
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/pledgeinfo/pledge',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion 

        // #region  解押操作
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/releaseinfo/release',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion         

        // #region  出库明细列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/storage/stockRemovalDetail/page',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10-20': [StockRemovalDetailList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },

                };
            }
        },
        // #endregion 

        // #region  出库单
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/storage/stockRemovalDetail/get',
            result() {
                return {
                    ...body,
                    data: {
                        "createdBy": "",
                        "createdTime": "",
                        "summation": "",
                        "list|1-2": [stockRemovalBill]
                    },

                };
            }
        },
        // #endregion 

        // #region  入库明细列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/storage/stockRegisterDetail/page',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10-20': [StockRegisterDetailList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },

                };
            }
        },
        // #endregion 

        // #region  入库单
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: storageURL + '/web/yc/storage/stockRegisterDetail/get',
            result() {
                return {
                    ...body,
                    data: {
                        ...InventoryTableList,
                        "num": 23,
                        "weight": 243,
                        "registerId": "SH1905060002",
                        "registerTime":'@DATE("yyyy-MM-dd HH:mm:ss")',
                        "summation":87,
                        "remark":"备注",
                        "productTypeCode":"34234"
                    },

                };
            }
        },
        // #endregion 

        // #region  过户明细列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/inventory/transfer/detail',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10-20': [TransferDetailList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },

                };
            }
        },
        // #endregion 

        // #region  过户单
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: storageURL + '/web/yc/inventory/transfer/bill',
            result() {
                return {
                    ...body,
                    data: {
                        ...TransferDetailList,
                        "num": 23,
                        "weight": 243,
                        "registerId": "SH1905060002",
                        "registerTime":'@DATE("yyyy-MM-dd HH:mm:ss")',
                        "summation":87,
                        "remark":"备注",
                        "chineseWeights":"" // 中文重量
                    },

                };
            }
        },
        // #endregion 


        // #region  质押明细列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/pledgeinfo/detail',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10-20': [PledgeDetailList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },

                };
            }
        },
        // #endregion 

        // #region  质押单
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: storageURL + '/web/yc/pledgeinfo/bill',
            result() {
                return {
                    ...body,
                    data: {
                        "bankName": "中国银行", //质权方名称
                        "cargoId": "1",
                        "cargoName": "@CNAME()", // 开始时间
                        "createdTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
                        "id": "11213",
                        "inventoryTotalNums": 98, // 库存数量
                        "inventoryTotalWeight": 86, // 库存总重量
                        "pledgeCargo": "@CNAME()",  // 质押方
                        "pledgeCode": "67216312", // 质押单号
                        "pledgeNums": 76, // 质押数量
                        "pledgeType": "0", // 质押类型
                        "pledgeWeight": 976, //质押重量
                    },

                };
            }
        },
        // #endregion 

        // #region  解押明细列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: storageURL + '/web/yc/releaseinfo/detail',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10-20': [ReleasePledgeDetailList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },

                };
            }
        },
        // #endregion 

        // #region  解押单
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: storageURL + '/web/yc/releaseinfo/bill',
            result() {
                return {
                    ...body,
                    data: {
                        "bankName": "中国银行", //质权方名称
                        "cargoId": "1",
                        "cargoName": "@CNAME()", // 货主
                        "createdTime": '@DATE("yyyy-MM-dd HH:mm:ss")', // 开始时间
                        "id": "11213",
                        "inventoryTotalNums": 98, // 库存数量
                        "inventoryTotalWeight": 86, // 库存总重量
                        "pledgeCargo": "@CNAME()",  // 质押方
                        "releaseCode": "67216312", // 解押单号
                        "releaseNums": 76, // 解押数量
                        "releaseWeight": 976, //解押重量
                    },

                };
            }
        },
        // #endregion 


        // #endregion

        // #region 系统参数

        // #region  获取用户信息
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/system/manage/user/getUser',
            result() {
                return {
                    ...body,
                    data: {
                        avatar: "https://file.hletong.com/group1/M00/00/00/CgESM10JhOeAMwkYAACpkiPEWEc863.png?token=0175c2599f38e9285a5c46f9aa563460&ts=1561431795",
                        createdBy: "admin",
                        createdTime: "2019-06-24 08:41:15.0",
                        email: "",
                        locked: 1,
                        password: "92bf7f66349ac7c8ede0aedc81f41a663c720a4510dd032991f985983dd976e5",
                        phone: "18652860219",
                        realname: "施少伟奇",
                        updatedBy: "admin",
                        updatedTime: "2019-06-24 08:41:15.0",
                        userId: "174466677793095680",
                        username: "18652860219",
                        version: "1"
                    }
                };
            }
        },
        // #endregion    

        // #region  获取用户系统跳转
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/system/manage/user/getSystems',
            result() {
                return {
                    ...body,
                    "data": [
                        {
                            "path": "https://pay.hletong.com",
                            "systemCode": "cwzx",
                            "systemId": "166948708439556096",
                            "systemName": "惠龙云仓"
                        }],
                }
            }
        },
        // #endregion    

        // #region  获取用户角色
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/system/manage/user/getUserRole',
            result() {
                return {
                    ...body,
                    data: {
                        ...MockRole
                    }
                };
            }
        },
        // #endregion   

        // #endregion

        // #region  字典项
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/web/yc/inventory/transfer/base',
            result() {
                return {
                    ...body,
                    data: {
                        "cargoMap": cargoMap,
                        "specificationsMap": specificationsMap,
                        "materialMap": materialMap,
                        "productNameMap": productNameMap,
                        "originPlaceMap": originPlaceMap,
                        "deliveryStoreMap": deliveryStoreMap,
                        "pilePositionMap": pilePositionMap
                    }
                };
            }
        },
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/web/yc/bank/info',
            result() {
                return {
                    ...body,
                    data: [
                        {
                            "affiliateBank": "中信银行",
                            "bankIphone": "15952903666",
                            "bankStatus": "0",
                            "cityId": "321100",
                            "cityName": "镇江市",
                            "createdTime": "2019-07-04 17:49:45.0",
                            "detailAddress": "长江路301号",
                            "id": "1",
                            "iphone": "15952903985",
                            "isDeleted": 0,
                            "provinceId": "320000",
                            "provinceName": "江苏省",
                            "regionId": "321111",
                            "regionName": "润州区",
                            "subbranch": "润州支行",
                            "updatedTime": "2019-07-04 17:49:48.0"
                        },
                        {
                            "affiliateBank": "中国银行",
                            "bankIphone": "15952903666",
                            "bankStatus": "0",
                            "cityId": "321100",
                            "cityName": "镇江市",
                            "createdTime": "2019-07-04 17:49:45.0",
                            "detailAddress": "长江路301号",
                            "id": "2",
                            "iphone": "15952903985",
                            "isDeleted": 0,
                            "provinceId": "320000",
                            "provinceName": "江苏省",
                            "regionId": "321111",
                            "regionName": "润州区",
                            "subbranch": "润州支行",
                            "updatedTime": "2019-07-04 17:49:48.0"
                        }

                    ]
                };
            }
        },
        // #endregion     

        // 数据字段项
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/baseserve/dict/item/valid/options/get',
            result() {
                return {
                    ...body,
                    "data": [
                        {
                            "entryCode": "YcDeliveryStoreType",
                            "entryName": "交割库类型",
                            "items": [
                                {
                                    "disabled": false,
                                    "id": "0",
                                    "orderBy": 0,
                                    "selected": 0,
                                    "text": "室内库"
                                },
                                {
                                    "disabled": false,
                                    "id": "1",
                                    "orderBy": 1,
                                    "selected": 0,
                                    "text": "室外库"
                                }
                            ]
                        },
                        {
                            "entryCode": "YcProductType",
                            "entryName": "品名大类",
                            "items": [
                                {
                                    "disabled": false,
                                    "id": "00",
                                    "orderBy": 0,
                                    "selected": 0,
                                    "text": "钢材"
                                },
                                {
                                    "disabled": false,
                                    "id": "01",
                                    "orderBy": 1,
                                    "selected": 0,
                                    "text": "石油"
                                },
                                {
                                    "disabled": false,
                                    "id": "02",
                                    "orderBy": 2,
                                    "selected": 0,
                                    "text": "木材"
                                }
                            ]
                        }
                    ]
                };
            }
        },
    ]
};

export const isMock = ({ url, methods, params = {}, host = "", version = "" }) => {
    let hasMock = {
        isMock: false
    };
    const path = version !== "" ? `/${version}url` : url;
    if (mockRouterMap[host] !== undefined) {
        mockRouterMap[host].forEach(routerObject => {
            if (routerObject.methods.toUpperCase() === methods.toUpperCase() && routerObject.isMock === true) {
                if (pathToRegexp(routerObject.router).exec(path) !== null) {
                    hasMock = { ...routerObject };
                    hasMock.mock = mockjs.mock(routerObject.result(params));
                }
            }
        });
    }
    return hasMock;
};