import pgClient from "../db"
require("dotenv").config()

export interface IGetUsers {
  sorted?: "day" | "week" | "month" | "all"
  take?: number
  skip?: number
}

const get_users = async (props: IGetUsers) => {
  let users: { users: any[]; countTotal: number } = {
    users: [],
    countTotal: 0,
  }
  try {
    const { sorted, take, skip } = props
    const client = await pgClient.getInstance()
    client.connect()
    await client.query("SELECT COUNT(id) FROM users").then((res) => {
      users.countTotal = res.rows[0].count
    })
    switch (sorted) {
      case "all":
        console.log("all")
        await client
          .query({
            text: 'SELECT users.username, users."telegramId", COUNT(lu.id) FROM users LEFT JOIN users AS lu ON lu."referralId" = users."referrerId" GROUP BY users.username, users."telegramId" ORDER BY COUNT(lu.id) DESC LIMIT $1 OFFSET $2',
            values: [take?.toString(), skip?.toString()],
          })
          .then((res) => {
            pgClient.close()
            return (users.users = res.rows)
          })
        break
      case "week":
        await client
          .query({
            text: 'SELECT users.username, users."telegramId", COUNT(lu.id) FROM users LEFT JOIN users AS lu ON lu."referralId" = users."referrerId" WHERE lu."created_at" >= CURRENT_DATE - INTERVAL \'7 days\' GROUP BY users.username, users."telegramId" ORDER BY COUNT(lu.id) DESC LIMIT $1 OFFSET $2',
            values: [take, skip],
          })
          .then((res) => {
            pgClient.close()
            return (users.users = res.rows)
          })
        break

      case "day":
        await client
          .query({
            text: 'SELECT users.username, users."telegramId", COUNT(lu.id) FROM users LEFT JOIN users AS lu ON lu."referralId" = users."referrerId" WHERE lu."created_at" >= CURRENT_DATE - INTERVAL \'1 days\' GROUP BY users.username, users."telegramId" ORDER BY COUNT(lu.id) DESC  LIMIT $1 OFFSET $2',
            values: [take, skip],
          })
          .then((res) => {
            pgClient.close()
            return (users.users = res.rows)
          })
        break

      default:
        break
    }
    pgClient.close()
    return users
  } catch (err) {
    console.log(err)
  } finally {
    pgClient.close()
  }
}
export default get_users
