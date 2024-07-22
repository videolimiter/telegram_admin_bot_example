import { Context } from "telegraf"
import { callbackQuery } from "telegraf/filters"

const callbacks = async (ctx: Context) => {
  if (ctx.has(callbackQuery("data"))) {
    switch (ctx.callbackQuery.data) {
      case "main_statistic":
        await ctx.answerCbQuery("main_statistic")
        break
      case "ad_statistic":
        await ctx.answerCbQuery("ad_statistic")
        break
      case "users":
        await ctx.answerCbQuery("users")
        break
      case "tasks_one":
        await ctx.answerCbQuery("tasks_one")
        break
      case "settings":
        await ctx.answerCbQuery("settings")
        break
      default:
        break
    }
  }
}

export default callbacks
