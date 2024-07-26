import { isNumberObject } from "util/types"
import pgClient from "../db"
require("dotenv").config()

export interface IGetUser {
  sorted?: "day" | "week" | "month" | "all"
  telegramId: number | string
}

const get_user = async (props: IGetUser) => {
  const { telegramId, sorted } = props
  let user: any

  function checkType(value: any) {
    if (typeof new Number(value) === "number") {
      console.log("Это число")
    } else if (typeof value === "string") {
      console.log("Это текст")
    } else {
      console.log("Тип не определен")
    }
  }
  console.log(checkType(telegramId))

  try {
    const client = await pgClient.getInstance()
    client.connect()
    if (typeof new Number(telegramId) === "number") {
      await client
        .query({
          text: `SELECT * FROM public.users WHERE "telegramId"= $1`,
          values: [telegramId.toString()],
        })
        .then(async (res) => {
          user = res.rows[0]
          await client
            .query({
              text: `SELECT COUNT(*) FROM public.users WHERE "referralId"= $1`,
              values: [user.referrerId],
            })
            .then(async (res) => {
              user.refCount = res.rows[0].count
              await client
                .query({
                  text: `SELECT * FROM public.WALLETS WHERE "id"= $1`,
                  values: [user.walletId],
                })
                .then(async (res) => {
                  user.doomCoins = res.rows[0].doomCoins
                  user.pvc = res.rows[0].pvc
                  pgClient.close()
                })
            })
          pgClient.close()
          return user
        })
    }
    if (typeof telegramId === "string") {
      await client
        .query({
          text: `SELECT * FROM public.users WHERE "username"= $1`,
          values: [telegramId.toString()],
        })
        .then(async (res) => {
          user = res.rows[0]
          await client
            .query({
              text: `SELECT COUNT(*) FROM public.users WHERE "referralId"= $1`,
              values: [user.referrerId],
            })
            .then(async (res) => {
              user.refCount = res.rows[0].count
              await client
                .query({
                  text: `SELECT * FROM public.WALLETS WHERE "id"= $1`,
                  values: [user.walletId],
                })
                .then(async (res) => {
                  user.doomCoins = res.rows[0].doomCoins
                  user.pvc = res.rows[0].pvc
                  pgClient.close()
                })
            })
          pgClient.close()
          return user
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
