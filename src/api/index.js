import axios from 'axios'
import qs from 'qs'
import { Base64 } from '@/util/base64.js'
import { isMock } from "./mock";
import {MessageBox} from 'element-ui';
let sessionFlag = true;
var cookie = require('cookie-parse');

const env = process.env.NODE_ENV;

let baseURL = '';//开发路由前缀
let loginUrl = '';

let redirectUrl = ''; //跳转到登录页的路由
let cookies = cookie.parse(document.cookie);
let Authorization = cookies.HLETTYPE + ' ' + cookies.HLETID
let uploadUrl = '/apis';
let validUrl = 'http://10.1.15.106:8102';

let oilURL = '';


// window.globelApi2 = 'http://10.1.15.106:8445'//test环境
// window.globelApi2 = 'http://192.168.4.16:25089'//建波
//  window.globelApi2 = 'http://192.168.4.16:25083'//冬菜

//根据不同的环境打包不同的接口
switch (env) {
    case 'development':
        baseURL = '/api';
        redirectUrl = 'http://localhost:8080/';
        loginUrl = 'http://localhost:3000/index.html';
        oilURL = ''
        break;
    case 'production':
        loginUrl = 'https://login.hletong.com/';
        redirectUrl = 'https://cloudStorage.hletong.com/';
        oilURL = ''
        break;
    case 'test':
        baseURL = 'http://test.hletong.com/apis/';
        redirectUrl = 'http://oilhui.hlet.com';
        loginUrl = 'http://login.hlet.com';
        oilURL = 'oilhui'
        break;
    case 'ywtest':
        baseURL = 'http://apis.hletown.com/';
        redirectUrl = 'http://oilhui.hletown.com';
        loginUrl = 'http://login.hletown.com';
        oilURL = 'oilhui'
        break;
    default:
        break;
}

const goLogin = (type) => {
	switch(type){
		case 'userClick':
			if(env == 'development') {
// 
			} else {
				window.location.href = loginUrl + '?redirectUrl=' + redirectUrl;
			}
			break;
		default:
			if(sessionFlag) {
				MessageBox.confirm('您长时间未操作，会话已过期，咱们后会有期，江湖再见！','提示',{
					confirmButtonText: '确定',
                    showClose:false,
                    showCancelButton:false
				}).then(() => {
					if(env == 'development') {
// 
					} else {
						window.location.href = loginUrl + '?redirectUrl=' + redirectUrl;
					}
				})
				sessionFlag = false;
			}
			break;
	}
};

