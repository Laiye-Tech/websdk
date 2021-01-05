## 本地启动

- node use v13
- yarn install
- yarn dev
- http://localhost:8082

## 目录结构

```
├── components
│   ├── chat-input // 输入框相关
│   │   ├── chat-input.less
│   │   ├── quick-reply.tsx // 预置回复组件
│   │   ├── sug-list.tsx // 用户输入联想组件
│   │   └── index.tsx // 输入框
│   ├── common
│   │   ├── error-header.tsx // 断网提示
│   │   ├── image-modal.tsx // 图片放大弹层
│   │   ├── tips-modal.tsx // 融云多端登录提示 & 接口错误提示
│   │   ├── toast.tsx // 上传文件失败后提示 3s之后消失
│   │   ├── video-modal.tsx // 视频弹层
│   │   └── style.less
│   ├── msg-content 消息相关
│   │   ├── file-content.tsx // 文件消息
│   │   ├── genius-msg.tsx // 机器人发送的消息
│   │   ├── img-content.tsx // 图片消息
│   │   ├── msg.tsx // 消息方向，用来判断加载用户/机器人消息
│   │   ├── msg-content.less
│   │   ├── msg-content.tsx // 用来区分消息类型，加载对应组件
│   │   ├── rich-text-content.tsx // 图文消息
│   │   ├── share-link-content.tsx // 卡片消息
│   │   ├── text-content.tsx // 文本消息
│   │   ├── user-msg.tsx // 用户消息
│   │   ├── video-content.tsx // 视频消息
│   │   └── voice-content.tsx // 语音消息
│   └── msg-panel
│       ├── history-msg-panel.tsx // 历史消息组件
│       └── rt-msg-panel.tsx // 实时消息组件
├── data
│   ├── message.data.ts // 消息相关接口
│   └── user.data.ts // 用户相关接口
├── stores // 状态管理
│   ├── actions.ts
│   └── reducer.ts
├── utils
│   ├── config.ts // 项目的一些基础配置（环境变量、头像形状、文件背景颜色、项目接触配置等）
│   ├── index.ts // 封装的一些公共方法
│   ├── load-script.ts // 加载script标签的方法
│   ├── message.ts // 消息相关的方法，一般用来发送消息，如果要增加一种消息类型，这里也需要改动
│   ├── request.ts
│   └── xss.ts
└── views
    ├── index.less
    └── index.tsx
```

## 1.引入 建议放到 body 标签的第一行
此处5.0.0是当前版本号
```jsx
<script src="https://cdn.wul.ai/IMLib-5.0.0.min.js"></script>
```

## 2.初始化

在 body 标签内添加如下代码
pubkey 为必传参数，可从吾来平台->渠道设置->WebSdk 界面获取

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

| 参数名     | 说明                                    |  类型   |             默认值              | 版本   |
| :--------- | :-------------------------------------- | :-----: | :-----------------------------: | :----- |
| pubkey     | 必填，必须是从吾来平台->渠道设置->WebSdk 获取的Pubkey | string  |               ''                |        |
| autoOpen   | SDK 默认是否打开聊天窗口                | boolean |              false              |        |
| fullScreen | 是否全屏                                | boolean |              false              |        |
| userInfo   | 设置用户信息                            | Object  |                                 | 3.30.0 |
| tagValues  | 设置用户属性                            |  Array  |                                 | 3.30.0 |
| pos        | 设置 sdk 入口图标的位置                 | Object  | {right: '16px', bottom: '16px'} | 3.30.0 |

#### userInfo 的配置项

| 参数名     | 说明                                                                                                                                             |  类型  | 默认值 | 版本 |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :----: | :----: | :--- |
| userId     | 用户 ID，请提供非空且唯一的字符串，相同的 userId 在同一时间只能给一个网页使用，否则会被融云视为多端登录，导致消息发送失败。字符最大长度 128 字符 | string |   ''   |      |
| userAvatar | 展示在吾来管理后台的用户头像                                                                                                                     | string |   ''   |
| nickName   | 展示在吾来管理后台的用户名                                                                                                                       | string |   ''   |

#### tagValues 的配置项

| 参数名               | 说明       |  类型  |   默认值   | 版本 |
| :------------------- | :--------- | :----: | :--------: | :--- |
| user_attribute       | 用户属性   | Object |  {id: ''}  |
| user_attribute_value | 用户属性值 | Object | {name: ''} |

#### userInfo 的用法

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

#### tagValues 的用法

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

- toggleSDkVisible 控制 web sdk 窗口是打开还是关闭：

```jsx
<button onClick="websdk.toggleSDkVisible()" />
```
