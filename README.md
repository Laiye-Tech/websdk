## 本地启动
- node use v13
- yarn install
- yarn dev
- http://localhost:8082

## 打包命令
* 测试环境执行：`npm run build:qa`
* 灰度环境执行：`npm run build:pre`
* 线上环境执行：`npm run build`

## web sdk上线
- 在dist目录下找到对应当前版本的IMLib-xxx.min.js，上传到阿里云cdn上
- [登录阿里云后台](https://signin.aliyun.com/laiye/login.htm) 账号: `monitor@laiye` 密码: `laiye@2018`
- 访问[对象存储模块](https://oss.console.aliyun.com/bucket/oss-cn-beijing/saas-frontend/object?path=)，在根目录下上传js文件

## 版本更新
- 每次版本更新的时候，都先拉出一个线上版本的分支，为了方便维护老版本的bug
- 不单独拉分支也可以，但是打tag的时候一定要写清楚版本号
- 版本更新直接修改package.json的version就行
- 版本要不要更新，取决于后端接口。比如某个功能是3.0版本之后才有的，现在线上的版本是2.9，这个时候就需要更新版本号

## 1.引入 建议放到body标签的第一行

```jsx
<script src="https://cdn.wul.ai/IMLib-5.0.0.min.js"></script>
```

## 2.初始化

在body标签内添加如下代码

```jsx
<div id="wulai-websdk"></div>
<script>
    new websdk({
        data: {
            pubkey: 'xxxxxxxxxxxxxxxxxxxx'
        }
    })
</script>
```

## 3.参数说明
| 参数名     | 说明                         | 类型                         | 默认值 | 版本 |
| :--------- | :--------------------------- | :-----------------------------------: | :--------: | :--------- |
| pubkey | 必填，必须是从吾来平台获取的有效PubKey | string | '' ||
| autoOpen | SDK默认是否打开聊天窗口 | boolean | false ||
| fullScreen | 是否全屏 | boolean | false ||
| userInfo | 设置用户信息 | Object ||3.30.0
| tagValues | 设置用户属性 | Array ||3.30.0
| pos | 设置sdk入口图标的位置 | Object | {right: '16px', bottom: '16px'} |3.30.0


#### userInfo的配置项
| 参数名     | 说明                         | 类型                         | 默认值 | 版本 |
| :--------- | :--------------------------- | :-----------------------------------: | :--------: | :--------- |
| userId | 用户ID，请提供非空且唯一的字符串，相同的userId在同一时间只能给一个网页使用，否则会被融云视为多端登录，导致消息发送失败。字符最大长度128字符 | string | '' ||
| userAvatar | 展示在吾来管理后台的用户头像 | string | '' |
| nickName | 展示在吾来管理后台的用户名 | string | '' |

#### tagValues的配置项
| 参数名     | 说明                         | 类型                         | 默认值 | 版本 |
| :--------- | :--------------------------- | :-----------------------------------: | :--------: | :--------- |
| user_attribute | 用户属性 | Object | {id: ''} |
| user_attribute_value | 用户属性值 | Object | {name: ''} |

#### userInfo的用法
```jsx
<script>
    new websdk({
        data: {
            pubkey: 'xxxxxxxxxxxxxxxxxxxx',
            userInfo: {
                userId: '',
                userAvatar: '',
                nickName: ''
            }
        }
    })
</script>
```

#### tagValues的用法
```jsx
<script>
    new websdk({
        data: {
            pubkey: 'xxxxxxxxxxxxxxxxxxxx',
            tagValues: [
                {
                    user_attribute: { id: '100000' },
                    user_attribute_value: { name: '女' }
                },
                {
                    user_attribute: { id: '100000' },
                    user_attribute_value: { name: '女' }
                }
            ]
        }
    })
</script>
```

## 4.API
* toggleSDkVisible 控制web sdk窗口是打开还是关闭：
```jsx
<button onClick="websdk.toggleSDkVisible()" />
```
