import * as Nerv from 'nervjs'
import { connect, Dispatch } from 'nerv-redux'

import * as styles from './MsgContent.less'

// actions
import { showImageModal } from '../../actions'

import { ImageMessage } from '../../../interfaces'
import { prefixUrl } from '../../utils'

interface IProps {
  body: ImageMessage
  showImageModal: (url: string) => void
}

const ImgContent = (props: IProps) => {
  const { showImageModal, body } = props
  const { resource_url } = body.image
  const url = prefixUrl(resource_url)

  const openImgModal = () => {
    showImageModal(url)
  }

  return (
    <div className={styles.imageWrapper} onClick={openImgModal}>
      <img src={url} />
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  showImageModal: url => dispatch(showImageModal(url))
})

export default connect(
  null,
  mapDispatchToProps
)(ImgContent) as any
