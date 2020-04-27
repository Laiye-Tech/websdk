import postForm from '../utils/request'
import { BASE_URL, getUserId } from '../utils/config'
import { ISugList, IUserSugList } from '../../interfaces'

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

  const url = `${BASE_URL}/msg/user/input`
  const { user_suggestions }: IUserSugList = await postForm(url, body)
  return user_suggestions
}
