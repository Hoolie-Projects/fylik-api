import {DEBUG, HTTP_SERVER, LIMITS, uploadDir} from '~/config.js'
import express, {NextFunction, Request, Response} from 'express'
import consola from 'consola'

import ExpressFormidable from 'express-formidable'
import cors from 'cors'

import rootRouter from './routes/root.js'
import limitsRouter from './routes/limits.js'
import fileListRouter from './routes/getFileList.js'
import downloadRouter from './routes/download.js'

import uploadRouter from './routes/upload.js'

const app = express()

// Enable CORS on debug
if(DEBUG) app.use(cors())

// Enable HTTP Routes
app.get('/', rootRouter)
app.get('/limits', limitsRouter)
app.get('/files', fileListRouter)
app.get('/download/:fileId', downloadRouter)

app.post('/upload', ExpressFormidable({
  maxFileSize: LIMITS.maxFileSize,
  uploadDir
}, [

  {event: 'error', action: (req, res, next) =>
      next({code: 400, error: new Error('File error')})}

]), uploadRouter)

// 404
app.use((req, res, next) =>
  next({code: 404, error: new Error('Route not found')}))

// Error middleware
app.use((error: {code: number, error: Error}, req: Request, res: Response, next: NextFunction) => {

  if(error.code >= 500)
    consola.error(error.error)

  return res
    .status(error.code)
    .setHeader('Content-Type', 'application/json')
    .send({
      error: {
        code: error.code,
        message: error.error.message
      },
      request: {
        path: req.path,
        headers: req.headers,
        body: {
          fields: req.fields,
          files: req.files
        }
      },
    })
})

// Run HTTP Server
app.listen(HTTP_SERVER.PORT, HTTP_SERVER.HOST, () =>
  consola.success(`HTTP Server started at ${HTTP_SERVER.HOST}:${HTTP_SERVER.PORT}`))

// Enable workers
import('./workers/deleteExpiredFiles.js')
