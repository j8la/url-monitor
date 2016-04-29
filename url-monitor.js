/*
Name    : url-monitor.js
Author  : Julien Blanc
Version : 1.2.0
Date    : 29/04/2016
NodeJS  : 5.10.1+ 
*/

//----------------------------------------- LOAD MODULES
var event = require('events').EventEmitter;
var http = require('http');
var https = require('https');
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
        
        self.testUrl(self.url);
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
urlmon.prototype.testUrl = function(url) {
    
    var self = this;
    var obj = urlp.parse(url);
    var req = null;
    
    if(obj.protocol == 'https:') {
        
        if(obj.port == null) { obj.port = '443'; }
        
        req = https.request({
           host: obj.hostname,
           port: obj.port,
           method: 'GET',
           path: obj.path,
           agent: false 
        }, (res) => {
            if(res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
                self.emit('available', self.message(url, res.statusCode));
            } else {
                self.emit('unavailable', self.message(url, res.statusCode));
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
                self.emit('available', self.message(url, res.statusCode));
            } else {
                self.emit('unavailable', self.message(url, res.statusCode));
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
urlmon.prototype.message = function(url, code) {
        
        var res = null;

        switch(code) {
            case 200:
                res = {code:code, url:url, message:"OK"}
                break;
            case 301:
                res = {code:code, url:url, message:"OK"}
                break;
            case 302:
                res = {code:code, url:url, message:"OK"}
                break;
            case 403:
                res = {code:code, url:url, message:"Access denied"}
                break;
            case 404:
                res = {code:code, url:url, message:"Not found"}
                break;
            case 500:
                res = {code:code, url:url, message:"Server error"}
                break;
            case 503:
                res = {code:code, url:url, message:"Server error"}
                break;
            default:
                res = {code:code, url:url, message:"Unknown error"}
                break;
        }
        
        return res;
        
    }

//------ Export module
module.exports = urlmon;
