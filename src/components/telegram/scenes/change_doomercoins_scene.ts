import i18next from "i18next"
import { Scenes } from "telegraf"
import { callbackQuery, message } from "telegraf/filters"
import { mainWindow } from "../../../app"
import set_doomercoins from "../../db/queries/mutations/set_doomercoins"
import { DoomerAdminContext } from "../telegram_bot"

let enterConnectSceneMgsId: number | undefined

const change_doomercoins_scene = new Scenes.BaseScene<DoomerAdminContext>(
  "change_doomercoins_scene"
)

change_doomercoins_scene.enter(async (ctx) => {
  const res = await ctx.reply(
    "💰 Указанное число будет использоваться для сложения. Используйте положительные числа, чтобы добавить $DOOMER или отрицательные, чтобы их отнять.\n\nУкажите новое количество $DOOMER: ",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: i18next.t("Cancel", {
                lng: ctx.from?.language_code || "en",
              }),
              callback_data: "cancel",
            },
          ],
        ],
      },
    }
  )
  enterConnectSceneMgsId = res.message_id
})

change_doomercoins_scene.leave(async (ctx) => {
  if (enterConnectSceneMgsId) {
    await ctx.deleteMessage(enterConnectSceneMgsId)
  }
  mainWindow()
})

change_doomercoins_scene.action("cancel", async (ctx) => {
  await ctx.scene.leave()
})
change_doomercoins_scene.on("callback_query", async (ctx) => {
  if (ctx.has(callbackQuery("data"))) {
    switch (ctx.callbackQuery.data) {
      case "cancel":
        ctx.scene.leave()
    }
  }
})

change_doomercoins_scene.on(message("text"), async (ctx) => {
  const input = ctx.message.text
  if (!isNaN(parseInt(input))) {
    try {
      await set_doomercoins({
        addCoins: parseInt(input),
        telegramId: ctx.session.idToChange,
      }).then(async () => {
        ctx.scene.leave()
      })
    } catch (e) {
      console.log(e)
    } finally {
      ctx.scene.leave()
    }
  } else {
    // input не является целым числом
    ctx.reply("❌ Не является числом")
    ctx.scene.leave()
  }
  if (input === "/cancel") {
    ctx.scene.leave()

    return
  }
})

export default change_doomercoins_scene
