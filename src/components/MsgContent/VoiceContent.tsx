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

  // 当前播放的音频、需要唯一性
  $audio: HTMLAudioElement | null = null

  constructor(props) {
    super(props)

    this.state = {
      isPlaying: false
    }
  }

  componentDidMount() {
    // 监听用户是否离开此页面、如果离开、则暂停当前音频
    document.addEventListener(
      'visibilitychange',
      () => {
        visibilitychange()
      },
      false
    )

    const visibilitychange = () => {
      if (!this.$audio) {
        return
      }

      if (document.hidden) {
        this.setState({ isPlaying: false })
        this.$audio.pause()
      }
    }
  }

  playAudio = async (evt: any) => {
    evt.stopPropagation()

    if (!this.$audio) {
      console.log('Audio elements does not exist.')
      return Promise.resolve(false)
    }

    // 判断页面中是否有其他audio、使得其他停止、只播放当前音频
    const audios = document.getElementsByTagName('audio')

    for (let i = 0; i < audios.length; i++) {
      if (audios[i] !== this.$audio) {
        audios[i].pause()
      }
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

    return (
      <div className={styles.voiceWrapper}>
        <div className={styles.audioMask} onClick={this.playAudio}>
          <span style={isPlaying ? { color: bgColor } : {}}>{btnText}</span>

          <ul
            className={`${styles.animation} ${isPlaying ? styles.actived : ''}`}
          >
            {[1, 2, 3, 4].map(item => (
              <li key={item} style={isPlaying ? style : {}} />
            ))}
          </ul>
        </div>

        <audio
          className={styles.audio}
          preload="true"
          src={resource_url}
          ref={audio => (this.$audio = audio)}
        />
      </div>
    )
  }
}

export default VoiceContent as any
