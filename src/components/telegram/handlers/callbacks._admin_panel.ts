import i18next from "i18next"
import { Context, Markup, Scenes } from "telegraf"
import { callbackQuery } from "telegraf/filters"
import get_ad_statistic from "../../db/queries/get_ad_statistic"
import get_main_statistic from "../../db/queries/get_main_statistic"

import { back_button } from "../keyboards/back_button"
import { admin_panel_keyboard } from "../keyboards/admin_panel_keyboard"
import { users_find_export_keyboard } from "../keyboards/users_find_export_keyboard"
import { users_sort_keyboard } from "../keyboards/users_sort_keyboard"
import { users_list_keyboard } from "../keyboards/users_list_keyboard"
import get_users, { IGetUsers } from "../../db/queries/get_users"
import { users_paginate_keyboard } from "../keyboards/users_paginate_keyboard"
import get_user from "../../db/queries/get_user"
import { user_panel_keyboard } from "../keyboards/user_panel_keyboard"
import sort_string from "../../helpers/sort_string"
import { sucsefull_hide_keyboard } from "../keyboards/sucsefull_hide_keyboard"
import { number } from "zod"
import set_hide_user from "../../db/queries/mutations/set_hide_user"
import set_partner_user from "../../db/queries/mutations/set_partner_user"
import user_msg_edit from "../messages/edit/user_msg_edit"
import { DoomerAdminContext, SessionData } from "../telegram_bot"
import { bot } from "../../../app"

interface ICallbacksAdminPanel extends Context {
  scene: Scenes.SceneContextScene<DoomerAdminContext>
  session: SessionData
  telegramId: number | string
}

