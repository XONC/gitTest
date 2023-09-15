var globalConfig = {
  systemTemp: {
    projectName: '采购电子档案系统',
    // 默认是否显示多页签栏
    haveTags: false,
    // 默认主题
    theme: 'LIGHT',
    // 是否iframe模式（无顶部和侧边栏）
    isIframe: false,
    // 是否需要网关
    isGateWay: true,
    casLogin: false,
    // 金额分位， 3：千分位  4万分位
    amountDivided: 3,
    // 系统模式(做区域配置使用)
    pageMode: 'default',
    // 是否需要走本系统的登录
    isLogin: true,
    // 是否需要请求的前缀
    apiBaseUrl: '/api/admin/psp-admin', // 本地开发环境
    // 工作流请求的前缀
    wfBaseUrl: '/api/wf/wf',
    // 登录请求的前缀
    authBaseUrl: '/api/auth', // 本地开发环境
    // token 存储Key值字段
    tokenTypeKey: 'Authorization'
    // access_token
  },
  gatewaySys: {
    // 网关地址
    GATE_WAY_ORIGIN: 'http://119.3.244.32:7001/',
    // 网关退出地址
    GATE_WAY_NGINX: 'http://119.3.244.32:8001/'
  },
  servePath: {
    // 文件服务器地址
    uploaderUrl: '/psp-uploader',
    // 预览附件链接
    previewPath: '/gpx-preview'
  },
  subAppConfigs: [
    // {
    //   // 子模块动态表单
    //   name: 'modules-configure'
    // },
    {
      // 子模块动态表单
      name: 'modules-psp'
    },
    {
      // 电子档案
      name: 'electronic-contract'
    },
  ],
  buyrequirementConfig: {
    // 采购需求嵌套页面服务
    buyrequirementPagePath: '/modules-announcement',
    // 采购需求嵌套页面服务业务类型
    buyrequirementTypeCode: 'gpc_procurement',
    // 采购需求服务
    buyrequirementServePath: '/psp-procurement'
  },
  signtConfig: {
    // 瑞术CA
    CA_CODE: 'BSGCY',
    CA_TYPE: 'RUI_SHU_CA',
    // 瑞术签章发送请求后等待刷新时间
    CA_WAIT_TIME: 5000,
    // 1.0 ||  3.0(驱动更新)
    caNew: '3.0',
    // 是否不需要签章(false需要签章，true不需要签章)
    noNeedSign: false,
    caOperate: {
     // 0 介质签章  1 扫码签章  2 都包含
      caSm: '0',
      // 核对序列号
      caCheckKeySN: false,
      // 配置公采签服务端地址
      configParametersUrl: 'http://open.591sign.cn/uat/gcq/auth/rssigncloud/post.json',
      // 去客户端websocket地址
      wsUrl: 'ws://open.591sign.cn/uat/socket'
    },
    // ca类型(四川 kinsec，其他省份无需配置)
    caType: '',
    // 签章自动化,一个印章时默认不弹选框（黑龙江为true，其他省份为false）
    autoSignature: false,
    // cas登录(湖北为true，其他省份为false)
    casLogin: false
  }
}
