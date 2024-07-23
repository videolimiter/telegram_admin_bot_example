import i18next from "i18next"
import { Markup } from "telegraf"
import { IGetUsers } from "../../db/queries/get_users"

export interface IUser {
  lng?: string
  page: number
  last_page: number
  sorted?: IGetUsers["sorted"]
}

export const users_paginate_keyboard = (props: IUser) => {
  const { lng, page, sorted, last_page } = props

  return [
    Markup.button.callback(
      "◀",
      page - 1 <= 0
        ? "users:" + last_page + ":" + sorted
        : "users:" + (page - 1) + ":" + sorted
    ),

    Markup.button.callback(page.toString(), "Nan"),
    Markup.button.callback(
      "▶",
      last_page <= page + 1
        ? "users:1:" + sorted
        : "users:" + (page + 1) + ":" + sorted
    ),
  ]
}
