import { Markup } from "telegraf"
import { user_panel_keyboard } from "../../keyboards/user_panel_keyboard"
import { IGetUser } from "../../../db/queries/get_user"

interface IUserMsgEdit {
  ctx: any
  user: any
  sorted: IGetUser["sorted"]
  msgId: number
}

const user_msg_edit = async (props: IUserMsgEdit) => {
  const { ctx, user, sorted, msgId } = props

  await ctx.telegram.editMessageText(
    ctx.chat?.id.toString() || "",
    msgId,
    msgId?.toString(),
    `ℹ Пользователь  ${user.username}  (<code>${user.telegramId}</code>)
            
          👁 Скрыт из лидерборда:  ${(user.IsHidden as boolean) ? "✅" : "❌"} 
          💼 Партнер: ${(user.IsPartner as boolean) ? "✅" : "❌"}
          🔗 Реферал: ${user.referralId ? user.referralId : "❌"}
           👥 Приглашенные рефералы: ${user.refCount}

            💰 $DOOMER: ${user.doomCoins}
            💰 $PVC: ${user.pvc}
            👥 Пригласительный ID: <code>r-${user.telegramId}</code>
          `,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([...user_panel_keyboard({ user, sorted })]),
    }
  )
}
export default user_msg_edit
