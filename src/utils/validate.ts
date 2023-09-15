/**
 * @param {string} path
 * @returns {Boolean}
 */
 export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 验证pad还是pc*/
export const vaildatePc = function() {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone',
    'SymbianOS', 'Windows Phone',
    'iPad', 'iPod']
  let flag = true
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/**
 * 判断身份证号码
 */
export function cardid(code) {
  const list: Array<string | boolean> = []
  let result = true
  let msg = ''
  var city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 '
  }
  if (!validatenull(code)) {
    if (code.length == 18) {
      if (!code || !/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code)) {
        msg = '证件号码格式错误'
      } else if (!city[code.substr(0, 2)]) {
        msg = '地址编码错误'
      } else {
        // 18位身份证需要验证最后一位校验位
        code = code.split('')
        // ∑(ai×Wi)(mod 11)
        // 加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        // 校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2, 'x']
        var sum = 0
        var ai = 0
        var wi = 0
        for (var i = 0; i < 17; i++) {
          ai = code[i]
          wi = factor[i]
          sum += ai * wi
        }
        var last = parity[sum % 11]
        if (parity[sum % 11] != code[17]) {
          msg = '证件号码校验位错误'
        } else {
          result = false
        }
      }
    } else {
      msg = '证件号码长度不为18位'
    }
  } else {
    msg = '请输入身份证号'
  }
  list.push(result)
  list.push(msg)
  return list
}

/**
 * 判断手机号码是否正确
 */
export function isvalidatemobile(phone): Array<boolean | string> {
  const list: Array<boolean | string> = []
  let result = true
  let msg = ''
  var isPhone = /^0\d{2,3}-?\d{7,8}$/
  // 增加134 减少|1349[0-9]{7}，增加181,增加145，增加17[678]
  var isMob = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|14[57][0-9]{8}|17[3678][0-9]{8})$/
  if (!validatenull(phone)) {
    if (phone.length == 11) {
      if (isPhone.test(phone)) {
        msg = '手机号码格式不正确'
      } else {
        result = false
      }
    } else {
      msg = '手机号码长度不为11位'
    }
  } else {
    msg = '手机号码不能为空'
  }
  list.push(result)
  list.push(msg)
  return list
}

/**
 * 判断姓名是否正确
 */
export function validatename(name) {
  var regName = /^[\u4e00-\u9fa5]{2,4}$/
  if (!regName.test(name)) return false
  return true
}

/**
 * 判断是否为整数
 */
export function validatenum(num, type) {
  let regName = /[^\d.]/g
  if (type == 1) {
    if (!regName.test(num)) return false
  } else if (type == 2) {
    regName = /[^\d]/g
    if (!regName.test(num)) return false
  }
  return true
}

/**
 * 判断是否为小数
 */
export function validatenumord(num, type) {
  let regName = /[^\d.]/g
  if (type == 1) {
    if (!regName.test(num)) return false
  } else if (type == 2) {
    regName = /[^\d.]/g
    if (!regName.test(num)) return false
  }
  return true
}

/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (val instanceof Array) {
    if (val.length == 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true
    return false
  }
  return false
}

/**
 * 判断是否含有非法字符
 */
export function notChars(rule, value, callback) {
  if (!(/;|<|>|'|\.\.|(\b(union|insert|select|delete|update|drop|alter|truncate|declare|xp_)\b)/.test(value))) {
    callback()
  } else {
    callback(new Error('包含非法字符'))
  }
}

/**
 * 密码复杂度校验
 * @return 0: 密码长度不够
 * @return 1: 数字字母特殊字符仅有一种
 * @return 2: 数字字母特殊字符仅有两种
 * @return 3: 数字字母特殊字符三种组合
 * */
function checkPass(s) {
  if (s.length < 8) {
    return 0
  }
  var ls = 0

  if (s.match(/([a-z])+/)) {
    ls++
  }

  if (s.match(/([0-9])+/)) {
    ls++
  }

  if (s.match(/([A-Z])+/)) {
    ls++
  }
  if (s.match(/[^a-zA-Z0-9]+/)) {
    ls++
  }
  return ls
}

/**
 * 密码
 */
export function password(rule, value, callback) {
  const res = checkPass(value)
  const resMsg = {
    0: '密码长度需为8位以上',
    1: '需为8位以上数字、字母、特殊字符任意两种',
    2: '需为8位以上数字、字母、特殊字符任意两种'
  }
  if (res >= 2) {
    callback()
  } else {
    callback(new Error(resMsg[res]))
  }
}

/**
 * 固定电话
 */
export function telephone(rule, value, callback) {
  const ruleArr: Array<string | RegExp> = [/0\d{2,3}-\d{5,9}|0\d{2,3}-\d{5,9}/, '请填写有效的电话号码']
  if ((ruleArr[0] as RegExp).test(value)) {
    callback()
  } else {
    callback(new Error(ruleArr[1] as string))
  }
}

/**
 * 移动电话
 */
export const mobile = (rule, value, callback) => {
  const res = isvalidatemobile(value)
  const isOk = !res[0]
  const msg = res[1] as string
  if (isOk) {
    callback()
  } else {
    callback(new Error(msg))
  }
}

/**
 * 身份证
 * */
export const idCard = (rule, value, callback) => {
  const res = cardid(value)
  const isOk = !res[0]
  const msg = res[1] as string
  if (isOk) {
    callback()
  } else {
    callback(new Error(msg))
  }
}

/**
 * 校验英文字符
 * */
export const validatMustBeEnglish = function(rule, value, callback) {
  validatAlphabets(value) ? callback() : callback(new Error('含有非英文字符'))
}

/**
 * 判断手机号码是否正确 可以为空
 */
export function isvalidatemobileCouldNull(phone) {
  const list: Array<string | boolean> = []
  let result = true
  let msg = ''
  var isPhone = /^0\d{2,3}-?\d{7,8}$/
  // 增加134 减少|1349[0-9]{7}，增加181,增加145，增加17[678]
  var isMob = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|14[57][0-9]{8}|17[3678][0-9]{8})$/
  if (!validatenull(phone)) {
    if (phone.toString().length == 11) {
      if (isPhone.test(phone)) {
        msg = '手机号码格式不正确'
      } else {
        result = false
      }
    } else {
      msg = '手机号码长度不为11位'
    }
  } else {
    result = false
  }
  list.push(result)
  list.push(msg)
  return list
}
/**
 * 移动电话
 */
