import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'

import { ImageMessage } from '../../../interfaces'

interface IProps {
  body: ImageMessage
}

export default function ImgContent({ body }: IProps) {
  const { resource_url } = body.image
  let url = resource_url
  if (url.indexOf('.oss') !== -1 || url.indexOf('.ps') !== -1) {
    url += '?x-oss-process=image/resize,m_lfit,h_200,w_200'
  }

  return(
    <div className={styles.imageWrapper}>
      <img src={url}/>
    </div>
  )
}
