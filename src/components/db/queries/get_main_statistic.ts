import { Client } from "pg"
import connectAndQuery from "./connect_and_query"
import pgClient from "../db"
require("dotenv").config()

const get_main_statistic = async () => {
  try {
    const client = await pgClient.getInstance()

    client.connect()

    const onlinePlayersCount = await client
      .query('SELECT COUNT(*) FROM users WHERE users."isOnline" IS True')
      .then((res) => res.rows[0].count)

    const countPlayersPlayed = await client
      .query('SELECT COUNT(*) FROM users WHERE users."lastOnline" IS NOT Null')
      .then((res) => res.rows[0].count)

    const countPlayers = await client
      .query("SELECT COUNT(*) FROM users")
      .then((res) => res.rows[0].count)

    const referrersCount = await client
      .query(
        'SELECT COUNT(DISTINCT u.id) FROM users u WHERE EXISTS (SELECT 1 FROM users u2 WHERE u2."referralId" = u."referrerId")'
      )
      .then((res) => res.rows[0].count)

    const doomsCoinsTasksTotal = await client
      .query(
        'SELECT SUM(CASE WHEN VALUE ~ \'^[0-9]+$\' THEN CAST(VALUE AS INTEGER) ELSE 0 END) AS total_sum FROM bonuses JOIN tasks ON bonuses.id=tasks."bonusId" JOIN completed_tasks ON completed_tasks."taskId"=tasks.id WHERE completed_tasks.percent=100.0;'
      )
      .then((res) => res.rows[0].count)

    const pvcEarnedTotal = await client
      .query('SELECT SUM("pvcEarnedTotal") FROM earnings')
      .then((res) => res.rows[0].count)

    const doomWasteTotal = await client
      .query(
        'SELECT (SELECT SUM(earnings."doomCoinsEarnedTotal") FROM earnings) - (SELECT SUM(wallets."doomCoins") FROM wallets) AS difference;'
      )
      .then((res) => res.rows[0].count)

    const doomsCoinsTotal = await client
      .query('SELECT SUM("doomCoinsEarnedTotal") FROM earnings')
      .then((res) => res.rows[0].count)

    const pvc_total = await client
      .query('SELECT SUM(spents."upgradePvc") FROM spents')
      .then((res) => res.rows[0].count)

    pgClient.close()
    return {
      onlinePlayersCount,
      countPlayersPlayed,
      countPlayers,
      referrersCount: referrersCount,
      doomsCoinsTasksTotal,
      doomsCoinsTotal,
      pvcEarnedTotal,
      doomWasteTotal,
      pvc_total,
    }
  } catch (err) {
    console.log(err)
  }
}
export default get_main_statistic

//  🟢 Пользователей онлайн: {onlinePlayersCount}

//         👤 Количество игроков запустивших бота: {get_count_bot_users()}
//         👤 Количество игроков в приложении: {countPlayersPlayed}
//         👤 Количество игроков в бд: {countPlayers}
//         👥 Привели минимум 1 активного реферала: {referrersCount}

//         💰 Всего заработано думер: {doomsCoinsTotal}
//         💰 Сколько всего заработано пива: {pvcEarnedTotal}

//         Сколько заработано думер именно за задания: {('0' if doomsCoinsTasksTotal is None else f'{doomsCoinsTasksTotal}')}

//         Потрачено PVC: {'{:0,.0f}'.format(pvc_total)}
//         Потрачено DOOMER: {'{:0,.0f}'.format(abs(doomWasteTotal))}
