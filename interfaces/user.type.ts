export interface IUserSugList {
  user_suggestions: ISugList[]
}

export interface ISugList {
  suggestion: string
}

export interface ITagValuesInput {
  user_attribute: { id: string }
  user_attribute_value: { name: string }
}
