import { isNumberObject } from "util/types"
import pgClient from "../../db"

require("dotenv").config()

export interface ISetPartnerUser {
  telegramId: number
}

const set_partner_user = async (props: ISetPartnerUser) => {
  try {
    const { telegramId } = props

    const client = await pgClient.getInstance()
    client.connect()

    await client
      .query(
        'UPDATE users SET "IsPartner" = (CASE WHEN "IsPartner" IS TRUE THEN FALSE ELSE TRUE END) WHERE users."telegramId"::bigint = $1',
        [telegramId.toString()]
      )
      .then(() => {
        pgClient.close()
        return true
      })
  } catch (err) {
    console.log(err)
  } finally {
    pgClient.close()
    return true
  }
}
export default set_partner_user
