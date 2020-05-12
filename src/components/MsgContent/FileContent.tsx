import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'

import { prefixUrl } from '../../utils'
import { EXT_COLOR, page as PageConfig, language } from '../../utils/config'

import { FileMessage } from '../../../interfaces'

interface IProps {
  body: FileMessage
}

export default function FileContent({ body }: IProps) {
  const { resource_url, file_name } = body.file
  const url = prefixUrl(resource_url)
  const ext = body.file.file_name.split('.').slice(-1)[0] || '?'
  const bgColor = EXT_COLOR[ext] || EXT_COLOR.default
  const color = PageConfig.get('theme_color') as string
  const text = language.get('Message').download

  return(
    <a href={url} target="_blank" className={styles.fileContent}>
      <dl>
        <dt style={{ backgroundColor: bgColor }}><i>{ext}</i></dt>
        <dd>
          <div className={styles.fileName}>{file_name}</div>
          <span
            className={styles.downLoad}
            style={{
              color,
              textDecoration: color === '#000000' ? 'underline' : 'initial'
            }}
          >
            {text}
          </span>
        </dd>
      </dl>
    </a>
  )
}
