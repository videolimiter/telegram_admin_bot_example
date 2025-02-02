import i18next from "i18next"
import { Markup } from "telegraf"

export const admin_panel_keyboard = (lng?: string) => [
  [
    Markup.button.callback(
      i18next.t("admin_keyboard.main_statistic", { lng: lng }),
      "main_statistic"
    ),
  ],
  [
    Markup.button.callback(
      i18next.t("admin_keyboard.ad_statistic", { lng: lng }),
      "ad_statistic"
    ),
  ],
  [
    Markup.button.callback(
      i18next.t("admin_keyboard.users_one_all", { lng: lng }),
      "users:1:all"
    ),
  ],
  [
    Markup.button.callback(
      i18next.t("admin_keyboard.tasks_one", { lng: lng }),
      "tasks_one"
    ),
  ],
  [
    Markup.button.callback(
      i18next.t("admin_keyboard.settings", { lng: lng }),
      "settings"
    ),
  ],
]
