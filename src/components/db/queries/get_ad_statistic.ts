import pgClient from "../db"
require("dotenv").config()

const get_ad_statistic = async () => {
  try {
    const client = await pgClient.getInstance()

    client.connect()

    const countViewDay = await client
      .query(
        "SELECT COUNT(*) FROM ad_views WHERE viewed_at >= DATE_TRUNC('day', NOW()) AND viewed_at < DATE_TRUNC('day', NOW() + INTERVAL '1 day')"
      )
      .then((res) => res.rows[0].count)

    const countViewWeek = await client
      .query(
        "SELECT COUNT(*) FROM ad_views WHERE viewed_at >= DATE_TRUNC('week', NOW()) AND viewed_at < DATE_TRUNC('week', NOW() + INTERVAL '1 week')"
      )
      .then((res) => res.rows[0].count)

    const countViewMonth = await client
      .query(
        "SELECT COUNT(*) FROM ad_views WHERE viewed_at >= DATE_TRUNC('month', NOW()) AND viewed_at < DATE_TRUNC('month', NOW() + INTERVAL '1 month')"
      )
      .then((res) => res.rows[0].count)

    const countViewAll = await client
      .query("SELECT COUNT(*) FROM ad_views")
      .then((res) => res.rows[0].count)

    pgClient.close()
    return {
      countViewDay,
      countViewWeek,
      countViewMonth,
      countViewAll,
    }
  } catch (err) {
    console.log(err)
  }
}
export default get_ad_statistic
