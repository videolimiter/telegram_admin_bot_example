import i18next from "i18next"
import { Markup } from "telegraf"
import { IGetUsers } from "../../db/queries/get_users"

export interface IUser {
  lng?: string
  page?: number
  sorted?: IGetUsers["sorted"]
}

export const users_sort_keyboard = (props: IUser) => {
  const { lng, page } = props

  return [
    Markup.button.callback(
      i18next.t("users_sort_day", { lng: lng }),
      "users:" + page + ":day"
    ),

    Markup.button.callback(
      i18next.t("users_sort_week", { lng: lng }),
      "users:" + page + ":week"
    ),
    Markup.button.callback(
      i18next.t("users_sort_all", { lng: lng }),
      "users:" + page + ":all"
    ),
  ]
}
