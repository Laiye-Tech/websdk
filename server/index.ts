const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const port = require('../pm2.json').port

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
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
    <title>网页机器人</title>
  </head>
  <body style="background: #eceef0">
    <script type="text/javascript" src="./IMLib-${version}.min.js?_t=${Date.now()}"></script>
      <script>
        new websdk({
          data: {
            pubkey: 'FuLcN3rXprCb9vbDyHrUrTGtq7zi5faA0089175d1938a21c81', // 吾来平台PubKey
            autoOpen: true // 是否自动打开
          },
          el: 'body'
        })
      </script>
  </body>
  </html>
`

http.createServer((req, res) => {
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
}).listen(port)
