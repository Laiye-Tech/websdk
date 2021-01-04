function loadScript(...scripts: string[]) {
  return Promise.all(
    scripts.map(item => {
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

async function loadAliOSS() {
  // AMD CMD引入
  if (typeof window.require !== 'undefined') {
    window.require.config({
      paths: {
        oss: 'https://gosspublic.alicdn.com/aliyun-oss-sdk-6.9.0.min'
      }
    })

    return new Promise((resolve, reject) => {
      window.require(['oss'], oss => {
        window.OSS = oss

        resolve(oss)
      })

      window.require.onError = err => {
        reject(err)
      }
    })
  } else {
    await loadScript(
      'https://gosspublic.alicdn.com/aliyun-oss-sdk-6.9.0.min.js'
    )
    return window.OSS
  }
}

export { loadScript, loadAliOSS }
