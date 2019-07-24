import axios from 'axios'
import qs from 'qs'
import { Base64 } from '@/util/base64.js'
import { isMock } from "./mock";
var cookie = require('cookie-parse');

const env = process.env.NODE_ENV;

let baseURL = '/apis';//开发路由前缀
let loginUrl = '';

let redirectUrl = ''; //跳转到登录页的路由
let cookies = cookie.parse(document.cookie);
let Authorization = cookies.HLETTYPE + ' ' + cookies.HLETID
let uploadUrl = '/apis';
let validUrl = 'http://10.1.15.106:8102';

let storageURL = '';


// window.globelApi2 = 'http://10.1.15.106:8445'//test环境
// window.globelApi2 = 'http://192.168.4.16:25089'//建波
//  window.globelApi2 = 'http://192.168.4.16:25083'//冬菜

//根据不同的环境打包不同的接口
switch (env) {
    case 'development':
        baseURL = '/api';
        redirectUrl = 'http://localhost:8080/';
        loginUrl = 'http://localhost:3000/index.html';
        storageURL = ''
        break;
    case 'production':
        loginUrl = 'https://login.hletong.com/';
        redirectUrl = 'https://cloudStorage.hletong.com/';
        storageURL = ''
        break;
    case 'test':
        baseURL = 'http://10.1.15.106:8445';
        redirectUrl = 'http://yc.hlet.com';
        loginUrl = 'http://login.hlet.com';
        storageURL = 'hlyc'
        break;
    default:
        break;

}

const goLogin = () => {
    if (env == 'development') {
        window.VueApp.$router.push({
            name: 'login'
        })
    } else {
        window.location.href = loginUrl + '?redirectUrl=' + redirectUrl;
    }
}


/*
* 首先判断localStorage是否有记录 by wzd
*
* */


let timeout = 300000;
let instance = axios.create({
    baseURL: baseURL,
    timeout: timeout
});

/*
*
* 请求的预处理 by wzd
* */
instance.interceptors.request.use((config) => {
    config.headers['Authorization'] = Authorization;
    config.headers['Accept'] = '';
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
}, (error) => {
    return Promise.reject(error);
});

/*
*
* 返回的预处理 by wzd
* */
instance.interceptors.response.use(function (response) {
    // Do something with response data
    return response.data;
}, function (error) {
    // console.log(error);
    let errCode = error.message.replace(/[^0-9]/gi, '');
    if (errCode == '401') {
        goLogin();
    }
    return Promise.reject(error);
});

