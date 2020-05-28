import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'

import { ShareLinkMessage } from '../../../interfaces'

interface IProps {
  body: ShareLinkMessage
}

export default function VideoContent({ body }: IProps) {
  const { title, description, cover_url, destination_url } = body.share_link

  return(
    <a className={styles.shareLinkContent} href={destination_url} target="_blank">
      <dl>
        <dt><h5>{title}</h5></dt>
        <dd>
          <div className={styles.description}>{description}</div>
          <div className={styles.coverUrl}>
            {cover_url ? (
              <img src={cover_url}/>
            ) : (
              <img src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/69135fc2-2a9a-47c2-8e10-248f0df9bb6c.png"/>
            )}
          </div>
        </dd>
      </dl>
    </a>
  )
}
