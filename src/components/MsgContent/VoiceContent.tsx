import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'

import { VoiceMessage } from '../../../interfaces'

interface IProps {
  body: VoiceMessage
}

export default function VoiceContent({ body }: IProps) {
  const { resource_url } = body.voice

  return(
    <div className={styles.voiceWrapper}>
      <div className="audioMask">
        <span>{{ resource_url }}</span>
      </div>
    </div>
  )
}
