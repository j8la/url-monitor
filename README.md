# url-monitor
Simple URL monitoring for node.js


# Installation
```
npm install url-monitor
```


# How to
```
var urlmon = require('url-monitor');

var website = new urlmon({
	url:'https://www.google.fr/?gws_rd=ssl', 
	interval: 5000,
	timeout: 3000
});

website.on('error', (data) => {
	website.stop();
	console.log(data);
})

website.on('available', (data) => {
	console.log(data);
})

website.on('unavailable', (data) => {
	console.log(data);
	website.stop();
})

website.start();
```


## Options
```
{
	url:'https://www.google.fr/?gws_rd=ssl', // Required
	interval: 5000,                          // Time interval in ms, default to 5000
	timeout: 3000                            // Timeout in ms, default to 3000
}
```


## Events
- `error` - Url is unreachable, host down, port closed...
- `available` - Url is up.
- `unavailable` - Host up but url is not working.


## Responses on events
```
{ code: 200, message: 'OK' }
{ code: 404, message: 'Not found' }
{ code: null, message: 'Host unavailable' }
...
```


## Licence
The MIT License (MIT) 
Copyright (c) 2016 Julien Blanc

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
