/*
V2.0.20221216  bussName接口方法调整
*/
var rsConfig = {
  authCode: function () {
      return localStorage.getItem('rs_authCode')
  },
  cloudUrl: function () {
      return localStorage.getItem('rs_rsigncloud')
  },
  commonUrl: "http://127.0.0.1:11200",
  commonUrl2: "http://127.0.0.1:61200",
  errorDict: {
      "0000": "成功",
      "9001": "未检测到UKEY证书",
      "9002": "检测到多个UKEY证书",
      "9003": "未接收到唯一标识",
      "9004": "唯一标识与当前UKEY证书不符",
      "9005": "未接收到证书base64编码",
      "9006": "接收到的证书base64编码有误，无法解析",
      "9007": "获取、解析信息标识项错误",
      "9008": "打开当前UKEY证书失败",
      "9009": "当前UKEY证书不需要获取唯一标识",
      "9010": "未接收到证书口令",
      "9011": "密码错误",
      "9012": "证书类型参数错误",
      "9013": "当前UKEY证书需先验证证书口令",
      "9014": "当前UKEY证书中未包含传入参数类型的证书",
      "9015": "未接收到信息标识",
      "9016": "接收到的信息标识错误，未在定义表中",
      "9017": "接收到的证书中无该信息标识项",
      "9018": "打开UKEY证书失败",
      "9019": "当前UKEY证书中不包含用户标识",
      "9020": "未接收到授权码",
      "9021": "接收到的授权码错误",
      "9022": "通讯异常",
      "9023": "未接收到待加密明文",
      "9024": "接收到的证书base64编码有误，无法用于加密",
      "9025": "接收到的待加密明文超出加密可支持长度",
      "9026": "未接收到待解密的密文",
      "9027": "待解密的密文格式错误，无法解密",
      "9028": "未验证UKEY证书口令",
      "9029": "待解密的密文非当前UKEY证书加密，无法解密",
      "9030": "加密失败",
      "9031": "解密失败",
      "9032": "文件不存在",
      "9033": "输出文件已存在",
      "9034": "参数不能为空",
      "9035": "签名证书导入失败",
      "9036": "加密证书导入失败",
      "9037": "未发现UKEY插入",
      "9038": "找不到数据库的表",
      "9039": "本项目不支持RSA证书",
      "9040": "本项目不支持此KEY类型",
      "9041": "兰州白名单code返回2",
      "9042": "兰州白名单code返回3",
      "9043": "兰州白名单code返回4",
      "9999": "未知错误"
  },
  getDictResult: function (code, data, message, isError) {
      return {
          code: code,
          data: data,
          msg: message || rsConfig.errorDict[code],
          isError: isError || false
      }
  },
  needClient: false,
  projectKey: '1479363604116406272'
}
if (window.sessionStorage.getItem('clientId')) {
  rsConfig.clientId = window.sessionStorage.getItem('clientId')
} else {
  var wsUuid = 'ws_' + RS_GetUuid()
  rsConfig.clientId = wsUuid
  window.sessionStorage.setItem('clientId', wsUuid)
}
Object.freeze(rsConfig)

var rsData = {
  wsUrl: function () {
      return this.WSUrl + "/webSocket/" + rsConfig.projectKey + "/" + rsConfig.clientId
  },
  addSocketContent: function (transid, value) {
      var dataTemp = this.socketContent;
      dataTemp[transid] = value;
      window.sessionStorage.setItem('socketContent', JSON.stringify(dataTemp))
      ;
  }
}

Object.defineProperty(rsData, 'socketContent', {
  get: function () {
      return JSON.parse(window.sessionStorage.getItem('socketContent') || '{}')
  }
})

if (!window.localStorage.getItem('rs_authType')) {
  localStorage.setItem('rs_authType', '0');
}

/**
* 生成uuid
*/
function RS_GetUuid() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}


/**
* 封装ajax 函数
* @param url  请求地址
* @param type 请求方法 get||post；
* @param dataType 接收数据类型
* @param async 是否异步 true 异步 || false  同步；默认异步
* @param data 发送数据
* @param Callback  回调函数(数据,对象)
*/
function ajax(url, data, async, callback) {
  var type = 'post';
  var dataType = 'json';
  var success = function (res) {
      callback(res);
  };
  var error = function (res) {
      callback(res);
  };
  $.ajax({
      'url': url,
      'data': data,
      'type': type,
      'dataType': dataType,
      'async': async,
      'success': success,
      'error': error,
  });
}

