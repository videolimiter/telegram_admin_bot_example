import i18next from "i18next"
import { Markup } from "telegraf"
interface IHideUser {
  user_id: string
  lng?: string
}

export const sucsefull_hide_keyboard = (props: IHideUser) => {
  const { user_id } = props
  return [Markup.button.callback(user_id, "user:" + user_id + ":all")]
}
