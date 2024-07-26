import express from "express"
import i18next from "i18next"
import { Markup } from "telegraf"
import { callbackQuery, message } from "telegraf/filters"
import errorHandler from "./components/express/errorHandler"
import callbacks_admin_panel from "./components/telegram/handlers/callbacks._admin_panel"
import { admin_panel_keyboard } from "./components/telegram/keyboards/admin_panel_keyboard"
import TelegramBot from "./components/telegram/telegram_bot"

require("dotenv").config()

const app = express()
const port = 5000
export const bot = TelegramBot.getInstance(process.env.TELEGRAM_TOKEN || "")

app.use(express.json())

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
i18next.init({
  lng: "ru",
  fallbackLng: "ru",
  resources: {
    en: { translation: require("./locales/en/telegram.json") },
    ru: { translation: require("./locales/ru/telegram.json") },
  },
})
bot.start(async (ctx) => {
  const res = await ctx.reply(
    i18next.t("main_keyboard.admin_panel", {
      lng: ctx.from?.language_code,
    }),

    Markup.keyboard([
      i18next.t("main_keyboard.admin_panel", {
        lng: ctx.from?.language_code,
      }),
    ])
      .oneTime()
      .resize()
  )

  ctx.session.msg.id = res.message_id
})

let msgId: number

export const mainWindow = async () => {
  bot.on(message("text"), async (ctx) => {
    if (ctx.message.text === i18next.t("main_keyboard.admin_panel")) {
      const res = await ctx.reply(
        i18next.t("main_keyboard.admin_panel", {
          lng: ctx.from?.language_code,
        }),
        Markup.inlineKeyboard(admin_panel_keyboard(ctx.from?.language_code))
      )

      ctx.session.msg.id = res.message_id
    }
  })
}
mainWindow()
bot.on("callback_query", async (ctx) => {
  if (ctx.has(callbackQuery("data"))) {
  }
  await callbacks_admin_panel(ctx)
})
bot.launch()
app.use(errorHandler)
app.listen(port, () => {
  console.log(`Doomer Admin Panel listening on port ${port}`)
})
