import { isNumberObject } from "util/types"
import pgClient from "../db"
require("dotenv").config()

export interface IGetUser {
  sorted?: "day" | "week" | "month" | "all"
  user_tag: string | number
}

const get_user = async (props: IGetUser) => {
  let user: any
  try {
    const { user_tag, sorted } = props
    const client = await pgClient.getInstance()
    client.connect()

    if (isNumberObject(new Number(user_tag))) {
      const telegramId = user_tag as number
      await client
        .query(
          'SELECT users.username, users."referralId", users."telegramId", COUNT(rf.id), w."pvc", w."doomCoins", users."IsPartner", users."IsHidden", lu."telegramId", lu.username FROM users LEFT JOIN users AS rf ON rf."referralId" = users."referrerId" LEFT JOIN users AS lu ON lu."referrerId" = users."referralId" LEFT JOIN wallets AS w ON w."id" = users."walletId" WHERE users."telegramId"::bigint = $1 GROUP BY users.username, users."referralId", users."telegramId", w."pvc", w."doomCoins", users."IsPartner", users."IsHidden", lu."telegramId", lu.username',
          [telegramId]
        )
        .then((res) => {
          return (user = res.rows[0])
        })
    } else {
      const username = user_tag as string
      await client
        .query(
          'SELECT users.username, users."referralId", users."telegramId", COUNT(rf.id), w."pvc", w."doomCoins", users."IsPartner", users."IsHidden", lu."telegramId", lu.username FROM users LEFT JOIN users AS rf ON rf."referralId" = users."referrerId" LEFT JOIN users AS lu ON lu."referrerId" = users."referralId" LEFT JOIN wallets AS w ON w."id" = users."walletId" WHERE users."username" = $1 GROUP BY users.username, users."referralId", users."telegramId", w."pvc", w."doomCoins", users."IsPartner", users."IsHidden", lu."telegramId", lu.username',
          [username]
        )
        .then((res) => {
          pgClient.close()
          return (user = res.rows[0])
        })
    }
  } catch (err) {
    console.log(err)
  } finally {
    pgClient.close()
    return user
  }
}
export default get_user
