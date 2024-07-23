import pgClient from "../db"

const connectAndQuery = async (query: string) => {
  try {
    const client = await pgClient.getInstance()

    client.connect()
    const result = await client.query(query)
    pgClient.close()
    return result
  } catch (err) {
    console.log(err)
  }
}
export default connectAndQuery
