import { Markup } from "telegraf"
import { IGetUsers } from "../../db/queries/get_users"

interface IUserSortedKeyboard {
  lng?: string
  users?: any[]
  page: number
  sorted?: IGetUsers["sorted"]
}

export const users_sorted_keyboard = (props: IUserSortedKeyboard) => {
  const { lng, users, sorted, page } = props
  if (!users) {
    return []
  }

  return users.map((u: any) => [
    Markup.button.callback(
      u.username + " " + u.telegramId + "   👥" + u.count,
      "user:" + u.telegramId + ":" + sorted
    ),
  ])
}
