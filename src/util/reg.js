// 手机号验证
export const mobileValidation = mobile => {
  const mobileReg = /^1\d{10}$/g; 
  return mobileReg.test(mobile);
}

// 联系电话验证
export const phoneValidation = phone => {
  const phoneReg = /(^1\d{10}$)|(^0\d{2,3}-\d{7,8}$)|(^0\d{2,3}\d{7,8}$)/g;
  return phoneReg.test(phone);
};


// 正数,小数点不超过2位
export const num2 = num => {
  const Reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{0,2})?$/g;
  return Reg.test(num);
};

// 正数1-9999
export const num9999 = num => {
  const Reg = /^[1-9][0-9]{0,3}$/g;
  return Reg.test(num);
};