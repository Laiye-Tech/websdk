import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'

import { request } from '../../utils/request'
import { RichTextMessage } from '../../../interfaces'

interface IProps {
  body: RichTextMessage
}

class RichTextContent extends Nerv.Component<IProps> {
  props: IProps
  state = {
    richTextHTML: ''
  }

  async componentDidMount() {
    const { rich_text: { resource_url } } = this.props.body
    const result = await request(resource_url, { mode: 'cors', credentials: 'omit'})
    this.setState({ richTextHTML: result })
  }

  render() {
    return(
      <div className={styles.richTextContent} dangerouslySetInnerHTML={{__html: this.state.richTextHTML}}/>
    )
  }
}

export default RichTextContent as any
