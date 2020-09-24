import postForm from '../utils/request'
import { BASE_URL, getUserId, OPEN_BASE_URL } from '../utils/config'
import { ISugList, IUserSugList, ITagValuesInput } from '../../interfaces'

/**
 * 创建用户
 */
export function createUser(userInfo): Promise<any> {
  const body = {
    user_id: userInfo.userId,
    avatar_url: userInfo.userAvatar,
    nickname: userInfo.nickName
  }

  const url = `${OPEN_BASE_URL}/v2/user/create`
  return postForm(url, body)
}

/**
 * 获取用户输入的sug
 * @param {string} input
 * @return {IUserSugList}
 * */
export async function getUserInputSugList(input: string): Promise<ISugList[]> {
  const body = {
    query: input,
    user_id: getUserId()
  }

  const url = `${OPEN_BASE_URL}/v2/msg/user-suggestion/get`
  const { user_suggestions }: IUserSugList = await postForm(url, body)
  return user_suggestions
}

/**
 * 给用户添加属性值
 * @param {Array<ITagValuesInput>} attribute
 * @return {}
 *
 * */
export function createUserTag(attribute: ITagValuesInput[]): Promise<{}> {
  const body = {
    user_id: getUserId(),
    user_attribute_user_attribute_value: attribute
  }

  const url = `${OPEN_BASE_URL}/v2/user/user-attribute/create`
  const res = postForm(url, body)
  return res
}
