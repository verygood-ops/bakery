/*jshint node:true, laxcomma:true */

var util = require('util')
    , dgram = require('dgram')
    , logger = require('../lib/logger');

var net = require('net')
    , generic_pool = require('generic-pool');

function UDPRepeater(config, logger) {
    var self = this;
    this.debug = config.debug;
    this.logger = logger
    this.config = config;
    this.sock = (config.repeaterProtocol == 'udp6') ?
        dgram.createSocket('udp6') :
        dgram.createSocket('udp4');
    // Attach DNS error handler
    this.sock.on('error', function (err) {
        if (self.debug) {
            self.logger.log('UDP Repeater error: ' + err);
        }
    });
}

UDPRepeater.prototype.process = function (packet, rinfo) {
    var self = this;
    var hosts = self.config.hosts;
    for (var i = 0; i < hosts.length; i++) {
        self.sock.send(packet, 0, packet.length, hosts[i].port, hosts[i].host, function (err, bytes) {
            if (err && self.debug) {
                self.logger.log(err);
            }
        });
    }
};

function TCPRepeater(config, logger) {
    var self = this;
    this.debug = config.debug;
    this.logger = logger
    this.connectionPool = generic_pool.Pool({
        name: 'connectionPool',
        max: config.maxConnections,
        create: function(callback) {
            var conn = net.createConnection(config.port, config.host);
            conn.addListener('error', function (connectionException) {
                self.logger.log('TCP Repeater error: ' + connectionException);
                self.connectionPool.destroy(this)
                callback(connectionException, null);
            });
            conn.on('connect', function () {
                if (self.debug) {
                    self.logger.log("connected to " + config.host + ":" + config.port);
                }
                callback(null, this);
            });
        },
        destroy: function(conn) {
            if (self.debug) {
                self.logger.log("connection is destroyed");
            }
            conn.destroy();
        }
    });
}

TCPRepeater.prototype.process = function (packet, rinfo) {
    var self = this;
    self.connectionPool.acquire(function(err, conn) {
        if (err) {
            self.logger.log("connection error. data is lost: "+packet);
        }
        else {
            conn.write(packet + "\n");
        }
        self.connectionPool.release(conn);
    });
}

exports.init = function (startupTime, config, events, logger) {
    var instance = {};
    if (config.repeater.udp && config.repeater.udp.enabled) {
        instance = new UDPRepeater(config.repeater.udp, logger);
    }
    else if (config.repeater.tcp && config.repeater.tcp.enabled){
        instance = new TCPRepeater(config.repeater.tcp, logger);
    }
    events.on('packet', function (packet, rinfo) {
        instance.process(packet, rinfo);
    });

    return true;
};