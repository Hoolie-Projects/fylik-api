import consola from 'consola'
import * as http from "http";
import { MongoClient } from 'mongodb'
import {DEBUG, MONGODB, SOCKETIO_SERVER} from '~/config.js'
import {createServer} from "http"
import {Server} from 'socket.io'

// ==================
// Initialize the DB connection
// ==================

const DB_CLIENT = new MongoClient(MONGODB.URI)
await DB_CLIENT.connect()

consola.success(`Connected to DataBase ${MONGODB.URI}/${MONGODB.DB_NAME}`)

export const DB = DB_CLIENT.db(MONGODB.DB_NAME)
export const $db = {
  files: DB.collection('files'),

  $collection: DB.collection
}

// ==================
// Initialize socket.io
// ==================

const httpServer = createServer()
export const io = new Server(httpServer, {
  ...(DEBUG ? {
    cors: {
      origin: '*'
    }
  } : {})
})

httpServer.listen(SOCKETIO_SERVER.PORT, SOCKETIO_SERVER.HOST, () =>
  consola.success(`Socket.IO server started at ${SOCKETIO_SERVER.HOST}:${SOCKETIO_SERVER.PORT}`))
