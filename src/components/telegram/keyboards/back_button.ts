import i18next from "i18next"
import { Markup } from "telegraf"

export const back_button = (lng?: string) => [
  Markup.button.callback(i18next.t("back"), "back_to_main_admin_panel"),
]
