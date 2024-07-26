import i18next from "i18next"
import { Scenes } from "telegraf"
import { callbackQuery, message } from "telegraf/filters"
import { mainWindow } from "../../../app"
import set_doomercoins from "../../db/queries/mutations/set_doomercoins"
import { DoomerAdminContext } from "../telegram_bot"
import get_user from "../../db/queries/get_user"

let enterConnectSceneMgsId: number | undefined

const find_user_scene = new Scenes.BaseScene<DoomerAdminContext>(
  "find_user_scene"
)

find_user_scene.enter(async (ctx) => {
  const res = await ctx.reply("Укажите ID или username пользователя: ", {
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
  })
  enterConnectSceneMgsId = res.message_id
})

find_user_scene.leave(async (ctx) => {
  if (enterConnectSceneMgsId) {
    await ctx.deleteMessage(enterConnectSceneMgsId)
  }
})

find_user_scene.action("cancel", async (ctx) => {
  await ctx.scene.leave()
})
find_user_scene.on("callback_query", async (ctx) => {
  if (ctx.has(callbackQuery("data"))) {
    switch (ctx.callbackQuery.data) {
      case "cancel":
        ctx.scene.leave()
    }
  }
})

find_user_scene.on(message("text"), async (ctx) => {
  const input = ctx.message.text

  try {
    await get_user({ telegramId: input }).then(async (res) => {
      console.log(res)

      ctx.scene.leave()
    })
  } catch (e) {
    console.log(e)
  } finally {
    ctx.scene.leave()
  }

  if (input === "/cancel") {
    ctx.scene.leave()

    return
  }
})

export default find_user_scene