if(!cookies.HLETID || cookies.HLETID == ''){
	goLogin();
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
				url: baseURL + "/auth/oauth/token",
				method: 'post',
				data: formData,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
				}
			}).then(res => {
				/*
				* 变量保存token，减少每次访问localstorage的消耗
				* */
				Authorization = res.tokenType + ' ' + res.value;
				/*
				* 存localstorage，方便刷新界面的时候获取到token
				* */
				localStorage.setItem('token', JSON.stringify(res));
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
    getUserRole(userId) {
        return fetch('/system/manage/user/getUserRole', { userId }, 'get')
    },

    // #region 商品管理

    /**
     * @author sswq
     * @param params
     * @description 查询最低保证金
     */
    cautionMoneny(params) {
        return fetch(oilURL + '/product/product/bzj', params, 'get')
    },
    /**
     * @author sswq
     * @param params
     * @description 交割库分页
     */
    queryDeliveryStoreList(params) {
        return fetch(oilURL + '/web/hyw/deliveryStore/page', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 新增交割库
     */
    addDeliveryStore(params) {
        return fetch(oilURL + '/web/hyw/deliveryStore/add', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 修改交割库
     * */
    updateDeliveryStore(params) {
        return fetch(oilURL + '/web/hyw/deliveryStore/update', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 修改交割库
     * */
    delDeliveryStore(params) {
        return fetch(oilURL + '/web/hyw/deliveryStore/delOrResume', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 一级牌号
     * */
    getClass() {
        return fetch(oilURL + '/open/productInterface/getClassify', '', 'get')
    },
    /**
     * @author sswq
     * @param params
     * @description 牌号下动态加载的
     * */
    getParameterById(id) {
        return fetch(oilURL + '/open/productInterface/getParameterById', { id }, 'get')
    },
    /**
     * @author sswq
     * @param params
     * @description 出售中的商品列表
     * */
    getCommodityOnSaleList(params) {
        return fetch(oilURL + '/web/hyw/product/product/pageOnSale', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 待售中的商品列表
     * */
    getCommodityForSaleList(params) {
        return fetch(oilURL + '/web/hyw/product/product/pageForSale', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 新增商品
     */
    addCommodity(params) {
        return fetch(oilURL + '/web/hyw/product/product/add', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 修改商品
     * */
    updateCommodity(params) {
        return fetch(oilURL + '/web/hyw/product/product/update', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 修改单价和库存
     * */
    updatePriceAndInventory(params) {
        return fetch(oilURL + '/web/hyw/product/product/updatePriceAndInventory', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 批量更新商品
     * */
    batchUpdateCommodity(params) {
        return fetch(oilURL + '/web/hyw/product/product/switchState', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 商品详情页/编辑查询
     * */
    getDetailCommodity(params) {
        return fetch(oilURL + '/open/product/product/get', params, 'get')
    },
    /**
     * @author sswq
     * @param params
     * @description 回收站分页
     * */
    getRecycleList(params) {
        return fetch(oilURL + '/web/hyw/product/product/pageForRecycle', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 回收站删除商品
     * */
    delOrResume(params) {
        return fetch(oilURL + '/web/hyw/product/product/delOrResume', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 订单管理列表
     * */
    orderCommodityManage(params) {
        return fetch(oilURL + '/web/hyw/shopping/order/seller', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 库存发布列表
     * */
    releaseycList(params) {
        return fetch(oilURL + '/web/hyw/product/product/pageForYc', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 库存发布列表查询云仓商品相关信息
     * */
    releaseycDetail(params) {
        return fetch(oilURL + '/product/product/ycDetail', params,'get')
    },
    /**
     * @author sswq
     * @param params
     * @description 新增商品FROM云仓
     * */
    releaseYc(params) {
        return fetch(oilURL + '/web/hyw/product/product/addYc', params)
    },
    /**
     * @author sswq
     * @description 生产商下拉列表
     * */
    getProducerSelectList() {
        return fetch(oilURL + '/product/product/selectProducers', '', 'get')
    },
    /**
     * @author sswq
     * @description 品类牌号
     * */
    getTransferBaseList(productType) {
        return fetch(oilURL + '/product/product/transferBaseList', {productType}, 'get')
    },
    /**
     * @author sswq
     * @description 云仓中商品相关信息(详情)
     * */
    ycProductDetail(id) {
        return fetch(oilURL + '/product/product/ycProductDetail', {id}, 'get')
    },
    // #endregion

    // #region 会员管理
    /**
     * @author sswq
     * @param params
     * @description 交易会员管理列表
     * */
    getVIPList(params) {
        return fetch(oilURL + '/web/hyw/member/page', params)
    },
    /**
      * @author sswq
      * @param params
      * @description 会员启用禁用
      * */
    vipEnable(params) {
        return fetch(oilURL + '/web/hyw/member/updateState', params)
    },
    /**
      * @author sswq
      * @param params
      * @description 获取会员信息(用于会员编辑前请求)
      * */
     getVIPInfo(params) {
        return fetch(oilURL + '/web/hyw/member/get', params,'get')
    },
    /**
      * @author sswq
      * @param params
      * @description 新增会员
      * */
    AddVIP(params) {
        return fetch(oilURL + '/web/hyw/member/add', params)
    },
    /**
      * @author sswq
      * @param params
      * @description 更新会员
      * */
    UpdateVIP(params) {
        return fetch(oilURL + '/web/hyw/member/update', params)
    }, 
    
    /**
      * @author sswq
      * @param params
      * @description 新增入会协议
      * */
     AddAgreement(params) {
        return fetch(oilURL + '/web/hyw/agreement/add', params)
    },        
    /**
      * @author sswq
      * @param params
      * @description 编辑入会协议
      * */
     UpdateAgreement(params) {
        return fetch(oilURL + '/web/hyw/agreement/update', params)
    },  
    /**
      * @author sswq
      * @param params
      * @description 删除入会协议
      * */
     DelAgreement(params) {
        return fetch(oilURL + '/web/hyw/agreement/delete', params)
    }, 
    // #endregion 

    // #region 审核管理
    /**
     * @author sswq
     * @param params
     * @description 审核管理列表
     * */
    getInitiateAuditList(params) {
        return fetch(oilURL + '/admissionAudit/page', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 更新入会审核
     * */
    updateAdmissionAudit(params) {
        return fetch(oilURL + '/admissionAudit/update', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 历史审核意见
     * */
    historyAudit(params) {
        return fetch(oilURL + '/web/hyw/admissionAuditHistory/page', params)
    },
    // #endregion 

    // #region 预警管理
    /**
     * @author sswq
     * @param params
     * @description 入会协议分页
     * */
    getAgreementList(params) {
        return fetch(oilURL + '/web/hyw/agreement/page', params)
    },
    /**
     * @author sswq
     * @param params
     * @description 协议到期预警列表
     * */
    getDealDueForeWarnList(params) {
        return fetch(oilURL + '/web/hyw/agreement/pageWarn', params)
    },
    // #endregion 

    // #region  字典项
    /**
     * @author sswq
     * @description 查询所有基础信息下拉数据源
     * */
    getAllBaseInfo() {
        return fetch(oilURL + '/web/yc/inventory/transfer/base', '', 'get')
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
        return fetch(oilURL + '/web/yc/bank/info', params, 'get')
    },
    /**
     * @author sswq
     * @description 获取文件信息
     * */
    getFilesInfo(params) {
        return fetch('/dfs/open/files/info/get', params, 'get')
    },
    /**
     * @author sswq
     * @description 企业用户分页查询
     * */
    getEnterpriseList(params) {
        return fetch('/userinfo/enterprise/list/search', params)
    },
    // #endregion


}
