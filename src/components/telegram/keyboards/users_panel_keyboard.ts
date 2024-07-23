import i18next from "i18next"
import { Markup } from "telegraf"

export const users_panel_keyboard = (lng?: string) => [
  [
    Markup.button.callback(i18next.t("find_users", { lng: lng }), "find_user"),
    Markup.button.callback(
      i18next.t("export_users", { lng: lng }),
      "export_users"
    ),
  ],
]
