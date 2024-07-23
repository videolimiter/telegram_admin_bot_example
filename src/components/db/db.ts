import { Client } from "pg"
require("dotenv").config()

const pgClient = (() => {
  let instance: Client | undefined
  const connectionString = process.env.DB_URL
  if (!connectionString) {
    throw new Error("DB_URL environment variable is not set")
  }
  const createPgClientInstance = (): Client => {
    try {
      return new Client({ connectionString })
    } catch (err) {
      console.error("Error creating Postgres client instance:", err)
      throw err
    }
  }
  return {
    getInstance: () => {
      if (!instance) {
        instance = createPgClientInstance()
      }
      return instance
    },
    close: async () => {
      if (instance) {
        await instance.end()
        instance = undefined
      }
    },
  }
})()

export default pgClient
