import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'

import { prefixUrl } from '../../utils'
import { EXT_COLOR } from '../../utils/config'

import { FileMessage, IPageConfig } from '../../../interfaces'

interface IProps {
  body: FileMessage
  pageConfig: IPageConfig
}

export default function FileContent({ body, pageConfig }: IProps) {
  const { resource_url, file_name } = body.file
  const url = prefixUrl(resource_url)
  const ext = body.file.file_name.split('.').slice(-1)[0] || '?'
  const bgColor = EXT_COLOR[ext] || EXT_COLOR.default

  return(
    <a href={url} target="_blank" className={styles.fileContent}>
      <dl>
        <dt style={{ backgroundColor: bgColor }}><i>{ext}</i></dt>
        <dd>
          <div className={styles.fileName}>{file_name}</div>
          <span
            className={styles.downLoad}
            style={{
              color: pageConfig.theme_color,
              textDecoration: pageConfig.theme_color === '#000000' ? 'underline' : 'initial'
            }}
          >
            下载
          </span>
        </dd>
      </dl>
    </a>
  )
}
