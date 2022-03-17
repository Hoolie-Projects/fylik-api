import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";
import path from "path";
import {uploadDir} from "~/config.js";
import {$db} from "~/loader.js";
import {validateMany} from "~/validate.js";

export default async (req: Request, res: Response, next: NextFunction) => {

  // Validate input data
  const validationErrors = validateMany([
    {rule: 'file_id', entity: req.params.fileId as any}
  ])

  if (validationErrors.length)
    return next({ code: 400, error: new Error(validationErrors.join('\n')) })

  // Get file ID
  const fileId = new ObjectId(req.params.fileId)

  // Fetch file info from DB
  const file = await $db.files.findOne({_id: fileId});

  // If the file not found, send 404
  if(!file) return next({code: '404', error: new Error('File not found')})

  // Send file to client
  res.download(path.join(uploadDir, file.path), file.name)
}
