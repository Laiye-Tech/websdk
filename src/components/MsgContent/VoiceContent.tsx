import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'

import { VoiceMessage } from '../../../interfaces'
import { page as PageConfig, language } from '../../utils/config'

interface IProps {
  body: VoiceMessage
}

interface IState {
  isPlaying: boolean
}

class VoiceContent extends Nerv.Component<IProps, IState> {
  props: IProps
  state: IState

  $audio: HTMLAudioElement | null = null

  constructor(props) {
    super(props)

    this.state = {
      isPlaying: false
    }
  }

  playAudio = async (evt: any) => {
    evt.stopPropagation()

    if (!this.$audio) {
      console.log('Audio elements does not exist.')
      return Promise.resolve(false)
    }

    if (!this.state.isPlaying) {
      try {
        await this.$audio.play()
      } catch (err) {
        alert('不支持的声音类型')
        return
      }

      this.setState({ isPlaying: true })

      this.$audio.onended = () => {
        this.setState({ isPlaying: false })
      }

      this.$audio.onpause = () => {
        this.setState({ isPlaying: false })
      }
    } else {
      this.$audio.pause()
      this.setState({ isPlaying: false })
    }
  }

  render() {
    const { body } = this.props
    const { isPlaying } = this.state
    const { resource_url } = body.voice

    const audioText = language.get('Message').audio
    const playingText = language.get('Message').audioPlaying
    const btnText = isPlaying ? playingText : audioText
    const bgColor = PageConfig.get('theme_color') as string
    const style = { backgroundColor: bgColor }

    return(
      <div className={styles.voiceWrapper}>
        <div className={styles.audioMask} onClick={this.playAudio}>
          <span style={isPlaying ? { color: bgColor } : {}}>{btnText}</span>

          <ul className={`${styles.animation} ${isPlaying ? styles.actived : ''}`}>
            {[1, 2, 3, 4].map(item => <li key={item} style={isPlaying ? style : {}}/>)}
          </ul>
        </div>

        <audio className={styles.audio} preload="true" src={resource_url} ref={audio => (this.$audio = audio)}/>
      </div>
    )
  }
}

export default VoiceContent as any