export const mobileCN = (rule, value, callback) => {
  const res = isvalidatemobileCouldNull(value)
  const isOk = !res[0]
  const msg = res[1] as string
  if (isOk) {
    callback()
  } else {
    callback(new Error(msg))
  }
}

//  电话号码校验
export const isTel = (rule, value, callback) => {
  var telReg = /^([0-9-]+)$/
  if (value) {
    if (!telReg.test(value)) {
      callback(new Error('请输入正确的联系电话'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入联系电话'))
  }
}
/**
 * 金额校验,最小0.01
 */
// export function isvalidateMoney(rule, value, callback) {
//   var isMoney = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
//   // 非负浮点数
//   var regPos = /^\d+(\.\d+)?$/
//   // 负浮点数
//   var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/
//   if (!validatenull(value)) {
//     if (regPos.test(value) || regNeg.test(value)) {
//       if (isMoney.test(value)) {
//         callback()
//       } else {
//         callback(new Error('金额格式有误（不超过两位小数,不为负数,不为0）'))
//       }
//     } else {
//       callback(new Error('金额格式有误'))
//     }
//   } else {
//     callback(new Error('请输入金额'))
//   }
// }

/**
 * 金额校验,最小0.01
 * houyile
 */
export function isvalidateMoney(rule, value, callback) {
  // 非负浮点数
  var regPos = /^\d+(\.\d+)?$/
  // 不超过两位小数的正实数
  var regTwo = /^[0-9]+(.[0-9]{1,2})?$/
  // 浮点数
  var regFlo = /^(-?\d+)(\.\d+)?$/
  if (!validatenull(value)) { // 非空值
    if (regPos.test(value)) { // 非负浮点数
      if (regTwo.test(value)) { // 不超过两位小数的正实数
        // +value 转布尔值
        +value ? callback() : callback(new Error('金额不为0'))
      } else { // 超过两位小数
        callback(new Error('金额不超过两位小数'))
      }
    } else { // 负浮点数和其他
      // 负浮点数走浮点验证规则，通过则为负数，其他格式不正确（例：*966.00、966.1/、966.5-）
      regFlo.test(value) ? callback(new Error('金额不为负数')) : callback(new Error('金额格式不正确'))
    }
  } else { // 金额为空值
    callback(new Error('请输入金额'))
  }
}

/**
 * 可以输入下划线、短横线的数字校验
 */
export function isNumberValidate(rule, value, callback) {
  var reg = /^([0-9-_]+)$/
  if (!validatenull(value)) {
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的收款账号'))
    }
  } else {
    callback(new Error('请选择收款账号'))
  }
}

// 自然数（不包括0）
export function isNaturalNumber(rule, value, callback) {
  // 非负浮点数
  var regF = /^(0|[1-9]\d*)(\.\d+)?$/
  // 不超过两位小数的正实数
  var regO = /^[0-9]+(.[0-9]{1,2})?$/
  if (!value) {
    callback(new Error('请输入数量'))
  } else {
    if (regF.test(value)) {
      if (regO.test(value)) {
        +value ? callback() : callback(new Error('数量不为0'))
        // callback()
      } else {
        callback(new Error('数量不超过两位小数'))
      }
    } else {
      callback(new Error('请输入正数'))
    }
  }
}
