import express from "express"
import i18next from "i18next"
import { Markup } from "telegraf"
import { message } from "telegraf/filters"
import errorHandler from "./components/express/errorHandler"
import callbacks from "./components/telegram/handlers/callbacks"
import { keyboardAdmin } from "./components/telegram/keyboards/keyboard_admin"
import TelegramBot from "./components/telegram/telegramBot"

require("dotenv").config()

const app = express()
const port = 5000
const bot = TelegramBot.getInstance(process.env.TELEGRAM_TOKEN || "")

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
  await ctx.reply(
    i18next.t("commandStartReply", { lng: ctx.from?.language_code }),
    Markup.keyboard([i18next.t("main_keyboard.admin_panel")]).resize(true)
  )
})

bot.on(message("text"), async (ctx) => {
  if (ctx.message.text === i18next.t("main_keyboard.admin_panel")) {
    await ctx.reply(
      i18next.t("admin_panel_enter_msg", {
        lng: ctx.from?.language_code,
      }),
      { ...keyboardAdmin(ctx.from?.language_code) }
    )
  }
})
bot.on("callback_query", async (ctx) => await callbacks(ctx))

bot.launch()

app.use(errorHandler)
app.listen(port, () => {
  console.log(`Doomer Admin Panel listening on port ${port}`)
})
