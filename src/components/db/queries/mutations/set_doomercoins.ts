import { isNumberObject } from "util/types"
import pgClient from "../../db"

require("dotenv").config()

export interface ISetDoomerCoins {
  telegramId: number
  addCoins: number
}

const set_doomercoins = async (props: ISetDoomerCoins) => {
  try {
    const { telegramId, addCoins } = props

    const client = await pgClient.getInstance()
    client.connect()

    await client
      .query(
        'UPDATE wallets SET "doomCoins" = "doomCoins" + $1 WHERE wallets.id = (SELECT users."walletId" FROM users WHERE users."telegramId"::bigint = $2)',
        [addCoins.toString(), telegramId.toString()]
      )
      .then(async (res) => {
        await client
          .query(
            'UPDATE earnings SET "doomCoinsEarnedTotal" = "doomCoinsEarnedTotal" + $1, "doomCoinsEarnedTotal12h" = "doomCoinsEarnedTotal12h" + $1, "doomCoinsEarned12h" = "doomCoinsEarned12h" + $1 WHERE earnings.id = (SELECT users."earningsId" FROM users WHERE users."telegramId"::bigint = $2)',
            [addCoins.toString(), telegramId.toString()]
          )
          .then((res) => {
            pgClient.close()
            return true
          })
      })
  } catch (err) {
    console.log(err)
  } finally {
    pgClient.close()
    return true
  }
}
export default set_doomercoins
