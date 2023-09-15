/**
 * websocket对象 创建对象
 */
function RS_WS(callback) {
    this.ws = null;
    this.wsurl = rsData.wsUrl(); // ws 地址
    this.lockReconnect = false;
    this.timeout = 30000; // 心跳间隔时间
    this.timeoutTimer = null; // 心跳定时
    this.serverTimeoutTimer = null // 判断是否重置心跳定时
    this.callback = callback
}

RS_WS.prototype.initialization = function() { //连接ws
    this.connection()
    this.heartReset();
};

RS_WS.prototype.connection = function() {
    var _self = this;
    console.log(this.wsurl)
    _self.ws = new WebSocket(this.wsurl);
    _self.ws.onopen = function() {
        _self.lockReconnect = false
        _self.sendMessage({
            code: 996,
            message: '第一次连'
        })
        _self.callback({ data: 'registerMqttService' })
        _self.heartReset();
    };
    _self.ws.onmessage = function(evt) {
        var res = JSON.parse(evt.data)
        if (res.code == 1) { // 下线
            _self.lockReconnect = true
            _self.ws.close()
        } else if (res.code == 998) { // 心跳检测未返回消息
            // console.log(res.message)
            // _self.ws.close()
        } else if (res.code == 997) { // 连接失败重连
            // console.log(res.message)
        } else if (res.code == 2) { // 消息通知
            // console.log('websocket', res)
            var content = JSON.parse(res.message)
            if (content.data) {
                content.data.userId ? content.data.userID = content.data.userId : ''
                content.data.certBase64 ? content.data.signdCert = content.data.certBase64 : ''
                content.data.authResult ? content.data.signResult = content.data.authResult : ''
                rsData.addSocketContent(JSON.parse(res.message).data.transid, content)
            }
            res.data = JSON.stringify(content)
            _self.callback(res);
        }
        _self.heartReset();
        return this;
    };
    _self.ws.onerror = function() { // 连接失败重连
        _self.reconnection();
    };
    _self.ws.onclose = function(evt) {
        clearTimeout(_self.timeoutTimer);
        clearTimeout(_self.serverTimeoutTimer)
        if (!_self.lockReconnect) {
            _self.reconnection();
            // console.log('ws连接关闭,重连中...')
        } else {
            // console.log('ws连接关闭')
        }
    };
};

RS_WS.prototype.reconnection = function() {
    var _self = this;
    if (_self.lockReconnect) { return; }
    _self.lockReconnect = true
    setTimeout(function() { //没连接上会一直重连，设置延迟避免请求过多
        _self.lockReconnect = false
        _self.connection();
    }, 2000);
};

RS_WS.prototype.close = function() {
    this.ws.close();
}

RS_WS.prototype.sendMessage = function(msg) {
    this.ws.send(JSON.stringify(msg));
};

RS_WS.prototype.heartReset = function() {
    var _self = this;
    clearTimeout(_self.serverTimeoutTimer)
    clearTimeout(_self.timeoutTimer);
    _self.heartStart();
};

RS_WS.prototype.heartStart = function() {
    var _self = this;
    //这里发送一个心跳，后端收到后，返回一个心跳消息，
    //onmessage拿到返回的心跳就说明连接正常
    _self.timeoutTimer = setTimeout(function() {
        var message = {
            code: 999,
            ticket: (Math.random() * 9999999999).toFixed(0)
        }
        _self.ws.send(JSON.stringify(message));

        _self.serverTimeoutTimer = setTimeout(function() { //如果超过一定时间还没重置，说明后端主动断开了
            var msg = {
                code: 998,
                data: '',
                message: '心跳未返回信息'
            }
            _self.callback(JSON.stringify(msg))
        }, _self.timeout)
    }, _self.timeout)
}

