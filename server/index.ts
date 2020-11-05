const http = require('http')
const url = require('url')
const fs = require('fs')

/**
 * @file node server for test
 */

const version = process.env.SDK_VERSION
const html = `
  <!DOCTYPE html>
  <html lang="zh">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="renderer" content="webkit|ie-stand|ie-comp">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1.0,user-scalable=no">
    <title>网页机器人</title>
  </head>
  <body style="background: #eceef0, margin: 0">
    <script type="text/javascript" src="./IMLib-${version}.min.js?_t=${Date.now()}"></script>
      <script>
        new websdk({
          data: {
            pubkey: 'pihcy4OlTWAWhQ717pfYNsCjgzMlRwQz004f53383d70e51d83', // 吾来平台PubKey
            autoOpen: true // 是否自动打开
          },
          el: 'body'
        })
      </script>

      <script>
        window.onload = function () {
          document.addEventListener('touchstart',function (event) {
            if(event.touches.length>1){
              event.preventDefault();
            }
          });
          var lastTouchEnd=0;
          document.addEventListener('touchend',function (event) {
            var now=(new Date()).getTime();
            if(now-lastTouchEnd<=300){
              event.preventDefault();
            }
            lastTouchEnd=now;
          },false);
          document.addEventListener('gesturestart', function (event) {
            event.preventDefault();
          });

          const wsUrl = 'ws://127.0.0.1:8089/astRecordEndpoint/22.100.10.10:4567'

          let ws = null

          ws = new WebSocket(wsUrl)
          window.websocket = ws
        }
      </script>
  </body>
  </html>
`

http
  .createServer((req, res) => {
    const obj = url.parse(req.url)

    if (/\.(js|ico|css|png)$/.test(obj.pathname)) {
      res.writeHead(200, { 'Content-Type': 'text/plain' })

      try {
        const file = fs.readFileSync(__dirname + obj.pathname)
        res.end(file)
      } catch (e) {
        res.end(null)
      }
    }

    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(html)
  })
  .listen(8082)
