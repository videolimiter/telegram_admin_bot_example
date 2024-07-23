import i18next from "i18next"
import { Context, Markup } from "telegraf"
import { callbackQuery } from "telegraf/filters"
import get_ad_statistic from "../../db/queries/get_ad_statistic"
import get_main_statistic from "../../db/queries/get_main_statistic"

import { back_button } from "../keyboards/back_button"
import { keyboardAdmin } from "../keyboards/keyboard_admin"
import { users_panel_keyboard } from "../keyboards/users_panel_keyboard"
import { users_sort_keyboard } from "../keyboards/users_sort_keyboard"
import { users_sorted_keyboard } from "../keyboards/users_sorted_keyboard"
import get_users, { IGetUsers } from "../../db/queries/get_users"
import { users_paginate_keyboard } from "../keyboards/users_paginate_keyboard"
import get_user from "../../db/queries/get_user"
import { user_panel_keyboard } from "../keyboards/user_panel_keyboard"
import sort_string from "../../helpers/sort_string"

const callbacks_admin_panel = async (ctx: Context, msgId?: number) => {
  if (ctx.has(callbackQuery("data"))) {
    try {
      const users_regex = /users/
      const user_regex = /user/
      //sort users callbacks
      switch (ctx.callbackQuery.data) {
        // отображение пользователей
        case users_regex.test(ctx.callbackQuery.data)
          ? ctx.callbackQuery.data
          : null:
          const users_tag = ctx.callbackQuery.data.split(":")
          const users_sorted = users_tag[2] as IGetUsers["sorted"]

          const page = Number(users_tag[1])

          const qty = 10
          const users = await get_users({
            sorted: users_sorted,
            qty,
            page: Number(page),
          })

          const last_page = users?.length ? Math.ceil(users?.length / qty) : 1

          const usersNew = users?.slice(
            (Number(page) - 1) * qty,
            (Number(page) - 1) * qty + qty
          )

          await ctx.telegram.editMessageText(
            ctx.chat?.id.toString() || "",
            msgId,
            msgId?.toString(),
            `👤 Список пользователей\n\nКоличество пользователей: ${
              users?.length
            }
            \nТип сортировки по реферелам: ${sort_string(users_sorted)}
            `,
            {
              parse_mode: "HTML",
              ...Markup.inlineKeyboard([
                ...users_panel_keyboard(),
                ...users_sorted_keyboard({
                  users: usersNew,
                  page: Number(page),
                  sorted: users_sorted,
                }),
                users_paginate_keyboard({
                  page,
                  last_page,
                  sorted: users_sorted,
                }),
                users_sort_keyboard({ page, sorted: users_sorted }),
                back_button(),
              ]),
            }
          )
          switch (ctx.callbackQuery.data.split(":")[2]) {
            case "day":
              console.log("day", page)
              await get_users({ sorted: "day", page })
              break
            case "week":
              console.log("week", page)
              const users = await get_users({ sorted: "week", page })
              break
            default:
              break
          }
          break

        // отображение пользователя
        case user_regex.test(ctx.callbackQuery.data)
          ? ctx.callbackQuery.data
          : null:
          const user_tag = ctx.callbackQuery.data.split(":")[1]

          const user_sorted = ctx.callbackQuery.data.split(
            ":"
          )[2] as IGetUsers["sorted"]

          const user = await get_user({ user_tag, sorted: user_sorted })
          await ctx.telegram.editMessageText(
            ctx.chat?.id.toString() || "",
            msgId,
            msgId?.toString(),
            `ℹ Пользователь  ${user.username}  (<code>${user.telegramId}</code>)
            
          👁 Скрыт из лидерборда:  ${user.IsHidden ? "✅" : "❌"} 
          💼 Партнер: ${user.IsPartner ? "✅" : "❌"}
          🔗 Реферал: ${user.referralId ? user.referralId : "❌"}
           👥 Приглашенные рефералы: ${user.count}

            💰 $DOOMER: ${user.doomCoins}
            💰 $PVC: ${user.pvc}
            👥 Пригласительный ID: <code>r-${user.telegramId}</code>
          `,
            {
              parse_mode: "HTML",
              ...Markup.inlineKeyboard([
                ...user_panel_keyboard({ user, sorted: user_sorted }),
              ]),
            }
          )
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
            Markup.inlineKeyboard(keyboardAdmin(ctx.from?.language_code))
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
