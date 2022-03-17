import { NextFunction, Request, Response } from "express";
import { $db, DB } from "~/loader.js"
import { validateMany } from "~/validate.js"

export default async (req: Request, res: Response, next: NextFunction) => {

  try {

    // Get client data
    const clientData: {
      offset?: string,
      limit?: string,
    } = req.query

    let offset = !isNaN(+(clientData.offset as any)) ? +(clientData.offset as string) : 0
    let limit = !isNaN(+(clientData.limit as any)) ? +(clientData.limit as string) : 50

    // Validate input data
    const validationErrors = validateMany([
      {rule: 'db_limit', entity: limit.toString(), displayFieldText: "limit"},
      {rule: 'db_offset', entity: offset.toString(), displayFieldText: "offset"},
    ])

    if (validationErrors.length)
      return next({ code: 400, error: new Error(validationErrors.join('\n')) })

    // Get files list from DB
    let files = (await $db.files.find({}).skip(offset).limit(limit).toArray()).map(file =>
      ({...file, fromIp: undefined, path: undefined}))

    // Send files list to Client
    res.send(files)

  }
  catch (error) {
    return next({ code: 500, error: error })
  }
}
