export const DEBUG = process.env.NODE_ENV !== 'production'

export const HTTP_SERVER = {
  HOST: '0.0.0.0',
  PORT: 3001
}

export const SOCKETIO_SERVER = {
  HOST: '0.0.0.0',
  PORT: 3002
}

export const MONGODB = {
  URI: 'mongodb://127.0.0.1:27017',
  DB_NAME: 'fylik'
}

export const uploadDir = "C:\\Users\\alyok\\projects\\fylik-api\\uploads"

export const LIMITS = {
  maxFileSize: 100 * 1024 * 1024, // 100 MB
  maxFilesPerClient: 3
}