const formDataRequest = (url, params, methods = 'post') => {
    let formData = new FormData();
    Object.keys(params).forEach(target => {
        if (typeof params[target] !== 'string') {
            formData.append(target, JSON.stringify(params[target]));
        } else {
            formData.append(target, params[target]);
        }
    })
    const mock = isMock({ url, params: formData, methods });
    if (env == 'development' && mock.isMock === true) {
        return new Promise((resolve) => {
            resolve(mock.mock);
        });
    }

    return new Promise((resolve, reject) => {
        instance({
            url: url,
            method: methods,
            data: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

/*
*
* 封装axios实例，对错误统一处理，返回成功的promise对象 by wzd
* */
const fetch = (url, params, methods = 'post') => {
    //对所有的请求进行页码的改动，新框架 by wzd
    if (params !== undefined && params.offset !== undefined && params.limit !== undefined) {
        params.offset = (params.offset - 1) * params.limit;
    }
    const mock = isMock({ url, params, methods });
    if (env == 'development' && mock.isMock === true) {
        return new Promise((resolve) => {
            resolve(mock.mock);
        });
    }
    return new Promise((resolve, reject) => {
        if (methods == 'get') {
            url = url + '?' + qs.stringify(params);
        }
        instance[methods](url, params).then(res => {
            switch (res.code) {
                case '-1':
                case '0000001':
                case '000002':
                case '010500':
                case '010002':
                case '020000':
                case '030001':
                    window.VueApp.$Message({
                        type: 'error',
                        message: res.mesg
                    })
                    break;
                case '040001':
                    goLogin();
                    break;
                default:
                    resolve(res)
                    break;
            }

        }).catch(err => {
            console.log(err);
            reject(err);
        })
    })
}
/*
*
* 封装axios实例，对错误统一处理，返回成功的promise对象
* */
const getfetch = (url, params, methods = 'post') => {
    //对所有的请求进行页码的改动，新框架 by wzd
    if (params !== undefined && params.offset !== undefined && params.limit !== undefined) {
        params.offset = (params.offset - 1) * params.limit;
    }
    return new Promise((resolve, reject) => {
        if (methods == 'get') {
            url = url + '?' + qs.stringify(params, { indices: false });
        }
        instance[methods](url, params).then(res => {
            switch (res.code) {
                case '-1':
                case '0000001':
                case '000002':
                case '010500':
                case '010002':
                case '020000':
                case '030001':
                    window.VueApp.$Message({
                        type: 'error',
                        message: res.mesg
                    })
                    break;
                case '040001':
                    goLogin();
                    break;
                default:
                    resolve(res)
                    break;
            }

        }).catch(err => {
            console.log(err)
            reject(err);
        })
    })
}

/*
*
* 封装axios实例，专门做Blob下载的 by sswq
* */
const fetchBlob = (url, params, methods = 'post') => {
    return new Promise((resolve, reject) => {
        if (methods == 'get') {
            url = url + '?' + qs.stringify(params);
        }
        instance[methods](url, params, { responseType: 'arraybuffer', headers: { ResponseFilter: false } }).then(res => { // 不加这个{responseType: 'arraybuffer'},流直接解析成字符串
            resolve(res)
        }
        ).catch(err => {
            reject(err);
        })
    })
}

export default {
    /**
     *登陆接口
     * params:{
     *    username:string,
     *    password:string,
     *    grant_type:number,
     *    client_id:number,
     *    client_secret:number
     * }
     * 登陆也的数据后端不解析json数据，用formdata by  wzd
     * **/
    login(params) {
        let formData = new FormData();
        formData.append('username', params.username);
        formData.append('password', params.password);
        formData.append('grant_type', params.grant_type);
        // formData.append('client_id', params.client_id)
        // formData.append('client_secret', params.client_secret)
        Authorization = 'Basic ' + Base64.encode('hlet-system-center:123456');
        return new Promise((resolve, reject) => {
            instance({
                url: "/auth/oauth/token",
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Authorization': Authorization
                }
            }).then(res => {
                /*
                * 变量保存token，减少每次访问localstorage的消耗
                * */
                var cookie = 'HLETID=' + res.value + ';path=/;domain=hletong.com'
                var cookie2 = 'HLETTYPE=' + res.tokenType + ';path=/;domain=hletong.com'
                document.cookie = cookie
                document.cookie = cookie2
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    },
    goLogin() {
        goLogin();
    },
    /*
        * 获取用户信息
        * by  wulei
        * */
    getUser() {
        return fetch('/system/manage/user/getUser', {}, 'get')
    },
    /*
        * 获取系统和菜单权限
        * by  wulei
    */
    getPermissions(sid) {
        return fetch('/system/manage/user/getPermissions', { sid: sid }, 'get')
    },
    /*
        * 获取系统
        * by  wulei
    */
    getSystems() {
        return fetch('/system/manage/user/getSystems', '', 'get')
    },
    // 文件上传
    upload(params) {
        return fetch('/dfs/open/files/upload', params)
    },
    // 修改头像
    resetAvatar(params) {
        return formDataRequest('/system/manage/user/resetAvatar', params)
    },
    // 修改密码
    resetPwd(params) {
        return formDataRequest('/system/manage/user/resetPwd', params)
    },
    // 获取验证码
    getVerfyCode(params) {
        // return formDataRequest(`${validUrl}/mc-client/sms/template/smsService/sendVerifiCode`, params)
        return formDataRequest(`/sms/mc-client/sms/template/smsService/sendVerifiCode`, params)
    },
    // 校验验证码
    reseverifiCodetPwd(params) {
        // return formDataRequest(`${validUrl}/mc-client/sms/template/smsService/verifiCode`, params)
        return formDataRequest(`/sms/mc-client/sms/template/smsService/verifiCode`, params)
    },
    // #region 根据userId判断角色是货主还是仓库管理人员
    getUserRole(userId){
        return fetch('/system/manage/user/getUserRole', { userId }, 'get')            
    },
    // #endregion

    // #region  基础信息
    /**
     * @author sswq
     * @param params
     * @description 查询货主管理列表
     * */
    getShipperManageList(params) {
        return fetch(storageURL + '/web/yc/base/cargoManage/pageCargo', params)
    },
    /**
     * @author sswq
     * @description 删除货主
     * */
    deleteShipper(params) {
        return fetch(storageURL + '/web/Shipper/delete', params)
    },

    /**
     * @author sswq
     * @description 新增货主
     * */
    createShipper(params) {
        return fetch(storageURL + '/web/yc/base/cargoManage/add', params)
    },
    /**
     * @author sswq
     * @description 编辑货主
     * */
    updateShipper(params) {
        return fetch(storageURL + '/web/yc/base/cargoManage/update', params)
    },    

    /**
     * @author xh
     * @description 激活货主
     * */
    activeCargo(params) {
        return fetch(storageURL + '/web/yc/base/cargoManage/updateActive', params)
    },
    /**
     * @author xh
     * @description 禁用用货主
     * */
    disableCargo(params) {
        return fetch(storageURL + '/web/yc/base/cargoManage/updateDisable', params)
    },
    /**
     * @author xh
     * @description 品名列表查询
     * */
    gettProductNamesList(params) {
        return fetch(storageURL + '/web/yc/base/productName/listProductNames', params)
    },
    /**
     * @author xh
     * @description 新增品名
     * */
    addProductName(params) {
        return fetch(storageURL + '/web/yc/base/productName/add', params)
    },
    /**
     * @author xh
     * @description 编辑品名
     * */
    updateProductName(params) {
        return fetch(storageURL + '/web/yc/base/productName/update', params)
    },
    /**
     * @author xh
     * @description 禁用品名
     * */
    disableProductName(params) {
        return fetch(storageURL + '/web/yc/base/productName/disable', params)
    },
    /**
     * @author xh
     * @description 激活品名
     * */
    activeProductName(params) {
        return fetch(storageURL + '/web/yc/base/productName/active', params)
    },
    /**
     * @author xh
     * @description 品名下拉列表
     * */
    getProductNameData() {
        return fetch(storageURL + '/web/yc/base/productName/select', '', 'get')
    },
    /**
     * @author sswq
     * @description 材质下拉列表(根据品名id)
     * */
    getMaterialsData(params) {
        return fetch(storageURL + '/web/yc/base/goods/selectMaterials', params, 'get')
    },
    /**
     * @author sswq
     * @description 规格下拉列表(根据品名id,材质id)
     * */
    getSpecsData(params) {
        return fetch(storageURL + '/web/yc/base/goods/selectSpecs', params, 'get')
    },
    /**
     * @author sswq
     * @description 产地下拉列表(根据品名id,材质id,规格id)
     * */
    getOriginPlacesData(params) {
        return fetch(storageURL + '/web/yc/base/goods/selectOriginPlaces', params, 'get')
    },
    /**
     * @author sswq
     * @description 仓库下拉列表(专门为入库登记设计)
     * */
    getdeliveryStoresData() {
        return fetch(storageURL + '/web/yc/base/pilePosition/selectStockIds', '', 'get')
    },
    /**
     * @author sswq
     * @description 区装位下拉列表(根据仓库id)
     * */
    getPilePositionsData(stockId) {
        return fetch(storageURL + '/web/yc/base/pilePosition/select', {stockId}, 'get')
    },
    /**
     * @author xh
     * @description 交割库分页查询
     * */
    getDeliveryStoreList(params) {
        return fetch(storageURL + '/web/yc/base/deliveryStoreManage/pageDeliveryStore', params)
    },
    /**
     * @author xh
     * @description 新增交割库
     * */
    addDeliveryStore(params) {
        return fetch(storageURL + '/web/yc/base/deliveryStoreManage/add', params)
    },
    /**
     * @author xh
     * @description 编辑交割库
     * */
    updateDeliveryStore(params) {
        return fetch(storageURL + '/web/yc/base/deliveryStoreManage/update', params)
    },
     /**
     * @author xh
     * @description 禁用交割库
     * */
    disableDeliveryStore(params) {
        return fetch(storageURL + '/web/yc/base/deliveryStoreManage/updateDisable', params)
    },
     /**
     * @author xh
     * @description 激活交割库
     * */
    activeDeliveryStore(params) {
        return fetch(storageURL + '/web/yc/base/deliveryStoreManage/updateActive', params)
    },
     /**
     * @author xh
     * @description 仓管人员下拉获取
     * */
    getStoreAdminData() {
        return fetch(storageURL + '/web/yc/base/deliveryStoreManage/getStoreAdmin', '', 'get')
    },
    /**
     * @author xh
     * @description 材质列表查询
     * */
    getMaterialsList(params) {
        return fetch(storageURL + '/web/yc/base/material/listMaterials', params)
    },
    /**
     * @author xh
     * @description 新增材质
     * */
    addMaterial(params) {
        return fetch(storageURL + '/web/yc/base/material/add', params)
    },
    /**
     * @author xh
     * @description 编辑材质
     * */
    updateMaterial(params) {
        return fetch(storageURL + '/web/yc/base/material/update', params)
    },
    /**
     * @author xh
     * @description 禁用材质
     * */
    disableMaterial(params) {
        return fetch(storageURL + '/web/yc/base/material/disable', params)
    },
    /**
     * @author xh
     * @description 激活材质
     * */
    activeMaterial(params) {
        return fetch(storageURL + '/web/yc/base/material/active', params)
    },
    /**
     * @author xh
     * @description 产地分页查询
     * */
    getOriginPlaceList(params) {
        return fetch(storageURL + '/web/yc/base/originPlace/listOriginPlaces', params)
    },
    /**
     * @author xh
     * @description 新增产地
     * */
    addOriginPlace(params) {
        return fetch(storageURL + '/web/yc/base/originPlace/add', params)
    },
    /**
     * @author xh
     * @description 编辑产地
     * */
    updateOriginPlace(params) {
        return fetch(storageURL + '/web/yc/base/originPlace/update', params)
    },
     /**
     * @author xh
     * @description 禁用产地
     * */
    disableOriginPlace(params) {
        return fetch(storageURL + '/web/yc/base/originPlace/disable', params)
    },
     /**
     * @author xh
     * @description 激活产地
     * */
    activeOriginPlace(params) {
        return fetch(storageURL + '/web/yc/base/originPlace/active', params)
    },
    /**
     * @author xh
     * @description 规格分页查询
     * */
    getSpecList(params) {
        return fetch(storageURL + '/web/yc/base/spec/listSpecs', params)
    },
    /**
     * @author xh
     * @description 新增规格
     * */
    addSpec(params) {
        return fetch(storageURL + '/web/yc/base/spec/add', params)
    },
    /**
     * @author xh
     * @description 编辑规格
     * */
    updateSpec(params) {
        return fetch(storageURL + '/web/yc/base/spec/update', params)
    },
     /**
     * @author xh
     * @description 禁用规格
     * */
    disableSpec(params) {
        return fetch(storageURL + '/web/yc/base/spec/disable', params)
    },
     /**
     * @author xh
     * @description 激活规格
     * */
    activeSpec(params) {
        return fetch(storageURL + '/web/yc/base/spec/active', params)
    },
    /**
     * @author xh
     * @description 物资分页查询
     * */
    getGoodsList(params) {
        return fetch(storageURL + '/web/yc/base/goods/listGoods', params)
    },
    /**
     * @author xh
     * @description 新增物资
     * */
    addGoods(params) {
        return fetch(storageURL + '/web/yc/base/goods/add', params)
    },
    /**
     * @author xh
     * @description 编辑物资
     * */
    updateGoods(params) {
        return fetch(storageURL + '/web/yc/base/goods/update', params)
    },
     /**
     * @author xh
     * @description 禁用物资
     * */
    disableGoods(params) {
        return fetch(storageURL + '/web/yc/base/goods/disable', params)
    },
     /**
     * @author xh
     * @description 激活物资
     * */
    activeGoods(params) {
        return fetch(storageURL + '/web/yc/base/goods/active', params)
    },
    /**
     * @author xh
     * @description 新增物资初始化查询
     * */
    addGoodsInit(params) {
        return fetch(storageURL + '/web/yc/base/goods/addInit', params, 'get')
    },
    /**
     * @author xh
     * @description 更新物资初始化查询
     * */
    updateGoodsInit(params) {
        return fetch(storageURL + '/web/yc/base/goods/updateInit', params, 'get')
    },
    /**
     * @author xh
     * @description 根据大类查询品名
     * */
    selectProductNames(params) {
        return fetch(storageURL + '/web/yc/base/goods/selectProductNames', params, 'get')
    },
    /**
     * @author xh
     * @description 区桩位分页查询
     * */
    getPilePositionsList(params) {
        return fetch(storageURL + '/web/yc/base/pilePosition/listPilePositions', params)
    },
    /**
     * @author xh
     * @description 新增区桩位
     * */
    addPilePositions(params) {
        return fetch(storageURL + '/web/yc/base/pilePosition/add', params)
    },
    /**
     * @author xh
     * @description 编辑区桩位
     * */
    updatePilePositions(params) {
        return fetch(storageURL + '/web/yc/base/pilePosition/update', params)
    },
     /**
     * @author xh
     * @description 禁用区桩位
     * */
    disablePilePositions(params) {
        return fetch(storageURL + '/web/yc/base/pilePosition/disable', params)
    },
     /**
     * @author xh
     * @description 激活区桩位
     * */
    activePilePositions(params) {
        return fetch(storageURL + '/web/yc/base/pilePosition/active', params)
    },
    /**
     * @author xh
     * @description 下拉查询
     * */
    getDropDownList() {
        return fetch(storageURL + '/web/yc/inventory/transfer/base', '', 'get')
    },
    // #endregion

    // #region 仓储管理
    /**
     * @author sswq
     * @param params
     * @description 入库登记
     * */
    addStockRegister(params){
        return fetch(storageURL + '/web/yc/storage/stockRegister/add', params)          
    },
    /**
     * @author sswq
     * @param params
     * @description 查询库存表列表
     * */
    getInventoryTable(params){
        return fetch(storageURL + '/web/yc/storage/stockInventory/page', params)          
    },
    /**
     * @author sswq
     * @param params
     * @description 查询库存明细分页
     * */
    getInventoryDetail(params){
        return fetch(storageURL + '/web/yc/storage/stockInventoryDetail/page', params)          
    },   
    /**
     * @author sswq
     * @param params
     * @description 过户的最大可用量
     * */
    getTransferAvailable(params){
        return fetch(storageURL + '/web/yc/inventory/transfer/available', params,'get')          
    },    
    /**
     * @author sswq
     * @param params
     * @description 获取过户信息
     * */
    getInventoryTransferinfo(params){
        return fetch(storageURL + '/web/yc/inventory/transferinfo', params)          
    },    
    /**
     * @author sswq
     * @param params
     * @description 过户操作
     * */
    DoTransfer(params){
        return fetch(storageURL + '/web/yc/inventory/transfer', params)          
    },       
    /**
     * @author sswq
     * @param params
     * @description 查询选中的是否还有余量
     * */
    getSurplus(params){
        return fetch(storageURL + '/web/InventoryTable/surplus', params)          
    },      
    /**
     * @author sswq
     * @param params
     * @description 选中的进行冻结
     * */
    frozen(params){
        return fetch(storageURL + '/web/yc/inventory/frozen', params)          
    },   
    /**
     * @author sswq
     * @param params
     * @description 选中的进行解冻
     * */
    unfrozen(params){
        return fetch(storageURL + '/web/yc/inventory/unfrozen', params)          
    },
    /**
     * @author sswq
     * @param params
     * @description 取消出库
     * */
    cancelcheckout(params){
        return fetch(storageURL + '/web/yc/storage/stockInventoryDetail/cancelRemoval', params)          
    },
    /**
     * @author sswq
     * @description 待验收出库列表
     * */    
    getStockRemovalList(params){
        return fetch(storageURL + '/web/yc/storage/stockRemoval/page', params)         
    },    
    /**
     * @author sswq
     * @param removalId
     * @description 待验收出库选中某一仓库,根据申请removalId，给出详细的列表信息
     * */    
    detailRetrieval(params){
        return fetch(storageURL + '/web/yc/storage/stockRemoval/list', params)         
    },            
    /**
     * @author sswq
     * @param params
     * @description 验收出库
     * */    
    DoRemovalCheck(params){
        return fetch(storageURL + '/web/yc/storage/stockRemoval/removal', params)         
    }, 
    /**
     * @author sswq
     * @param params
     * @description 出库申请
     * */    
    DoCheckOutApply(params){
        return fetch(storageURL + '/web/yc/storage/stockRemoval/apply', params)         
    }, 
    /**
     * @author sswq
     * @description 待验收入库列表
     * */    
    getStockRegisterList(params){
        return fetch(storageURL + '/web/yc/storage/stockRegister/page', params)         
    },
    /**
     * @author sswq
     * @description 验收入库
     * */    
    examine(params){
        return fetch(storageURL + '/web/yc/storage/stockRegister/examine', params)         
    },
    /**
     * @author sswq
     * @description 质押解押管理列表
     * */    
    getPledgeinfo(params){
        return fetch(storageURL + '/web/yc/pledgeinfo/page', params)         
    },
    /**
     * @author sswq
     * @description 解押管理页面专门获取质押信息
     * */    
    getPledgeCargoinfo(cargoId){
        return fetch(storageURL + '/web/yc/pledgeinfo/cargo/info', {cargoId},'get')         
    },
    /**
     * @author sswq
     * @param cargoId 货主id
     * @description 获取质押总量
     * */    
    getPledgeNum(cargoId){
        return fetch(storageURL + '/web/yc/pledgeinfo/pledgeNum', {cargoId},'get')         
    }, 
    /**
     * @author sswq
     * @param cargoId 货主id
     * @description 获取可用总量
     * */    
    getAvailableNum(cargoId){
        return fetch(storageURL + '/web/yc/pledgeinfo/available', {cargoId},'get')         
    }, 
    /**
     * @author sswq
     * @param params 质押请求参数
     * @description 质押操作
     * */        
    DoPledge(params){
        return fetch(storageURL + '/web/yc/pledgeinfo/pledge', params)  
    },
    /**
     * @author sswq
     * @param params 解押请求参数
     * @description 解押操作
     * */        
    DoReleasePledge(params){
        return fetch(storageURL + '/web/yc/releaseinfo/release', params)  
    },
    /**
     * @author sswq
     * @description 出库明细列表
     * */     
    getStockRemovalDetailList(params){
        return fetch(storageURL + '/web/yc/storage/stockRemovalDetail/page', params)         
    }, 
    /**
     * @author sswq
     * @description 出库单
     * */     
    getStockRemovalBill(params){
        return fetch(storageURL + '/web/yc/storage/stockRemovalDetail/get', params)         
    },
    /**
     * @author sswq
     * @description 入库明细列表
     * */     
    getStockRegisterDetailList(params){
        return fetch(storageURL + '/web/yc/storage/stockRegisterDetail/page', params)         
    },  
    /**
     * @author sswq
     * @description 入库单
     * */     
    getStockRegisterBill(params){
        return fetch(storageURL + '/web/yc/storage/stockRegisterDetail/get', params,'get')         
    },
    /**
     * @author sswq
     * @description 过户明细列表
     * */     
    getTransferDetailList(params){
        return fetch(storageURL + '/web/yc/inventory/transfer/detail', params)         
    },   
    /**
     * @author sswq
     * @description 过户单
     * */     
    getTransferBill(params){
        return fetch(storageURL + '/web/yc/inventory/transfer/bill', params,'get')         
    },
    /**
     * @author sswq
     * @description 质押明细列表
     * */    
    getPledgeDetailList(params){
        return fetch(storageURL + '/web/yc/pledgeinfo/detail', params)         
    },    
    /**
     * @author sswq
     * @param {string} pledgeId
     * @description 质押单
     * */       
    PledgeinfoBill(pledgeId){
        return fetch(storageURL + '/web/yc/pledgeinfo/bill',{pledgeId}, 'get')   
    },
    /**
     * @author sswq
     * @description 解押明细列表
     * */    
    getReleasePledgeDetailList(params){
        return fetch(storageURL + '/web/yc/releaseinfo/detail', params)         
    },
    /**
     * @author sswq
     * @param {string} releaseId
     * @description 解押单
     * */       
    ReleaseinfoBill(releaseId){
        return fetch(storageURL + '/web/yc/releaseinfo/bill',{releaseId}, 'get')   
    },
    // #endregion

    // #region  字典项
    /**
     * @author sswq
     * @description 查询所有基础信息下拉数据源
     * */
    getAllBaseInfo() {
        return fetch(storageURL + '/web/yc/inventory/transfer/base', '', 'get')
    },
    /**
     * @author xh
     * @description 获取字典项数据列表
     * */
    getValidList(params) {
        return fetch('/baseserve/dict/item/valid/options/get', params, 'get')
    },
    /**
     * @author xh
     * @description 获取银行列表
     * */
    getBankList(params) {
        return fetch(storageURL + '/web/yc/bank/info', params, 'get')
    },
    // #endregion

    
}
