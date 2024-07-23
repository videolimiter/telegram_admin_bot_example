import pgClient from "../db"
require("dotenv").config()

export interface IGetUsers {
  sorted?: "day" | "week" | "month" | "all"
  qty?: number
  page?: number
}

const get_users = async (props: IGetUsers) => {
  let users: any[] = []
  try {
    const { qty, page, sorted } = props
    const client = await pgClient.getInstance()
    client.connect()

    switch (sorted) {
      case "all":
        await client
          .query(
            'SELECT users.username, users."telegramId", COUNT(lu.id) FROM users LEFT JOIN users AS lu ON lu."referralId" = users."referrerId" GROUP BY users.username, users."telegramId" ORDER BY COUNT(lu.id) DESC'
          )
          .then((res) => {
            pgClient.close()
            return (users = res.rows)
          })
        break
      case "week":
        await client
          .query(
            'SELECT users.username, users."telegramId", COUNT(lu.id) FROM users LEFT JOIN users AS lu ON lu."referralId" = users."referrerId" WHERE lu."created_at" >= CURRENT_DATE - INTERVAL \'7 days\' GROUP BY users.username, users."telegramId" ORDER BY COUNT(lu.id) DESC'
          )
          .then((res) => {
            pgClient.close()
            return (users = res.rows)
          })
        break

      case "day":
        await client
          .query(
            'SELECT users.username, users."telegramId", COUNT(lu.id) FROM users LEFT JOIN users AS lu ON lu."referralId" = users."referrerId" WHERE lu."created_at" >= CURRENT_DATE - INTERVAL \'1 days\' GROUP BY users.username, users."telegramId" ORDER BY COUNT(lu.id) DESC'
          )
          .then((res) => {
            pgClient.close()
            return (users = res.rows)
          })
        break

      default:
        break
    }
    return users
  } catch (err) {
    console.log(err)
  } finally {
    pgClient.close()
  }
}
export default get_users
