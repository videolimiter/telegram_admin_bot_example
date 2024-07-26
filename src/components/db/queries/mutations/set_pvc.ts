import { isNumberObject } from "util/types"
import pgClient from "../../db"

require("dotenv").config()

export interface ISetDoomerPVC {
  telegramId: number
  addPVC: number
}

const set_pvc = async (props: ISetDoomerPVC) => {
  try {
    const { telegramId, addPVC } = props

    const client = await pgClient.getInstance()
    client.connect()

    await client
      .query(
        'UPDATE wallets SET pvc = pvc + $1 WHERE wallets.id = (SELECT users."walletId" FROM users WHERE users."telegramId"::bigint = $2)',
        [addPVC.toString(), telegramId.toString()]
      )
      .then(async (res) => {
        await client
          .query(
            "UPDATE earnings SET pvcEarnedTotal = pvcEarnedTotal + $1, pvcEarnedTotal12h = pvcEarnedTotal12h + $1, pvcEarned12h = pvcEarned12h + $1 WHERE earnings.id = (SELECT users.earningsId FROM users WHERE users.telegramId::bigint = $2)",
            [addPVC.toString(), telegramId.toString()]
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
export default set_pvc