function cloudAjax(fnName, data, async, callback) {
  var result
  var body = Object.assign({
      SYSCODE: "",
      authCode: localStorage.getItem('rs_authCode') || '',
      clientId: rsConfig.clientId,
      socketId: ""
  }, data)
  $.ajax({
      'url': rsConfig.cloudUrl(),
      'data': JSON.stringify({
          body: JSON.stringify(body),
          head: {
              bizCode: 'BIZ.' + fnName,
              sysId: "b253fca87f6711e995aa005056a72395",
              unit: "RSYZ"
          }
      }),
      'type': 'post',
      'dataType': 'json',
      'contentType': 'application/json',
      'async': async,
      'success': function (res) {
          result = res
          callback && callback(res);
      },
      'error': function (res) {
          res.isError = true
          result = res
          callback && callback(res);
      },
  });
  return result
}

//获取证书列表接口
function RS_GetUserList() {
  var url = rsConfig.commonUrl + "/RS_GetUserList";
  var data = "";
  var result;
  ajax(url, data, false, function (res) {
      if (res.data && res.data.userlist) {
          var test = res.data.userlist;
          var str = test.split("||");
          var ContainerId = str[1];
          var res1 = RS_GetCertBase64String(1, ContainerId);
          if (res1.data && res1.data.certBase64) {
              var res2 = RS_GetCertInfo(res1.data.certBase64, '56');
              if (res2.data && res2.data.info) {
                  res.data.userlist = res2.data.info + '||' + str[1];
                  result = res;
              } else {
                  result = res2;
              }
          } else {
              result = res1;
          }
      } else {
          result = res;
      }
  });
  return result;
}

