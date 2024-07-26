import i18next from "i18next"
import { Markup } from "telegraf"
import { IGetUsers } from "../../db/queries/get_users"

export interface IUserPanelKeyBoard {
  lng?: string
  user: any
  sorted: IGetUsers["sorted"]
}
export const user_panel_keyboard = (props: IUserPanelKeyBoard) => {
  const { lng, user, sorted } = props
  return [
    [
      Markup.button.callback(
        (user.IsHidden as boolean)
          ? "👁 Показать пользователя"
          : "👁 Скрыть пользователя",
        "hide:" + user.telegramId
      ),
    ],
    [
      Markup.button.callback(
        user.IsPartner ? "💼 Снять партнера" : "💼 Выдать партнера",
        "partner:" + user.telegramId
      ),
    ],
    [
      Markup.button.callback(
        "💰 Выдать/Снять DOOMER",
        "change_doomer:" + user.telegramId
      ),
    ],
    [
      Markup.button.callback(
        "💰 Выдать/Снять PVC",
        "change_pvc:" + user.telegramId
      ),
    ],
    [
      Markup.button.callback(
        "📃 Задания",
        "user_tasks:" + user.telegramId + ":1"
      ),
    ],
    [
      Markup.button.callback(
        "👥 Список рефералов",
        "user_referrals:" + user.telegramId + ":1"
      ),
    ],
    [Markup.button.callback("🔙 Назад", "users:1:" + sorted)],
  ]
}
