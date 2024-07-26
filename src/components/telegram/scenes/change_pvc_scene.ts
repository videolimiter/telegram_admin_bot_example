import i18next from "i18next"
import { Context, Markup, Scenes } from "telegraf"
import { callbackQuery, message } from "telegraf/filters"
import { DoomerAdminContext } from "../telegram_bot"
import user_msg_edit from "../messages/edit/user_msg_edit"
import set_doomercoins from "../../db/queries/mutations/set_doomercoins"
import get_user from "../../db/queries/get_user"
import set_pvc from "../../db/queries/mutations/set_pvc"

let enterConnectSceneMgsId: number | undefined

const change_pvc_scene = new Scenes.BaseScene<DoomerAdminContext>(
  "change_pvc_scene"
)

change_pvc_scene.enter(async (ctx) => {
  const res = await ctx.reply(
    "💰 Указанное число будет использоваться для сложения. Используйте положительные числа, чтобы добавить $PVC или отрицательные, чтобы их отнять.\n\nУкажите новое количество $PVC: ",
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

change_pvc_scene.leave(async (ctx) => {
  if (enterConnectSceneMgsId) {
    await ctx.deleteMessage(enterConnectSceneMgsId)
  }
})

change_pvc_scene.action("cancel", async (ctx) => {
  await ctx.scene.leave()
})
change_pvc_scene.on("callback_query", async (ctx) => {
  if (ctx.has(callbackQuery("data"))) {
    switch (ctx.callbackQuery.data) {
      case "cancel":
        ctx.scene.leave()
    }
  }
})

change_pvc_scene.on(message("text"), async (ctx) => {
  const input = ctx.message.text
  if (!isNaN(parseInt(input))) {
    try {
      await set_pvc({
        addPVC: parseInt(input),
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

export default change_pvc_scene
