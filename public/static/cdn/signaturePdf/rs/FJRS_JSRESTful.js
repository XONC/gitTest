function FJRS_cloudAjax(fnName, data) {
  var body = Object.assign(
    {
      SYSCODE: '',
      authCode: localStorage.getItem('rs_authCode') || '',
      clientId: rsConfig.clientId,
      socketId: '',
    },
    data
  )
  return axios({
    url: rsConfig.cloudUrl(),
    data: JSON.stringify({
      body: JSON.stringify(body),
      head: {
        bizCode: 'BIZ.' + fnName,
        sysId: 'b253fca87f6711e995aa005056a72395',
        unit: 'RSYZ',
      },
    }),
    method: 'post',
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(function (res) {
      return res.data;
    })
    .catch(function (error) {
      // 这行不要删掉哦
      window.KGPdfViewerWebApp.PDFViewerApplication.KGAlertPrompt.open(fnName + '接口异常，请联系管理员。')
      return error
    });
}

//获取流水号接口
function FJRS_GetTransid(joinCode) {
  var now = +new Date();
  var random = (Math.random() * 1000000).toFixed(0);
  var res = {
    code: '0000',
    data: { transid: joinCode + now + random },
    msg: '成功',
  };
  return res;
}

//签章/撤章授权
function FJRS_CloudSealAuth(transid, authType, keySn) {
  var action = '4';
  if (!authType || authType === 0) {
    //盖章授权
    action = '4';
  } else if (authType === 1) {
    // 撤章授权
    action = '5';
  }
  // { action: action, transid: transid, keySn }
  return FJRS_cloudAjax('CREATEAUTHIDENT', { action: action, transid: transid, keySn: keySn })
    .then(function(res) {
      var result = null;
      if (res.head.code === '0000') {
        result = rsConfig.getDictResult(
          res.head.code,
          { action: action, authIdent: res.body },
          '成功'
        );
      } else {
        result = rsConfig.getDictResult(
          res.head.code,
          '',
          res.head.message,
          true
        );
      }
      return result;
    })
}

//获取授权结果接口
function FJRS_CloudGetAuth(transid, authType) {
  if(rsData.socketContent[transid] && rsData.socketContent[transid].data.action == 5){
    sessionStorage.removeItem("token_info");
  }
  return rsData.socketContent[transid] ? {
      code: rsData.socketContent[transid].code,
      msg: rsData.socketContent[transid].msg,
      data: {
        authResult: rsData.socketContent[transid].data.authResult,
        token: rsData.socketContent[transid].data.token,
        keySn: rsData.socketContent[transid].data.action === '5' && authType === 1 ? rsData.socketContent[transid].data.keySn : "",
        mobile: rsData.socketContent[transid].data.mobile,
        userName: rsData.socketContent[transid].data.userName,
        userID: rsData.socketContent[transid].data.userID
      }
    } : {
      code: '0000',
      msg: 'successful',
      data: {
        authResult: '0',
        token: '',
        keyS: '',
        mobile: '',
        userName: '',
        userID: ''
      },
    }
  
}

//获取印章列表数据接口
function FJRS_CloudGetSealList(token) {
  return FJRS_cloudAjax('GETSEALLISTTOKEN', { token: token })
    .then(function (res) {
      var result = null;
      if (res.head.code === '0000') {
        result = rsConfig.getDictResult(
          res.head.code,
          Array.isArray(JSON.parse(res.body)) ? JSON.parse(res.body) : [JSON.parse(res.body)],
          '成功'
        );
      } else {
        result = rsConfig.getDictResult(
          res.head.code,
          '',
          res.head.message,
          true
        );
      }
      return result;
    })
}

//判断字节长度
function getByteLength(string) {
  var str = string | ''
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
function FJRS_CloudSignByP7(msg, keySn, transid, token) {
  if (getByteLength(msg) > 3000) {
    return rsConfig.getDictResult('9025', '');
  }
  return FJRS_cloudAjax('SIGNTOKEN', {
    transid: transid,
    dealData: msg,
    keySn: keySn,
    token: token
  })
    .then(function (res) {
      var result = null;
      if (res.head.code === '0000') {
        result = rsConfig.getDictResult(res.head.code, '', '成功');
      } else {
        result = rsConfig.getDictResult(
          res.head.code,
          '',
          res.head.message,
          true
        );
      }
      return result;
    })
}

//获取签名结果接口
function FJRS_CloudGetSignResult(transid) {
  return new Promise(function (resolve) {
    resolve(rsData.socketContent[transid] ? {
      code: rsData.socketContent[transid].code,
      msg: rsData.socketContent[transid].msg,
      data: {
        signResult: rsData.socketContent[transid].data.authResult,
        signdMsg: rsData.socketContent[transid].data.signdMsg,
        certBase64: rsData.socketContent[transid].data.signdCert
      }
    } : {
        code: "0000",
        msg: "successful",
        data: {
          signResult: "0",
          signdMsg: "",
          certBase64: ""
        }
    })
  })
}

// 服务端P7验签
function FJRS_VerifySignByP7WithServer(msg, signdMsg, flag) {
  return FJRS_cloudAjax('DETACHEDVERIFY', {msg: msg, signMsg: signdMsg, flag: flag,}).then(function (res) {
    var result = null
    if (res.head.code === '0000') {
      result = rsConfig.getDictResult(res.head.code, JSON.parse(res.body), '成功')
    } else {
      result = rsConfig.getDictResult('9999', '', '未知参数', true)
    }
    return result
  })
}

//注销授权接口
function FJRS_CloudLogoutAuth(token) {
  return FJRS_cloudAjax('LOGOUTTOKEN', {token: token}).then(function (res) {
    var result = null
    if (res.head.code === '0000') {
      result = {
        result: true,
        msg: "注销成功"
      }
    } else {
      result = {
        result: false,
        msg: '注销失败'
      }
    }
    return result
  })
}


var FJRS_API = {
  RS_GetTransid: FJRS_GetTransid,
  RS_CloudSealAuth: FJRS_CloudSealAuth,
  RS_CloudGetAuth: FJRS_CloudGetAuth,
  RS_CloudGetSealList: FJRS_CloudGetSealList,
  RS_CloudSignByP7: FJRS_CloudSignByP7,
  RS_CloudGetSignResult: FJRS_CloudGetSignResult,
  RS_VerifySignByP7WithServer: FJRS_VerifySignByP7WithServer,
  RS_CloudLogoutAuth: FJRS_CloudLogoutAuth
};