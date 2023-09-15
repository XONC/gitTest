/**
 * websocket 2020-3-10
 */
function WS(callback) {
    this.ws = null;
    this.wsurl = "ws://localhost:11200";
    this.lockReconnect = false;
    this.timeout = 60000;
    this.timeoutObj = null;
    this.initialization = function() {
        this.connection();
    };
    this.connection = function() {
        var _self = this;
        _self.ws = new WebSocket(this.wsurl);
        _self.ws.onopen = function() {
            _self.ws.send("registerMqttService");
        };
        _self.ws.onmessage = function(evt) {
            callback(evt);
        };
        _self.ws.onerror = function() {
            _self.reconnection();
        };
        _self.ws.onclose = function(evt) {
            //_self.reconnection();
        };
    };

    this.reconnection = function() {
        var _self = this;
        if (_self.lockReconnect)
            return;
        _self.lockReconnect = true;
        setTimeout(function() {
            _self.connection();
            _self.lockReconnect = false;
        }, 2000);
    };

    this.close = function() {
        this.ws.close();
    };

}