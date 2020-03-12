import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'

import { ImageMessage } from '../../../interfaces'

interface IProps {
  body: ImageMessage
}

export default function ImgContent({ body }: IProps) {
  const { resource_url } = body.image

  return(
    <div className={styles.imgContent}>
      <img src={resource_url}/>
    </div>
  )
}
