const DICT = {};
/** 成功 */
DICT.SUCCESS = '000000';
/** 导入 */
DICT.IMPORT = '10000';
/** 集配平台 */
DICT.JPPT_PLANT = '10010';
/** 电商平台 */
DICT.BUSINESS_ONLINE_PLANT = '10020';


DICT.APP_INFO = {
    [DICT.IMPORT]:'导入',
    [DICT.JPPT_PLANT]:'集配平台',
    [DICT.BUSINESS_ONLINE_PLANT]:'电商平台'
}


/**买房会员*/
DICT.BUYER_VIP = '2'
/**卖房会员*/
DICT.SELLER_VIP = '1'

/**会员类型*/
DICT.VIP_TYPE = {
    [DICT.BUYER_VIP]: "买方会员",
    [DICT.SELLER_VIP]: "卖方会员"
}

/**会员状态禁用*/
DICT.VIP_STATUS_FROZEN = '0'
/**会员状态正常*/
DICT.VIP_STATUS_NORMAL = '1'

/**会员状态 */
DICT.VIP_STATUS = {
    [DICT.VIP_STATUS_NORMAL]: "正常",
    [DICT.VIP_STATUS_FROZEN]: "禁用",
}

export default DICT;