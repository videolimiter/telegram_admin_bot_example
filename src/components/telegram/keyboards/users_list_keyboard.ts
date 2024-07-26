import { Markup } from "telegraf"
import { IGetUsers } from "../../db/queries/get_users"

export interface IUserSortedKeyboard {
  lng?: string
  users: any[]
  sorted?: IGetUsers["sorted"]
}

export const users_list_keyboard = (props: IUserSortedKeyboard) => {
  const { lng, users, sorted } = props

  if (!users) {
    return []
  }
  const user_column: IUserSortedKeyboard["users"] = []
  for (let i = 0; i < users.length / 2; i++) {
    user_column.push([
      Markup.button.callback(
        users[i].username || users[i].telegramId + "  👥" + users[i].count,
        "user:" + users[i].telegramId + ":" + sorted
      ),

      Markup.button.callback(
        users[i + users.length / 2].username ||
          users[i + users.length / 2].telegramId +
            " " +
            // users[i + users.length / 2].telegramId +
            "   👥" +
            users[i + users.length / 2].count,
        "user:" + users[i + users.length / 2].telegramId + ":" + sorted
      ),
    ])
  }
  return user_column
}
