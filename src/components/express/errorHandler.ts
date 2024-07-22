import { Request, Response, NextFunction } from "express"

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Something went wrong: ", error)
  res.status(500).json({ error: "Something went wrong" })
}
