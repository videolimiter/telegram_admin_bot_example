import { Context, Scenes, Telegraf } from "telegraf"
import LocalSession from "telegraf-session-local"

export interface SessionData extends Scenes.SceneSession {
  counter: number
  msg: {
    id: number
    param: object
  }[]
}
export interface DoomerAdminContext extends Context {
  roomId: number
  params: object
  text: string
  session: SessionData
  // declare scene type
  scene: Scenes.SceneContextScene<DoomerAdminContext>
}
const TelegramBot = (() => {
  let instance: Telegraf<DoomerAdminContext>

  const createInstance = (token: string) => {
    const bot = new Telegraf<DoomerAdminContext>(token)

    const localSession = new LocalSession({
      database: "tgbot_db.json",
    })

    //console.log("Current LocalSession DB:", localSession.DB)

    // Telegraf will use `telegraf-session-local` configured above middleware
    bot.use(localSession.middleware())

    bot.catch((err, ctx) => {
      console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
    })

    // const stage = new Scenes.Stage<DoomerAdminContext>([TempScene])
    // //bot.use(session())

    // bot.use(stage.middleware())
    bot.use((ctx, next) => {
      ctx.params ??= {}
      // we now have access to the the fields defined above
      ctx.roomId ??= 0
      ctx.text ??= ""
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