const callbacks_admin_panel = async (ctx: ICallbacksAdminPanel) => {
  if (ctx.has(callbackQuery("data"))) {
    const msgId = ctx.session.msg.id
    let user: any
    try {
      const users_regex = /^users/
      const user_regex = /^user/
      const hide_regexp = /^hide/
      const partner_regex = /^partner/
      const change_pvc_regexp = /^change_pvc/
      const change_doomercoins_regexp = /^change_doomer/

      //callbacks
      switch (ctx.callbackQuery.data) {
        //изменить pvc
        case change_pvc_regexp.test(ctx.callbackQuery.data)
          ? ctx.callbackQuery.data
          : null:
          ctx.session.idToChange = parseInt(
            ctx.callbackQuery.data.split(":")[1]
          )

          await ctx.scene.enter("change_pvc_scene")

          break
        //изменить doomer
        case change_doomercoins_regexp.test(ctx.callbackQuery.data)
          ? ctx.callbackQuery.data
          : null:
          ctx.session.idToChange = parseInt(
            ctx.callbackQuery.data.split(":")[1]
          )

          await ctx.scene.enter("change_doomercoins_scene")

          break

        //снять/добавить партнера
        case partner_regex.test(ctx.callbackQuery.data)
          ? ctx.callbackQuery.data
          : null:
          if (
            await set_partner_user({
              telegramId: Number(ctx.callbackQuery.data.split(":")[1]),
            })
          ) {
            await await ctx.answerCbQuery(
              "💼 Статус партнера был успешно изменен.",
              { show_alert: true }
            )
            user = await get_user({
              telegramId: Number(ctx.callbackQuery.data.split(":")[1]),
            })
            await user_msg_edit({
              ctx,
              user,
              sorted: ctx.session.sorted,
              msgId,
            })
          }
          break

        // отображение пользователей
        case users_regex.test(ctx.callbackQuery.data)
          ? ctx.callbackQuery.data
          : null:
          const users_tag = ctx.callbackQuery.data.split(":")
          ctx.session.sorted = users_tag[2] as IGetUsers["sorted"]

          const page = Number(users_tag[1])
          console.log("🚀 ~ constcallbacks_admin_panel= ~ page:", page)
          const take = 20
          console.log("🚀 ~ constcallbacks_admin_panel= ~ take:", take)

          const users = await get_users({
            sorted: ctx.session.sorted,
            take,
            skip: Number(page - 1) * take,
          })

          const last_page = users?.countTotal
            ? Math.ceil(users.countTotal / take)
            : 1

          const users_list = users?.users
          if (users_list)
            await ctx.telegram.editMessageText(
              ctx.chat?.id.toString() || "",
              msgId,
              msgId?.toString(),
              `👤 Список пользователей\n\nКоличество пользователей: ${
                users?.countTotal
              }
            \nТип сортировки по реферелам: ${sort_string(ctx.session.sorted)}
            `,
              {
                parse_mode: "HTML",
                ...Markup.inlineKeyboard([
                  ...users_find_export_keyboard(),
                  ...users_list_keyboard({
                    users: users_list,
                    sorted: ctx.session.sorted,
                  }),
                  users_paginate_keyboard({
                    page,
                    last_page,
                    sorted: ctx.session.sorted,
                  }),
                  users_sort_keyboard({ page, sorted: ctx.session.sorted }),
                  back_button(),
                ]),
              }
            )
          switch (ctx.callbackQuery.data.split(":")[2]) {
            case "day":
              console.log("day", page)
              await get_users({
                sorted: "day",
                take,
                skip: Number(page - 1) * take,
              })
              break
            case "week":
              console.log("week", page)
              const users = await get_users({
                sorted: "week",
                take,
                skip: Number(page - 1) * take,
              })
              break
            default:
              break
          }
          break

        // отображение пользователя
        case user_regex.test(ctx.callbackQuery.data)
          ? ctx.callbackQuery.data
          : null:
          const telegramId = Number(ctx.callbackQuery.data.split(":")[1])

          ctx.session.sorted = ctx.callbackQuery.data.split(
            ":"
          )[2] as IGetUsers["sorted"]

          user = await get_user({
            telegramId,
            sorted: ctx.session.sorted,
          })
          await user_msg_edit({ ctx, user, sorted: ctx.session.sorted, msgId })

          break
        // скрыть пользователя
        case hide_regexp.test(ctx.callbackQuery.data)
          ? ctx.callbackQuery.data
          : null:
          if (
            await set_hide_user({
              telegramId: Number(ctx.callbackQuery.data.split(":")[1]),
            })
          ) {
            await await ctx.answerCbQuery(
              "👁 Статус отображения был успешно изменен",
              { show_alert: true }
            )
          }
          break
        case "find_user":
          ctx.scene.enter("find_user_scene")

          break
        case "back_to_main_admin_panel":
          // await ctx.telegram.sendMessage(
          //   ctx.chat?.id.toString() ?? "",
          //   i18next.t("main_keyboard.admin_panel")
          // )
          // await ctx.deleteMessage(msgId)
          ctx.telegram.editMessageText(
            ctx.chat?.id.toString() || "",
            msgId,
            msgId?.toString(),

            i18next.t("admin_panel_enter_msg", {
              lng: ctx.from?.language_code,
            }),
            Markup.inlineKeyboard(admin_panel_keyboard(ctx.from?.language_code))
          )
          break
        case "main_statistic":
          await ctx.answerCbQuery("main_statistic")
          const statistic = await get_main_statistic()
          ctx.telegram.editMessageText(
            ctx.chat?.id.toString() || "",
            msgId,
            msgId?.toString(),
            "🟢 Пользователей онлайн: " +
              statistic?.onlinePlayersCount +
              "\n\n👤 Количество игроков в приложении: " +
              statistic?.countPlayersPlayed +
              "\n👤 Количество игроков в бд: " +
              statistic?.countPlayers +
              "\n👥 Привели минимум 1 активного реферала: " +
              statistic?.referrersCount +
              "\n\n💰 Всего заработано думер: " +
              statistic?.doomsCoinsTotal +
              "\n💰 Сколько всего заработано пива: " +
              statistic?.pvcEarnedTotal +
              "\n\nСколько заработано думер именно за задания: " +
              statistic?.doomsCoinsTasksTotal +
              "\n\nПотрачено PVC: " +
              statistic?.pvc_total +
              "\nПотрачено DOOMER: " +
              Math.abs(statistic?.doomWasteTotal),
            Markup.inlineKeyboard([back_button()])
          )
          break
        case "ad_statistic":
          await ctx.answerCbQuery("ad_statistic")
          const ad_statistic = await get_ad_statistic()
          ctx.telegram.editMessageText(
            ctx.chat?.id.toString() || "",
            msgId,
            msgId?.toString(),
            "📉 Количество просмотренной рекламы за день: " +
              ad_statistic?.countViewDay +
              "\n📉 Количество просмотренной рекламы за неделю: " +
              ad_statistic?.countViewWeek +
              "\n📉 Количество просмотренной рекламы за месяц: " +
              ad_statistic?.countViewMonth +
              "\n📉 Количество просмотренной рекламы за всё время:  " +
              ad_statistic?.countViewAll,
            Markup.inlineKeyboard(back_button())
          )
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
    } catch (e) {
      console.log(e)
    }
  }
}

export default callbacks_admin_panel
