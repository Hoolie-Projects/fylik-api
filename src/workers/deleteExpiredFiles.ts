import {uploadDir} from "~/config.js";
import {asyncSleep} from "~/funcs.js";
import {$db} from '~/loader.js'
import {promises as fs} from 'fs'
import path from 'path'
import File from "~/models/File";


// Search for expired files every second
while(await asyncSleep(1000) || true) for await (const file: File of $db.files.find({expiresIn: {$lt: new Date()}})) {

  //  Delete file from FS
  await fs.unlink(path.join(uploadDir, file.path))

  //  Delete file from DB
  await $db.files.deleteOne(file)
}
