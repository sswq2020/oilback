const DICT = Object.create(null);
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
DICT.VIP_STATUS_FROZEN = 0
/**会员状态正常*/
DICT.VIP_STATUS_NORMAL = 1


/**会员状态 */
DICT.VIP_STATUS = {
    [DICT.VIP_STATUS_NORMAL]: "正常",
    [DICT.VIP_STATUS_FROZEN]: "禁用",
}

/**销售状态上架*/
DICT.SELL_STATUS_ON = "0"
/**销售状态下架*/
DICT.SELL_STATUS_OFF = "1"

/**销售状态出售中*/
DICT.SELL_ON_SALE = "0"
/**销售状态待售中*/
DICT.SELL_FOR_SALE = "1"

/**销售状态**/
DICT.SELL_STATE = {
    [DICT.SELL_ON_SALE]: "出售中",
    [DICT.SELL_FOR_SALE]: "待售中",
}

/**允许重复交易*/
DICT.RETRADE_ABLE = "0"
/**禁止重复交易*/
DICT.RETRADE_DISABLE = "1"

DICT.RETRADE_STATUS = {
    [DICT.RETRADE_ABLE]:"允许",
    [DICT.RETRADE_DISABLE]:"不允许"
}



/**线上协议 */
DICT.AGREE_ONLINE = "0"
/**线下协议 */
DICT.AGREE_OFFLINE = "1"
/**协议类型 */
DICT.AGREE_TYPE = {
    [DICT.AGREE_ONLINE]: "线上协议",
    [DICT.AGREE_OFFLINE]: "线下协议",
}

/**云仓*/
DICT.IS_YC = "1"
/**非云仓*/
DICT.IS_NOT_YC = "0"



/**恢复 */
DICT.DELETE_RECOVER = "0"
/**普通删除 */
DICT.DELETE_NORMAL = "1"
/**彻底删除 */
DICT.DELETE_COMPLETE = "2"
/**商品删除恢复状态 */
DICT.DELETE_STATUS = {
    [DICT.DELETE_RECOVER]: "恢复",
    [DICT.DELETE_COMPLETE]: "普通删除",
    [DICT.DELETE_COMPLETE]: "彻底删除",
}


/**钢材*/
DICT.PRODUCT_STELL = '00'
/**石油*/
DICT.PRODUCT_OIL = '01'
/**木材*/
DICT.PRODUCT_WOOD = '02'

/**商品大类*/
DICT.PRODUCT_CATEGORY = {
    [DICT.PRODUCT_STELL]:"钢材",
    [DICT.PRODUCT_OIL]:"石油",
    [DICT.PRODUCT_WOOD]:"木材",
}

/**待支付 */
DICT.PAY_AWAIT = "11"
/**已付款 */
DICT.PAY_RECEIVED="50"


DICT.PAY_STATUS = {
    [DICT.PAY_AWAIT]: "待支付",
    [DICT.PAY_RECEIVED]: "已付款",
}

/**待审核 */
DICT.WAIT_AUDIT = "0"
/**已审核 */
DICT.DONE_AUDIT="1"

DICT.AUDIT_STATUS = {
    [DICT.WAIT_AUDIT]: "待审核",
    [DICT.DONE_AUDIT]: "已审核",
}

/**审核不通过 */
DICT.NOPASS_AUDIT = "0"
/**审核通过 */
DICT.PASS_AUDIT = "1"

DICT.AUDIT_RESULT = {
    [DICT.NOPASS_AUDIT]: "审核不通过",
    [DICT.PASS_AUDIT]: "审核通过",
}


/**商品已发布 */
DICT.RELEASE_DONE = 1
/**商品未发布 */
DICT.RELEASE_UNDONE = 0


export default DICT;