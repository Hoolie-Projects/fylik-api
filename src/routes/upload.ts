import { NextFunction, Request, Response } from "express";
import {ObjectId} from "mongodb";
import path from "path";
import {LIMITS} from "~/config.js";
import {randomNumber} from "~/funcs.js";
import { $db, io } from "~/loader.js"
import formidable from 'formidable'
import {DateTime} from 'luxon'
import File from '~/models/File'
import {promises as fs} from 'fs'

const deleteAllFiles = async (files: formidable.Files | []) => {

  // ===
  // Deletes all uploaded files (in a current request)
  // ===

  for(let file of Object.entries(files)) {

    await fs.unlink((file[1] as formidable.File).path)
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {

  try {

    // Prepare data
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string

    // Checks
    if(!req.files || !req.files.file) {

      await deleteAllFiles(req.files || [])
      return next({code: 400, error: new Error('No file uploaded')})
    }

    // Check files amount
    if(
      (await $db.files.countDocuments({fromIp: ip})) >= LIMITS.maxFilesPerClient
      && ip != '127.0.0.1' // Allow unlimited localhost uploads
    ) {
      await deleteAllFiles(req.files || [])
      return next({code: 429, error: new Error('Too much files already uploaded. Wait a few minutes and try again')})
    }

    // Save file info to DB
    const uploadedFile = req.files.file as formidable.File
    const file: File = {
      _id: new ObjectId(),
      name: uploadedFile.name || 'unnamed',
      size: uploadedFile.size,
      type: uploadedFile.type || 'unknown',
      path: path.basename(uploadedFile.path),
      expiresIn: DateTime.now().plus({minutes: randomNumber(3, 30)}).toJSDate(),
      fromIp: ip,
      createdAt: new Date()
    }
    await $db.files.insertOne(file as {_id: ObjectId} & File)

    // Send file info to client
    res.status(201).send(file)

    // Send socket.io emits
    io.emit('newFile', {
      ...file,
      path: undefined,
      fromIp: undefined
    })
  }
  catch(error) {
    await deleteAllFiles(req.files || [])
    return next({ code: 500, error: error })
  }
}
