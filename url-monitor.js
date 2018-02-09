/*
Name    : url-monitor.js
Author  : Julien Blanc
Version : 1.3.3
Date    : 09/02/2018
NodeJS  : 5.10.1+ => 8.9.4
*/

//----------------------------------------- LOAD MODULES
var event = require('events').EventEmitter;
var http = require('http');
var https = require('https');
var HTTPStatus  = require('http-status');
var util = require('util');
var urlp = require('url');

//----------------------------------------- CLASS

//------ Constructor
function urlmon(options) {
    
    this.url = options.url;
    this.interval = options.interval || 5000;
    this.timeout = options.timeout || 3000;
    this.handle = null;
        
}

//------ Inherit from 'events' module
util.inherits(urlmon, event);

//------ Starts monitor
urlmon.prototype.start = function() {
    
    var self = this;
        
    var timer = function() {
        
        testUrl.call(self, self.url);
        self.handle = setTimeout(timer, self.interval);
        
    }
    
    timer();
        
}

//------ Stops monitor
urlmon.prototype.stop = function() {
    clearTimeout(this.handle);
    this.handle = null;
}

//------ Test url
function testUrl(url) {
    
    var self = this;
    var obj = urlp.parse(url);
    var req = null;
    
    if(obj.protocol == 'https:') {
        
        if(obj.port == null) { obj.port = '443'; }

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Ignore self-signed certificate error
        
        req = https.request({
           host: obj.hostname,
           port: obj.port,
           method: 'GET',
           path: obj.path,
           agent: false 
        }, (res) => {
            if(res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
                self.emit('available', message.call(this, url, res.statusCode));
            } else {
                self.emit('unavailable', message.call(this, url, res.statusCode));
            }
        });
        
        req.setTimeout(self.timeout, function() {
            req.abort();
        });
        
        req.on('error', function(err) {
            self.emit('error', {code:null, url:url, message:"Host unavailable"});
        })
        
        req.end();
        
    } else if (obj.protocol == 'http:') {
        
        if(obj.port == null) { obj.port = '80'; }
        
        req = http.request({
           host: obj.hostname,
           port: obj.port,
           method: 'GET',
           path: obj.path,
           agent: false  
        }, (res) => {
            if(res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
                self.emit('available', message.call(this, url, res.statusCode));
            } else {
                self.emit('unavailable', message.call(this, url, res.statusCode));
            }
        });
        
       req.setTimeout(self.timeout, function() {
            req.abort();
        });
        
        req.on('error', function(err) {
            self.emit('error', {code:null, url:url, message:"Host unavailable"});
        })
        
        req.end();
        
    } else {
        self.emit('error', {code:null, url:url, message:"Unknown protocol (http & https only)"});
    }
    
}

//------ Messages
function message(url, code) {
        
        var res = null;

        if(code != null) {
            res = {
                code: code, 
                url: url,
                message: HTTPStatus[code]
            }
        } else {
            res = {
                code: null, 
                url: url, 
                message: "Unknown error"
            }
        }
        
        return res;
        
    }

//------ Export module
module.exports = urlmon;
