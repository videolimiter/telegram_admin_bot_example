import { Context, Scenes, session, Telegraf } from "telegraf"
import change_doomercoins_scene from "./scenes/change_doomercoins_scene"
import { IGetUsers } from "../db/queries/get_users"
import change_pvc_scene from "./scenes/change_pvc_scene"
import find_user_scene from "./scenes/find_user_scene"

export interface SessionData extends Scenes.SceneSession {
  counter: number
  idToChange: number
  sorted: IGetUsers["sorted"]
  msg: {
    id: number
  }
}
export interface DoomerAdminContext extends Context {
  text: string
  telegramId: number | string
  session: SessionData
  scene: Scenes.SceneContextScene<DoomerAdminContext>
}
const TelegramBot = (() => {
  let instance: Telegraf<DoomerAdminContext>

  const createInstance = (token: string) => {
    const bot = new Telegraf<DoomerAdminContext>(token)

    bot.catch((err, ctx) => {
      console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
    })

    const stage = new Scenes.Stage<DoomerAdminContext>(
      [change_doomercoins_scene, change_pvc_scene, find_user_scene],
      {
        ttl: 10,
      }
    )
    bot.use(session())
    bot.use(stage.middleware())
    bot.use((ctx, next) => {
      ctx.text ??= ""
      ctx.session.idToChange ??= 0
      ctx.session.counter ??= 0
      ctx.session.sorted ??= "all"
      ctx.session.msg ??= { id: 0 }
      ctx.telegramId ??= ctx.from?.id ?? ""
      return next()
    })
    return bot
  }

  return {
    getInstance: (token: string) => {
      if (!instance) {
        instance = createInstance(token)
      }
      return instance
    },
  }
})()

export default TelegramBot
