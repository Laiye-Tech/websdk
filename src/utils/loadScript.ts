function loadScript(...scripts: string[]) {
  return Promise.all(
    scripts.map((item) => {
      return getScript(item)
    })
  )
}

function getScript(scriptUrl: string, preload?: boolean) {
  return new Promise((resolve: any, reject: any) => {
    const node = document.createElement('script')
    node.src = scriptUrl

    if (!preload) {
      document.body.appendChild(node)
    }

    node.onload = () => {
      resolve(scriptUrl)
    }

    node.onerror = () => {
      console.error('load_script', { desc: '下载脚本失败', script: scriptUrl })
      reject(scriptUrl)
    }
  })
}

async function loadRongCloud(): Promise<any> {
  // AMD CMD引入
  if (typeof window.require !== 'undefined') {
    window.require.config({
      paths: {
        RongIMLib: 'https://cdn.ronghub.com/RongIMLib-2.5.5.min',
        RongEmoji: 'https://cdn.ronghub.com/RongEmoji-2.2.7.min',
        protobuf: 'https://cdn.ronghub.com/protobuf-2.3.5.min'
      },
      shim: {
        'protobuf': {
          deps: ['RongIMLib']
        },
        'RongEmoji': {
          deps: ['RongIMLib']
        }
      }
    })

    return new Promise((resolve, reject) => {
      window.require(['RongIMLib', 'RongEmoji', 'protobuf'], (RongIMLib: any, RongEmoji: RongIMLib.RongIMEmoji, protobuf: any) => {
        window.RongIMLib = RongIMLib
        window.RongIMLib.RongIMClient.Protobuf = window.RongIMLib.RongIMClient.Protobuf || protobuf
        window.RongIMLib.RongIMEmoji = RongEmoji

        resolve(RongIMLib)
      })

      window.require.onError = (err) => {
        reject(err)
      }
    })
  } else {
    await loadScript('https://cdn.ronghub.com/RongIMLib-2.5.5.min.js')
    await loadScript('https://cdn.ronghub.com/RongEmoji-2.2.7.min.js')

    return new Promise(resolve => resolve(window.RongIMLib))
  }
}

export { loadScript, loadRongCloud }
