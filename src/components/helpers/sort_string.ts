import { IGetUsers } from "../db/queries/get_users"

const sort_string = (sorted: IGetUsers["sorted"]) => {
  switch (sorted) {
    case "all":
      return "🌟 Всё время"
    case "day":
      return "1️⃣ День"

    case "week":
      return "📅 Неделя"

    default:
      break
  }
}

export default sort_string