//证书口令验证接口
function RS_CertLogin(containerId, password) {
  var url = rsConfig.commonUrl + "/RS_CertLogin";
  var data = {
      containerId: containerId,
      password: password,
  }
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//获取数字证书接口
function RS_GetCertBase64String(certType, containerId) {
  var url = rsConfig.commonUrl + "/RS_GetCertBase64String";
  var data = {
      certType: certType,
      containerId: containerId
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

// 服务端获取证书信息接口
function RS_GetCertInfoWithServer(certBase64, type) {
  var res = cloudAjax('GETCERTINFO', {certBase64: certBase64, type: type}, false)
  if (res.isError) return res
  return res.head.code === '0000' ?
      rsConfig.getDictResult(res.head.code, {info: JSON.parse(res.body)[type]}, '成功') :
      rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//.获取证书信息接口
function RS_GetCertInfo(certBase64, type) {
  var url = rsConfig.commonUrl + "/RS_GetCertInfo";
  var data = {
      certBase64: certBase64,
      type: type
  };
  var result;
  ajax(url, data, false, function (res) {
      if (!res.code) {
          result = RS_GetCertInfoWithServer(certBase64, type);
      } else if (!res.data && type == 56) {
          var data = {
              certBase64: certBase64,
              type: 49
          };
          ajax(url, data, false, function (res2) {
              if (res2.data && res2.data.info) {
                  res2.data.info = subjectName(res2.data.info)
                  result = res2;
              } else {
                  result = res2;
              }

          })
      } else {
          result = res
      }
  });
  return result;
}

//.获取多个证书信息接口
function RS_GetCertInfoGroup(certBase64, types) {
  var group = {}
  var groupType = types.split(',')
  var res = RS_GetVersion()
  if (res.code === '0000') {
      for (var i = 0; i < groupType.length; i++) {
          var type = groupType[i]
          var resInfo = RS_GetCertInfo(certBase64, type)
          if (resInfo.code === '0000') {
              group[type] = resInfo.data.info
          } else {
              return resInfo
          }
      }
      return {
          code: '0000',
          data: group,
          msg: 'successful'
      }
  } else {
      var res = cloudAjax('GETCERTINFO', {certBase64: certBase64, type: types}, false)
      if (res.isError) return res
      return res.head.code === '0000' ?
          rsConfig.getDictResult(res.head.code, JSON.parse(res.body), '成功') :
          rsConfig.getDictResult(res.head.code, '', res.head.message)
  }
}

//获取证书信息 49项证书名过滤
function subjectName(text) {
  var content = text
  var rule = [{tag: /@/, pos: 2}, {tag: /-/, pos: 1}, {tag: /_/, pos: 1}]
  var pattern = new RegExp("[(（](业务专用)[^（(]+[)）]$");
  rule.forEach(function (value) {
      if (value.tag.test(content)) {
          var position
          var str = content.split(value.tag)
          if (content.indexOf("041") == 0 && value.tag == '/@/') {
              position = value.pos
          } else {
              position = value.pos - 1
          }
          content = str[position]
      }
  })
  return content.replace(pattern, '');
}

//.获取设备信息接口
function RS_KeyGetDeviceInfo(containerId, type) {
  var url = rsConfig.commonUrl + "/RS_KeyGetDeviceInfo";
  var data = {
      containerId: containerId,
      type: type
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//获取证书用户标识接口
function RS_KeyGetKeySn(containerId) {
  var url = rsConfig.commonUrl + "/RS_KeyGetKeySn";
  var data = {
      containerId: containerId
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//非对称加密接口
function RS_KeyEncryptData(rsKey, certBase64) {
  var url = rsConfig.commonUrl + "/RS_KeyEncryptData";
  var data = {
      rsKey: rsKey,
      certBase64: certBase64
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//非对称解密接口
function RS_KeyDecryptData(encRsKey, containerId) {
  var url = rsConfig.commonUrl + "/RS_KeyDecryptData";
  var data = {
      encRsKey: encRsKey,
      containerId: containerId
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//获取密码重试剩余次数接口
function RS_GetPinRetryCount(containerId) {
  var url = rsConfig.commonUrl + "/RS_GetPinRetryCount";
  var data = {
      containerId: containerId,
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//参数配置接口
function RS_ConfigParameters(cmd, val) {
  var url = rsConfig.commonUrl + "/RS_ConfigParameters";
  var data = {
      cmd: cmd,
      val: val
  };
  var result;
  if (cmd == 'bussName') {
      return RS_ConfigParamsByBussSys(cmd, val)
  } else if (cmd !== 'rsigncloud') {
      ajax(url, data, true, function (res) {
          result = res;
      });
  }
  localStorage.setItem('rs_' + cmd, val);
  return {
      code: '0000',
      msg: '成功'
  };
}

//获取配置参数接口
function RS_GetParameters(cmd) {
  var res = {
      code: '0000',
      data: {},
      msg: 'successful'
  };
  res.data[cmd] = localStorage.getItem('rs_' + cmd) || '';
  return res;
}

//生成二维码图片接口
function RS_GreateQRCode(qrcode, path) {
  var url = rsConfig.commonUrl + "/RS_GreateQRCode";
  var data = {
      qrcode: qrcode,
      path: path,
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//获取流水号接口
function RS_GetTransid(joinCode) {
  var now = +new Date();
  var random = (Math.random() * 1000000).toFixed(0)
  var res = {
      code: '0000',
      data: {transid: joinCode + now + random},
      msg: '成功'
  };
  return res;
}

//对称加密接口
function RS_EncryptFile(souceFilePath, encFilePath) {
  var url = rsConfig.commonUrl + "/RS_EncryptFile";
  var data = {
      souceFilePath: souceFilePath,
      encFilePath: encFilePath,
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//对称解密接口
function RS_DevryptFile(symKey, encFilePath, dncDirectoryPath) {
  var url = rsConfig.commonUrl + "/RS_DecryptFile";
  var data = {
      symKey: symKey,
      encFilePath: encFilePath,
      dncDirectoryPath: dncDirectoryPath,
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//对称加密数据接口
function RS_EncryptData(dataStr) {
  var url = rsConfig.commonUrl + "/RS_EncryptData";
  var data = {
      dataStr: dataStr
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//对称解密数据接口
function RS_DevryptData(symKey, encDataStr) {
  var url = rsConfig.commonUrl + "/RS_DevryptData";
  var data = {
      symKey: symKey,
      encDataStr: encDataStr
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//修改证书口令接口
function RS_ChangePassWd(containerId, oldCode, newCode) {
  var url = rsConfig.commonUrl + "/RS_ChangePassWd";
  var data = {
      containerId: containerId,
      oldCode: oldCode,
      newCode: newCode,
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//验证证书有效性接口
function RS_VerifyIdentity(certBase64, authNo) {
  var url = rsConfig.commonUrl + "/RS_VerifyIdentity";
  var data = {
      certBase64: certBase64,
      authNo: authNo,
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//P1签名接口（域签）
function RS_KeyDigitalSignByP1(asn1Msg, containerId) {
  var url = rsConfig.commonUrl + "/RS_KeyDigitalSignByP1";
  var data = {
      asn1Msg: asn1Msg,
      containerId: containerId,
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//P1验签接口（域签）
function RS_VerifyDigitalSignByP1(certBase64, asn1Msg, signdMsg) {
  var url = rsConfig.commonUrl + "/RS_VerifyDigitalSignByP1";
  var data = {
      certBase64: certBase64,
      asn1Msg: asn1Msg,
      signdMsg: signdMsg,
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//P7签名
function RS_KeySignByP7(msg, flag, containerId) {
  var url = rsConfig.commonUrl + "/RS_KeySignByP7";
  var data = {
      msg: msg,
      flag: flag,
      containerId: containerId
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

// 服务端P7验签
function RS_VerifySignByP7WithServer(msg, signdMsg, flag) {
  var res = cloudAjax('DETACHEDVERIFY', {msg: msg, signMsg: signdMsg, flag: flag,}, false)
  if (res.isError) return res
  if (res.head.code === '0000') {
      if (JSON.parse(res.body).verify) {
          return rsConfig.getDictResult(res.head.code, '', '成功')
      } else {
          return rsConfig.getDictResult('9999', '', '未知参数')
      }
  } else {
      return rsConfig.getDictResult(res.head.code, '', res.head.message)
  }
}

//P7验签
function RS_VerifySignByP7(msg, signdMsg, flag) {
  var url = rsConfig.commonUrl + "/RS_VerifySignByP7";
  var data = {
      msg: msg,
      signdMsg: signdMsg,
      flag: flag
  };
  var result;
  ajax(url, data, false, function (res) {
      if (!res.code || res.code !== '0000') {
          result = RS_VerifySignByP7WithServer(msg, signdMsg, flag)
      } else {
          result = res;
      }
  });
  return result;
}

//P1签名接口
function RS_KeySignByP1(containerId, asn1Msg) {
  var url = rsConfig.commonUrl + "/RS_KeySignByP1";
  var data = {
      containerId: containerId,
      asn1Msg: asn1Msg,
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//P1验签接口
function RS_VerifySignByP1(certBase64, msg, signdMsg) {
  var url = rsConfig.commonUrl + "/RS_VerifySignByP1";
  var data = {
      certBase64: certBase64,
      msg: msg,
      signdMsg: signdMsg,
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//数字信封加密文件接口
function RS_KeyEncryptFileByDigitalEnvelope(sourceFilePath, encFilePath, certBase64) {
  var url = rsConfig.commonUrl + "/RS_KeyEncryptFileByDigitalEnvelope";
  var data = {
      sourceFilePath: sourceFilePath,
      encFilePath: encFilePath,
      certBase64: certBase64,
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//数字信封解密文件接口
function RS_KeyDecryptFileByDigitalEnvelope(encFilePath, dncDirectory, containerId) {
  var url = rsConfig.commonUrl + "/RS_KeyDecryptFileByDigitalEnvelope";
  var data = {
      encFilePath: encFilePath,
      dncDirectory: dncDirectory,
      containerId: containerId
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//参数配置接口
function RS_ConfigParamsByBussSys(cmd, val) {
  if (cmd !== 'bussName') {
      return rsConfig.getDictResult('9016', '');
  }
  var res = cloudAjax('GETAUTHCODEBYBUSSNAME', {bussName: val}, false)
  if (res.isError) return res
  if (res.head.code === '0000') {
      RS_ConfigParameters('authCode', JSON.parse(res.body).authCode)
      if (JSON.parse(res.body).appserurl) {
          localStorage.setItem('rs_rsigncloud', JSON.parse(res.body).appserurl);
      }
      if (JSON.parse(res.body).clientserurl) {
          var url = rsConfig.commonUrl + "/RS_ConfigParameters";
          data = {
              cmd: 'rsigncloud',
              val: JSON.parse(res.body).clientserurl
          }
          ajax(url, data, true, function (res) {
              result = res;
          });
      }
  }
  return rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//登录授权接口
function RS_CloudLoginAuth(transid) {
  var res = cloudAjax('CREATEAUTHIDENT', {action: 1, transid: transid,}, false)
  if (res.isError) return res
  return res.head.code === '0000' ?
      rsConfig.getDictResult(res.head.code, {action: '1', authIdent: res.body}, '成功') :
      rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//用户退出接口
function RS_CloudLogout(userId) {
  var res = cloudAjax('LOGOUTACCOUNT', {userId: userId, status: 3}, false)
  if (res.isError) return res
  return rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//注销授权接口
function RS_CloudLogoutAuth(token) {
  var res = cloudAjax('LOGOUTTOKEN', {token: token}, false)
  if (res.isError) return res
  return rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//签章/撤章授权
function RS_CloudSealAuth(transid) {
  if (!localStorage.getItem('rs_authType') || localStorage.getItem('rs_authType') === '0') {//盖章授权
      var action = '4'
  } else if (localStorage.getItem('rs_authType') === '1') { // 撤章授权
      var action = '5'
  }
  var res = cloudAjax('CREATEAUTHIDENT', {
      action: action,
      transid: transid,
      keySn: action === '4' ? '' : localStorage.getItem('rs_keySn')
  }, false)
  if (res.isError) return res
  return res.head.code === '0000' ?
      rsConfig.getDictResult(res.head.code, {action: action, authIdent: res.body}, '成功') :
      rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//获取印章列表数据接口
function RS_CloudGetSealList(token) {
  var res = cloudAjax('GETSEALLISTTOKEN', {token: token}, false)
  if (res.isError) return res
  return res.head.code === '0000' ?
      rsConfig.getDictResult(res.head.code, Array.isArray(JSON.parse(res.body)) ? JSON.parse(res.body) : [JSON.parse(res.body)], '成功') :
      rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//获取授权结果接口
function RS_CloudGetAuth(transid) {
  if (rsData.socketContent[transid] && rsData.socketContent[transid].data && rsData.socketContent[transid].data.action == 5) {
      sessionStorage.removeItem("FJRS_TOKEN");
  }
  return rsData.socketContent[transid] ? {
      code: rsData.socketContent[transid].code,
      msg: rsData.socketContent[transid].msg,
      data: {
          authResult: rsData.socketContent[transid].data.authResult,
          token: rsData.socketContent[transid].data.token,
          keySn: rsData.socketContent[transid].data.action === '5' && localStorage.getItem('rs_authType') === '1' ? rsData.socketContent[transid].data.keySn : "",
          mobile: rsData.socketContent[transid].data.mobile,
          userName: rsData.socketContent[transid].data.userName,
          userID: rsData.socketContent[transid].data.userID
      }
  } : {
      code: "0000",
      msg: "successful",
      data: {
          authResult: "0",
          token: "",
          keySn: "",
          mobile: "",
          userName: "",
          userID: ""
      }
  }
}

//判断字节长度
function getByteLength(str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
          len += 2;
      } else {
          len++;
      }
  }
  return len;
}

//P7签名接口
function RS_CloudSignByP7(msg, keySn, transid, token) {
  if (getByteLength(msg) > 3000) {
      return rsConfig.getDictResult('9025', '')
  }
  var res = cloudAjax('SIGNTOKEN', {transid: transid, dealData: msg, keySn: keySn, token: token}, false)
  if (res.isError) return res
  return res.head.code === '0000' ?
      rsConfig.getDictResult(res.head.code, '', '成功') :
      rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//获取签名结果接口
function RS_CloudGetSignResult(transid) {
  return rsData.socketContent[transid] ? {
      code: rsData.socketContent[transid].code,
      msg: rsData.socketContent[transid].msg,
      data: {
          signResult: rsData.socketContent[transid].data.authResult,
          signdMsg: rsData.socketContent[transid].data.signdMsg,
          certBase64: rsData.socketContent[transid].data.signdCert,
      }
  } : {
      code: "0000",
      msg: "successful",
      data: {
          signResult: "0",
          signdMsg: "",
          certBase64: ""
      }
  }
}

//加密授权接口
function RS_CloudEncryptAuth(transid) {
  var res = cloudAjax('CREATEAUTHIDENT', {action: 2, transid: transid,}, false)
  if (res.isError) return res
  return res.head.code === '0000' ?
      rsConfig.getDictResult(res.head.code, {action: '2', authIdent: res.body}, '成功') :
      rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//非对称加密数据接口
function RS_CloudEncryptData(symKey, transid, token) {
  if (!symKey) {
      return rsConfig.getDictResult('9023', '')
  }
  var res = cloudAjax('GETCERTTOKEN', {action: 2, token: token, transid: transid,}, false)
  if (res.isError) return res
  if (res.head.code === '0000') {
      var data = JSON.parse(res.body)
      data.encReachKey = '04' + sm2.doEncrypt(symKey, data.pubkey).toUpperCase()
      return rsConfig.getDictResult(res.head.code, data, '成功')
  } else {
      return rsConfig.getDictResult(res.head.code, '', res.head.message)
  }
}

//非对称加密文件接口
function RS_CloudEncryptFile(sourceFilePath, encFilePath, transid, token) {
  var url = rsConfig.commonUrl + "/RS_CloudEncryptFile";
  var data = {
      sourceFilePath: sourceFilePath,
      encFilePath: encFilePath,
      transid: transid,
      token: token
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//解密授权接口
function RS_CloudDevryptAuth(transid) {
  var res = cloudAjax('CREATEAUTHIDENT', {action: 3, transid: transid,}, false)
  if (res.isError) return res
  return res.head.code === '0000' ?
      rsConfig.getDictResult(res.head.code, {action: '3', authIdent: res.body}, '成功') :
      rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//非对称加密数据接口（base64公钥证书）
function RS_EncryptDataBase64(symKey, certBase64) {
  if (!symKey) {
      return rsConfig.getDictResult('9023', '')
  }
  var res = cloudAjax('GETPUBKEY', {encCertBase64: certBase64,}, false)
  if (res.isError) return res
  if (res.head.code === '0000') {
      var encReachKey = '04' + sm2.doEncrypt(symKey, res.body).toUpperCase();
      return rsConfig.getDictResult(res.head.code, {encReachKey: encReachKey}, '成功')
  } else {
      return rsConfig.getDictResult(res.head.code, '', res.head.message)
  }
}

//非对称加密文件接口（base64公钥证书）
function RS_EncryptFileBase64(sourceFilePath, encFilePath, certBase64) {
  var url = rsConfig.commonUrl + "/RS_EncryptFileBase64";
  var data = {
      sourceFilePath: sourceFilePath,
      encFilePath: encFilePath,
      certBase64: certBase64
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//非对称解密数据接口
function RS_CloudDevryptData(encSymKey, url, transid, token) {
  if (!encSymKey) {
      return rsConfig.getDictResult('9026', '')
  }
  var res = cloudAjax('DEVRYPTTOKEN', {
      action: 3,
      transid: transid,
      token: token,
      bussUrl: url,
      dealData: encSymKey,
      certOid: ''
  }, false)
  if (res.isError) return res
  return res.head.code === '0000' ?
      rsConfig.getDictResult(res.head.code, {symKey: res.body}, '成功') :
      rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//非对称解密文件接口
function RS_CloudDevryptFile(encFilePath, dncFilePath, url, transid, token) {
  var devryptFileUrl = rsConfig.commonUrl + "/RS_CloudDevryptFile";
  var data = {
      encFilePath: encFilePath,
      dncFilePath: dncFilePath,
      url: url,
      transid: transid,
      token: token
  };
  var result;
  ajax(devryptFileUrl, data, false, function (res) {
      result = res;
  });
  return result;
}

//接收对称解密结果接口
function RS_CloudReceiveDevryptResult(transid, token, devResult) {
  var res = cloudAjax('RECEIVERESULTTOKEN', {action: 3, transid: transid, token: token, result: devResult}, false)
  if (res.isError) return res
  return rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//获取企业证书信息接口
function RS_CloudGetCompanyCert(transid, token) {
  var res = cloudAjax('GETCOMPANYCERTTOKEN', {token: token, transid: transid,}, false)
  if (res.isError) return res
  return res.head.code === '0000' ?
      rsConfig.getDictResult(res.head.code, JSON.parse(res.body), '成功') :
      rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//获取证书授权接口
function RS_CloudGetCertAuth(transid) {
  var res = cloudAjax('CREATEAUTHIDENT', {action: 6, transid: transid,}, false)
  if (res.isError) return res
  return res.head.code === '0000' ?
      rsConfig.getDictResult(res.head.code, {action: '6', authIdent: res.body}, '成功') :
      rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//获取证书公钥信息接口
function RS_CloudGetCertBase64(transid, token) {
  var res = cloudAjax('GETSIGNCERTTOKEN', {transid: transid, token: token}, false)
  if (res.isError) return res
  return res.head.code === '0000' ?
      rsConfig.getDictResult(res.head.code, {certBase64: res.body}, '成功') :
      rsConfig.getDictResult(res.head.code, '', res.head.message)
}

//获取本机mac地址及其他信息据接口
function RS_HardwareInfo() {
  var url = rsConfig.commonUrl2 + "/RS_HardwareInfo";
  var data = "";
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//获取版本号
function RS_GetVersion() {
  var url = rsConfig.commonUrl2 + "/RS_GetVersion";
  var data = "";
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//获取介质标识
function RS_GetKeyIdent() {
  var url = rsConfig.commonUrl2 + "/RS_GetKeyIdent";
  var data = "";
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//获取互认助手检测结果
function RS_GetCheckResult(keySn) {
  var url = rsConfig.commonUrl2 + "/RS_GetCheckResult";
  var data = {
      keySn: keySn
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//获取H5签章服务器地址接口
function RS_GetH5SealUrl(keySn, url) {
  var rsurl = rsConfig.commonUrl + "/RS_GetH5SealUrl";
  var data = {
      keySn: keySn,
      url: url
  }
  var result;
  ajax(rsurl, data, false, function (res) {
      result = res;
  });
  return result;
}

//获取互认助手版本号
function RS_GetHRZSVersion() {
  var url = rsConfig.commonUrl2 + "/RS_GetHRZSVersion";
  var data = "";
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//获取介质证章类型
function RS_GetCertSealInfo(containerId) {
  var url = rsConfig.commonUrl2 + "/RS_GetCertSealInfo";
  var data = {
      containerId: containerId
  };
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}


//数字信封加密数据接口
function RS_KeyEncryptDataByDigitalEnvelope(dataStr, certBase64) {
  var url = rsConfig.commonUrl + "/RS_KeyEncryptDataByDigitalEnvelope";
  var data = {
      dataStr: dataStr,
      certBase64: certBase64
  }
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//数字信封解密数据接口
function RS_KeyDecryptDataByDigitalEnvelope(encDataStr, containerId) {
  var url = rsConfig.commonUrl + "/RS_KeyDecryptDataByDigitalEnvelope";
  var data = {
      encDataStr: encDataStr,
      containerId: containerId
  }
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

// 检测印章状态
function RS_CheckSeal(areaCode) {
  var data = {
      "PluginRequestID": new Date().getTime().toString(),
      "PluginRequest": "Experts_CheckSeal",
      "areaCode": areaCode
  };
  data = JSON.stringify(data);
  var result;
  ajax("http://127.0.0.1:31220", data, false, function (res) {
      var resData = {};
      resData.data = {};
      resData.code = res.ServerResponseCode;
      if (res.PluginResponseValue) {
          resData.data = JSON.parse(res.PluginResponseValue)
      }
      resData.msg = res.PluginResponse;
      result = resData;
  });
  return result;
}

// 兰州白名单认证接口
function RS_CheckCertInWhiteList() {
  var url = rsConfig.commonUrl + "/RS_CheckCertInWhiteList";
  var data = "";
  var result;
  ajax(url, data, false, function (res) {
      result = res;
  });
  return result;
}

//兼容ie
if (typeof Object.assign != 'function') {
  Object.assign = function (target) {
      'use strict';
      if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
      }

      target = Object(target);
      for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source != null) {
              for (var key in source) {
                  if (Object.prototype.hasOwnProperty.call(source, key)) {
                      target[key] = source[key];
                  }
              }
          }
      }
      return target;
  };
}
